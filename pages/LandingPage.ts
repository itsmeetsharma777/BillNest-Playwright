import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
export class LandingPage extends BasePage {
 async open(){await this.goto('/');}
 async expectLoaded(){await expect(this.page.getByText(/BillNest/i).first()).toBeVisible();}
 async expectGetStarted(){await expect(this.page.getByRole('link',{name:/get started/i}).first()).toBeVisible();}
}
