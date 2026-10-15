import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';
import { loginAs } from '../../utils/auth';

/**
 * Route inventory checks validate route resolution and visible application
 * output only. They are not a substitute for complete business workflow tests.
 * Authenticated routes require dedicated role-specific test accounts.
 */
const publicRoutes = [
  '/', '/get-started', '/explore', '/forgot-password', '/reset-password', '/login', '/register',
  '/shopkeeper/login', '/shopkeeper/register', '/shopkeeper/learn-more',
  '/customer/login', '/customer/register', '/customer/learn-more',
];

test.describe('Complete public route inventory', () => {
  for (const path of publicRoutes) {
    test(`public route resolves: ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response, `Navigation response missing for ${path}`).not.toBeNull();
      expect([200, 301, 302, 304]).toContain(response!.status());
      await expect(page.locator('body')).not.toContainText(/internal server error|vite error|uncaught exception/i);
      expect(errors, `Uncaught browser errors on ${path}`).toEqual([]);
    });
  }
});

const shopkeeperRoutes = [
  '/shopkeeper', '/shopkeeper/create-shop', '/shopkeeper/products',
  '/shopkeeper/categories', '/shopkeeper/brands', '/shopkeeper/customers',
  '/shopkeeper/invoices', '/shopkeeper/invoices/new', '/shopkeeper/warranties',
  '/shopkeeper/warranties/new', '/shopkeeper/inventory/history',
  '/shopkeeper/reports', '/shopkeeper/notifications', '/shopkeeper/settings',
];

test.describe('Shopkeeper route inventory (requires dedicated test account)', () => {
  test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword,
    'Set dedicated SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD.');

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'shopkeeper');
  });

  for (const path of shopkeeperRoutes) {
    test(`shopkeeper route resolves: ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).not.toContainText(/internal server error|vite error|uncaught exception/i);
      expect(errors).toEqual([]);
    });
  }
});

const customerRoutes = [
  '/customer', '/customer/invoices', '/customer/bills', '/customer/payments',
  '/customer/warranties', '/customer/notifications', '/customer/settings',
];

test.describe('Customer route inventory (requires dedicated test account)', () => {
  test.skip(!env.customerEmail || !env.customerPassword,
    'Set dedicated CUSTOMER_EMAIL and CUSTOMER_PASSWORD.');

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'customer');
  });

  for (const path of customerRoutes) {
    test(`customer route resolves: ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).not.toContainText(/internal server error|vite error|uncaught exception/i);
      expect(errors).toEqual([]);
    });
  }
});

test.describe('Responsive layout baseline', () => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`landing page has no horizontal overflow at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(metrics.scrollWidth, `Horizontal overflow at ${viewport.name}`)
        .toBeLessThanOrEqual(metrics.clientWidth + 1);
    });
  }
});
