import { expect, Page } from '@playwright/test';
import { env } from './env';

/**
 * Shared test-only authentication helper.
 *
 * Always navigate directly to the role-specific login route. Do not depend on
 * the landing-page menu labels, which can change independently of login.
 * Authentication succeeds only when the login route has been left and the
 * destination is not another role's login page.
 */
export async function loginAs(page: Page, role: 'shopkeeper' | 'customer'): Promise<void> {
  const credentials = role === 'shopkeeper'
    ? { email: env.shopkeeperEmail, password: env.shopkeeperPassword }
    : { email: env.customerEmail, password: env.customerPassword };

  if (!credentials.email || !credentials.password) {
    throw new Error(
      `Missing ${role} test credentials. Set ${role === 'shopkeeper' ? 'SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD' : 'CUSTOMER_EMAIL and CUSTOMER_PASSWORD'} in the local .env file.`,
    );
  }

  await page.goto(`/${role}/login`, { waitUntil: 'domcontentloaded' });
  await page.getByLabel(/email/i).first().fill(credentials.email);
  await page.getByLabel(/^password$/i).first().fill(credentials.password);
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();

  // Reject staying on any role login route; merely loading a page is not auth.
  await expect(page).not.toHaveURL(/\/(?:shopkeeper|customer)\/login(?:[/?#]|$)/i, {
    timeout: 15_000,
  });
  await expect(page.locator('body')).toBeVisible();
}
