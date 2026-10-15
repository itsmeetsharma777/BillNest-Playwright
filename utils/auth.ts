import { expect, Page } from '@playwright/test';
import { env } from './env';

/**
 * Shared role-based test login.
 * Always navigate directly to the role-specific route and require the
 * successful dashboard URL; remaining on a login form is not authentication.
 */
export async function loginAs(page: Page, role: 'shopkeeper' | 'customer'): Promise<void> {
  const credentials = role === 'shopkeeper'
    ? { email: env.shopkeeperEmail, password: env.shopkeeperPassword }
    : { email: env.customerEmail, password: env.customerPassword };

  if (!credentials.email || !credentials.password) {
    throw new Error(
      `Missing ${role} test credentials. Set ${role === 'shopkeeper'
        ? 'SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD'
        : 'CUSTOMER_EMAIL and CUSTOMER_PASSWORD'} in .env.`,
    );
  }

  await page.goto(`/${role}/login`, { waitUntil: 'domcontentloaded' });
  await page.getByLabel(/email/i).first().fill(credentials.email);
  await page.getByLabel(/^password$/i).first().fill(credentials.password);
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();

  // The production app redirects successful role logins to /shopkeeper or /customer.
  await expect(page).toHaveURL(new RegExp(`/${role}(?:[?#]|$)`), { timeout: 15_000 });
  await expect(page.locator('body')).toBeVisible();
}
