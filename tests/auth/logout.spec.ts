import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test('shopkeeper can log out', async ({ page, dashboardPage }) => {
  test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword,
    'Configure dedicated shopkeeper credentials in .env');

  await loginAs(page, 'shopkeeper');
  await dashboardPage.expectVisible();
  await dashboardPage.logout();
  await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/i, { timeout: 10_000 });
});
