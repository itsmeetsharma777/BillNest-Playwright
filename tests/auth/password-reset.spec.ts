import { test, expect } from '@playwright/test';
import { installMockAuth } from '../../utils/auth';

/**
 * Password reset UI tests use route interception. They never send reset
 * requests to the configured BillNest backend and never change an account.
 */
test.describe('Password reset UI (network mocked)', () => {
  test.beforeEach(async ({ page }) => {
    await installMockAuth(page, 'shopkeeper', 'reject');
  });
  test('forgot-password page shows required email input and submit button', async ({ page }) => {
    await page.goto('/forgot-password');

    await expect(page.getByRole('heading', { name: /forgot your password/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toHaveAttribute('type', 'email');
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeDisabled();
  });

  test('forgot-password sends request through mocked endpoint and shows generic confirmation', async ({ page }) => {
    let requestBody: unknown;
    await page.route('**/auth/forgot-password', async route => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'If an account exists, a reset link was sent.' }),
      });
    });

    await page.goto('/forgot-password');
    await page.getByLabel(/email address/i).fill('playwright.invalid@example.test');
    await page.getByRole('button', { name: /send reset link/i }).click();

    await expect(page.getByRole('heading', { name: /check your email/i })).toBeVisible();
    await expect(page.getByText(/if an account exists/i)).toBeVisible();
    expect(requestBody).toEqual({ email: 'playwright.invalid@example.test' });
  });

  test('forgot-password displays a safe error when mocked service fails', async ({ page }) => {
    await page.route('**/auth/forgot-password', route => route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Service temporarily unavailable.' }),
    }));

    await page.goto('/forgot-password');
    await page.getByLabel(/email address/i).fill('playwright.invalid@example.test');
    await page.getByRole('button', { name: /send reset link/i }).click();

    await expect(page.getByRole('alert')).toContainText(/temporarily unavailable/i);
    await expect(page.getByRole('heading', { name: /forgot your password/i })).toBeVisible();
  });

  test('reset-password without a token explains that the link is unavailable', async ({ page }) => {
    await page.goto('/reset-password');

    await expect(page.getByRole('heading', { name: /reset link unavailable/i })).toBeVisible();
    await expect(page.getByText(/missing a valid token/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /request a new reset link/i })).toBeVisible();
  });

  test('reset-password rejects a mocked invalid token without showing the password form', async ({ page }) => {
    await page.route('**/auth/validate-reset-token', route => route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'This password reset link is invalid or has expired.' }),
    }));

    await page.goto('/reset-password?token=not-a-real-token');

    await expect(page.getByRole('heading', { name: /reset link unavailable/i })).toBeVisible();
    await expect(page.getByLabel('New password', { exact: true })).toHaveCount(0);
  });

  test('reset-password enforces password requirements and matching confirmation in the UI', async ({ page }) => {
    await page.route('**/auth/validate-reset-token', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ valid: true }),
    }));

    await page.goto('/reset-password?token=playwright-mocked-token');
    await expect(page.getByRole('heading', { name: /create a new password/i })).toBeVisible();

    const submit = page.getByRole('button', { name: /^reset password$/i });
    await expect(submit).toBeDisabled();

    await page.getByLabel('New password', { exact: true }).fill('weak');
    await page.getByLabel('Confirm new password', { exact: true }).fill('weak');
    await expect(submit).toBeDisabled();

    await page.getByLabel('New password', { exact: true }).fill('StrongPass1!');
    await page.getByLabel('Confirm new password', { exact: true }).fill('DifferentPass1!');
    await expect(submit).toBeDisabled();

    await page.getByLabel('Confirm new password', { exact: true }).fill('StrongPass1!');
    await expect(submit).toBeEnabled();
  });

  test('reset-password submits valid form to mocked service only', async ({ page }) => {
    await page.route('**/auth/validate-reset-token', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ valid: true }),
    }));

    let resetBody: unknown;
    await page.route('**/auth/reset-password', async route => {
      resetBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password reset successful.' }),
      });
    });

    await page.goto('/reset-password?token=playwright-mocked-token');
    await page.getByLabel('New password', { exact: true }).fill('StrongPass1!');
    await page.getByLabel('Confirm new password', { exact: true }).fill('StrongPass1!');
    await page.getByRole('button', { name: /^reset password$/i }).click();

    await expect(page.getByRole('heading', { name: /password reset successful/i })).toBeVisible();
    expect(resetBody).toEqual({ token: 'playwright-mocked-token', password: 'StrongPass1!' });
  });
});
