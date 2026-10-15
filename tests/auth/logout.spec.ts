import { test, expect } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test('shopkeeper can log out of the mocked UI session', async ({ page, dashboardPage }) => {
  await loginAs(page, 'shopkeeper');
  await dashboardPage.expectVisible();
  await dashboardPage.logout();
  await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/i, { timeout: 10_000 });
});
