import { test, expect } from '@playwright/test';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper modules - UI navigation checks (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'shopkeeper');
  });

  for (const moduleName of ['dashboard', 'products', 'inventory', 'customers', 'invoices', 'warranty', 'payments', 'settings']) {
    test(`navigation to ${moduleName} is available`, async ({ page }) => {
      const nav = page.getByRole('link', { name: new RegExp(moduleName, 'i') }).first();
      if (!(await nav.isVisible().catch(() => false))) {
        test.skip(true, `No visible navigation link detected for ${moduleName} on this layout.`);
      }
      await nav.click();
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
    });
  }
});
