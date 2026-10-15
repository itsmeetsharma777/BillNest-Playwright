import { expect, Page, Route } from '@playwright/test';
import { installReadOnlyApiMocks } from './apiMocks';

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
 * Installs test-only authentication responses for frontend UI checks.
 * Live backend authentication is deliberately not part of this helper.
 */
export async function installMockAuth(page: Page, role: Role, mode: LoginMode = 'success'): Promise<void> {
  let signedIn = false;
  const user = {
    id: `playwright-${role}`,
    name: role === 'shopkeeper' ? 'Playwright Shopkeeper' : 'Playwright Customer',
    email: `playwright-${role}@example.test`,
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
        ? { success: true, data: { shop: { _id: 'pw-test-shop', name: 'Playwright Test Shop' } } }
        : { success: false, message: 'Not authenticated' });
  });

  // A deterministic catalog keeps UI controls testable without modifying real data.
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
          _id: 'pw-product-0001',
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
          description: 'Mock fixture for catalog UI checks',
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

  await installReadOnlyApiMocks(page, role);
}

/** Signs in to a test-only mocked session and verifies the expected dashboard route. */
export async function loginAs(page: Page, role: Role): Promise<void> {
  await installMockAuth(page, role);
  await page.goto(`/${role}/login`, { waitUntil: 'domcontentloaded' });
  await page.getByLabel(/email/i).first().fill(`playwright-${role}@example.test`);
  await page.getByLabel(/^password$/i).first().fill('Playwright-Test-Only-Password');
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();

  await expect(page).toHaveURL(new RegExp(`/${role}(?:[?#]|$)`), { timeout: 15_000 });
  await expect(page.locator('body')).toBeVisible();
}
