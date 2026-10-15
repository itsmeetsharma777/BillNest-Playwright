import { test } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test.describe('Customer navigation (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
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
