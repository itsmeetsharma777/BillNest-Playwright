import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test.describe('Shopkeeper authenticated smoke tests', () => {
  test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword,
    'Set dedicated SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD credentials.');

  test('shopkeeper can sign in and reach an authenticated page', async ({ page }) => {
    await loginAs(page, 'shopkeeper');
    await expect(page).toHaveURL(/\/shopkeeper(?:[?#]|$)/);
    await expect(page.locator('body')).toBeVisible();
  });
});
