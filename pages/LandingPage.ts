import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LandingPage extends BasePage {
  async open() {
    await this.goto('/');
  }

  async expectLoaded() {
    await expect(this.page).toHaveTitle(/BillNest.*Business Made Simple/i);
    await expect(
      this.page.getByText('Billing and warranty', { exact: false }).first()
    ).toBeVisible();
  }

  async expectGetStarted() {
    await expect(
      this.page.getByRole('button', { name: /get started now/i })
    ).toBeVisible();
  }

  async expectRoleOptions() {
    await expect(
      this.page.getByRole('button', { name: /sign in as shopkeeper/i })
    ).toBeVisible();
    await expect(
      this.page.getByRole('button', { name: /sign in as customer/i })
    ).toBeVisible();
  }
}
