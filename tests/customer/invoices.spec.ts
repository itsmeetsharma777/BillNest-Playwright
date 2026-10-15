import { test, expect } from '../../fixtures/testFixtures';
import { loginAs } from '../../utils/auth';

test('customer invoice area shows invoice information', async ({ page, customerPage }) => {
  await loginAs(page, 'customer');
  await customerPage.expectArea();
  await customerPage.openInvoices();
  await expect(page.getByText(/PW-INV-001|invoice|amount|total|due|paid/i).first()).toBeVisible();
});
