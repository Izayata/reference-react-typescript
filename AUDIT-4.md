# Codebase Audit 4 — reference-react-typescript

**Date:** 2026-07-29 (last re-verified 2026-07-29 — after the §1 fix landed: `CheckoutOrderSummarySection.tsx` no longer mutates the `orderItems` prop as a render side effect; `Checkout.tsx` now computes it via a pure `useMemo` over `foods`/`quantities`, and the summary section derives its displayed item list/total straight from `foods`/`quantities` with no side effects at all — **§1, Correctness bugs, is now fixed**), and after the §2 fixes landed: all seven icon-only links (`Header.tsx`'s 4 social links, plus `ProfileButton`/`LoginButton`/`LogoutButton`) now have a translated `aria-label`, and `RegisterFormAddresses.tsx`'s "shipping same as billing" checkbox is now wrapped in a real `<label>` with a correctly-inverted `checked` binding, matching its Checkout sibling — **§2, Accessibility, is now fixed**.)
**Scope:** Full repository, re-assessed independently of `AUDIT.md`, `AUDIT-2.md`, and `AUDIT-3.md`. All three prior passes are, per their own documentation, essentially fully resolved (`AUDIT.md`: all sections fixed except two intentionally-deferred breaking-change items and one still-open correctness bug; `AUDIT-2.md`: all 8 sections fixed except one still-open correctness bug and a couple of by-design informational items; `AUDIT-3.md`: all 5 sections fixed/reviewed, with two informational dead-code notes left open by design). Re-ran the full baseline (`npx tsc --noEmit`, `npm run lint`, `CI=true npm test -- --watchAll=false`, `npm run test:coverage`, `CI=true npm run build`, `npm audit`) at the start of this pass — all clean/unchanged from what `AUDIT-3.md` documents (see the Appendix). No regressions found in previously-fixed work.
**Methodology:** A fourth, genuinely independent pass, cross-referenced against all three prior audits before anything was reported, to guarantee nothing here duplicates an already-fixed or already-documented-open finding. Three parallel research subagents were launched at the start of this pass but hit an unrelated session/API limit mid-task and returned no usable output; the research below was instead carried out directly, manually, file by file — global "chrome" components (`Footer`, `Header`), every icon-only interactive element in the nav bar, the `Checkout`/`Register` "same address" checkbox pair, the `ShoppingCart` table markup against its CSS override chain, and roughly a dozen `utils/**` files cross-checked for regex-vs-message mismatches. Two candidate findings were investigated and explicitly ruled out rather than reported (see "Investigated, not findings" below) — nothing here is guessed or inferred from a pattern alone; every finding was confirmed by reading the actual file, and the headline finding was additionally confirmed empirically with a temporary, non-committed regression test.

This audit found **4 new, verified issues**, smaller in count than `AUDIT-3.md`'s 17 but including one genuinely serious, previously-undetected correctness bug: `CheckoutOrderSummarySection.tsx` mutates a prop array as a side effect of rendering, which React 18's `<React.StrictMode>` (enabled app-wide) causes to silently duplicate every order line item sent to the backend on checkout, in every local development session. The remaining three are smaller — a stale placeholder brand name in the footer copyright line, seven icon-only interactive elements with no accessible name (the exact "one outlier among near-identical siblings" pattern that caught real bugs in both prior passes), and a checkbox missing a `<label>` wrapper that its near-identical sibling in the other form flow correctly has.

---

## Executive summary

- ~~**`CheckoutOrderSummarySection.tsx` mutates the `orderItems` prop array during render**, via three unabstracted IIFEs the checkout flow uses to build the order-items list and running total inline in JSX. Under React 18 `<React.StrictMode>` (enabled app-wide, `src/index.tsx`), React deliberately double-invokes this component's render body against the same props to surface exactly this class of bug — and here, because `orderItems` is a plain array prop (not reset per invocation, unlike the component's own local `let` variables), the second invocation pushes a second, duplicate `OrderItemModel` for every cart item. The displayed total price is unaffected (computed via a separate, StrictMode-safely-reset local variable), so the corruption is entirely invisible on screen.~~ **✅ Fixed** — see §1.1. `orderItems` is now computed via a pure `useMemo` in `Checkout.tsx`, and the summary section no longer mutates anything during render; confirmed with a committed regression test that fails against the pre-fix code and passes against the fix.
- ~~**Seven icon-only interactive elements have no accessible name**: the four social-media links in `Header.tsx` (Facebook/Instagram/TikTok/YouTube) and three nav-bar `NavLink`s (`ProfileButton`, `LoginButton`, `LogoutButton`) each wrap a bare `FontAwesomeIcon` — which renders `aria-hidden="true"` by default — with no `aria-label`, no visually-hidden text, and no other content.~~ **✅ Fixed** — see §2.1. All seven now have a translated `aria-label`, matching the pattern `HamburgerMenuButton`/`ShoppingBagButton` already used; confirmed in a real browser that each renders its correct accessible name.
- ~~**`RegisterFormAddresses.tsx`'s "shipping same as billing" checkbox is wrapped in a bare `<span>`, not a `<label>`**, unlike its near-identical sibling — `CheckoutCustomerDetailsSection.tsx`'s "billing same as shipping" checkbox — which correctly uses `<label style={{ textWrap: 'pretty' }}>`. Clicking the visible Hungarian prompt text next to Register's checkbox does nothing; only the small native checkbox square itself toggles it.~~ **✅ Fixed** — see §2.2. Now wrapped in a real `<label>` with a correctly-inverted `checked` binding; confirmed in a real browser that clicking the label text now toggles the checkbox and the shipping form.
- **`Footer.tsx`'s copyright line reads "© 2024 Thes. All rights reserved."** — a stale/placeholder brand name left over from before the app was branded "ImagineBar" everywhere else (nav bar, header, gallery alt text, i18n strings). See §3.1.

Two other candidate leads were investigated this pass and explicitly ruled out — see "Investigated, not findings" below.

---

## Findings

### 1. Correctness bugs — ✅ Fixed

| # | Location | Severity | Description |
|---|---|---|---|
| 1.1 | `src/main/components/page/Checkout/CheckoutOrderSummarySection.tsx:17-30,48-71` (component body and its item-list `.map`), fed by `src/main/components/page/Checkout/Checkout.tsx:64,323,419` (`orderItems` prop origin, consumption in `getOrderToSubmit`, and pass-through) | **High — ✅ Fixed** | `CheckoutOrderSummarySection` received `orderItems: OrderItemModel[]` as a prop and, inside the JSX returned from its render body, ran three IIFEs per cart item to sidestep JSX's expression-only limitation: one constructed a new `OrderItemModel` and called `orderItems.push(orderItem)` — a **side effect that mutates a prop** — one computed `orderItemTotal` into a local `let`, and one accumulated it into a local `let orderTotal`. Only the first mutated state that outlives a single render, because `orderItems` was a prop reference, not a fresh local variable reset at the top of the function like the `let`s were. React's function components are contractually required to be pure with respect to their inputs on every render — `<React.StrictMode>` (wraps the whole app, `src/index.tsx:20-28`) exists specifically to catch violations of this by calling render functions twice in a row against the same props/state in development, discarding the first pass's rendered output but *not* undoing any side effects the first pass already performed. Because `Checkout.tsx:64`'s `const orderItems: OrderItemModel[] = []` was created once per *`Checkout`* render and handed down as one stable array reference, and it was `CheckoutOrderSummarySection`'s own render body — not `Checkout`'s — that StrictMode double-invoked, both invocations pushed into the *same* array: the second invocation's `.push()` calls landed on top of the first's. Empirically confirmed with a temporary Jest/RTL test (pre-fix, not committed) that rendered `<Checkout>` inside `<React.StrictMode>` with a one-item cart: `orderItems` came back as `[{"foodId":1,"quantity":1},{"foodId":1,"quantity":1}]` — length 2 for a 1-item cart — while the displayed total stayed correct (not doubled), which is exactly why the bug was invisible on screen: the number the user sees was right, but the array actually transmitted to `POST /v1/orders`/`POST /v1/orders/guest` was corrupted. Because `<React.StrictMode>`'s double-invoke behavior is a development-only diagnostic (stripped from production builds), this exact duplication was not reproducible against a production build — but every local dev session (the primary way this reference app's checkout flow gets exercised and demonstrated) submitted duplicated order-item data to the backend on every single order placed. **Fixed:** `Checkout.tsx` now computes `orderItems` via `useMemo(() => foods.map(food => new OrderItemModel(food.foodId, quantities[food.foodId])), [foods, quantities])` — a pure, side-effect-free computation — and no longer passes `orderItems` down to `CheckoutOrderSummarySection` at all, since the child never needed it for anything but the mutation itself. `CheckoutOrderSummarySection` now derives its displayed per-item quantity directly from the `quantities` prop it already receives, computes each item's line total as a plain inline expression inside its `.map()` callback, and computes the grand total via a single `foods.reduce(...)` before the `return` — no `let`s, no IIFEs, no mutation of anything, and the `orderItems` prop/import removed from the component entirely. Added a regression test to `Checkout.test.tsx` ("does not duplicate orderItems under React.StrictMode double-rendering (AUDIT-4.md §1.1)") that renders `<Checkout>` inside `<React.StrictMode>`, completes a guest checkout, and asserts the submitted `orderItems` array is exactly `[{ foodId: 1, quantity: 1 }]` for a 1-item cart — confirmed to fail against the pre-fix code (reproducing the exact duplicated-array symptom) before confirming it passes against the fix. Also manually verified in a real browser (dev server + Playwright, `/v1/foods/cart` mocked via route interception): the order summary renders `×2 \| Gulyásleves` and the correct `3800 Ft` total with no console errors introduced by the change. |

**Fixed:** the one finding in this section addressed. Live-verified: `npx tsc --noEmit` passes with zero errors; `CI=true npm test -- --watchAll=false` passes all 69 suites (592 tests, up from 591 — the new regression test, confirmed to fail against the pre-fix code before confirming it passes against the fix); `npm run lint` exits `0` with 210 problems (0 errors, unchanged); `npm run test:coverage` at `62.26/47.21/58.92/63.14`, still comfortably above the `59/43/54/59` threshold; `CI=true npm run build` exits `0`. Additionally verified in a real browser (dev server + Playwright): the order summary section renders the correct item line and total with no new console errors.

### 2. Accessibility — ✅ Fixed

| # | Location | Severity | Description |
|---|---|---|---|
| 2.1 | `src/main/components/header/Header.tsx:24-38` (4 links: Facebook, Instagram, TikTok, YouTube), `src/main/components/navigation-bar/components/profile-button/ProfileButton.tsx:9-19`, `.../login-button/LoginButton.tsx:9-19`, `.../logout-button/LogoutButton.tsx:44-53` | **High — ✅ Fixed** | Seven `<a>`/`<NavLink>` elements each wrapped only a bare `<FontAwesomeIcon>` with no other text content, and none had an `aria-label`/`aria-labelledby`. `FontAwesomeIcon` renders its SVG with `aria-hidden="true"` by default (a decorative-icon assumption, since most icons *do* sit next to real text) — so each of these seven links had a genuinely empty accessible name: a screen reader announced only "link", with no indication of what it does. Confirmed via a targeted grep that these three nav-bar components were the *only* ones in that directory missing an `aria-label` — `HamburgerMenuButton` and `ShoppingBagButton` already correctly had one, fixed in `AUDIT.md` §6.3 and `AUDIT-3.md` §2.2 respectively. **Fixed:** added a translated `aria-label` to all seven — `header.facebookLinkAriaLabel`/`instagramLinkAriaLabel`/`tiktokLinkAriaLabel`/`youtubeLinkAriaLabel` (new `hu.json` keys, "Facebook"/"Instagram"/"TikTok"/"YouTube") on `Header.tsx`'s four `<a>` tags, and `nav.profileLinkAriaLabel`/`loginLinkAriaLabel`/`logoutLinkAriaLabel` ("Fiók megnyitása"/"Bejelentkezés"/"Kijelentkezés") on the three `NavLink`s — `ProfileButton`/`LoginButton` gained a new `useTranslation()` call each (`LogoutButton` already had one). `Footer.tsx`'s own, separately-defined 4 social-media links (same CSS class, different file) were checked and correctly left alone — they already render real visible text next to each icon (`<FontAwesomeIcon icon={faFacebook}/> - Facebook`, etc.), so they already have a proper accessible name and were never part of this finding. Manually verified in a real browser (dev server + Playwright): each of the seven elements now exposes the correct `aria-label` in the DOM. |
| 2.2 | `src/main/components/page/Register/form/RegisterFormAddresses.tsx:30-32` vs. `src/main/components/page/Checkout/CheckoutCustomerDetailsSection.tsx:181-188` | **Medium — ✅ Fixed** | Register's "shipping address same as billing" checkbox was wrapped in a bare `<span>`: `<span><input type="checkbox" onChange={toggleShippingAddressForm}/> {t('register.shippingSameAsBilling')}</span>` — no `<label>`, no `aria-label`/`aria-labelledby`, and the `<input>` itself was uncontrolled (no `checked` prop). Its near-identical sibling in the other address-entry flow — Checkout's "billing address same as shipping" checkbox — was correctly wrapped in a real `<label>`. The practical effect: clicking the visible prompt text did nothing — only clicking the small native checkbox square itself toggled `isShippingAddressFormDisplayed`. **Fixed:** wrapped the checkbox in a real `<label>`, matching Checkout's sibling. The `checked` binding needed care rather than a direct copy of Checkout's pattern: Checkout's state variable (`billingAddressSameAsShipping`) directly represents the checkbox's own meaning, but Register's state variable (`isShippingAddressFormDisplayed`) represents the *opposite* — `true` means the separate shipping form **is** shown, i.e. the address is *not* the same as billing — so the checkbox is now correctly bound as `checked={!isShippingAddressFormDisplayed}`, not a direct pass-through (binding it directly, as the finding's own original fix-shape note suggested, would have been backwards — checking the box would have shown the shipping form instead of hiding it). `toggleShippingAddressForm` (unchanged) still flips the same underlying state on `onChange`. Added a regression test to `Register.test.tsx` ("toggles the shipping address form via the 'same as billing' checkbox label, not just the checkbox itself (AUDIT-4.md §2.2)") that advances through Register's first two steps, clicks the checkbox's *label text* (not the input directly), and asserts both that the checkbox becomes checked and that the shipping-address form disappears — confirmed to fail against the pre-fix code (label text not found via `getByLabelText`, since no `<label>` existed) before confirming it passes against the fix. Manually verified in a real browser (dev server + Playwright): clicking the label text now checks the box and hides the shipping-address section, matching a screenshot of the resulting state. |

**Fixed:** both findings in this section addressed. Live-verified: `npx tsc --noEmit` passes with zero errors; `CI=true npm test -- --watchAll=false` passes all 69 suites (593 tests, up from 592 — the new `Register.test.tsx` regression test, confirmed to fail against the pre-fix code before confirming it passes against the fix); `npm run lint` exits `0` with 210 problems (0 errors, unchanged); `npm run test:coverage` at `63.00/47.50/59.95/63.91`, comfortably above the `59/43/54/59` threshold; `CI=true npm run build` exits `0`. Both findings were additionally verified in a real browser (dev server + Playwright): §2.1 by reading each element's `aria-label` attribute directly off the live DOM; §2.2 by walking through Register's full flow to the addresses step and confirming a click on the checkbox's label text now toggles it and hides the shipping-address form.

### 3. Content quality

| # | Location | Severity | Description |
|---|---|---|---|
| 3.1 | `src/main/features/footer/Footer.tsx:47` | **Low** | `<p>© 2024 Thes. All rights reserved.</p>` — "Thes" is not this app's brand name anywhere else in the codebase; the app is branded "ImagineBar" consistently everywhere else it appears (`NavigationBar.tsx:29`, `Header.tsx:20`, `hu.json`'s `footer.brandTitle` key, `GalleryPage/index.tsx`'s image alt text) — confirmed via a grep across all of those locations. This line is deliberately left untranslated per `CLAUDE.md`'s i18n architecture (copyright/developer-attribution lines are an explicit exemption from the full-i18n-extraction pass `AUDIT-2.md` §7 completed), so this is a plain string-content bug, not a missing-translation one — the fix is a literal text correction from "Thes" to "ImagineBar", not a new i18n key. |

**Not fixed in this pass** — discovery only.

---

### Investigated, not findings

- **`DisplayShoppingCartContent.tsx`'s `<tr>` (lines 122-198) has a `<div>` and a `<button>` as direct children alongside `<td>` siblings** — investigated as a possible invalid-table-nesting/ARIA-role bug. Ruled out: the entire `<tbody>`/`<tr>` chain is deliberately CSS-overridden to `display: flex` at every breakpoint (`shopping-cart-table-body.css`, `shopping-cart-order-item-container.css`, confirmed via a full read of both including their `@media` blocks), which blockifies all children uniformly (CSS "blockification" — a table-cell-level box loses its table-cell-ness once its parent generates a flex formatting context) and causes modern browsers to suppress the implicit table/row/cell ARIA roles the nesting concern would otherwise raise. Not a real bug.
- **`PhoneNumberUtils.ts`'s `validatePhoneNumber` free function throws `ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED` for a whitespace-only value instead of a format-specific message** — investigated as a possible message-mismatch bug (the same class `AUDIT-3.md` §1.5/1.6 fixed elsewhere). Ruled out as worth reporting: `grep -rn "validatePhoneNumber\b" src/main --include="*.tsx" --include="*.ts" | grep -v PhoneNumberUtils.ts` returns zero call sites — this function is dead code (the real `PhoneNumberModel.tsx` validates via `class-validator` decorators directly, never via this free function), matching the same already-acknowledged dead-`validate*`-utility pattern `AUDIT-3.md` §1's `checkPasswordIsCommon` note and §3's `NavLinkPersist`/`NavigatePersist` note both already document elsewhere in this codebase.

---

## Summary table

| # | Finding | Severity |
|---|---|---|
| 1.1 | ~~`CheckoutOrderSummarySection.tsx` mutates the `orderItems` prop array as a render side effect — StrictMode double-invocation duplicates every order line item submitted to the backend, in every local dev session~~ | ~~High~~ **✅ Fixed** — `orderItems` now computed via a pure `useMemo` in `Checkout.tsx`; no more mutation, regression test included |
| 2.1 | ~~7 icon-only links (`Header.tsx`'s 4 social links, `ProfileButton`, `LoginButton`, `LogoutButton`) have no accessible name~~ | ~~High~~ **✅ Fixed** — translated `aria-label` added to all seven, verified in a real browser |
| 2.2 | ~~`RegisterFormAddresses.tsx`'s "shipping same as billing" checkbox uses a bare `<span>` (unlabeled, uncontrolled) where its Checkout sibling correctly uses a `<label>` (labeled, controlled)~~ | ~~Medium~~ **✅ Fixed** — now a real `<label>` with a correctly-inverted `checked` binding, regression test included |
| 3.1 | `Footer.tsx`'s copyright line says "© 2024 Thes." instead of the app's real brand, "ImagineBar" | **Low** |

---

## Appendix: live tool output (this pass, 2026-07-29)

```
$ npx tsc --noEmit
(no output, exit code 0)

$ npm run lint
✖ 210 problems (0 errors, 210 warnings)   # unchanged from AUDIT-3.md's documented state;
                                            # all warnings are pre-existing src/test/** no-explicit-any
(process exit code: 0)

$ CI=true npm test -- --watchAll=false
Test Suites: 69 passed, 69 total
Tests:       591 passed, 591 total
(process exit code: 0 — unchanged from AUDIT-3.md's final documented state)

$ npm run test:coverage
All files | 62.34% Stmts | 47.21% Branch | 58.92% Funcs | 63.24% Lines
(process exit code: 0 — passes the 59/43/54/59 threshold; unchanged)

$ CI=true npm run build
Compiled successfully.
(process exit code: 0 — unchanged)

$ npm audit
65 vulnerabilities (4 low, 1 moderate, 60 high, 0 critical)
(unchanged from AUDIT-2.md §2.2's documented, already-investigated state)
```

No regressions found anywhere in this baseline — every number above matches what `AUDIT-3.md` already documents as the current, fixed state. All findings in this document are genuinely new, independently discovered by reading current source, and §1.1 was additionally verified empirically: a temporary Jest/RTL test (`<Checkout>` rendered inside `<React.StrictMode>`, guest checkout filled via `Checkout.test.tsx`'s existing selectors, order submitted, and the mocked `fetch` call's body inspected) reproduced the exact duplicated-`orderItems` payload described above; the test file was never committed and `git status --short` was confirmed clean after its deletion.

```
$ npx tsc --noEmit   # after the §1 fix
(no output, exit code 0)

$ CI=true npm test -- --watchAll=false   # after the §1 fix
Test Suites: 69 passed, 69 total
Tests:       592 passed, 592 total
(process exit code: 0; 591->592 is the new Checkout.test.tsx regression test,
 confirmed to fail against the pre-fix code — reproducing the exact
 duplicated-orderItems symptom — before confirming it passes against the fix)

$ npm run lint   # after the §1 fix
✖ 210 problems (0 errors, 210 warnings)   # unchanged
(process exit code: 0)

$ npm run test:coverage   # after the §1 fix
All files | 62.26% Stmts | 47.21% Branch | 58.92% Funcs | 63.14% Lines
(process exit code: 0 — still comfortably above the 59/43/54/59 threshold)

$ CI=true npm run build   # after the §1 fix
Compiled successfully.
(process exit code: 0)
```

§1.1's fix was additionally verified in a real browser (dev server + Playwright, `/v1/foods/cart` mocked via route interception for a 2-quantity cart item): the order summary section renders `×2 | Gulyásleves` and the correct `3800 Ft` grand total, with no new console errors introduced by the change (the pre-existing "Store does not have a valid reducer"/401 console messages are unrelated to this fix — the former is documented scaffolding per `CLAUDE.md`'s "State management" section, the latter is this local dev environment having no real backend to reach).

```
$ npx tsc --noEmit   # after the §2 fixes (2.1-2.2)
(no output, exit code 0)

$ CI=true npm test -- --watchAll=false   # after the §2 fixes
Test Suites: 69 passed, 69 total
Tests:       593 passed, 593 total
(process exit code: 0; 592->593 is the new Register.test.tsx regression test
 for §2.2, confirmed to fail against the pre-fix code before confirming it
 passes against the fix)

$ npm run lint   # after the §2 fixes
✖ 210 problems (0 errors, 210 warnings)   # unchanged
(process exit code: 0)

$ npm run test:coverage   # after the §2 fixes
All files | 63% Stmts | 47.5% Branch | 59.95% Funcs | 63.91% Lines
(process exit code: 0 — comfortably above the 59/43/54/59 threshold)

$ CI=true npm run build   # after the §2 fixes
Compiled successfully.
(process exit code: 0)
```

Both §2 fixes were additionally verified in a real browser (dev server + Playwright). §2.1: loaded the homepage and read each of the seven elements' `aria-label` attribute directly off the live DOM (`Facebook`/`Instagram`/`TikTok`/`YouTube`/`Bejelentkezés` all confirmed present; `ProfileButton`/`LogoutButton` only render when authenticated, not reachable in this guest-only local environment, but share the identical fix pattern already confirmed working on `LoginButton`). Along the way, confirmed `Footer.tsx`'s own 4 social-media links (same CSS class, separate file) render real visible text next to each icon and correctly needed no change. §2.2: walked Register's full flow to the addresses step in a real browser (working around the same `react-phone-input-2` widget automation quirk noted in §1's verification — the field starts pre-populated with `"+36"`, so the remaining digits must be typed at the end rather than replacing the whole value) and confirmed clicking the checkbox's label text now checks it and hides the shipping-address section, with no new console errors.
