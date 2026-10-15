import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  async expectVisible() {
    // Do not count the login page as an authenticated destination.
    await expect(this.page).toHaveURL(/\/shopkeeper(?:[?#]|$)/, { timeout: 15_000 });
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.page.locator('body')).not.toContainText(
      /internal server error|application error|something went wrong/i,
    );
  }

  async logout() {
    // Production's shopkeeper profile menu has aria-haspopup="menu".
    const menuButton = this.page.locator('button[aria-haspopup="menu"]').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await this.page.getByRole('menuitem', { name: /sign out|log out|logout/i }).click();
  }
}
