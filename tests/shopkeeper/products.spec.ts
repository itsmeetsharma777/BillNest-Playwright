import { test, expect } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper products (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'shopkeeper');
  });

  test('product screen renders', async ({ shopkeeperPage }) => {
    await shopkeeperPage.openProducts();
    await shopkeeperPage.expectProducts();
  });

  test('product page remains on the catalog route', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    await expect(page.getByRole('heading', { name: /products/i }).first()).toBeVisible();
    await expect(page).toHaveURL(/\/shopkeeper\/products(?:[?#]|$)/);
  });
});
