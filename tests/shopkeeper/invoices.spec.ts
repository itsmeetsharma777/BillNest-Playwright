import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper invoices', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword, 'Configure dedicated shopkeeper credentials in .env');
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
      // The route itself is still required to be accessible; don't report a ghost action as enabled.
      await page.goto('/shopkeeper/invoices/new', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/shopkeeper\/invoices\/new(?:[?#]|$)/);
    }
  });
});
