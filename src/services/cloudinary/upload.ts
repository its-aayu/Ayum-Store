import type { CustomDesign } from '@/types';
import { generateCustomDesignId } from '@/utils/id';

type SignatureResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: 'image' | 'raw';
};

async function getUploadSignature(resourceType: 'image' | 'raw'): Promise<SignatureResponse> {
  const response = await fetch('/api/upload-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceType }),
  });

  if (!response.ok) {
    throw new Error('Upload is not available right now.');
  }

  return response.json();
}

export type UploadProgressHandler = (percent: number) => void;

export async function uploadCustomDesign(
  file: File,
  onProgress?: UploadProgressHandler,
): Promise<CustomDesign> {
  const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';
  const { signature, timestamp, apiKey, cloudName, folder } = await getUploadSignature(resourceType);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  const result = await new Promise<{
    public_id: string;
    format?: string;
    width?: number;
    height?: number;
    secure_url: string;
    resource_type: 'image' | 'raw';
  }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed.'));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed.'));
    xhr.send(formData);
  });

  return {
    id: generateCustomDesignId(),
    publicId: result.public_id,
    resourceType: result.resource_type,
    format: result.format,
    width: result.width,
    height: result.height,
    previewUrl: result.secure_url,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
