import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';

/**
 * Safe API access-control probes. These issue GET requests only and do not
 * create, update, or delete application records. API_URL may be supplied as
 * either the API origin or an origin already ending in /api.
 */
const apiBase = env.apiURL.replace(/\/$/, '').endsWith('/api')
  ? env.apiURL.replace(/\/$/, '')
  : `${env.apiURL.replace(/\/$/, '')}/api`;

const protectedReadRoutes = [
  '/products',
  '/categories',
  '/brands',
  '/customers',
  '/invoices',
  '/warranties',
  '/inventory/movements',
  '/inventory/valuation',
  '/reports',
  '/notifications',
  '/shops/me',
  '/customer-portal/dashboard',
  '/customer-portal/invoices',
  '/customer-portal/warranties',
  '/customer-portal/ledger',
];

test.describe('Unauthenticated API access control (read-only)', () => {
  test.skip(!process.env.API_URL, 'Set API_URL explicitly to enable API access-control probes.');

  for (const path of protectedReadRoutes) {
    test(`anonymous request cannot read protected endpoint ${path}`, async ({ request }) => {
      const response = await request.get(`${apiBase}${path}`, {
        failOnStatusCode: false,
      });

      expect(
        [401, 403],
        `Expected protected endpoint ${path} to deny anonymous access; got HTTP ${response.status()}`,
      ).toContain(response.status());
    });
  }

  test('anonymous user cannot access a specific product record', async ({ request }) => {
    const response = await request.get(`${apiBase}/products/000000000000000000000000`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('anonymous user cannot access a specific invoice record', async ({ request }) => {
    const response = await request.get(`${apiBase}/invoices/000000000000000000000000`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('anonymous user cannot access a specific warranty record', async ({ request }) => {
    const response = await request.get(`${apiBase}/warranties/000000000000000000000000`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });
});
