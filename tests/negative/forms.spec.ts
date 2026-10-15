import { test, expect } from '../../fixtures/testFixtures';
import { installMockAuth } from '../../utils/auth';

test('login form rejects empty submission', async ({ loginPage, page }) => {
  await installMockAuth(page, 'shopkeeper', 'reject');
  await loginPage.open('shopkeeper');
  await loginPage.signInButton.click();

  const emailInvalid = await loginPage.email
    .evaluate(el => !(el as HTMLInputElement).checkValidity())
    .catch(() => false);
  const passwordInvalid = await loginPage.password
    .evaluate(el => !(el as HTMLInputElement).checkValidity())
    .catch(() => false);

  expect(emailInvalid || passwordInvalid).toBeTruthy();
  await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/);
});
