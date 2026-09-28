import { expect, Page } from '@playwright/test';
export class BasePage {
 constructor(protected readonly page: Page) {}
 async goto(path = '/') { await this.page.goto(path); await this.page.waitForLoadState('domcontentloaded'); }
 async expectPath(pattern: RegExp) { await expect(this.page).toHaveURL(pattern); }
}
