# BillNest Software Testing Test Case Catalogue

This catalogue is the human-readable companion to the Playwright suite. It is suitable for review, execution evidence, and mapping manual test cases to automation.

## Execution status

- **AUTOMATED (implemented)** means an automated spec exists; it does not mean it has passed against production.
- **BLOCKED** means execution requires configured role credentials or safe disposable test data.
- **MANUAL** means the scenario needs a human or a sandbox/external integration.
- Record the run date, environment, build/commit, tester, actual result, and evidence link in the execution log before marking a case Pass.

## Test environment

| Field | Value |
|---|---|
| Application | BillNest |
| Automation | Playwright + TypeScript |
| Target | `BASE_URL` configured by the tester |
| Browser coverage | Chromium, Firefox, WebKit |
| Test data | Disposable accounts and records only |
| Live payment/email | Prohibited; use provider sandbox or approved stubs |

## Test cases

| ID | Module | Scenario / steps | Expected result | Type | Current status |
|---|---|---|---|---|---|
| BN-PUB-001 | Landing | Open the root URL | Landing page renders without an unhandled navigation error | Positive | Automated (smoke) |
| BN-PUB-002 | Landing | Locate Get Started CTA | CTA is visible and actionable | UI | Automated (smoke) |
| BN-PUB-003 | Landing | Inspect shopkeeper and customer entry options | Both role choices are discoverable | UI | Automated (smoke) |
| BN-PUB-004 | Responsive | Open root at 375×812 | Main page is visible without excessive horizontal overflow | Boundary | Automated |
| BN-PUB-005 | HTTPS | Run against an HTTPS base URL | Final page URL uses HTTPS | Security | Automated (conditional) |
| BN-AUTH-001 | Authentication | Submit valid shopkeeper credentials | Authenticated shopkeeper landing/dashboard appears | Positive | Implemented; credentials required |
| BN-AUTH-002 | Authentication | Submit invalid credentials | User remains unauthenticated and sees a safe error | Negative | Implemented; credentials required |
| BN-AUTH-003 | Authentication | Submit blank login fields | Required-field validation prevents successful submission | Negative | Implemented; inspect actual form behavior |
| BN-AUTH-004 | Authentication | Sign out and revisit protected route | Session is cleared and protected content is not accessible | Security | Implemented; credentials required |
| BN-AUTH-005 | Authentication | Repeat login/logout for customer role | Customer session works independently from shopkeeper role | Positive | Implemented; credentials required |
| BN-AUTH-006 | Password reset | Request reset for known and unknown email | Safe response does not disclose whether an account exists | Security | Planned / manual |
| BN-SHOP-001 | Shop setup | First shopkeeper signs in without a shop | Shop creation/onboarding is required before shop features | Positive | Planned |
| BN-SHOP-002 | Shop setup | Submit incomplete or invalid shop details | Validation is shown and invalid shop is not saved | Negative | Planned |
| BN-DASH-001 | Shopkeeper dashboard | Open dashboard with seeded records | Dashboard loads and summary values correspond to the seeded records | Functional | Planned; disposable data required |
| BN-DASH-002 | Customer dashboard | Open customer dashboard | Summary shows only the signed-in customer's data | Authorization | Planned |
| BN-CAT-001 | Categories | Create, edit, search, and deactivate a test category | Changes persist and duplicate/invalid input is rejected | CRUD / negative | Planned |
| BN-BRAND-001 | Brands | Create, edit, search, and deactivate a test brand | Changes persist and invalid input is rejected | CRUD / negative | Planned |
| BN-PROD-001 | Products | Search and open product list | List loads and search/filter results match the query | Functional | Partial automation exists |
| BN-PROD-002 | Products | Create product with valid disposable values | Product is saved and appears in list/detail | Positive | Requires disposable test shop |
| BN-PROD-003 | Products | Submit missing name, invalid price, or invalid quantity | Validation prevents invalid product data | Negative / boundary | Partial automation exists |
| BN-PROD-004 | Product images | Upload supported, unsupported, and oversized files | Supported image previews; invalid files are rejected safely | Negative | Planned |
| BN-INV-001 | Inventory | Record a valid stock adjustment | Quantity changes and an auditable movement is recorded | Functional | Planned |
| BN-INV-002 | Inventory | Attempt negative or nonnumeric adjustment | Invalid stock change is rejected | Negative / boundary | Planned |
| BN-INV-003 | Inventory | Open movement history for a test product | Correct product movements and quantities are displayed | Functional | Read-only route implemented |
| BN-CUST-001 | Customers | Search and open a disposable customer | Correct customer details and ledger are displayed | Functional | Planned |
| BN-CUST-002 | Customers | Attempt to access another shop's customer record | Access is denied or record is not disclosed | Authorization | Planned |
| BN-INVCE-001 | Invoices | Open invoice list and invoice detail | Invoice list/detail render for authorized shopkeeper | Functional | Partial automation; route checks implemented |
| BN-INVCE-002 | Invoices | Create invoice using disposable customer and products | Invoice is saved with correct line totals and status | Positive | Planned / requires test data |
| BN-INVCE-003 | Invoices | Create invoice with quantity beyond available stock | Request is rejected or handled according to documented stock rules | Negative / boundary | Planned |
| BN-INVCE-004 | Invoices | Cancel a disposable invoice | Cancellation follows business rules and stock restoration is correct | Functional | Planned; destructive to created test record only |
| BN-DOC-001 | Invoice documents | Print or download a disposable invoice | Document opens/downloads and contains the expected invoice details | Functional | Manual / planned |
| BN-PAY-001 | Payments | Record a partial payment on a disposable invoice | Paid and due balances update consistently for both roles | Functional | Planned |
| BN-PAY-002 | Payments | Submit zero, negative, or greater-than-due amount | Invalid amount is rejected or handled by explicit business rules | Negative / boundary | Planned |
| BN-PAY-003 | Gateway | Complete, cancel, and fail sandbox checkout | Status is verified server-side and duplicate callbacks do not double-apply | Integration | Sandbox required; manual |
| BN-WAR-001 | Warranties | Create warranty linked to a disposable invoice/product/customer | Warranty is saved with correct dates and associations | Positive | Planned |
| BN-WAR-002 | Warranties | Enter invalid dates or unrelated invoice/customer | Validation or authorization prevents invalid association | Negative / authorization | Planned |
| BN-CINV-001 | Customer invoices | Customer opens own invoice and details | Only that customer's invoices are displayed | Authorization | Partial modules implemented |
| BN-CINV-002 | Customer invoices | Customer requests another customer's invoice ID | Access is denied and data is not exposed | Authorization | Planned |
| BN-CPAY-001 | Customer payments | Open customer payment history | Only the signed-in customer's payment records appear | Authorization | Planned |
| BN-CWAR-001 | Customer warranties | Open own warranty and attempt another customer's warranty | Own record is visible; foreign record is denied/not disclosed | Authorization | Partial modules implemented |
| BN-REP-001 | Reports | Apply date filters to known disposable transactions | Report totals and date boundaries match seeded transactions | Functional / boundary | Planned |
| BN-NOT-001 | Notifications | Open, read, and mark notifications read where supported | Read state persists and notices are scoped to the user | Functional | Planned |
| BN-SET-001 | Settings | Update allowed shopkeeper profile fields | Valid changes persist; invalid values are rejected | Functional / negative | Planned |
| BN-SET-002 | Settings | Update customer account settings | Changes persist only for the signed-in customer | Authorization | Planned |
| BN-SEC-001 | Access control | Open shopkeeper routes while logged out or as customer | Protected shopkeeper data is not shown | Security | Partial authorization suite |
| BN-SEC-002 | Tenant isolation | Alter customer/shop-owned resource IDs | Server rejects access to records outside the current user/shop | Security | Planned; API-level verification required |
| BN-SEC-003 | Errors | Visit unknown route and inspect visible response | No stack trace, database URI, or secret is rendered | Security | Automated |
| BN-SEC-004 | Secrets | Inspect rendered public page for obvious secret patterns | Private keys and live secret-token patterns are not rendered | Security | Automated (limited pattern check) |
| BN-CI-001 | CI | Run typecheck and Playwright smoke suite | Checks complete successfully and artifacts are available on failure | Regression | Workflow implemented; full CI run not verified |

## Execution evidence log template

Copy one row per execution. Do not mark a test Pass based only on the existence of a spec.

| Test ID | Run date/time | Environment/build | Browser | Result (Pass/Fail/Blocked/Not run) | Actual result / defect ID | Evidence |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## Defect report template

- **Defect ID / title:**
- **Related test case:**
- **Environment and build:**
- **Severity / priority:**
- **Preconditions:**
- **Steps to reproduce:**
- **Expected result:**
- **Actual result:**
- **Evidence (screenshot / trace / video):**
- **Status / retest result:**

