import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
export class CustomerPage extends BasePage {
 async expectArea(){await expect(this.page.getByText(/invoice|warranty|customer|portal/i).first()).toBeVisible();}
 async openInvoices(){const l=this.page.getByRole('link',{name:/invoice/i}).first();if(await l.isVisible().catch(()=>false))await l.click();}
 async openWarranty(){const l=this.page.getByRole('link',{name:/warranty/i}).first();if(await l.isVisible().catch(()=>false))await l.click();}
 async openSettings(){const l=this.page.getByRole('link',{name:/settings/i}).first();if(await l.isVisible().catch(()=>false))await l.click();}
}
