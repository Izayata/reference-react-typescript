# Codebase Audit — reference-react-typescript

**Date:** 2026-07-26 (last re-verified 2026-07-27, after the §1 correctness-bug fixes landed)
**Scope:** Full repository — application source (`src/`), build/deploy config (`Dockerfile`, `nginx.conf`, `tsconfig.json`, `.eslintrc.json`), dependency manifest (`package.json` / `package-lock.json`), test suite, and (§8) every frontend `fetch()` call cross-referenced against the documented backend contract in `API_ENDPOINTS.md`.
**Methodology:** Manual review of source and config, cross-checked with live tool output: `npm install`, `npm run lint`, `npm test -- --watchAll=false` (CI mode), and `npm audit`. All findings below with a file/line reference were verified by reading the actual file at that location; the live command output is summarized in the Appendix. §8 additionally cross-references every `fetch()` call site in `src/` against the backend contract documented in `API_ENDPOINTS.md` (added to the repo after the initial audit pass) — that section assumes `API_ENDPOINTS.md` accurately reflects the backend's current routes.

This audit is written to serve two audiences at once — as supporting material for a university thesis, and as a realistic example of what a professional pre-release review of a small-to-medium React/TypeScript app looks like. Findings are graded by severity (Critical / High / Medium / Low, plus an occasional Informational note for non-defect observations) and grouped by category, not by discovery order.

---

## Executive summary

- ~~**The frontend and its documented backend API have drifted apart on nearly every dynamic endpoint.** Cross-referencing every `fetch()` call site against `API_ENDPOINTS.md` (§8) found that **15 of ~21 distinct integration points call a URL path — and in two cases an HTTP method — that doesn't exist in the documented backend contract.**~~ **✅ Fixed** — see §8.1/§8.2. All 15 mismatched calls were repointed at the documented paths/methods, `Register.tsx`'s signup call now attaches the CSRF token the documented endpoint requires, and `Checkout.tsx` now branches between `/v1/orders` and `/v1/orders/guest` by auth state instead of always hitting one nonexistent URL.
- ~~**A real, verified functional bug**: three places in the app catch a validation error, format it, and then discard the formatted message instead of showing it — so users get silent failures at two registration steps and one checkout path (`Register.tsx`, `Checkout.tsx`).~~ **✅ Fixed** — see §1.
- ~~**The configured test command fails today** (`npm test -- --watchAll=false` exits with code `1`) because `src/test/App.test.tsx` has no active test in it.~~ **✅ Fixed** — `App.test.tsx` now has a real smoke test; the full suite (37 suites, 444 tests) passes and the process exits `0`.
- **`npm run lint` currently reports 388 problems (126 errors, 262 warnings)** against the project's own `.eslintrc.json` — the codebase has drifted from its own style rules because nothing enforces them automatically.
- **`npm audit` reports 60 known vulnerabilities (2 critical, 33 high, 13 moderate, 12 low)**, all reachable through `react-scripts`' build toolchain (webpack-dev-server, rollup, workbox). `react-scripts` itself (CRA) has been unmaintained since 2023 and will not receive fixes.
- **The model/builder value-object layer (443 tests across 36 suites) is genuinely well tested and all currently pass**, and `App.test.tsx` now adds one root-level smoke test on top of that (§1.4) — but Login, Register, Checkout, ShoppingCart, and AccountRouteGuard themselves still have zero test coverage of their own.
- **`nginx.conf` sets `Access-Control-Allow-Origin: *`** on the same routes the app calls with `credentials: 'include'`, including `/actuator` — a fragile config that should be an explicit origin allowlist.
- The checkout "Place Order" action and the modal used for every error/success message in the app are **not operable by keyboard**.
- There is **no CI/CD pipeline** of any kind, so none of the above (lint, tests, or vulnerable deps) is caught automatically before it ships.

---

## Findings

### 1. Correctness bugs — ✅ Fixed

| # | Location | Severity | Description |
|---|---|---|---|
| 1.1 | `src/main/components/page/Register/Register.tsx:113-114` (`handlePersonalDetailsStep`) | **High** | `handleErrorMessages(e)` is called but its return value (the formatted error string) is discarded instead of being passed to `setModalMessage`. A validation failure on the "personal details" registration step fails with zero user-visible feedback. |
| 1.2 | `src/main/components/page/Register/Register.tsx:139-140` (`handleSetAddressesStep`) | **High** | Same pattern — `handleErrorMessages(e)` result discarded, so address-step validation errors (and any error from the `register()` network call on this step) are silently swallowed. |
| 1.3 | `src/main/components/page/Checkout/Checkout.tsx:366-367` (`submitOrder`, outer catch) | **Medium** | Same discarded-return pattern. In practice most real failures are already surfaced by the inner `getOrderToSubmit`/`sendOrderToServer` catches (`Checkout.tsx:322-324`, `:351-353`), but the "order data missing/invalid" case thrown at `:362` reaches only this outer catch and is never shown to the user. |
| 1.4 | `src/test/App.test.tsx` | **Medium** | The file's only test is commented out, leaving zero active assertions. Under `react-scripts test`, an empty suite is a **hard failure** ("Your test suite must contain at least one test"), not a silent pass — confirmed live: `Test Suites: 1 failed, 36 passed, 37 total`, overall process exit code `1`. Any CI pipeline added today would be red from the first commit, for a reason unrelated to app correctness. |

**Fixed:** 1.1–1.3 now call `setModalMessage(handleErrorMessages(e))` consistently, matching the correct pattern already used elsewhere in the same files. 1.4 was replaced with a real smoke test (mocks `fetch`, renders `<App>` under `Provider`/`BrowserRouter`, waits for the post-auth-check app shell to appear) rather than removing the suite. Live-verified: `CI=true npm test -- --watchAll=false` now passes all 37 suites (444 tests) and exits `0` for the first time.

### 2. Security

| # | Location | Severity | Description |
|---|---|---|---|
| 2.1 | `nginx.conf:25,35` | **High** | `Access-Control-Allow-Origin: '*'` is set on the proxied `/auth-status|csrf-token|login|v1|actuator` block, the same routes called throughout the app with `credentials: 'include'`. Browsers currently reject the wildcard-origin + credentialed-request combination, so this isn't exploitable as-is, but it's one small change away (adding `Access-Control-Allow-Credentials: true`, or any reverse-proxy that reflects the request origin) from letting any origin read authenticated responses — including Spring Boot `/actuator` endpoints. Should be an explicit origin allowlist, not `*`. |
| 2.2 | `src/main/components/page/Register/Register.tsx` (signup `POST`), `src/main/components/page/ShoppingCart/ShoppingCart.tsx:14-20` (`fetchFoodsByIds`), `src/main/utils/myUser/PasswordUtils.tsx:16-27` (`isCommonPassword` check) | ~~**Medium**~~ **Resolved / not actually a bug** | These three mutating `fetch` calls send no CSRF token, unlike every other state-changing call in the app. **Final correction, now that §8.1 is fixed and every endpoint has been checked against `API_ENDPOINTS.md`:** only the `Register.tsx` signup case was a real gap — `POST /v1/registration` is documented CSRF-required, and it's now fixed (§8.1) alongside the path correction. `ShoppingCart.tsx`'s and `PasswordUtils.tsx`'s calls were never actually bugs: `POST /v1/foods/cart` and `POST /v1/registration/common-password` are both documented **CSRF-exempt**, so sending no token there is correct, not inconsistent. |
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
| 4.1 | `src/test/**` vs `src/main/components/**`, `src/main/pages/**`, `src/main/features/**` | **High** | Live run: 37 test suites, 444 tests, all passing. 443 of those target the model/builder/value-object layer (`src/test/model/**`, `src/test/builder/**`) — genuinely thorough coverage there. `src/test/App.test.tsx` now adds one root-level smoke test (fixed per §1.4), but **no other React component has any test coverage**: `Login.tsx`, `Register.tsx`, `Checkout.tsx`, `ShoppingCart.tsx`, and `AccountRouteGuard.tsx` still have zero coverage of their own. |
| 4.2 | `package.json` / repo-wide | **Medium** | No coverage thresholds or reporting are configured anywhere (no `--coverage`, no `coverageThreshold` in any Jest config). Even once tests exist for components, there's currently no mechanism to prevent coverage from silently regressing. |

### 5. Tooling & CI/CD

| # | Location | Severity | Description |
|---|---|---|---|
| 5.1 | repo-wide | **High** | No `.github/workflows/`, `.gitlab-ci.yml`, or any other CI config exists, and no pre-commit hooks are configured. Live-verified consequence: `npm run lint` currently reports **388 problems (126 errors, 262 warnings)** with nothing enforcing it automatically. `npm test -- --watchAll=false` now exits `0` (the §1.4 fix), but that was only luck of a human running it manually — nothing would have caught it failing, or would catch the lint drift today, without CI. |
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

### 8. Backend API contract mismatches

`API_ENDPOINTS.md` documents the backend's actual request/response contract (paths, methods, CSRF requirements, body shapes). Every `fetch()` call site in `src/` was located and compared against it directly. The comparison assumes `API_ENDPOINTS.md` is accurate for the backend as it currently stands — if so, the frontend was written against (or has drifted from) a different set of routes almost everywhere except auth/session plumbing.

#### 8.1 Endpoint path/method mismatches — **Critical — ✅ Fixed**

Every row below would return **404** (or fail Spring's parameter binding, for the query-vs-path-segment case) against a backend that implements `API_ENDPOINTS.md` as documented. This covers registration validation, signup, account loading, all profile/address/password updates, the menu, food details, allergens, cart contents, checkout, and password-reset link validation — i.e. nearly every screen in the app past the login form.

| Frontend call | Documented backend endpoint | File:line | Notes |
|---|---|---|---|
| `GET /v1/req/isEmailExist/{email}` | `GET /v1/registration/email/{email}/exists` | `src/main/utils/EmailUtils.tsx:16` | Wrong path. |
| `GET /v1/req/isUsernameExist/{username}` | `GET /v1/registration/username/{username}/exists` | `src/main/utils/myUser/UsernameUtils.tsx:15` | Wrong path. |
| `POST /v1/req/isCommonPassword` | `POST /v1/registration/common-password` | `src/main/utils/myUser/PasswordUtils.tsx:16-24` | Wrong path — but `checkPasswordIsCommon` isn't called from anywhere else in `src/`, so this one's unreachable regardless (dead code, see also §3). |
| `POST /v1/req/signup` | `POST /v1/registration` | `src/main/components/page/Register/Register.tsx:64` | Wrong path — registration itself is broken. Even if the path were fixed, no CSRF token is attached (§2.2), and the documented endpoint requires one. |
| `GET /v1/account/getAuthenticatedUser` | `GET /v1/account/me` | `src/main/utils/pages/account/accountPageUtils.tsx:2` | Wrong path — the account page can't load the logged-in user's data. |
| `PUT /v1/account/updatePassword` | `PATCH /v1/account/password` | `src/main/components/page/UserProfile/LoginData/LoginData.tsx:46` | Wrong path **and** wrong method. |
| `PUT /v1/customer/updateBillingAddress` | `PUT /v1/customer/billing-address` | `src/main/components/page/UserProfile/BillingAddress/BillingAddress.tsx:55` | Wrong path (method is correct). |
| `PUT /v1/customer/updateDefaultShippingAddress` | `PUT /v1/customer/shipping-address` | `src/main/components/page/UserProfile/ShippingAddress/ShippingAddress.tsx:56` | Wrong path (method is correct). |
| `PUT /v1/customer/updatePersonalDetails` | `PATCH /v1/customer/personal-details` | `src/main/components/page/UserProfile/PersonalData/PersonalData.tsx:47` | Wrong path **and** wrong method. |
| `GET /v1/foods/getMenuItemsBy/RESTAURANT` | `GET /v1/foods/menu/{placeToBuy}` | `src/main/components/page/Menu/Menu.tsx:60` (URL built in `src/main/pages/MenuPage/index.tsx:5`) | Wrong path. Also hardcodes the literal `RESTAURANT` segment rather than passing `PlaceToBuyEnum` dynamically — `FANTASY_WORLD` is never reachable from any menu route even once the path is fixed. |
| `POST /v1/foods/getShoppingCartItemsData` | `POST /v1/foods/cart` | `src/main/components/page/ShoppingCart/ShoppingCart.tsx:14` | Wrong path — the cart page can't resolve line-item names/prices/images. |
| `GET /v1/foods/getFoodDetailsBy/{foodId}` | `GET /v1/foods/{id}` | `src/main/components/page/FoodDetails/FoodDetails.tsx:38` | Wrong path — the food detail page 404s. |
| `GET /v1/allergen/getAllAllergens` | `GET /v1/allergens` | `src/main/utils/food/AllergenUtils.tsx:7-12` | Wrong path (singular `allergen` vs. documented plural `allergens`) — the allergens page 404s. |
| `POST /v1/orders/createOrder` | `POST /v1/orders` (authenticated) or `POST /v1/orders/guest` (public) | `src/main/components/page/Checkout/Checkout.tsx:333` | Wrong path either way — order submission, the entire commercial point of the app, 404s. See also §8.2. |
| `GET /v1/password-reset/validate-{token}` | `GET /v1/password-reset/validate?token={token}` | `src/main/components/page/ForgottenPassword/ForgottenPassword.tsx:74` | The token is appended to the path with a literal hyphen instead of being sent as a `?token=` query parameter — won't bind to a `@RequestParam` on the backend. Breaks reset-link validation. |

**Endpoints that do line up** (path and method both correct): `GET /auth-status`, `GET /csrf-token`, `POST /login`, `POST /logout`, `POST /v1/password-reset/request-password-reset-link`, `POST /v1/password-reset/set-new-password`.

**Fixed:** all 15 calls above now use the documented path and method. `Register.tsx`'s signup call also now attaches `X-CSRF-TOKEN` (the documented endpoint requires it, and fixing only the path would have traded a 404 for a 403). `PasswordChangeModel`'s and `PersonalDetailsModel`'s serialized request bodies were spot-checked against the documented `PATCH /v1/account/password` and `PATCH /v1/customer/personal-details` shapes and already match, since both rely on the same value-wrapper Model pattern the doc expects — but body shapes for the other endpoints were **not** exhaustively re-verified against the doc as part of this fix, only paths/methods. `MenuPage`'s hardcoded `RESTAURANT` segment (noted in the original finding) also wasn't addressed — reaching `FANTASY_WORLD` would need a new route/page, which is feature work beyond a path fix. Live-verified: full test suite still passes (37 suites, 444 tests) and lint shows 0 new errors on every changed file.

#### 8.2 Checkout doesn't branch between authenticated and guest order endpoints — **High — ✅ Fixed**

`Checkout.tsx:333` always `POST`s to the same URL regardless of `isAuthenticated`, but the documented API models this as two distinct endpoints — `POST /v1/orders` for logged-in customers (order gets attached to their `Customer` record) vs. `POST /v1/orders/guest` for anonymous checkout. Beyond the path typo in §8.1, the frontend has no branching logic at all for this, so even a path fix would need new conditional routing, not just a URL correction.

**Fixed:** `sendOrderToServer` now calls `fetch(isAuthenticated ? '/v1/orders' : '/v1/orders/guest', ...)`, using the `isAuthenticated` prop `Checkout` already receives.

#### 8.3 CSRF tokens sent to endpoints the backend documents as CSRF-exempt — **Low**

`Login.tsx:30`, `ForgottenPassword.tsx:45`, and `ForgottenPassword.tsx:114` each call `fetchCsrfToken()` and attach the result before hitting `/login`, `/v1/password-reset/request-password-reset-link`, and `/v1/password-reset/set-new-password` — all three of which `API_ENDPOINTS.md` documents as **CSRF-exempt**. Harmless against a backend that simply ignores the extra token, but it's a wasted round-trip (an extra `GET /csrf-token` before every login attempt) and suggests the CSRF-exemption list wasn't consulted when these calls were written.

#### 8.4 `/logout`'s CSRF token is sent as a body field, not a header — **Medium — ✅ Fixed**

`API_ENDPOINTS.md` describes CSRF as "send `X-CSRF-TOKEN`" for any non-exempt mutating call, and `POST /logout` is explicitly listed as CSRF-required. `LogoutButton.tsx:19-37` does fetch and send a token, but as a `_csrf` field inside a `URLSearchParams` body (same pattern as `Login.tsx`, where it's harmless because `/login` is exempt) — not as the `X-CSRF-TOKEN` header the doc describes elsewhere. Whether Spring's `CsrfFilter` accepts a body parameter alongside/instead of the header depends on the backend's `CsrfTokenRequestHandler` configuration, which isn't visible from the frontend — flagged as a likely-but-unconfirmed logout failure, worth a quick manual check against the real backend rather than assuming either way.

**Fixed:** `LogoutButton.tsx` now reuses the shared `fetchCsrfToken()` utility (`src/main/supports/fetch-utilities/fetchCsrfToken.tsx`) instead of duplicating its own inline `/csrf-token` fetch, and sends the token via the `X-CSRF-TOKEN` header — matching the doc and every other mutating call in the app. The now-unnecessary `Content-Type: application/x-www-form-urlencoded` header and `_csrf` form body were removed, since the documented request body for `POST /logout` is `none`.

#### 8.5 Documented endpoints with no frontend caller — **Informational**

`POST /v1/foods` (authenticated menu-item creation), `GET /v1/customers` (admin customer list), `GET /v1/orders/{id}` (order detail/receipt lookup), and `GET /v1/ingredients` are all defined in `API_ENDPOINTS.md` but never called anywhere in `src/`. Not a bug — there's simply no admin UI, order-history/receipt view, or ingredient listing built yet — but worth noting for anyone using this repo as a reference: the backend's capability surface is larger than what the current frontend exposes.

---

## Summary table

| # | Finding | Severity |
|---|---|---|
| 8.1 | ~~15 of ~21 frontend API calls use a path/method that doesn't exist in the documented backend~~ | ~~Critical~~ **✅ Fixed** |
| 6.1 | Modal has no keyboard/ARIA support | High |
| 6.2 | Checkout "Place Order" is an unreachable-by-keyboard `<div>` | High |
| 4.1 | Zero test coverage for all React components/pages/flows | High |
| 5.1 | No CI/CD — lint (388 problems) runs only manually and nothing would catch a regression | High |
| 2.1 | `nginx.conf` wildcard CORS on credentialed API routes | High |
| 2.4 | 60 npm audit vulnerabilities (2 critical) via unmaintained CRA toolchain | High |
| 8.2 | ~~Checkout never branches between authenticated/guest order endpoints~~ | ~~High~~ **✅ Fixed** |
| 1.1 | ~~Silent validation-error swallowing — Register personal details step~~ | ~~High~~ **✅ Fixed** |
| 1.2 | ~~Silent validation-error swallowing — Register address step~~ | ~~High~~ **✅ Fixed** |
| 1.3 | ~~Silent validation-error swallowing — Checkout submit (partial)~~ | ~~Medium~~ **✅ Fixed** |
| 1.4 | ~~`App.test.tsx` empty suite fails the test run outright~~ | ~~Medium~~ **✅ Fixed** |
| 2.2 | ~~Inconsistent CSRF/credentials coverage on 3 mutating requests~~ | ~~Medium~~ **✅ Resolved** (2 of 3 were never bugs; the real one is fixed) |
| 2.5 | `AccountRouteGuard` dead state + no real access-control guarantee | Medium |
| 3.1 | Pervasive `any` at the form-validation boundary despite `strict: true` | Medium |
| 3.3 | 5 debug `console.log`s in the shared error-formatting utility | Medium |
| 3.8 | 686-line monolithic `Checkout.tsx` | Medium |
| 5.2 | No `jsx-a11y` lint rules configured | Medium |
| 4.2 | No coverage thresholds/reporting configured | Medium |
| 6.3 | Hamburger menu toggle not keyboard-operable | Medium |
| 8.4 | ~~`/logout` CSRF token sent as body field, not header (unverified against backend)~~ | ~~Medium~~ **✅ Fixed** |
| 2.3 | `.gitignore` doesn't exclude top-level `.env` | Low |
| 3.2 | Dead `counter` Redux feature still wired into the store | Low |
| 3.4 | Assorted leftover `console.log`s / commented-out code | Low |
| 3.5 | Converter duplication; heavy boilerplate for trivial leaf models | Low |
| 3.6 | `pages/*Page` vs `components/page/*` naming overlap | Low |
| 3.7 | `.tsx` used for files with no JSX | Low |
| 5.3 | `tsconfig.json` `target: es5` inconsistent with `browserslist` | Low |
| 6.4 | Additional non-semantic clickable `<div>`s | Low |
| 7.1 | No i18n layer; all UI text hardcoded in Hungarian | Low |
| 8.3 | Unneeded CSRF token fetches on 3 documented CSRF-exempt endpoints | Low |
| 8.5 | 4 documented backend endpoints have no frontend caller (no admin/order-history UI) | Informational |

---

## Appendix: live tool output (condensed)

```
$ npm install
added 1439 packages
60 vulnerabilities (12 low, 13 moderate, 33 high, 2 critical)

$ npm run lint   # re-run 2026-07-27, after the §1 fixes (388 vs. the original 392 — App.test.tsx's
                  # previously-unused imports in the commented-out suite accounted for the difference)
✖ 388 problems (126 errors, 262 warnings)
  115 errors and 0 warnings potentially fixable with the `--fix` option

$ CI=true npm test -- --watchAll=false   # before the §1 fixes
Test Suites: 1 failed, 36 passed, 37 total
Tests:       443 passed, 443 total
Time:        2.272 s
(process exit code: 1, due to src/test/App.test.tsx: "Your test suite must contain at least one test")

$ CI=true npm test -- --watchAll=false   # after the §1 fixes (fix/correctness-bugs)
Test Suites: 37 passed, 37 total
Tests:       444 passed, 444 total
Time:        2.829 s
(process exit code: 0)

$ npm audit
60 vulnerabilities (12 low, 13 moderate, 33 high, 2 critical)
  — all transitive through react-scripts (webpack-dev-server, rollup,
    workbox-build, websocket-driver, shell-quote, ws, yaml, validator,
    serialize-javascript, underscore)
```

`npm audit --omit=dev` returns the same 60 findings: `react-scripts` is listed under `"dependencies"` (not `"devDependencies"`) in `package.json`, which is how CRA projects are conventionally structured, so the `--omit=dev` filter doesn't separate build tooling from runtime code here.
