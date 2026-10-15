import { test, expect } from '@playwright/test';
import { loginAs } from '../../utils/auth';

const sections = [
  { name: 'dashboard', label: /dashboard/i },
  { name: 'products', label: /products/i },
  { name: 'inventory', label: /inventory/i },
  { name: 'customers', label: /customers/i },
  { name: 'invoices', label: /invoices?/i },
  { name: 'warranty', label: /warrant/i },
  { name: 'reports', label: /reports/i },
  { name: 'notifications', label: /notifications/i },
  { name: 'settings', label: /settings/i },
];

test.describe('Shopkeeper modules - UI navigation checks (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'shopkeeper');
  });

  for (const section of sections) {
    test(`navigation to ${section.name} is available`, async ({ page }) => {
      const nav = page.getByRole('link', { name: section.label }).first();
      await expect(nav).toBeVisible();
      await nav.click();
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
    });
  }
});
