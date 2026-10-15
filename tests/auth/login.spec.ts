import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';
import { testData } from '../../utils/testData';

test.describe('Authentication - Login', () => {
  test('shopkeeper login form renders', async ({ loginPage, page }) => {
    await loginPage.open('shopkeeper');
    await loginPage.expectForm();
    await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/);
  });

  test('invalid shopkeeper credentials stay rejected', async ({ loginPage, page }) => {
    await loginPage.open('shopkeeper');
    await loginPage.login(testData.invalidEmail, testData.invalidPassword);
    await expect(page).toHaveURL(/\/shopkeeper\/login(?:[?#]|$)/);
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
  });

  test('shopkeeper login', async ({ loginPage, dashboardPage }) => {
    test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword, 'Configure dedicated shopkeeper credentials in .env');
    await loginPage.open('shopkeeper');
    await loginPage.login(env.shopkeeperEmail, env.shopkeeperPassword);
    await dashboardPage.expectVisible();
  });

  test('customer login', async ({ loginPage, customerPage, page }) => {
    test.skip(!env.customerEmail || !env.customerPassword, 'Configure dedicated customer credentials in .env');
    await loginPage.open('customer');
    await loginPage.login(env.customerEmail, env.customerPassword);
    await expect(page).toHaveURL(/\/customer(?:[?#]|$)/, { timeout: 15_000 });
    await customerPage.expectArea();
  });
});
