import { test, expect } from '@playwright/test';

const email = process.env.SHOPKEEPER_EMAIL;
const password = process.env.SHOPKEEPER_PASSWORD;

test.describe('Shopkeeper authenticated smoke tests', () => {
  test.skip(!email || !password, 'Set SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD for a dedicated test account.');

  test('shopkeeper can sign in and reach an authenticated page', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.getByRole('link', { name: /sign in|log in|login/i })
      .or(page.getByRole('button', { name: /sign in|log in|login/i }));
    await loginLink.first().click();

    await page.getByLabel(/email/i).fill(email!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();

    await expect(page).not.toHaveURL(/login|sign-in/i, { timeout: 15000 });
    await expect(page.locator('body')).toBeVisible();
  });
});
