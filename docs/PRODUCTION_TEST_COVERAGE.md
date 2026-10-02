# BillNest Production-to-Playwright Coverage Matrix

This document tracks the end-to-end test coverage required for the BillNest-Production application. A feature is not marked **Verified** until its test has been executed successfully against a dedicated test environment. A page-load assertion alone does not verify a business workflow.

## Status definitions

- **Planned**: coverage required; no dedicated spec confirmed.
- **Implemented**: spec exists but may not have been executed against the intended environment.
- **Verified**: test execution passed with recorded evidence.
- **Blocked**: requires test credentials, seeded data, a test integration, or an environment decision.

## Test environment and safety

- Set `BASE_URL` to a dedicated staging/test deployment, not the production site, for data-mutating tests.
- Use test-only shopkeeper and customer accounts.
- Use seeded products/customers and disposable records. Tests must not delete or modify real customer, invoice, inventory, payment, or warranty data.
- Payment tests must use the payment provider's test/sandbox mode and test credentials. Never use live payment credentials.
- External email/SMS, document storage, and payment side effects should be sandboxed or explicitly stubbed.
- Run cross-browser coverage only after the workflow is stable in Chromium.

## Coverage matrix

| Area | Required scenarios | Status |
|---|---|---|
| Public landing / get started / explore | Render, CTA navigation, responsive layout, theme, broken links, console/page errors | Implemented: smoke baseline |
| Shopkeeper authentication | Valid/invalid login, required fields, register, duplicate account, logout, session persistence, expired session | Implemented / needs full verification |
| Customer authentication | Valid/invalid login, registration, validation, logout, session persistence | Implemented / needs full verification |
| Password reset | Request/reset UI, generic confirmation, service failure, missing/invalid token, password rules/matching, mocked successful submit | Implemented with mocked API; real email delivery, expiry, token reuse, and session invalidation remain unverified |
| Shop setup | First login without shop, create shop, required fields, duplicate/invalid values, update shop profile, access guard | Planned |
| Shopkeeper dashboard | Data cards, loading/empty/error states, totals against seeded data, navigation | Planned |
| Customer dashboard | Customer-specific summary, correct account data, empty/loading/error states | Planned |
| Products/catalog | List/search/filter, advanced filters, create/edit, required/invalid fields, price and quantity validation, bulk actions, CSV import/export, deactivate/reactivate, variant manager | Implemented: Feature 22 dedicated spec; execution still requires dedicated test environment |
| Product images | Upload, preview, primary image, replace/remove, unsupported type/size, failed upload | Planned |
| Categories | List/search, create/edit, required/duplicate validation, deactivate and product associations | Planned |
| Brands | List/search, create/edit, validation, deactivate and product associations | Planned |
| Inventory | Stock adjustment, movement history, per-product history, variant stock adjustment, invalid/negative quantity, audit record, stock reconciliation | Implemented: production integration + Feature 22 variant coverage; full execution requires dedicated test data |
| Customers / ledger | Customer list/search, customer detail, ledger balance, invoice/payment history, invalid customer access | Planned |
| Shopkeeper invoices | Create invoice, line items, quantities, discounts/tax if supported, validation, stock deduction, list/search/filter, details, cancel/restore stock | Implemented: partial invoices coverage; needs verification |
| Invoice documents | Print, PDF download, content/filename, document access and errors | Planned |
| Payments / partial payments | Record payment, partial/full payment, due/balance calculations, invalid amount, duplicate submission, payment history, customer synchronization | Planned |
| Payment gateway | Sandbox checkout, success/failure/cancel, verification/webhook behavior, duplicate callback/idempotency | Planned; sandbox required |
| Shopkeeper warranties | Create, associate customer/product/invoice, dates, validation, list/search, details, status and expiry | Planned |
| Customer invoice portal | Only own invoices, invoice detail, balance/payment status, document download | Implemented: partial modules; needs verification |
| Customer payment portal | Payment history, due amount, sandbox payment, payment status updates | Planned |
| Customer warranty portal | Own warranties, details, coverage dates/status, unauthorized record access | Implemented: partial modules; needs verification |
| Reports and analytics | Date filters, totals against known test data, empty/error states, export if available | Planned |
| Shopkeeper notifications | List/read/unread, relevant warranty/invoice events, empty/error state | Planned |
| Customer notifications | Customer-scoped notices, read/unread, notification triggers | Planned |
| Shopkeeper settings | Load/update profile or shop settings, validation, persistence, unauthorized fields | Planned |
| Customer settings/account | Load/update account, validation, persistence, account security behavior | Planned |
| Documents | Upload/generate/download, invalid file, access control, missing document | Planned |
| Authorization / tenant isolation | Anonymous access, wrong role, cross-customer IDs, cross-shop records, protected APIs | Implemented: anonymous read-only API probes for protected modules; wrong-role and cross-tenant record isolation still need authenticated test identities and disposable fixtures |
| API and application errors | API 4xx/5xx, network failure, validation messages, no uncaught page errors, safe error handling | Implemented: partial negative tests; needs expansion |
| Security controls | CSRF behavior, rate limits, security headers, cookie flags, CORS policy, session expiry | Planned; some require API/integration-level tests |
| Cross-browser / responsive | Chromium, Firefox, WebKit; key workflows at desktop and mobile viewport | Smoke verified in three browsers; workflow coverage planned |
| Regression / CI | Typecheck, smoke, full suite, artifacts, traces/screenshots on failure, no accidental focused tests | Implemented workflow; verify full CI execution |

## Completion criteria

BillNest E2E coverage is complete only when:
1. Every applicable row above has a dedicated test or a documented reason it cannot be browser-tested.
2. Positive, negative, boundary, and authorization cases are covered for each business-critical workflow.
3. The full suite passes against the dedicated test environment.
4. CI execution and artifacts are checked, and any skipped tests or external dependencies are reported.
5. Tests are repeatable and clean up only the disposable data they created.

This matrix is a coverage plan, not a claim that all listed tests currently exist or have passed.
