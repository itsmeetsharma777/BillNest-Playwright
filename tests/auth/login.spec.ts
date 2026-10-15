import { test, expect } from '../../fixtures/testFixtures';
import { installMockAuth, loginAs } from '../../utils/auth';
import { testData } from '../../utils/testData';

test.describe('Authentication - Login', () => {
  test('shopkeeper login form renders', async ({ loginPage, page }) => {
    await loginPage.open('shopkeeper');
    await loginPage.expectForm();
    await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/);
  });

  test('invalid credentials stay rejected by the login UI', async ({ loginPage, page }) => {
    await installMockAuth(page, 'shopkeeper', 'reject');
    await loginPage.open('shopkeeper');
    await loginPage.login('unknown.user@playwright.invalid', testData.invalidPassword);
    await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/);
    await expect(page.getByRole('alert')).toContainText(/invalid email or password/i);
  });

  test('shopkeeper can complete the login UI flow', async ({ page, dashboardPage }) => {
    await loginAs(page, 'shopkeeper');
    await dashboardPage.expectVisible();
  });

  test('customer can complete the login UI flow', async ({ page, customerPage }) => {
    await loginAs(page, 'customer');
    await customerPage.expectArea();
  });
});
