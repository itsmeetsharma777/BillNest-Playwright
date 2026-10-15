import { test, expect } from '@playwright/test';
import { loginAs } from '../../utils/auth';

const routes = [
  ['/customer', /dashboard|overview|welcome|invoice|warranty/i],
  ['/customer/invoices', /invoices/i],
  ['/customer/payments', /payments/i],
  ['/customer/warranties', /warranties/i],
  ['/customer/notifications', /notifications/i],
  ['/customer/settings', /settings/i],
] as const;

test.describe('Customer route access (read-only UI, mocked session)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'customer');
  });

  for (const [path, content] of routes) {
    test(`authenticated customer can open ${path}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect.poll(() => new URL(page.url()).pathname).toBe(path);
      await expect(page.locator('body')).not.toContainText(/internal server error|application error|something went wrong/i);
      await expect(page.getByText(content).first()).toBeVisible();
      expect(pageErrors, 'No uncaught browser exceptions expected').toEqual([]);
    });
  }
});
