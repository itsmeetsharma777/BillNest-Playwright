import {test as base,expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';import {LandingPage} from '../pages/LandingPage';import {DashboardPage} from '../pages/DashboardPage';import {ShopkeeperPage} from '../pages/ShopkeeperPage';import {CustomerPage} from '../pages/CustomerPage';
type Fixtures={loginPage:LoginPage;landingPage:LandingPage;dashboardPage:DashboardPage;shopkeeperPage:ShopkeeperPage;customerPage:CustomerPage};
export const test=base.extend<Fixtures>({loginPage:async({page},use)=>use(new LoginPage(page)),landingPage:async({page},use)=>use(new LandingPage(page)),dashboardPage:async({page},use)=>use(new DashboardPage(page)),shopkeeperPage:async({page},use)=>use(new ShopkeeperPage(page)),customerPage:async({page},use)=>use(new CustomerPage(page))});
export {expect};
