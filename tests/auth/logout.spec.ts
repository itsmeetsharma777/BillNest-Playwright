import { test, expect } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test('shopkeeper can log out of the mocked UI session', async ({ page, dashboardPage }) => {
  await loginAs(page, 'shopkeeper');
  await dashboardPage.expectVisible();
  await dashboardPage.logout();

  // Mock auth now reports an unauthenticated session, so the protected-route
  // guard sends the browser to the shopkeeper login page.
  await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/i, { timeout: 10_000 });
  await expect(page.getByLabel(/email/i).first()).toBeVisible();
});
