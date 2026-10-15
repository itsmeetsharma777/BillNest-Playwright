import { test, expect } from '@playwright/test';
import { installMockAuth } from '../../utils/auth';

test('unauthenticated visit to dashboard does not expose protected content', async ({ page }) => {
  await installMockAuth(page, 'shopkeeper', 'reject');
  await page.goto('/shopkeeper');
  await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/);
  await expect(page.getByLabel(/email/i).first()).toBeVisible();
});
