# Codebase Audit 2 — reference-react-typescript

**Date:** 2026-07-27
**Scope:** Full repository, re-assessed independently of `AUDIT.md`. `AUDIT.md` (the first audit pass) found a large set of issues across security, correctness, tooling, accessibility, and a full frontend/backend API cross-check — essentially all of it has since been fixed, verified by re-running `npx tsc --noEmit`, `npm run lint`, `CI=true npm test -- --watchAll=false`, `npm run test:coverage`, `CI=true npm run build`, and `npm audit` at the start of this pass (all clean/unchanged from what `AUDIT.md` documents — see the Appendix).
**Methodology:** This is a genuinely fresh pass, not a summary of `AUDIT.md`. Every finding below was independently re-derived by reading the current source and cross-referencing it against `API_ENDPOINTS.md`, the live test-coverage report, and the rendered app — not copied from the first audit's conclusions. Where a finding overlaps with something `AUDIT.md` already documents as fixed, it's called out explicitly as confirmed-still-fixed rather than restated as new.

This audit found a well-hardened codebase overall — the fixes from `AUDIT.md` held up, no regressions. But a fresh, independent read surfaced **9 real defects the first audit's methodology didn't catch**, several of them concrete and user-facing (a completely unreachable profile-edit flow, a dead nav link, a wrong `<html lang>` on an otherwise fully-localized app), plus supporting evidence for *why* they weren't caught (the exact components involved have 0% test coverage).

---

## Executive summary

- ~~**`UserProfile`'s "Personal Data" edit flow is completely unreachable.** A single inverted condition means the only button that enters edit mode is itself hidden until edit mode is already on.~~ **✅ Fixed** — see §1.1. `PersonalData.tsx` had 0% test coverage (§4.1), which is almost certainly why this shipped unnoticed; a regression test (confirmed to fail against the bug before confirming it passes against the fix) now covers it. `UserProfile.tsx` and its other three subsections remain at 0% coverage.
- **The "Kapcsolat" (Contact) nav link 404s to a blank page** — it points at `/contact`, but no such route (and no catch-all) exists in `App.tsx` — see §1.2.
- **The app's `<html>` tag says `lang="en"`, but 100% of the app's content is Hungarian** — every screen reader will attempt to pronounce Hungarian text with English phonetics — see §6.1. Notable given the extensive `i18next` migration `AUDIT.md` §7 already did; this static-HTML piece was outside that migration's reach and never revisited.
- **Two username/email-availability checks silently fail open.** `checkUsernameExists`/`checkEmailExists` treat *any* non-2xx response (including the documented 20/hr rate limit) as "not taken," and the async check itself sits outside the `try/catch` meant to catch it — see §1.3.
- **Checkout's "edit shipping address" during checkout doesn't call the backend at all.** It mutates local state only, presented with the exact same edit/save UI the real (persisting) `UserProfile` version uses — see §1.4.
- **The frontend can't agree on the backend's error-response field name.** Two call sites read `errorData.message`, two read `errorData.error` — at least one pair is reading a field that isn't there and silently discarding the real backend error text — see §1.5.
- A guest checkout order still sends an `X-CSRF-TOKEN` to `POST /v1/orders/guest`, which `API_ENDPOINTS.md` documents as CSRF-exempt — the same category of bug `AUDIT.md` §8.3 already fixed elsewhere, just a fourth instance it didn't catch — see §2.1.
- `OrderModel` serializes an `isAuthenticatedUser` field into every order request body that isn't part of the documented request shape — see §7.1.

---

## Findings

### 1. Correctness bugs

| # | Location | Severity | Description |
|---|---|---|---|
| 1.1 | `src/main/components/page/UserProfile/PersonalData/PersonalData.tsx:120` (button) / `:129` (form) | **High — ✅ Fixed** | The view/edit toggle for personal data (firstname/lastname/phone number) is inverted. The data-display block is correctly gated on `{!editMode && (...)}` (line 104), but the "Edit" button that calls `handleEdit()` (which does `setEditMode(true)`) was gated on `{editMode && (...)}` (line 120) — and the edit `<form>` itself is *also* gated on `{editMode && (...)}` (line 129, correct as-is). Since `editMode` starts `false` and the only way to set it `true` was clicking a button that didn't render until it was already `true`, **there was no way to enter edit mode through the UI at all** — a logged-in user could never edit their name or phone number from the account page. Confirmed pre-existing since the repo's initial commit (`git log --follow` shows no revision ever had the correct condition). The three sibling components in the same directory (`BillingAddress.tsx:115`, `ShippingAddress.tsx:115`, `LoginData.tsx:117`) all correctly use `{!editMode && (<button onClick={handleEdit}>...` — this was the one outlier. **Fixed:** the button's condition at line 120 is now `{!editMode && (...)}`, matching the display block above it and all three sibling components. Added `src/test/components/page/UserProfile/PersonalData/PersonalData.test.tsx` (3 tests: view mode shows the current details and an Edit button but not the form, clicking Edit reveals the Save/Cancel form, clicking Cancel returns to view mode) — this is the first test coverage `PersonalData.tsx` has ever had (was 0%, per §4.1); the test was verified to fail against the pre-fix code (all 3 assertions fail when the bug is reintroduced) before confirming it passes against the fix, so it functions as a real regression test, not just a coverage-padding one. Live-verified: `npx tsc --noEmit` passes with zero errors; `CI=true npm test -- --watchAll=false` passes all 43 suites (464 tests, up from 42/461); `npm run lint` exits `0` with 182 problems (0 errors, unchanged); `CI=true npm run build` exits `0`. Not manually re-verified in a real browser — `/account` requires real authentication against a live backend, which isn't available in this environment (same constraint as prior sessions' UI checks); the new automated test is the verification here, and it was specifically confirmed to catch the exact bug being fixed. |
| 1.2 | `src/main/components/navigation-bar/navigation-menu/navigation-link-menu/NavigationLinkMenu.tsx:63` (`to='/contact'`), `src/App.tsx:87-106` (`<Routes>`) | **High** | The "Kapcsolat" (Contact) nav link — one of 4 primary nav items, present on every page — points at `/contact`. No `<Route path="/contact">` exists in `App.tsx`, and there's no catch-all (`path="*"`) route either. Clicking it renders `Header`/`Nav`/`Footer` (all outside `<Routes>`) but a completely blank `<main>` — no content, no "not found" message. Verified live in a browser: navigating to `/contact` shows the site chrome with an empty page body. |
| 1.3 | `src/main/components/input/myUser/UsernameInput/UsernameInput.tsx:38-39`, `src/main/components/input/myUser/EmailInput/EmailInput.tsx:40-41`, `src/main/utils/myUser/UsernameUtils.ts:17`, `src/main/utils/EmailUtils.tsx:18` | **Medium** | Two separate bugs in the same pattern. **(a)** The availability check (`checkUsernameExists`/`checkEmailExists`) runs inside `setTimeout(async () => {...}, 150)`, itself nested inside the outer `try { ... } catch (e) {...}` block that's meant to catch it. Because `setTimeout` schedules the callback to run *after* the synchronous `try` block has already returned, the surrounding `catch` can never actually catch a rejection from this call — any network failure becomes an unhandled promise rejection, and the checkmark/xmark availability indicator is left stuck in its "checking" (`null`) state forever, with no error shown to the user. **(b)** Independently, `checkUsernameExists`/`checkEmailExists` themselves return `false` (i.e. "not taken," shown as a green checkmark) on **any** non-`ok` HTTP response — including the `429` that `API_ENDPOINTS.md` explicitly documents these two endpoints as returning at 20 requests/hour per value. A rate-limited or failed check is silently presented to the user as a confirmed-available username/email, rather than as "check failed, try again." (Registration itself would still catch a truly-taken value server-side, so this isn't a security hole — just a misleading availability indicator.) |
| 1.4 | `src/main/components/page/Checkout/Checkout.tsx:133-152` (`handleSave`) | **Medium** | When an authenticated user clicks "Módosítás" (Edit) on their shipping address during checkout and saves, `handleSave` only mutates the in-memory `myUserData.customer.shippingAddress.*` fields directly (lines 143-147) — it never calls any backend endpoint. `Checkout.tsx`'s only `fetch()` call in the entire file is the final order submission (line 323). The edit form and "Mentés"/"Mégse" (Save/Cancel) buttons are visually identical to the real, persisting edit flow in `UserProfile/ShippingAddress.tsx` (which does `PUT /v1/customer/shipping-address`), so a user has no visual cue that this "save" is a one-order-only local override rather than an update to their stored profile. (The order itself is submitted correctly with the edited address, since `getCustomer()` reads from the same mutated `myUserData` object — so no data is lost for *this* order, but the user's actual profile is unchanged, which will likely surprise them on their next visit/order.) |
| 1.5 | `src/main/components/page/Checkout/Checkout.tsx:334`, `src/main/components/page/Register/Register.tsx:76` vs. `src/main/components/page/UserProfile/LoginData/LoginData.tsx:61`, `src/main/components/page/ForgottenPassword/ForgottenPassword.tsx:59,130` | **Medium** | The frontend is internally inconsistent about which JSON field holds the backend's error message on a non-`ok` response: `Checkout.tsx` and `Register.tsx` read `errorData.message`; `LoginData.tsx` and both `ForgottenPassword.tsx` call sites read `errorData.error`. `API_ENDPOINTS.md` explicitly defers the authoritative error-shape contract to a backend-only doc (`docs/DESIGN.md` §9, not present in this repo) rather than documenting it inline, so which convention is actually correct can't be confirmed from this repo alone — but a single backend almost certainly uses one consistent field name for every error response, meaning **at least one of these two groups is reading a field that doesn't exist** and is silently falling back to a generic translated message instead of showing the real, specific backend error (e.g. "current password doesn't match" vs. a generic "password update failed"). |
| 1.6 | `src/main/components/navigation-bar/components/logout-button/LogoutButton.tsx:36` | **Low** | Unlike every other catch block in the app (which uses `handleErrorMessages(e)` to extract a clean message), this one does `setModalMessage(String(err))`. For the expected failure path (`throw new Error(t('nav.logoutFailed'))`), `String(err)` produces `"Error: Kijelentkezés sikertelen!"` — prepending a hardcoded, never-translated `"Error: "` in front of an otherwise fully-Hungarian-localized modal. If `fetchCsrfToken()` itself fails first, the raw untranslated English message from §7.2 below would surface here too. |

**Note on scope:** `AUDIT.md` §4.1 documents a `Checkout.tsx` `submitOrder` double-catch bug (a specific validation error silently overwritten by a generic one) as a real, confirmed, still-open bug. Re-verified here: still present and unchanged (`Checkout.tsx:347-358`), not re-listed above to avoid duplicating that finding.

### 2. Security

| # | Location | Severity | Description |
|---|---|---|---|
| 2.1 | `src/main/components/page/Checkout/Checkout.tsx:322-328` (`sendOrderToServer`) | **Low** | `fetch(isAuthenticated ? '/v1/orders' : '/v1/orders/guest', { ... headers: { 'X-CSRF-TOKEN': await fetchCsrfToken() } ... })` sends a CSRF token unconditionally for both branches. `API_ENDPOINTS.md` documents `POST /v1/orders/guest` as explicitly **CSRF-exempt** (only `POST /v1/orders`, the authenticated variant, requires it). This is the identical category of bug `AUDIT.md` §8.3 already found and fixed at three other call sites (`Login.tsx`, `ForgottenPassword.tsx` ×2) — this fourth instance, on the guest-checkout path, wasn't among them. Harmless functionally (a wasted `GET /csrf-token` round-trip before every guest order), same as the other three were. |
| 2.2 | `npm audit` (live, re-verified) | **High, unchanged/open** | 73 vulnerabilities (0 critical, 63 high, 6 moderate, 4 low), all transitive through the unmaintained `react-scripts`/CRA build toolchain — confirmed identical to `AUDIT.md` §2.4's documented state, no regression, no further non-breaking fix available. |
| 2.3 | `package.json` (`react-router-dom: ^6.30.0`) | **Medium, unchanged/open** | `react-router` is still in the vulnerable `6.0.0 - 7.17.0` range (`GHSA-wrjc-x8rr-h8h6`, open redirect). Confirmed identical to `AUDIT.md` §2.6, no regression. |
| — | `nginx.conf`, `.gitignore`, secrets scan, `dangerouslySetInnerHTML`/`eval` scan | **Clean** | Re-verified: CORS allowlist still correctly scoped (no wildcard), `.env`/`.idea/` still excluded, no hardcoded secrets/API keys found, no `dangerouslySetInnerHTML`, `eval()`, or `new Function()` anywhere in `src/main`. |

### 3. Code quality & architecture

| # | Location | Severity | Description |
|---|---|---|---|
| 3.1 | `src/main/supports/fetch-utilities/fetchCsrfToken.tsx` (whole file) | **Low** | Zero JSX (confirmed with a stricter check than a naive `<...>` grep, which false-positives on TypeScript generics like `Promise<string>`) but still uses the `.tsx` extension — the same category `AUDIT.md` §3.7 already tracks two other instances of (`utils/EmailUtils.tsx`, all of `model/`/`builder/`). This is a *third*, independent instance, in `src/main/supports/`, a directory that was never even in §3.7's original stated scope (`converter/`, `myDecorators/`, `utils/`). |
| 3.2 | `src/main/pages/Order/CustomerDetailsPage/index.tsx` | **Low** | Exports `CheckoutPage`, imported by `App.tsx` for the `/checkout` route. The directory path (`pages/Order/CustomerDetailsPage`) matches neither the component's name (`CheckoutPage`) nor its actual purpose (the checkout form, not an order-detail or customer-detail view). This looks like a leftover from the same restructuring that left behind the dead `Order/index.tsx` `AUDIT.md` §3.4 already found and removed — this sibling survived because it's genuinely in use, just oddly placed. Purely a naming/discoverability issue, not a bug. |
| 3.3 | `src/main/supports/fetch-utilities/fetchCsrfToken.tsx:11` | **Low** | `console.error('Failed to fetch CSRF token')` immediately precedes `throw new Error('Failed to fetch CSRF token')` on the next line — the console statement adds nothing the thrown error (which every caller already surfaces to the user) doesn't already convey, and it's the *only* `console.error` left anywhere in `src/main` (confirmed via full-tree grep), suggesting it's a leftover from before the throw was added rather than an intentional logging strategy. |
| 3.4 | `src/main/components/functional/Modal/Modal.tsx:10,36` | **Informational** | `isSuccess`/the `modal-message-success` CSS branch is dead code in current usage — grepping every `setModalMessage(...)`/`<Modal message=...>` call site in the app (30+ call sites across every page) shows all of them pass error text; genuine success confirmations go through `toast.success(...)` (react-toastify) instead, never `<Modal>`. Not urgent to remove, but worth knowing before assuming this branch is exercised by anything. See also §6.2/§7.1 for why the mechanism itself is also fragile. |

### 4. Testing & coverage

| # | Location | Severity | Description |
|---|---|---|---|
| 4.1 | `src/main/components/page/UserProfile/**` (`UserProfile.tsx`, `BillingAddress.tsx`, `ShippingAddress.tsx`, `PersonalData.tsx`, `LoginData.tsx`) | **High — partially fixed** | Live coverage run (original): **all five files sat at 0% statements/branches/functions/lines.** This is the entire account/profile-management feature area — one of the app's larger, more state-heavy screens — with zero automated coverage of any kind. This directly explained why §1.1 (the completely unreachable Personal Data edit flow) shipped and stayed unnoticed: no test ever rendered `PersonalData` and asserted that clicking "Edit" reveals the form. **Partially fixed** as a side effect of fixing §1.1: `PersonalData.tsx` now has 3 tests (43.24% statement coverage, up from 0%) — see §1.1. `UserProfile.tsx`, `BillingAddress.tsx`, `ShippingAddress.tsx`, and `LoginData.tsx` remain at 0% coverage; adding tests for those wasn't in scope of the §1.1 bug fix. |
| 4.2 | `src/main/components/input/myUser/UsernameInput/UsernameInput.tsx`, `EmailInput.tsx` | **Medium** | 45.45% / 46.66% statement coverage respectively; the live coverage report's uncovered-line ranges (`UsernameInput.tsx:35-54,86-109`; `EmailInput.tsx:37-56,87-111`) directly contain the exact async availability-check block described in §1.3 — the buggy code path is untested. |
| 4.3 | `src/main/supports/fetch-utilities/fetchCsrfToken.tsx` | **Low** | 0% coverage — the shared CSRF-token utility used by 7 different mutating call sites across the app has no test of its own, including no test of its error path (§2.1/§3.3/§7.2). |
| — | `package.json`'s `jest.coverageThreshold` (45/30/43/46) vs. live coverage (47.34/31.58/44.51/48.36) | **Informational** | Still passes, unchanged from `AUDIT.md` §4.2's documented state. The gap between floor and actual has widened slightly as coverage has grown since the threshold was set — not a defect, just worth knowing the floor hasn't been re-tightened to match. |

### 5. Tooling & CI/CD

| # | Location | Severity | Description |
|---|---|---|---|
| 5.1 | repo-wide | **Low** | No Dependabot/Renovate config (checked `.github/` — only `workflows/` exists, no `dependabot.yml`). Given §2.2's 73 open `npm audit` findings, there's currently no automated mechanism to surface *newly*-disclosed vulnerabilities going forward — someone has to remember to re-run `npm audit` manually, same as how §2.3 (`react-router`) was originally discovered mid-audit rather than flagged proactively. |
| 5.2 | `package.json` | **Low** | No `engines` field, despite `Dockerfile` (`FROM node:18`) and `.github/workflows/ci.yml` (`node-version: 18`) both implicitly targeting Node 18 specifically. A contributor running `npm install`/`npm start` on a different major Node version locally (this sandbox's own Node is v24) gets no warning of a potential mismatch — relevant given `react-scripts`/CRA 5's known sensitivity to Node version differences. |

### 6. Accessibility

| # | Location | Severity | Description |
|---|---|---|---|
| 6.1 | `public/index.html:2` | **High** | `<html lang="en">`, but every single piece of user-facing text in the app is Hungarian (confirmed: the app has exactly one configured locale, `hu`, per `src/main/i18n/i18n.ts`). Screen readers use the document's `lang` attribute to select pronunciation rules — with this mismatch, assistive technology will attempt to read 100% of the app's Hungarian content using English phonetics, producing largely incomprehensible speech output for blind/low-vision users. This file is static HTML outside the React tree, so it wasn't touched by `AUDIT.md` §7's `i18next` migration (which only covered `src/main/**`) and has apparently never been revisited since. |
| 6.2 | `src/main/components/header/Header.tsx:20`, all `page-title`-classed headings app-wide | **Low** | No `<h1>` exists anywhere in the persistent app shell — the "ImagineBar" brand/logo (`Header.tsx:20`) is a bare `<span>`, not a heading — and most individual pages start their heading hierarchy at `<h2 className='page-title'>` (`Menu`, `Allergen`, `FoodDetails`, `UserProfile`, etc.). Exactly two conditional states break this pattern by using `<h1 className='page-title'>` for the identical visual role instead: `Checkout.tsx:415` (order-success message) and `ShoppingCart.tsx:67` (empty-cart message). Net effect: most pages have no `<h1>` at all, and the two that do use it inconsistently for what's everywhere else treated as an `<h2>`-level role — unpredictable landmark structure for screen-reader users navigating by heading level. Not caught by `eslint-plugin-jsx-a11y`, which doesn't enforce heading-level consistency. |

### 7. Internationalization (i18n)

`AUDIT.md` §7 already did a full `i18next` extraction across `src/main/**`; re-verified that migration's own scope is intact (fresh `grep` for Hungarian-accented characters outside `i18n/locales/` still turns up only regex character classes and the `Footer.tsx` proper-noun, as documented). The gaps below are things that migration's stated scope (`src/main/**`) structurally couldn't reach, or that its own line-by-line sweep missed.

| # | Location | Severity | Description |
|---|---|---|---|
| — | See §6.1 | **High** | `public/index.html`'s `<html lang="en">` — an i18n gap as much as an accessibility one; cross-listed rather than duplicated. |
| 7.1 | `src/main/components/functional/Modal/Modal.tsx:10` | **Low** | `const isSuccess = message.toLowerCase().includes('siker')` — success/error styling is determined by substring-matching the literal Hungarian word "siker" (from "sikeres", success) directly in component logic, entirely bypassing the `i18next` architecture the rest of the app now uses. This isn't hardcoded *display* text (so `AUDIT.md` §7's string-extraction sweep wouldn't have flagged it), but it's the same underlying problem: locale-specific assumptions baked into shared logic. It would silently and permanently stop working — no message would ever render as "success" styled — the moment a second locale is added, with no error or warning. (Also see §3.4: currently dead code regardless, since nothing calls this component with success text today.) |
| 7.2 | `src/main/supports/fetch-utilities/fetchCsrfToken.tsx:11-12` | **Medium** | Two hardcoded, untranslated English strings: `console.error('Failed to fetch CSRF token')` and `throw new Error('Failed to fetch CSRF token')`. Unlike the `OrderModel`-style internal validation messages (§7.3, below — effectively unreachable), this one is genuinely reachable by real users: any network hiccup while fetching a CSRF token (used by 7 different mutating flows — checkout, registration, profile edits, logout) throws this, and `ErrorUtils.tsx`'s `handleErrorMessages()` surfaces a plain `Error`'s `.message` verbatim, so this literal English string can appear directly in an otherwise fully-Hungarian modal. Given the user explicitly chose "full extraction, everything" for `AUDIT.md` §7, this is a genuine (if narrow) miss — `fetch-utilities/` isn't `utils/**`, `converter/**`, or component JSX, so it fell outside every category that migration's file-by-file sweep covered. |
| 7.3 | `src/main/model/OrderModel.tsx:8,9,12,13,16,17,20,21`, `src/main/model/order/OrderItemModel.tsx:6,7,10,11`, `src/main/model/food/AllergenModel.tsx:17` | **Informational, confirmed unchanged** | Hardcoded English `class-validator` messages (e.g. `'Customer email is required (null)'`) remain untranslated. Re-confirmed this matches the `i18n` migration's own explicit, documented scope decision (English content was deliberately left alone) rather than an oversight — these are defensive internal-invariant checks on objects the app always constructs validly itself, not reachable through normal user action. Listed here only for completeness, not as a new finding. |

### 8. Backend API contract

Re-cross-referenced every `fetch()` call site in `src/main` against `API_ENDPOINTS.md` from scratch. All 15 previously-mismatched paths/methods `AUDIT.md` §8.1 fixed remain correctly fixed — no regressions on path or method anywhere. Spot-checked request-body shapes for `POST /v1/registration`, `PATCH /v1/account/password`, `PUT /v1/customer/*-address`, and `POST /v1/orders`/`/v1/orders/guest` against the documented JSON shapes — all match field-for-field, with one exception:

| # | Location | Severity | Description |
|---|---|---|---|
| 8.1 | `src/main/model/OrderModel.tsx:22,28,33` | **Low** | `OrderModel` has a fourth constructor parameter, `isAuthenticatedUser?: boolean`, which becomes a real field in the object `JSON.stringify`'d and sent as the request body for both `POST /v1/orders` and `POST /v1/orders/guest`. `API_ENDPOINTS.md`'s documented request body for both endpoints is exactly `{ customer, orderItems, paymentType }` — no fourth field. Whether a Spring/Jackson backend errors or silently ignores an unrecognized JSON property depends on its `@JsonIgnoreProperties` configuration (not visible from this repo) — likely harmless under Jackson's common default of ignoring unknown properties, but it's a genuine, easily-fixed contract mismatch: the URL path itself (`/v1/orders` vs. `/v1/orders/guest`) already fully encodes the authentication state the backend needs, making this field redundant even if it is silently accepted. |
| — | See §2.1 | **Low** | The `/v1/orders/guest` CSRF-exempt violation — cross-listed under Security rather than duplicated. |

**Still open, confirmed unchanged from `AUDIT.md` §8.5:** `POST /v1/foods`, `GET /v1/customers`, `GET /v1/orders/{id}`, `GET /v1/ingredients` remain documented but uncalled — no admin UI, order-history, or ingredient-listing feature exists yet. Not a defect.

---

## Summary table

| # | Finding | Severity |
|---|---|---|
| 1.1 | ~~`UserProfile`'s Personal Data edit flow is completely unreachable (inverted `editMode` condition)~~ | ~~High~~ **✅ Fixed** — button condition corrected, first-ever test coverage added |
| 1.2 | "Kapcsolat" nav link points at a route that doesn't exist — blank page, no 404 handling | **High** |
| 6.1 | `<html lang="en">` on an all-Hungarian app — screen readers mispronounce everything | **High** |
| 4.1 | `UserProfile` + all 4 subsections at 0% test coverage — directly enabled 1.1 shipping unnoticed | **High** |
| 2.2 | 73 open `npm audit` vulnerabilities (0 critical) — unchanged, no further non-breaking fix | **High, unchanged** |
| 1.3 | Username/email availability checks: unhandled-rejection path + fail-open on rate-limit/errors | **Medium** |
| 1.4 | Checkout's "edit shipping address" never persists to the backend, looks like it does | **Medium** |
| 1.5 | Frontend reads inconsistent error-response field names (`error` vs `message`) across 4 call sites | **Medium** |
| 2.3 | `react-router` open-redirect advisory, needs a major bump — unchanged, not attempted | **Medium, unchanged** |
| 4.2 | `UsernameInput`/`EmailInput` ~45% covered; the buggy async block is exactly what's uncovered | **Medium** |
| 7.2 | `fetchCsrfToken.tsx`'s two hardcoded English strings, reachable by real users | **Medium** |
| 1.6 | `LogoutButton.tsx` shows raw `String(err)` with an untranslated "Error:" prefix | **Low** |
| 2.1 | Guest checkout still sends CSRF token to a documented CSRF-exempt endpoint | **Low** |
| 3.1 | `fetchCsrfToken.tsx`: `.tsx` extension, zero JSX — third instance of the §3.7-category gap | **Low** |
| 3.2 | `pages/Order/CustomerDetailsPage/index.tsx` exports `CheckoutPage` — naming mismatch | **Low** |
| 3.3 | Leftover `console.error` duplicating the very next line's thrown error | **Low** |
| 4.3 | `fetchCsrfToken.tsx` at 0% coverage | **Low** |
| 5.1 | No Dependabot/Renovate — 73 known vulnerabilities rely on manual re-audits | **Low** |
| 5.2 | No `engines` field in `package.json` despite Docker/CI both pinning Node 18 | **Low** |
| 6.2 | No consistent `<h1>` per page; 2 of ~10 pages inconsistently use it for the same role | **Low** |
| 7.1 | `Modal.tsx`'s success/error styling hinges on matching the literal string "siker" | **Low** |
| 8.1 | `OrderModel` sends an undocumented `isAuthenticatedUser` field in the order request body | **Low** |
| 3.4 | `Modal.tsx`'s success-styling branch is dead code in current usage | **Informational** |
| 7.3 | `OrderModel`/`OrderItemModel`/`AllergenModel`'s internal English validator messages | **Informational, confirmed unchanged** |
| 8.2 | 4 documented backend endpoints still have no frontend caller | **Informational, confirmed unchanged** |

---

## Appendix: live tool output (this pass, 2026-07-27)

```
$ npx tsc --noEmit
(no output, exit code 0)

$ npm run lint
✖ 182 problems (0 errors, 182 warnings)   # unchanged from AUDIT.md's documented state;
                                            # all warnings are pre-existing src/test/** no-explicit-any
(process exit code: 0)

$ CI=true npm test -- --watchAll=false
Test Suites: 42 passed, 42 total
Tests:       461 passed, 461 total
(process exit code: 0 — unchanged)

$ npm run test:coverage
All files | 47.34% Stmts | 31.58% Branch | 44.51% Funcs | 48.36% Lines
(process exit code: 0 — passes the 45/30/43/46 threshold; see §4)

$ CI=true npm run build
Compiled successfully.
(process exit code: 0 — unchanged)

$ npm audit
73 vulnerabilities (4 low, 6 moderate, 63 high, 0 critical)
(unchanged from AUDIT.md §2.4/§2.6's documented state; react-router still in the
 vulnerable 6.0.0-7.17.0 range per §2.3 above)
```

No regressions found anywhere in this baseline — every number above matches what `AUDIT.md` already documents as the current, fixed state. All findings in this document are genuinely new, independently discovered by reading current source rather than by re-running the same checks `AUDIT.md` already ran.
