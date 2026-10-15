import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper navigation', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword, 'Configure dedicated shopkeeper credentials in .env');
    await loginAs(page, 'shopkeeper');
  });

  test('products/inventory opens', async ({ shopkeeperPage }) => {
    await shopkeeperPage.openProducts();
    await shopkeeperPage.expectProducts();
  });

  test('invoice page opens', async ({ shopkeeperPage }) => {
    await shopkeeperPage.openInvoices();
  });

  test('settings page opens', async ({ shopkeeperPage }) => {
    await shopkeeperPage.openSettings();
  });
});
