import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
export class ShopkeeperPage extends BasePage {
 async openProducts(){const l=this.page.getByRole('link',{name:/products|inventory/i}).first();if(await l.isVisible().catch(()=>false))await l.click();}
 async expectProducts(){await expect(this.page.getByText(/products|inventory/i).first()).toBeVisible();}
 async openInvoices(){const l=this.page.getByRole('link',{name:/invoice/i}).first();if(await l.isVisible().catch(()=>false))await l.click();}
 async openSettings(){const l=this.page.getByRole('link',{name:/settings/i}).first();if(await l.isVisible().catch(()=>false))await l.click();}
}
