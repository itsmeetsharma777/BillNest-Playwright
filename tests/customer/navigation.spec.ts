import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

test.describe('Customer navigation', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!env.customerEmail || !env.customerPassword, 'Configure dedicated customer credentials in .env');
    await loginAs(page, 'customer');
  });

  test('invoices are reachable', async ({ customerPage }) => {
    await customerPage.openInvoices();
  });

  test('warranty is reachable', async ({ customerPage }) => {
    await customerPage.openWarranty();
  });

  test('settings are reachable', async ({ customerPage }) => {
    await customerPage.openSettings();
  });
});
