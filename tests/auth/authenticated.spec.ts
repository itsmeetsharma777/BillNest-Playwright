import { test, expect } from '@playwright/test';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper authenticated UI smoke tests (mocked session)', () => {
  test('shopkeeper can sign in and reach the authenticated dashboard', async ({ page }) => {
    await loginAs(page, 'shopkeeper');
    await expect(page).toHaveURL(/\/shopkeeper(?:[?#]|$)/);
    await expect(page.locator('body')).toBeVisible();
  });
});
