import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper advanced catalog Feature 22', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword,
      'Configure dedicated shopkeeper credentials in .env');
    await loginAs(page, 'shopkeeper');
  });

  test('advanced catalog controls render', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Advanced filters/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Import CSV/i })).toBeVisible();
  });

  test('advanced filters open and expose catalog dimensions', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    await page.getByRole('button', { name: /Advanced filters/i }).click();
    await expect(page.getByText('Stock', { exact: true })).toBeVisible();
    await expect(page.getByText('Barcode', { exact: true })).toBeVisible();
    await expect(page.getByText('Variants', { exact: true })).toBeVisible();
    await expect(page.getByText('Min price', { exact: true })).toBeVisible();
    await expect(page.getByText('Max price', { exact: true })).toBeVisible();
  });

  test('product selection exposes bulk actions when a product exists', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    const checkbox = page.locator('input[type="checkbox"][aria-label^="Select "]').first();
    if (!(await checkbox.count())) {
      test.info().annotations.push({ type: 'note', description: 'No seeded product is available for a bulk-action assertion.' });
      return;
    }
    await checkbox.check();
    await expect(page.getByRole('button', { name: /Activate selected/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Deactivate selected/i })).toBeVisible();
  });

  test('variant manager is reachable from catalog when a product exists', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    const variantButton = page.getByTitle('Manage variants').first();
    if (!(await variantButton.count())) {
      test.info().annotations.push({ type: 'note', description: 'No seeded product is available for the variant-manager assertion.' });
      return;
    }
    await variantButton.click();
    await expect(page).toHaveURL(/\/shopkeeper\/products\/[^/]+\/variants(?:[?#]|$)/);
    await expect(page.getByRole('heading', { name: 'Product Variants' })).toBeVisible();
  });
});
