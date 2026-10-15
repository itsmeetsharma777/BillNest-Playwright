import { test, expect } from '@playwright/test';
import { installMockAuth } from '../../utils/auth';

test.describe('Public-facing resilience', () => {
  test.beforeEach(async ({ page }) => {
    await installMockAuth(page, 'shopkeeper', 'reject');
  });

  test('unknown route does not expose a server stack trace', async ({ page }) => {
    await page.goto('/this-route-should-not-exist-playwright');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/stack trace|mongodb\+srv|\bat\s+.*\.js:\d+:\d+/i);
  });

  test('application does not expose obvious secret values in rendered page', async ({ page }) => {
    await page.goto('/');
    const html = await page.locator('body').innerText();
    expect(html).not.toMatch(/sk_live_[A-Za-z0-9]+|-----BEGIN PRIVATE KEY-----/);
  });
});
