import { expect, Page, Route } from '@playwright/test';
import { env } from './env';

type Role = 'shopkeeper' | 'customer';
type LoginMode = 'success' | 'reject';

function jsonResponse(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/**
 * Installs test-only auth/API responses for UI and route smoke tests.
 *
 * This keeps front-end route checks deterministic and independent of live
 * account state. It does not prove that the production authentication API works.
 */
export async function installMockAuth(page: Page, role: Role, mode: LoginMode = 'success'): Promise<void> {
  let signedIn = false;
  const user = {
    id: `playwright-${role}`,
    name: role === 'shopkeeper' ? 'Playwright Shopkeeper' : 'Playwright Customer',
    email: role === 'shopkeeper'
      ? (env.shopkeeperEmail || 'shopkeeper@playwright.invalid')
      : (env.customerEmail || 'customer@playwright.invalid'),
    role,
    isActive: true,
    emailVerified: true,
  };

  await page.route(/\/auth\/me(?:[?#]|$)/, async route => {
    if (signedIn) {
      await jsonResponse(route, 200, { success: true, data: { user } });
    } else {
      await jsonResponse(route, 401, { success: false, message: 'Not authenticated' });
    }
  });

  await page.route(/\/auth\/login(?:[?#]|$)/, async route => {
    if (mode === 'reject') {
      await jsonResponse(route, 401, { success: false, message: 'Invalid email or password.' });
      return;
    }

    signedIn = true;
    await jsonResponse(route, 200, { success: true, data: { user } });
  });

  await page.route(/\/auth\/logout(?:[?#]|$)/, async route => {
    signedIn = false;
    await jsonResponse(route, 200, { success: true, message: 'Logged out' });
  });

  await page.route(/\/shops\/me(?:[?#]|$)/, async route => {
    if (signedIn && role === 'shopkeeper') {
      await jsonResponse(route, 200, {
        success: true,
        data: { shop: { _id: 'playwright-test-shop', name: 'Playwright Test Shop' } },
      });
    } else {
      await jsonResponse(route, 401, { success: false, message: 'Not authenticated' });
    }
  });

  // Stable empty catalog payloads keep read-only catalog screens deterministic.
  await page.route(/\/products(?:[?#]|$)/, async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await jsonResponse(route, 200, { success: true, data: { products: [], pagination: { hasMore: false } } });
  });

  await page.route(/\/categories(?:[?#]|$)/, async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await jsonResponse(route, 200, { success: true, data: { categories: [] } });
  });

  await page.route(/\/brands(?:[?#]|$)/, async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await jsonResponse(route, 200, { success: true, data: { brands: [] } });
  });

  await page.route(/\/product-catalog\/analytics(?:[?#]|$)/, async route => {
    await jsonResponse(route, 200, { success: true, data: { analytics: {} } });
  });
}

/**
 * Sign in to a test-only mock session and assert the correct role dashboard.
 * Use dedicated live-auth tests separately when verifying production credentials.
 */
export async function loginAs(page: Page, role: Role): Promise<void> {
  await installMockAuth(page, role);
  const email = role === 'shopkeeper'
    ? (env.shopkeeperEmail || 'shopkeeper@playwright.invalid')
    : (env.customerEmail || 'customer@playwright.invalid');
  const password = role === 'shopkeeper'
    ? (env.shopkeeperPassword || 'Playwright-Test-Only-Password')
    : (env.customerPassword || 'Playwright-Test-Only-Password');

  await page.goto(`/${role}/login`, { waitUntil: 'domcontentloaded' });
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/^password$/i).first().fill(password);
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();

  await expect(page).toHaveURL(new RegExp(`/${role}(?:[?#]|$)`), { timeout: 15_000 });
  await expect(page.locator('body')).toBeVisible();
}
