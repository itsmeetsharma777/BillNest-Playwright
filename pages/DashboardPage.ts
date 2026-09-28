import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
export class DashboardPage extends BasePage {
 async expectVisible(){await expect(this.page.getByText(/dashboard/i).first()).toBeVisible();}
 async logout(){const b=this.page.getByRole('button',{name:/logout|log out|sign out/i}).first();if(await b.isVisible().catch(()=>false)){await b.click();return;}const m=this.page.getByRole('button',{name:/menu|profile|account/i}).first();if(await m.isVisible().catch(()=>false)){await m.click();const l=this.page.getByText(/logout|log out|sign out/i).first();if(await l.isVisible().catch(()=>false))await l.click();}}
}
