import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper products', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword, 'Configure dedicated shopkeeper credentials in .env');
    await loginAs(page, 'shopkeeper');
  });

  test('product screen renders', async ({ shopkeeperPage }) => {
    await shopkeeperPage.openProducts();
    await shopkeeperPage.expectProducts();
  });

  test('product click does not unexpectedly return to dashboard', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    const productHeading = page.getByRole('heading', { name: /products/i }).first();
    await expect(productHeading).toBeVisible();
    await expect(page).toHaveURL(/\/shopkeeper\/products(?:[?#]|$)/);
  });
});
