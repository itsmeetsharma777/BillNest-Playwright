import { test, expect } from '../../fixtures/testFixtures';
import { installMockAuth } from '../../utils/auth';

test('login form rejects empty submission', async ({ loginPage, page }) => {
  await installMockAuth(page, 'shopkeeper', 'reject');
  await loginPage.open('shopkeeper');
  await loginPage.signInButton.click();

  // The app uses an inline validation message rather than native required fields.
  await expect(page.getByRole('alert')).toContainText(/please enter your email address/i);
  await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/);
});
