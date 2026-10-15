import { test, expect } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper advanced catalog Feature 22 (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
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

  test('product selection exposes bulk actions', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    const checkbox = page.locator('input[type="checkbox"][aria-label^="Select "]').first();
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await expect(page.getByRole('button', { name: /Activate selected/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Deactivate selected/i })).toBeVisible();
  });

  test('variant manager is reachable from catalog', async ({ shopkeeperPage, page }) => {
    await shopkeeperPage.openProducts();
    await page.getByTitle('Manage variants').first().click();
    await expect(page).toHaveURL(/\/shopkeeper\/products\/[^/]+\/variants(?:[?#]|$)/);
    await expect(page.getByRole('heading', { name: 'Product Variants' })).toBeVisible();
  });
});
