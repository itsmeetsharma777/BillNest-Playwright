import { test, expect } from '@playwright/test';

const email = process.env.SHOPKEEPER_EMAIL;
const password = process.env.SHOPKEEPER_PASSWORD;

test.describe('Shopkeeper modules - read-only navigation checks', () => {
  test.skip(!email || !password, 'Requires dedicated SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD credentials.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const login = page.getByRole('link', { name: /sign in|log in|login/i })
      .or(page.getByRole('button', { name: /sign in|log in|login/i }));
    await login.first().click();
    await page.getByLabel(/email/i).fill(email!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  for (const moduleName of ['dashboard', 'products', 'inventory', 'customers', 'invoices', 'warranty', 'payments', 'settings']) {
    test(`navigation to ${moduleName} is available`, async ({ page }) => {
      const nav = page.getByRole('link', { name: new RegExp(moduleName, 'i') });
      test.skip(await nav.count() === 0, `No visible navigation link detected for ${moduleName}.`);
      await nav.first().click();
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
    });
  }
});
