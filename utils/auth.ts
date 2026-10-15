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

async function ignoreDocumentNavigation(route: Route): Promise<boolean> {
  if (route.request().resourceType() !== 'document') return false;
  await route.continue();
  return true;
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
    if (await ignoreDocumentNavigation(route)) return;
    await jsonResponse(route, signedIn ? 200 : 401, signedIn
      ? { success: true, data: { user } }
      : { success: false, message: 'Not authenticated' });
  });

  await page.route(/\/auth\/login(?:[?#]|$)/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    if (mode === 'reject') {
      await jsonResponse(route, 401, { success: false, message: 'Invalid email or password.' });
      return;
    }
    signedIn = true;
    await jsonResponse(route, 200, { success: true, data: { user } });
  });

  await page.route(/\/auth\/logout(?:[?#]|$)/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    signedIn = false;
    await jsonResponse(route, 200, { success: true, message: 'Logged out' });
  });

  await page.route(/\/shops\/me(?:[?#]|$)/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    await jsonResponse(route, signedIn && role === 'shopkeeper' ? 200 : 401,
      signedIn && role === 'shopkeeper'
        ? { success: true, data: { shop: { _id: 'playwright-test-shop', name: 'Playwright Test Shop' } } }
        : { success: false, message: 'Not authenticated' });
  });

  // A stable seed keeps catalog controls, bulk-selection, and variant navigation testable.
  await page.route(/\/products(?:[?#]|$)/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await jsonResponse(route, 200, {
      success: true,
      data: {
        products: [{
          _id: 'playwright-product-0001',
          name: 'Playwright Test Product',
          sku: 'PW-TEST-001',
          category: 'Test category',
          brand: 'Test brand',
          barcode: 'PW123456',
          unit: 'piece',
          purchasePrice: 100,
          sellingPrice: 150,
          stockQuantity: 10,
          lowStockThreshold: 2,
          warrantyPeriodMonths: 12,
          description: 'Mocked read-only fixture for catalog UI checks',
          isActive: true,
          images: [],
          hasVariants: true,
          createdAt: '2026-01-01T00:00:00.000Z',
        }],
        pagination: { hasMore: false },
      },
    });
  });

  await page.route(/\/categories(?:[?#]|$)/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await jsonResponse(route, 200, { success: true, data: { categories: [] } });
  });

  await page.route(/\/brands(?:[?#]|$)/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await jsonResponse(route, 200, { success: true, data: { brands: [] } });
  });

  await page.route(/\/product-catalog\/analytics(?:[?#]|$)/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    await jsonResponse(route, 200, { success: true, data: { analytics: {} } });
  });

  await page.route(/\/product-variants\/[^/?]+(?:\?.*)?$/, async route => {
    if (await ignoreDocumentNavigation(route)) return;
    if (route.request().method() === 'GET') {
      await jsonResponse(route, 200, { success: true, data: { variants: [] } });
      return;
    }
    await route.continue();
  });
}

/**
 * Signs in to a test-only mock session and asserts the correct role dashboard.
 * Use the optional live-auth suite to verify actual production credentials.
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
