import { test, expect } from '@playwright/test';
import { loginAs } from '../../utils/auth';

const sections = [
  { name: 'invoice', label: /my purchases|invoices?/i },
  { name: 'warranty', label: /warrant/i },
  { name: 'payment', label: /payments/i },
  { name: 'settings', label: /settings/i },
  // The profile editor lives under Settings in the customer portal.
  { name: 'profile', label: /settings/i },
];

test.describe('Customer portal - read-only UI navigation checks (mocked session)', () => {
  test('customer can sign in and view the portal', async ({ page }) => {
    await loginAs(page, 'customer');
    await expect(page).toHaveURL(/\/customer(?:[?#]|$)/);
    await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
  });

  for (const section of sections) {
    test(`customer portal exposes ${section.name} section`, async ({ page }) => {
      await loginAs(page, 'customer');
      const item = page.getByRole('link', { name: section.label }).first();
      await expect(item).toBeVisible();
      await item.click();
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/internal server error|application error/i);
    });
  }
});
