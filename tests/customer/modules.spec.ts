import { test, expect } from '@playwright/test';

const email = process.env.CUSTOMER_EMAIL;
const password = process.env.CUSTOMER_PASSWORD;

test.describe('Customer portal - read-only navigation checks', () => {
  test.skip(!email || !password, 'Requires dedicated CUSTOMER_EMAIL and CUSTOMER_PASSWORD credentials.');

  test('customer can sign in and view the portal', async ({ page }) => {
    await page.goto('/');
    const login = page.getByRole('link', { name: /sign in|log in|login/i })
      .or(page.getByRole('button', { name: /sign in|log in|login/i }));
    await login.first().click();
    await page.getByLabel(/email/i).fill(email!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
  });

  for (const moduleName of ['invoice', 'warranty', 'payment', 'settings', 'profile']) {
    test(`customer portal exposes ${moduleName} section when available`, async ({ page }) => {
      await page.goto('/');
      const login = page.getByRole('link', { name: /sign in|log in|login/i })
        .or(page.getByRole('button', { name: /sign in|log in|login/i }));
      await login.first().click();
      await page.getByLabel(/email/i).fill(email!);
      await page.getByLabel(/password/i).fill(password!);
      await page.getByRole('button', { name: /sign in|log in|login/i }).click();
      const item = page.getByRole('link', { name: new RegExp(moduleName, 'i') });
      test.skip(await item.count() === 0, `No navigation link detected for ${moduleName}.`);
      await item.first().click();
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
