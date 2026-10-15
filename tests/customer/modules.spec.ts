import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test.describe('Customer portal - read-only navigation checks', () => {
  test.skip(!env.customerEmail || !env.customerPassword,
    'Requires dedicated CUSTOMER_EMAIL and CUSTOMER_PASSWORD credentials.');

  test('customer can sign in and view the portal', async ({ page }) => {
    await loginAs(page, 'customer');
    await expect(page).toHaveURL(/\/customer(?:[?#]|$)/);
    await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
  });

  for (const moduleName of ['invoice', 'warranty', 'payment', 'settings', 'profile']) {
    test(`customer portal exposes ${moduleName} section when available`, async ({ page }) => {
      await loginAs(page, 'customer');
      const item = page.getByRole('link', { name: new RegExp(moduleName, 'i') }).first();
      if (!(await item.isVisible().catch(() => false))) {
        test.skip(true, `No visible navigation link detected for ${moduleName} on this account/layout.`);
      }
      await item.click();
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
    });
  }
});
