# BillNest Playwright E2E

End-to-end test automation for the BillNest web application using Playwright, TypeScript, and page objects.

## Prerequisites

- Node.js 20 or 22 (Node 22 is used in CI)
- npm
- Access to a BillNest test deployment
- Test-only Shopkeeper and Customer accounts for authenticated tests

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
```

Edit `.env` locally. Never commit real credentials or production secrets.

```dotenv
BASE_URL=https://your-test-deployment.example
API_URL=http://localhost:5001
SHOPKEEPER_EMAIL=
SHOPKEEPER_PASSWORD=
CUSTOMER_EMAIL=
CUSTOMER_PASSWORD=
```

Use a dedicated test/staging environment and test accounts. Do not run data-mutating tests against real customer or production financial data.

## Run tests

```bash
# TypeScript validation
npm run typecheck

# Landing smoke checks across configured browsers
npm run test:smoke

# Entire configured suite
npm test

# Chromium only
npm run test:chromium

# Authentication, Shopkeeper, Customer, negative, or edge suites
npm run test:auth
npm run test:shopkeeper
npm run test:customer
npm run test:negative
npm run test:edge
```

Tests requiring credentials are designed to skip when their corresponding environment variables are absent. A skipped test is not a verified pass; configure test-only credentials to exercise those workflows.

## HTML report and artifacts

Playwright's HTML reporter writes to `playwright-report/`. After a run:

```bash
npm run report
```

Open the report in a browser. Failed-test screenshots, videos, and traces are configured to be retained under `test-results/` and can be inspected from the HTML report when generated.

## GitHub Actions

The workflow at `.github/workflows/playwright.yml` runs typechecking, smoke tests, the full suite, and uploads reports. Configure these repository Actions secrets:

- `BILLNEST_BASE_URL`: test deployment base URL
- `BILLNEST_API_URL`: test API URL, if needed by API tests
- `BILLNEST_SHOPKEEPER_EMAIL` and `BILLNEST_SHOPKEEPER_PASSWORD`: dedicated test Shopkeeper account
- `BILLNEST_CUSTOMER_EMAIL` and `BILLNEST_CUSTOMER_PASSWORD`: dedicated test Customer account

Never use personal or production customer credentials. If secrets are not configured, authenticated tests may skip and CI does not establish that authenticated modules work.

## Current verification

The landing smoke suite was locally run successfully across Chromium, Firefox, and WebKit (9 passed). TypeScript typechecking also passed in the reported local run. This is not a claim that every authenticated or business workflow has been verified; final completion requires running the full suite against a suitable test environment with test accounts and reviewing all failures and skips.
