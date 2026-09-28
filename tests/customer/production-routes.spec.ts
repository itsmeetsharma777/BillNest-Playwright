import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';

const routes = [
  ['/customer', /dashboard|overview|welcome/i],
  ['/customer/invoices', /invoices/i],
  ['/customer/payments', /payments/i],
  ['/customer/warranties', /warranties/i],
  ['/customer/notifications', /notifications/i],
  ['/customer/settings', /settings/i],
] as const;

test.describe('Customer production route access (read-only)', () => {
  test.skip(!env.customerEmail || !env.customerPassword,
    'Requires a dedicated test customer account; set CUSTOMER_EMAIL and CUSTOMER_PASSWORD.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/customer/login');
    await page.getByLabel(/email/i).fill(env.customerEmail);
    await page.getByLabel(/password/i).fill(env.customerPassword);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await expect(page).toHaveURL(/customer/);
  });

  for (const [path, content] of routes) {
    test(`authenticated customer can open ${path}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      await expect(page.locator('body')).not.toContainText(/internal server error|application error|something went wrong/i);
      await expect(page.getByText(content).first()).toBeVisible();
      expect(pageErrors, 'No uncaught browser exceptions expected').toEqual([]);
    });
  }
});
