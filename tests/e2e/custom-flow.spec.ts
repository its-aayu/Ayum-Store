import { test, expect } from '@playwright/test';

async function generateTestPng(page: import('@playwright/test').Page): Promise<Buffer> {
  const base64 = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#710014';
    ctx.fillRect(0, 0, 320, 320);
    const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
    const buffer = await blob.arrayBuffer();
    let binary = '';
    for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
    return btoa(binary);
  });
  return Buffer.from(base64, 'base64');
}

test('custom → upload → preview → product → variant → copyright → order', async ({ page, context }) => {
  // Mock the signing endpoint and the Cloudinary upload so the flow runs deterministically offline.
  await page.route('**/api/upload-signature', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        signature: 'test-signature',
        timestamp: Math.floor(Date.now() / 1000),
        apiKey: 'test-key',
        cloudName: 'test-cloud',
        folder: 'ayum/custom-designs',
        resourceType: 'image',
      }),
    });
  });

  await page.route('https://api.cloudinary.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        public_id: 'ayum/custom-designs/test123',
        format: 'png',
        width: 320,
        height: 320,
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1/ayum/custom-designs/test123.png',
        resource_type: 'image',
      }),
    });
  });

  await page.goto('/custom');

  const pngBuffer = await generateTestPng(page);
  await page.locator('input[type="file"]').setInputFiles({
    name: 'my-design.png',
    mimeType: 'image/png',
    buffer: pngBuffer,
  });

  await expect(page.getByText('Upload complete')).toBeVisible();

  await page.getByRole('button', { name: /Heavyweight Pullover Hoodie/ }).click();
  await page.getByRole('radio', { name: 'Obsidian Black' }).click();
  await page.getByRole('radio', { name: 'M', exact: true }).click();

  await page.getByLabel(/I confirm that I have the necessary rights/).check();

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', { name: 'Message on WhatsApp' }).click(),
  ]);
  // wa.me redirects live to api.whatsapp.com/send — accept either, since the redirect itself
  // confirms the deep link is well-formed.
  await popup.waitForLoadState('domcontentloaded').catch(() => {});
  expect(popup.url()).toMatch(/wa\.me|whatsapp\.com/);
  const decodedUrl = decodeURIComponent(popup.url().replace(/\+/g, ' '));
  expect(decodedUrl).toContain('AY-CUSTOM-');
  expect(decodedUrl).toContain('Custom Design: Yes');
});

test('rejects an unsupported file type with a human-readable error', async ({ page }) => {
  await page.goto('/custom');

  await page.locator('input[type="file"]').setInputFiles({
    name: 'not-an-image.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello world'),
  });

  await expect(page.getByText("This file type isn't supported.")).toBeVisible();
});
