import { test, expect } from '@playwright/test';

test('home → shop → product → variant → cart → WhatsApp', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Wear What You Imagine.' })).toBeVisible();

  await page.getByRole('link', { name: 'Explore Designs' }).first().click();
  await expect(page).toHaveURL(/\/shop$/);

  await page.getByRole('link', { name: /Classic Crest Tee/ }).click();
  await expect(page).toHaveURL(/\/product\/classic-crest-tee$/);

  await page.getByRole('radio', { name: 'Obsidian Black' }).click();
  await page.getByRole('radio', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('button', { name: 'Added to cart' })).toBeVisible();

  await page.getByRole('link', { name: /Cart/ }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole('heading', { name: 'Order Request' })).toBeVisible();

  const cartItem = page.getByRole('listitem');
  await expect(cartItem.getByText('Classic Crest Tee')).toBeVisible();
  await expect(cartItem.getByText('M · Obsidian Black')).toBeVisible();

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', { name: 'Continue to WhatsApp' }).click(),
  ]);
  // wa.me redirects live to api.whatsapp.com/send — accept either, since the redirect itself
  // confirms the deep link is well-formed.
  await popup.waitForLoadState('domcontentloaded').catch(() => {});
  expect(popup.url()).toMatch(/wa\.me|whatsapp\.com/);
  const decodedUrl = decodeURIComponent(popup.url().replace(/\+/g, ' '));
  expect(decodedUrl).toContain('AY-REQ-');
  expect(decodedUrl).toContain('AY-TS001');
});
