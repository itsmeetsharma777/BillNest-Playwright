import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerPage extends BasePage {
  async expectArea() {
    await expect(this.page).toHaveURL(/\/customer(?:[?#]|$)/, { timeout: 15_000 });
    await expect(this.page.locator('body')).toBeVisible();
  }

  async openInvoices() {
    await this.page.getByRole('link', { name: /invoices?/i }).first().click();
    await expect(this.page).toHaveURL(/\/customer\/invoices(?:[?#]|$)/);
  }

  async openWarranty() {
    await this.page.getByRole('link', { name: /warranties/i }).first().click();
    await expect(this.page).toHaveURL(/\/customer\/warranties(?:[?#]|$)/);
  }

  async openSettings() {
    await this.page.getByRole('link', { name: /settings/i }).first().click();
    await expect(this.page).toHaveURL(/\/customer\/settings(?:[?#]|$)/);
  }
}
