import {test} from '../../fixtures/testFixtures';
test.describe('Landing smoke tests',()=>{test('landing page loads',async({landingPage})=>{await landingPage.open();await landingPage.expectLoaded();});test('Get Started is visible',async({landingPage})=>{await landingPage.open();await landingPage.expectGetStarted();});});
