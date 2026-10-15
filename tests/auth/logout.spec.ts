import { test, expect } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test('shopkeeper can log out of the mocked UI session', async ({ page, dashboardPage }) => {
  await loginAs(page, 'shopkeeper');
  await dashboardPage.expectVisible();
  await dashboardPage.logout();

  // BillNest redirects the shopkeeper's Sign out action through /register.
  await expect(page).toHaveURL(/\/shopkeeper\/register(?:[?#]|$)/i, { timeout: 10_000 });
  await expect(page.getByRole('button', { name: /sign in|log in|login/i }).first()).toBeVisible();
});
