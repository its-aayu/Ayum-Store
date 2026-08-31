import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';

const FOLDER = 'ayum/custom-designs';
const ALLOWED_RESOURCE_TYPES = new Set(['image', 'raw']);

const ALLOWED_ORIGINS = [process.env.SITE_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(
  (origin): origin is string => Boolean(origin),
);

// Best-effort per-instance rate limit. Serverless instances are ephemeral and
// this resets on cold start — production should move to a shared store
// (Vercel KV / Upstash) if upload abuse becomes a real problem.
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const clientKey = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(clientKey)) {
    res.status(429).json({ error: 'Too many upload requests. Please try again shortly.' });
    return;
  }

  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, VITE_CLOUDINARY_CLOUD_NAME } = process.env;
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !VITE_CLOUDINARY_CLOUD_NAME) {
    res.status(500).json({ error: 'Upload is not configured. Please try again later.' });
    return;
  }

  const resourceType = req.body?.resourceType === 'raw' ? 'raw' : 'image';
  if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
    res.status(400).json({ error: 'Invalid upload request.' });
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = {
    folder: FOLDER,
    timestamp,
  };

  const stringToSign =
    Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&') + CLOUDINARY_API_SECRET;

  const signature = createHash('sha1').update(stringToSign).digest('hex');

  res.status(200).json({
    signature,
    timestamp,
    apiKey: CLOUDINARY_API_KEY,
    cloudName: VITE_CLOUDINARY_CLOUD_NAME,
    folder: FOLDER,
    resourceType,
  });
}
