import { test, expect } from '@playwright/test';
import { installMockAuth } from '../../utils/auth';

test.describe('Public authentication entry points', () => {
  test.beforeEach(async ({ page }) => {
    await installMockAuth(page, 'shopkeeper', 'reject');
  });

  test('landing page exposes a sign-in or login entry point', async ({ page }) => {
    await page.goto('/');
    const entry = page.getByRole('link', { name: /sign in|log in|login/i })
      .or(page.getByRole('button', { name: /sign in|log in|login/i }));
    await expect(entry.first()).toBeVisible();
  });

  test('registration or create-account entry point is reachable when offered', async ({ page }) => {
    await page.goto('/');
    const entry = page.getByRole('link', { name: /create account|sign up|register|get started/i })
      .or(page.getByRole('button', { name: /create account|sign up|register|get started/i }));
    test.skip(await entry.count() === 0, 'No public registration entry point detected on landing page.');
    await expect(entry.first()).toBeVisible();
  });
});
