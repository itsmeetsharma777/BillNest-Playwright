import { test, expect } from '@playwright/test';
import { installMockAuth } from '../../utils/auth';

test.describe('Production safety checks', () => {
  test.beforeEach(async ({ page }) => {
    await installMockAuth(page, 'shopkeeper', 'reject');
  });

  test('website is served over HTTPS on configured production host', async ({ page, baseURL }) => {
    test.skip(!baseURL?.startsWith('https://'), 'HTTPS check applies to production BASE_URL.');
    await page.goto('/');
    expect(new URL(page.url()).protocol).toBe('https:');
  });

  test('root page remains usable at a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    const width = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(width).toBeLessThanOrEqual(420);
  });
});
