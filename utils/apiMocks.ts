import type { Page, Route } from '@playwright/test';

const ok = (route: Route, data: unknown) => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ success: true, data }),
});

const passDocument = async (route: Route) => {
  if (route.request().resourceType() !== 'document') return false;
  await route.continue();
  return true;
};

/** Test-only empty/seeded API responses; never writes to BillNest data. */
export async function installReadOnlyApiMocks(page: Page, role: 'shopkeeper' | 'customer') {
  const customer = { id: 'pw-customer', name: 'Playwright Customer', email: 'playwright-customer@example.test' };
  const invoice = {
    _id: 'pw-invoice-1', id: 'pw-invoice-1', invoiceNumber: 'PW-INV-001',
    invoiceNo: 'PW-INV-001', issueDate: '2026-01-01T00:00:00.000Z',
    invoiceDate: '2026-01-01T00:00:00.000Z', customerName: customer.name,
    customer, productNames: ['Playwright Test Product'], subtotal: 150,
    discount: 0, tax: 0, total: 150, amountPaid: 150, amountDue: 0,
    status: 'paid', paymentMethod: 'cash',
  };

  const handlers: Array<[RegExp, (route: Route) => Promise<unknown>]> = [
    [/\/customer\/dashboard(?:[?#]|$)/, route => ok(route, {
      customer, shops: [],
      summary: {
        invoices: { totalInvoices: 1, total: 1, totalSpent: 150, totalPaid: 150, totalDue: 0 },
        warranties: { totalWarranties: 0, activeWarranties: 0, expiringSoon: 0, expired: 0, total: 0, active: 0 },
      },
      recentInvoices: [{ ...invoice, _id: 'pw-invoice-1' }], upcomingWarranties: [],
    })],
    [/\/customer\/invoices(?:[?#]|$)/, route => ok(route, { invoices: [invoice], total: 1 })],
    [/\/customer\/ledger(?:[?#]|$)/, route => ok(route, {
      summary: { totalPurchases: 150, totalPaid: 150, totalDue: 0, totalInvoices: 1, paidInvoices: 1, partiallyPaidInvoices: 0, unpaidInvoices: 0 },
      invoices: [invoice], payments: [],
    })],
    [/\/customer\/warranties(?:[?#]|$)/, route => ok(route, { warranties: [], total: 0 })],
    [/\/customer\/bills(?:[?#]|$)/, route => ok(route, { bills: [] })],
    [/\/customer\/notifications(?:[?#]|$)/, route => ok(route, {
      notifications: [], unreadCount: 0, pagination: { page: 1, limit: 10, total: 0, hasMore: false },
    })],
    [/\/customer\/account(?:[?#]|$)/, route => ok(route, {
      user: { ...customer, role: 'customer', isActive: true, emailVerified: true },
      customer: { id: customer.id, phone: '9999999999', address: { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' } },
    })],
  ];

  for (const [pattern, handler] of handlers) {
    await page.route(pattern, async route => {
      if (await passDocument(route)) return;
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await handler(route);
    });
  }

  // Keep route inventories independent of an external API when opening Shopkeeper pages.
  if (role === 'shopkeeper') {
    await page.route(/\/invoices(?:[?#]|$)/, async route => {
      if (await passDocument(route)) return;
      if (route.request().method() !== 'GET') return route.continue();
      await ok(route, { invoices: [invoice], total: 1 });
    });
    await page.route(/\/warranties(?:[?#]|$)/, async route => {
      if (await passDocument(route)) return;
      if (route.request().method() !== 'GET') return route.continue();
      await ok(route, { warranties: [], pagination: { page: 1, limit: 10, hasMore: false } });
    });
    await page.route(/\/notifications(?:[?#]|$)/, async route => {
      if (await passDocument(route)) return;
      if (route.request().method() !== 'GET') return route.continue();
      await ok(route, { notifications: [], unreadCount: 0, pagination: { page: 1, limit: 10, total: 0, hasMore: false } });
    });
  }
}
