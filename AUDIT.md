# Codebase Audit — reference-react-typescript

**Date:** 2026-07-26
**Scope:** Full repository — application source (`src/`), build/deploy config (`Dockerfile`, `nginx.conf`, `tsconfig.json`, `.eslintrc.json`), dependency manifest (`package.json` / `package-lock.json`), and test suite.
**Methodology:** Manual review of source and config, cross-checked with live tool output: `npm install`, `npm run lint`, `npm test -- --watchAll=false` (CI mode), and `npm audit`. All findings below with a file/line reference were verified by reading the actual file at that location; the live command output is summarized in the Appendix.

This audit is written to serve two audiences at once — as supporting material for a university thesis, and as a realistic example of what a professional pre-release review of a small-to-medium React/TypeScript app looks like. Findings are graded by severity (Critical / High / Medium / Low) and grouped by category, not by discovery order.

---

## Executive summary

- **A real, verified functional bug**: three places in the app catch a validation error, format it, and then discard the formatted message instead of showing it — so users get silent failures at two registration steps and one checkout path (`Register.tsx`, `Checkout.tsx`).
- **The configured test command fails today** (`npm test -- --watchAll=false` exits with code `1`) because `src/test/App.test.tsx` has no active test in it — anyone wiring up CI right now would hit a red build immediately, unrelated to real app logic.
- **`npm run lint` currently reports 392 problems (127 errors, 265 warnings)** against the project's own `.eslintrc.json` — the codebase has drifted from its own style rules because nothing enforces them automatically.
- **`npm audit` reports 60 known vulnerabilities (2 critical, 33 high, 13 moderate, 12 low)**, all reachable through `react-scripts`' build toolchain (webpack-dev-server, rollup, workbox). `react-scripts` itself (CRA) has been unmaintained since 2023 and will not receive fixes.
- **The model/builder value-object layer (443 tests across 36 suites) is genuinely well tested and all currently pass** — but zero React components, pages, or user flows (login, registration, checkout, cart, route guarding) have any test coverage.
- **`nginx.conf` sets `Access-Control-Allow-Origin: *`** on the same routes the app calls with `credentials: 'include'`, including `/actuator` — a fragile config that should be an explicit origin allowlist.
- The checkout "Place Order" action and the modal used for every error/success message in the app are **not operable by keyboard**.
- There is **no CI/CD pipeline** of any kind, so none of the above (lint, tests, or vulnerable deps) is caught automatically before it ships.

---

## Findings

### 1. Correctness bugs

| # | Location | Severity | Description |
|---|---|---|---|
| 1.1 | `src/main/components/page/Register/Register.tsx:113-114` (`handlePersonalDetailsStep`) | **High** | `handleErrorMessages(e)` is called but its return value (the formatted error string) is discarded instead of being passed to `setModalMessage`. A validation failure on the "personal details" registration step fails with zero user-visible feedback. |
| 1.2 | `src/main/components/page/Register/Register.tsx:139-140` (`handleSetAddressesStep`) | **High** | Same pattern — `handleErrorMessages(e)` result discarded, so address-step validation errors (and any error from the `register()` network call on this step) are silently swallowed. |
| 1.3 | `src/main/components/page/Checkout/Checkout.tsx:366-367` (`submitOrder`, outer catch) | **Medium** | Same discarded-return pattern. In practice most real failures are already surfaced by the inner `getOrderToSubmit`/`sendOrderToServer` catches (`Checkout.tsx:322-324`, `:351-353`), but the "order data missing/invalid" case thrown at `:362` reaches only this outer catch and is never shown to the user. |
| 1.4 | `src/test/App.test.tsx` | **Medium** | The file's only test is commented out, leaving zero active assertions. Under `react-scripts test`, an empty suite is a **hard failure** ("Your test suite must contain at least one test"), not a silent pass — confirmed live: `Test Suites: 1 failed, 36 passed, 37 total`, overall process exit code `1`. Any CI pipeline added today would be red from the first commit, for a reason unrelated to app correctness. |

**Recommendation:** fix 1.1–1.3 by passing the return value of `handleErrorMessages(e)` to `setModalMessage(...)` consistently (the correct pattern already exists a few lines away in the same files). Fix 1.4 by either writing a real smoke test or removing the empty suite.

### 2. Security

| # | Location | Severity | Description |
|---|---|---|---|
| 2.1 | `nginx.conf:25,35` | **High** | `Access-Control-Allow-Origin: '*'` is set on the proxied `/auth-status|csrf-token|login|v1|actuator` block, the same routes called throughout the app with `credentials: 'include'`. Browsers currently reject the wildcard-origin + credentialed-request combination, so this isn't exploitable as-is, but it's one small change away (adding `Access-Control-Allow-Credentials: true`, or any reverse-proxy that reflects the request origin) from letting any origin read authenticated responses — including Spring Boot `/actuator` endpoints. Should be an explicit origin allowlist, not `*`. |
| 2.2 | `src/main/components/page/Register/Register.tsx` (signup `POST`), `src/main/components/page/ShoppingCart/ShoppingCart.tsx:14-20` (`fetchFoodsByIds`), `src/main/utils/myUser/PasswordUtils.tsx:16-27` (`isCommonPassword` check) | **Medium** | These three mutating `fetch` calls send no CSRF token and (for the latter two) no `credentials: 'include'`, unlike every other state-changing call in the app (Checkout, PersonalData, BillingAddress, ShippingAddress, LoginData, Login, ForgottenPassword, Logout all correctly attach `X-CSRF-TOKEN` via `fetchCsrfToken()` from `src/main/supports/fetch-utilities/fetchCsrfToken.tsx`). Low direct impact today (signup is inherently unauthenticated; the other two aren't obviously sensitive), but it's an inconsistency that should be resolved deliberately, not by omission. |
| 2.3 | `.gitignore` (repo root) | **Low** | Ignores `.env.local`, `.env.development.local`, etc., but not the top-level `.env`. The current `.env` only holds `DANGEROUSLY_DISABLE_HOST_CHECK=true` / `HOST=0.0.0.0` (no secrets), but as-is, the first `git add .` in this repo (which currently has zero commits) would commit it. Add `.env` to `.gitignore` before any real secret is ever placed there. |
| 2.4 | `package.json` dependencies + `npm audit` (live run) | **High** | `npm audit` reports **60 vulnerabilities: 2 critical, 33 high, 13 moderate, 12 low**, all transitive through `react-scripts` (webpack-dev-server, rollup, workbox-build, websocket-driver, shell-quote, ws, yaml, etc.). These are build-tooling/dev-server dependencies, not code shipped in the production bundle, so the practical exposure is to the build/CI machine and local dev server rather than end users — but `react-scripts@5.0.1` (Create React App) has been unmaintained since 2023, so none of this will be patched upstream without migrating off CRA. `typescript@4.9.5`, `@types/node@^17` (Node 17 is EOL), and `eslint@^8` (deprecated major, confirmed via install-time deprecation warning) compound the staleness. |
| 2.5 | `src/main/components/functional/AccountRouteGuard/AccountRouteGuard.tsx:5,8-12` | **Medium** | The guard's local `authenticated`/`setAuthenticated` state is declared but `setAuthenticated` is never called anywhere — dead state. Protection is a `useEffect` that calls `navigate('/login')` only *after* first render, so a user who is already loaded into the app (`isAuthenticated === false`) and navigates client-side straight to `/account` will have `AccountPage` (and its own data-fetching effects) mount and paint for one cycle before the redirect fires. This is architecturally fine as *UX routing* (the real security boundary is correctly each API endpoint's own session check), but it provides no actual access-control guarantee on its own and shouldn't be mistaken for one. |

### 3. Code quality & architecture

| # | Location | Severity | Description |
|---|---|---|---|
| 3.1 | `src/main/converter/*.tsx`, `src/main/utils/ErrorUtils.tsx:5,15`, most `catch (e: any)` blocks (~15 components) | **Medium** | `tsconfig.json` sets `"strict": true`, but the form-data boundary — exactly where validation matters most — is typed `any` throughout: every converter's raw-form-data parameter, `ErrorUtils.tsx`'s `handleErrorMessages`/`getErrorMessages`, and the great majority of `catch` blocks app-wide. `AddressModelConverter.tsx` shows the team knows how to avoid this (two of its four functions use a proper inline object type instead of `any`) but didn't apply it consistently. |
| 3.2 | `src/app/store.ts:2,6`, `src/main/features/counter/**` | **Low** | The entire `counter` Redux feature (`Counter.tsx`, `counterSlice.ts`, `counterAPI.ts`, `counterSlice.spec.ts`) is unused CRA-template boilerplate — grep confirms zero references outside its own folder and the store wiring. It's the *only* reducer registered in the store, which misleadingly signals that Redux is load-bearing for this app when in practice state is local `useState` / `ModalMessageContext`. |
| 3.3 | `src/main/utils/ErrorUtils.tsx:7,17,19,21,28` | **Medium** | Five `console.log` debug statements sit inside the shared error-formatting utility that runs on *every* validation failure app-wide. |
| 3.4 | `src/main/components/page/Checkout/Checkout.tsx:309-311,364`, `Register.tsx:125`, `src/main/utils/pages/account/accountPageUtils.tsx:5`, `DisplayShoppingCartContent.tsx:102-103`, `UserProfile/LoginData/LoginData.tsx:91` | **Low** | Leftover debug `console.log`s, including one that logs the full constructed order object and payment-method flags during checkout (`Checkout.tsx:364`). Several more commented-out `console.log`/JSX blocks exist (`App.tsx:24,96`, `FoodDetails.tsx:4,6,75,82`, `fetchCsrfToken.tsx:16,18`, `LogoutButton.tsx:42`). |
| 3.5 | `src/main/converter/AddressModelConverter.tsx:9-61` | **Low** | Four near-identical functions (differ only by a `shipping`/`billing` field-name prefix) — a small shared `buildAddress(prefix, data)` helper would remove the duplication. More broadly: the Model → Builder → Converter → Utils pattern is applied uniformly for composite models, but for a single optional-string wrapper like `FloorDoorModel` (23 lines) it still generates a model + decorator stack + a 22-line `FloorDoorUtils.tsx` that duplicates the model's own validation constants — worth reconsidering per-model boilerplate cost for the simplest leaf types (note: `FloorDoorModel` has no dedicated Builder, so the pattern already isn't applied with full uniformity). |
| 3.6 | `src/main/pages/*Page/index.tsx` vs `src/main/components/page/*` | **Low** | Two similarly-named directories (`src/main/pages/LoginPage` and `src/main/components/page/Login`) exist side by side; the split is real and consistent (thin route wrapper vs. presentational component) but the near-identical naming is a likely source of confusion for new contributors — a short note in `CLAUDE.md`/README would help. |
| 3.7 | `src/main/converter/**`, `src/main/myDecorators/**`, most of `src/main/utils/**` | **Low** | These files contain no JSX (verified by grep) but use the `.tsx` extension; `.ts` would be more accurate and is enforced by no tooling currently, so it drifts silently. |
| 3.8 | `src/main/components/page/Checkout/Checkout.tsx` (686 lines) | **Medium** | A single component mixes form state, address/order model construction, two separate network calls, and rendering for the entire checkout flow. Not a bug, but its size makes it the highest-risk file to modify safely without tests (see §4). |

### 4. Testing & coverage

| # | Location | Severity | Description |
|---|---|---|---|
| 4.1 | `src/test/**` vs `src/main/components/**`, `src/main/pages/**`, `src/main/features/**` | **High** | Live run: 37 test suites, 443 tests, all passing except the empty `App.test.tsx` (see 1.4). Every single test targets the model/builder/value-object layer (`src/test/model/**`, `src/test/builder/**`) — genuinely thorough coverage there. **Zero tests exist for any React component**, including auth-critical flows: `Login.tsx`, `Register.tsx`, `Checkout.tsx`, `ShoppingCart.tsx`, and `AccountRouteGuard.tsx` all have no coverage at all. |
| 4.2 | `package.json` / repo-wide | **Medium** | No coverage thresholds or reporting are configured anywhere (no `--coverage`, no `coverageThreshold` in any Jest config). Even once tests exist for components, there's currently no mechanism to prevent coverage from silently regressing. |

### 5. Tooling & CI/CD

| # | Location | Severity | Description |
|---|---|---|---|
| 5.1 | repo-wide | **High** | No `.github/workflows/`, `.gitlab-ci.yml`, or any other CI config exists, and no pre-commit hooks are configured. Live-verified consequence: `npm run lint` currently reports **392 problems (127 errors, 265 warnings)**, and `npm test -- --watchAll=false` currently **exits non-zero**  — neither would be caught before merging without a human remembering to run them manually. |
| 5.2 | `.eslintrc.json` | **Medium** | No `jsx-a11y` plugin/rules are configured, so none of the accessibility issues in §6 would ever be flagged by lint even if CI existed. |
| 5.3 | `tsconfig.json:2-8` | **Low** | `"target": "es5"` is inconsistent with the project's own `browserslist` in `package.json` (evergreen Chrome/Firefox/Safari for dev, `>0.2%, not dead` for prod) — no supported target needs ES5 down-leveling; this adds unnecessary transpilation and bundle size for zero real compatibility benefit. |

### 6. Accessibility

| # | Location | Severity | Description |
|---|---|---|---|
| 6.1 | `src/main/components/functional/Modal/Modal.tsx:11-19` | **High** | Used for every error/success message app-wide. Missing `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`; no focus trap, no auto-focus on open, and no `Escape`-to-close — a keyboard-only user cannot dismiss it except by tabbing to the one visible "OK" button. |
| 6.2 | `src/main/components/page/Checkout/Checkout.tsx:672-674` | **High** | The "Megrendel" (Place Order) control — the single most important call-to-action in the checkout flow — is `<div className='...' onClick={submitOrder}>`, not a `<button>`, with no `role`, `tabIndex`, or `onKeyDown`. It is unreachable via keyboard. Inconsistent with `DisplayShoppingCartContent.tsx:153-193` in the same feature area, which correctly uses `<button aria-label>` for quantity/delete controls. |
| 6.3 | `src/main/components/navigation-bar/components/hamburger-menu/button/HamburgerMenuButton.tsx:28-35` | **Medium** | The menu toggle sets `aria-expanded`/`aria-controls`/`aria-hidden` but is rendered as a plain clickable `<FontAwesomeIcon>` (SVG) with no `role="button"`, `tabIndex`, `onKeyDown`, or `aria-label` — partially ARIA-wired but not actually operable or announced correctly. |
| 6.4 | `src/main/components/navigation-bar/navigation-menu/NavigationMenu.tsx:24`, `src/main/components/navigation-bar/components/shopping-bag/dropdown/ShoppingBagDropdown.tsx:8` | **Low** | Additional clickable `<div onClick>` wrappers with no keyboard/ARIA affordances, same shape as 6.2/6.3. |

### 7. Portability / localization

| # | Location | Severity | Description |
|---|---|---|---|
| 7.1 | repo-wide | **Low** | No i18n library is present (`package.json` has no `react-i18next`/`i18next`/`react-intl` etc.). All user-facing strings — labels, error messages, page copy — are hardcoded Hungarian literals inline in components (e.g. `Login.tsx`, `UserProfile.tsx`, `ErrorUtils.tsx`-driven messages throughout). Not a bug, but worth flagging given this repo is also positioned as an industry-reference example: a reference implementation would typically demonstrate an extraction/i18n layer. |

---

## Summary table

| # | Finding | Severity |
|---|---|---|
| 1.1 | Silent validation-error swallowing — Register personal details step | High |
| 1.2 | Silent validation-error swallowing — Register address step | High |
| 6.1 | Modal has no keyboard/ARIA support | High |
| 6.2 | Checkout "Place Order" is an unreachable-by-keyboard `<div>` | High |
| 4.1 | Zero test coverage for all React components/pages/flows | High |
| 5.1 | No CI/CD — lint (392 problems) and tests (currently failing) run only manually | High |
| 2.1 | `nginx.conf` wildcard CORS on credentialed API routes | High |
| 2.4 | 60 npm audit vulnerabilities (2 critical) via unmaintained CRA toolchain | High |
| 1.3 | Silent validation-error swallowing — Checkout submit (partial) | Medium |
| 1.4 | `App.test.tsx` empty suite fails the test run outright | Medium |
| 2.2 | Inconsistent CSRF/credentials coverage on 3 mutating requests | Medium |
| 2.5 | `AccountRouteGuard` dead state + no real access-control guarantee | Medium |
| 3.1 | Pervasive `any` at the form-validation boundary despite `strict: true` | Medium |
| 3.3 | 5 debug `console.log`s in the shared error-formatting utility | Medium |
| 3.8 | 686-line monolithic `Checkout.tsx` | Medium |
| 5.2 | No `jsx-a11y` lint rules configured | Medium |
| 4.2 | No coverage thresholds/reporting configured | Medium |
| 6.3 | Hamburger menu toggle not keyboard-operable | Medium |
| 2.3 | `.gitignore` doesn't exclude top-level `.env` | Low |
| 3.2 | Dead `counter` Redux feature still wired into the store | Low |
| 3.4 | Assorted leftover `console.log`s / commented-out code | Low |
| 3.5 | Converter duplication; heavy boilerplate for trivial leaf models | Low |
| 3.6 | `pages/*Page` vs `components/page/*` naming overlap | Low |
| 3.7 | `.tsx` used for files with no JSX | Low |
| 5.3 | `tsconfig.json` `target: es5` inconsistent with `browserslist` | Low |
| 6.4 | Additional non-semantic clickable `<div>`s | Low |
| 7.1 | No i18n layer; all UI text hardcoded in Hungarian | Low |

---

## Appendix: live tool output (condensed)

```
$ npm install
added 1439 packages
60 vulnerabilities (12 low, 13 moderate, 33 high, 2 critical)

$ npm run lint
✖ 392 problems (127 errors, 265 warnings)
  116 errors and 0 warnings potentially fixable with the `--fix` option

$ CI=true npm test -- --watchAll=false
Test Suites: 1 failed, 36 passed, 37 total
Tests:       443 passed, 443 total
Time:        2.272 s
(process exit code: 1, due to src/test/App.test.tsx: "Your test suite must contain at least one test")

$ npm audit
60 vulnerabilities (12 low, 13 moderate, 33 high, 2 critical)
  — all transitive through react-scripts (webpack-dev-server, rollup,
    workbox-build, websocket-driver, shell-quote, ws, yaml, validator,
    serialize-javascript, underscore)
```

`npm audit --omit=dev` returns the same 60 findings: `react-scripts` is listed under `"dependencies"` (not `"devDependencies"`) in `package.json`, which is how CRA projects are conventionally structured, so the `--omit=dev` filter doesn't separate build tooling from runtime code here.
