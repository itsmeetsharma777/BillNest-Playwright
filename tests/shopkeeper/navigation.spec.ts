import { test } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper navigation (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
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
