import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';

const routes = [
  ['/shopkeeper', /dashboard|overview|shop/i],
  ['/shopkeeper/customers', /customers/i],
  ['/shopkeeper/products', /products/i],
  ['/shopkeeper/categories', /categories/i],
  ['/shopkeeper/brands', /brands/i],
  ['/shopkeeper/inventory/history', /inventory|stock|movement/i],
  ['/shopkeeper/invoices', /invoices/i],
  ['/shopkeeper/warranties', /warranties/i],
  ['/shopkeeper/reports', /reports|analytics/i],
  ['/shopkeeper/notifications', /notifications/i],
  ['/shopkeeper/settings', /settings/i],
] as const;

test.describe('Shopkeeper production route access (read-only)', () => {
  test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword,
    'Requires a dedicated test shopkeeper account; set SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/shopkeeper/login');
    await page.getByLabel(/email/i).fill(env.shopkeeperEmail);
    await page.getByLabel(/password/i).fill(env.shopkeeperPassword);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await expect(page).toHaveURL(/shopkeeper/);
  });

  for (const [path, content] of routes) {
    test(`authenticated shopkeeper can open ${path}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      await expect(page.locator('body')).not.toContainText(/internal server error|application error|something went wrong/i);
      await expect(page.getByText(content).first()).toBeVisible();
      expect(pageErrors, 'No uncaught browser exceptions expected').toEqual([]);
    });
  }

  test('shopkeeper invoice creation route opens without submitting data', async ({ page }) => {
    await page.goto('/shopkeeper/invoices/new');
    await expect(page).toHaveURL(/shopkeeper\/invoices\/new/);
    await expect(page.locator('form').first()).toBeVisible();
  });

  test('shopkeeper warranty creation route opens without submitting data', async ({ page }) => {
    await page.goto('/shopkeeper/warranties/new');
    await expect(page).toHaveURL(/shopkeeper\/warranties\/new/);
    await expect(page.locator('form').first()).toBeVisible();
  });
});
