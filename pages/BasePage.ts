import { expect, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    // SPA readiness depends on DOM hydration, not every API request finishing.
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async expectPath(pattern: RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }
}
