import { test, expect } from '@playwright/test';

// Create Your Own is gated behind CUSTOM_DESIGN_ENABLED = false in CustomDesignPage.tsx while
// print-quality review and mockup previews are finished. The full upload → preview → order flow
// still exists in the codebase (behind that flag) but isn't reachable from the UI, so these tests
// only cover the Coming Soon state that customers actually see.
test('custom design page shows a Coming Soon state with a WhatsApp notify CTA', async ({ page, context }) => {
  await page.goto('/custom');

  await expect(page.getByRole('heading', { name: 'Your design. Our craft.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: "Upload-your-own-design isn't open yet" })).toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Notify me on WhatsApp' }).click(),
  ]);
  await popup.waitForLoadState('domcontentloaded').catch(() => {});
  expect(popup.url()).toMatch(/wa\.me|whatsapp\.com/);
});
