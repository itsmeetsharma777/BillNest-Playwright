# BillNest Playwright E2E

End-to-end test automation for the BillNest web application using Playwright, TypeScript, and page objects.

## Prerequisites

- Node.js 20 or 22 (Node 22 is used in CI)
- npm
- Access to a BillNest test deployment
- A test deployment URL (the repository CI defaults to the provided BillNest Production URL)
- Dedicated Shopkeeper and Customer credentials only when running opt-in live-auth tests

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
```

Edit `.env` locally. Never commit real credentials or production secrets.

```dotenv
BASE_URL=https://bill-nest-production.vercel.app
# Leave empty to skip optional live API authorization checks.
API_URL=
SHOPKEEPER_EMAIL=
SHOPKEEPER_PASSWORD=
CUSTOMER_EMAIL=
CUSTOMER_PASSWORD=
RUN_LIVE_AUTH_TESTS=false
```

Use a dedicated test/staging environment and test accounts. Do not run data-mutating tests against real customer or production financial data.

## Run tests

```bash
# TypeScript validation
npm run typecheck

# Landing smoke checks
npm run test:smoke

# Entire suite in Chromium (same browser used by CI)
npm run test:chromium

# Optional real-backend authentication tests (use dedicated test accounts only)
RUN_LIVE_AUTH_TESTS=true npm run test:chromium

# Chromium only
npm run test:chromium

# Authentication, Shopkeeper, Customer, negative, or edge suites
npm run test:auth
npm run test:shopkeeper
npm run test:customer
npm run test:negative
npm run test:edge
```

## What the default suite verifies

Most authenticated route and navigation tests use Playwright's test-only mocked session and seeded read-only API responses. This makes UI coverage deterministic, avoids writing to production records, and prevents login tests from depending on the live backend. These tests verify frontend login flow, role-aware routing, page rendering, visible controls, and client-side navigation; they do **not** prove that the production authentication API or authorization rules work.

The opt-in tests in `tests/auth/live-auth.spec.ts` exercise real sign-in against the configured backend. Run them only with dedicated test accounts by setting `RUN_LIVE_AUTH_TESTS=true` and both role credentials. A skipped test is not a verified pass. API access-control tests are also conditional on `API_URL` being configured.

## HTML report and artifacts

Playwright's HTML reporter writes to `playwright-report/`. After a run:

```bash
npm run report
```

Open the report in a browser. Failed-test screenshots, videos, and traces are configured to be retained under `test-results/` and can be inspected from the HTML report when generated.

## GitHub Actions

The workflow at `.github/workflows/playwright.yml` runs typechecking, Chromium smoke tests, the full Chromium suite, and uploads reports. It uses `https://bill-nest-production.vercel.app` unless `BILLNEST_BASE_URL` is set. Configure these repository Actions secrets when you want the opt-in integration tests:

- `BILLNEST_BASE_URL`: test deployment base URL
- `BILLNEST_API_URL`: test API URL, if needed by API tests
- `BILLNEST_SHOPKEEPER_EMAIL` and `BILLNEST_SHOPKEEPER_PASSWORD`: dedicated test Shopkeeper account
- `BILLNEST_CUSTOMER_EMAIL` and `BILLNEST_CUSTOMER_PASSWORD`: dedicated test Customer account
- `RUN_LIVE_AUTH_TESTS`: set to the string `true` only when the dedicated test accounts and backend are ready

The default route/UI tests are mocked and do not require those credential secrets. Never use personal or production customer credentials.

## Software Testing submission documents

- [Production-to-Playwright coverage matrix](docs/PRODUCTION_TEST_COVERAGE.md) — module coverage, status definitions, completion criteria, and environment safeguards.
- [Test case catalogue and execution log](docs/TEST_CASE_CATALOGUE.md) — test IDs, scenarios, expected results, test types, status, execution evidence log, and defect report template.

## Verification status

The authoritative result is the latest GitHub Actions run linked from the repository's **Actions** tab. Passing the default suite indicates UI/route tests passed with mocks; it should not be described as proof that live authentication, backend authorization, payments, or write workflows work unless their corresponding real-backend tests were enabled and passed.
