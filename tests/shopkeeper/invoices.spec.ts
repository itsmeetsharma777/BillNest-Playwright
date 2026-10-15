import { test, expect } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper invoices (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'shopkeeper');
  });

  test('invoice area is reachable', async ({ shopkeeperPage }) => {
    await shopkeeperPage.openInvoices();
  });

  test('create invoice action is enabled if present', async ({ page }) => {
    const action = page.getByRole('link', { name: /create invoice|new invoice/i }).first()
      .or(page.getByRole('button', { name: /create invoice|new invoice/i }).first());
    if (await action.isVisible().catch(() => false)) {
      await expect(action).toBeEnabled();
    } else {
      await page.goto('/shopkeeper/invoices/new', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/shopkeeper\/invoices\/new(?:[?#]|$)/);
      await expect(page.locator('form').first()).toBeVisible();
    }
  });
});
