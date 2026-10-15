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
    const logoutButton = this.page.getByRole('button', { name: /logout|log out|sign out/i }).first();
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
      return;
    }

    const menuButton = this.page.getByRole('button', { name: /menu|profile|account/i }).first();
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      const logoutItem = this.page.getByText(/logout|log out|sign out/i).first();
      if (await logoutItem.isVisible().catch(() => false)) {
        await logoutItem.click();
        return;
      }
    }

    throw new Error('Could not find a visible logout control on the shopkeeper dashboard.');
  }
}
