import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopkeeperPage extends BasePage {
  async openProducts() {
    await this.page.getByRole('link', { name: /products/i }).first().click();
    await expect(this.page).toHaveURL(/\/shopkeeper\/products(?:[?#]|$)/);
  }

  async expectProducts() {
    await expect(this.page.getByRole('heading', { name: /products/i }).first()).toBeVisible();
  }

  async openInvoices() {
    await this.page.getByRole('link', { name: /invoices?/i }).first().click();
    await expect(this.page).toHaveURL(/\/shopkeeper\/invoices(?:[?#]|$)/);
  }

  async openSettings() {
    await this.page.getByRole('link', { name: /settings/i }).first().click();
    await expect(this.page).toHaveURL(/\/shopkeeper\/settings(?:[?#]|$)/);
  }
}
