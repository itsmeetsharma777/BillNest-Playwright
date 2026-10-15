import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';

/**
 * Opt-in integration checks against the actual API/session.
 * They are skipped by default so ordinary UI tests don't need live credentials.
 * Never use a personal account; use a dedicated test account only.
 */
test.describe('Live authentication integration (opt-in, real backend)', () => {
  test.beforeEach(async () => {
    test.skip(
      process.env.RUN_LIVE_AUTH_TESTS !== 'true',
      'Set RUN_LIVE_AUTH_TESTS=true to exercise real API authentication.',
    );
  });

  test('valid shopkeeper credentials reach the shopkeeper dashboard', async ({ page }) => {
    test.skip(!env.shopkeeperEmail || !env.shopkeeperPassword,
      'Set SHOPKEEPER_EMAIL and SHOPKEEPER_PASSWORD to a dedicated test account.');
    await page.goto('/shopkeeper/login', { waitUntil: 'domcontentloaded' });
    await page.getByLabel(/email/i).first().fill(env.shopkeeperEmail);
    await page.getByLabel(/^password$/i).first().fill(env.shopkeeperPassword);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await expect(page).toHaveURL(/\/shopkeeper(?:[?#]|$)/, { timeout: 20_000 });
  });

  test('valid customer credentials reach the customer portal', async ({ page }) => {
    test.skip(!env.customerEmail || !env.customerPassword,
      'Set CUSTOMER_EMAIL and CUSTOMER_PASSWORD to a dedicated test account.');
    await page.goto('/customer/login', { waitUntil: 'domcontentloaded' });
    await page.getByLabel(/email/i).first().fill(env.customerEmail);
    await page.getByLabel(/^password$/i).first().fill(env.customerPassword);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await expect(page).toHaveURL(/\/customer(?:[?#]|$)/, { timeout: 20_000 });
  });
});
