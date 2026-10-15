import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type LoginRole = 'shopkeeper' | 'customer';

export class LoginPage extends BasePage {
  readonly email = this.page.getByLabel(/email/i).first();
  readonly password = this.page.getByLabel(/^password$/i).first();
  readonly signInButton = this.page.getByRole('button', { name: /sign in|login|log in/i }).first();

  async open(role: LoginRole = 'shopkeeper') {
    // /login is only a compatibility redirect to the shopkeeper form.
    await this.goto(`/${role}/login`);
  }

  async expectForm() {
    await expect(this.email).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
  }
}
