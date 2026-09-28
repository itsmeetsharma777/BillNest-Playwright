import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
const baseURL = process.env.BASE_URL || 'http://localhost:5173';
export default defineConfig({
 testDir: './tests', timeout: 30000, expect: { timeout: 7000 }, fullyParallel: true,
 forbidOnly: !!process.env.CI, retries: process.env.CI ? 2 : 0, workers: process.env.CI ? 1 : undefined,
 reporter: process.env.CI ? [['line'], ['html',{open:'never'}]] : [['list'], ['html',{open:'never'}]],
 use: { baseURL, trace:'retain-on-failure', screenshot:'only-on-failure', video:'retain-on-failure', actionTimeout:10000, navigationTimeout:15000 },
 projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'firefox',use:{...devices['Desktop Firefox']}},{name:'webkit',use:{...devices['Desktop Safari']}}]
});
