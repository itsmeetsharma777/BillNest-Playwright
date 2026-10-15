import { test } from '../../fixtures/testFixtures';
import { installMockAuth } from '../../utils/auth';

test.describe('Landing smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await installMockAuth(page, 'shopkeeper', 'reject');
  });

  test('landing page loads', async ({ landingPage }) => {
    await landingPage.open();
    await landingPage.expectLoaded();
  });

  test('Get started CTA is visible', async ({ landingPage }) => {
    await landingPage.open();
    await landingPage.expectGetStarted();
  });

  test('shopkeeper and customer entry options are visible', async ({ landingPage }) => {
    await landingPage.open();
    await landingPage.expectRoleOptions();
  });
});
