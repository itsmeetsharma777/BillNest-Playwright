import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerPage extends BasePage {
  async expectArea() {
    await expect(this.page).toHaveURL(/\/customer(?:[?#]|$)/, { timeout: 15_000 });
    await expect(this.page.locator('body')).toBeVisible();
  }

  async openInvoices() {
    // The production portal labels this destination "My Purchases".
    await this.page.getByRole('link', { name: /my purchases|invoices?/i }).first().click();
    await expect(this.page).toHaveURL(/\/customer\/invoices(?:[?#]|$)/);
  }

  async openWarranty() {
    await this.page.getByRole('link', { name: /warrant/i }).first().click();
    await expect(this.page).toHaveURL(/\/customer\/warranties(?:[?#]|$)/);
  }

  async openSettings() {
    await this.page.getByRole('link', { name: /settings/i }).first().click();
    await expect(this.page).toHaveURL(/\/customer\/settings(?:[?#]|$)/);
  }
}
