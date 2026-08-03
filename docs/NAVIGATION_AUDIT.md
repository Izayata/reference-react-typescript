# Navigation & Scroll Audit — `src/main/components/navigation-bar/`, `src/App.tsx`, `src/main/supports/Persistence.tsx`

## 1. Overview & Scope

Triggered by a real-user report: navigating via the nav buttons sometimes left the new page scrolled
to the same vertical offset as the previous page instead of jumping to the top. This audit traces
every route-to-route navigation control in the app plus the router setup, to find the root cause of
the scroll bug and to record adjacent issues surfaced along the way.

**Verdict up front:** the scroll bug had a single, clear root cause (no scroll-restoration logic
existed anywhere) and has been fixed (F1, resolved). Two smaller pre-existing issues were found in
the same navigation controls audited for F1 — a hard page reload on login (F2) and a double
navigation on logout (F3) — both flagged as follow-ups, not fixed here. A fourth item (F4) confirms a
gap already documented in `CLAUDE.md`.

---

## 2. Findings

### F1 (high) — No scroll-to-top on route navigation — RESOLVED

**Root cause:** the app renders `<BrowserRouter>` (`src/index.tsx:22`) with plain `<Routes>/<Route>`
(`src/App.tsx`) — react-router v7's declarative router, not the data router
(`createBrowserRouter`/`<RouterProvider>`). No scroll-restoration logic existed anywhere in `src`:
no `window.scrollTo`, no custom scroll-to-top component, no `<ScrollRestoration>` (which requires a
data router anyway, so wasn't a drop-in option here even if referenced).

Every route-to-route nav control in the app — `NavigationLinkMenu`, `ShoppingBagDropdown`,
`LoginButton`/`LogoutButton`/`ProfileButton`, `Menu.tsx`'s food-item links, `ShoppingCart`'s checkout
button, `Checkout.tsx`'s empty-cart redirect, `Login.tsx`'s forgot-password/register links,
`NotFound.tsx`'s back-to-home link, `ForgottenPassword.tsx`'s post-reset redirect, and
`AccountRouteGuard`'s unauthenticated redirect — is a plain `NavLink`/`Link`/`useNavigate` call, i.e.
a client-side `pushState` navigation. Browsers do not reset `window.scrollY` on `pushState`, so the
newly routed page rendered at whatever scroll offset the previous page had. Whether that "looked
like" a top-scroll or not was pure coincidence of relative content height between the previous and
next page (a short destination page clamps the old offset near 0; a tall one preserves it, landing
the user mid-content) — not any conditional logic, since none existed.

**Fix:** added `src/main/components/functional/ScrollToTop/ScrollToTop.tsx`, a `null`-rendering
component that calls `window.scrollTo(0, 0)` in a `useEffect` keyed on `useLocation().pathname`,
mounted once inside `AppContent` in `src/App.tsx`. Keying on `pathname` only (not `search`/`hash`)
means it doesn't fire for the in-page hash anchors also present in the nav bar (`#contact` in
`NavigationLinkMenu.tsx`, `#slide-N` in `GalleryPage`'s carousel dots — see F4-adjacent note below)
or for query-string-only changes. Colocated test: `ScrollToTop.test.tsx`.

### F2 (medium) — `Login.tsx` hard-reloads on successful login

`Login.tsx:38` does `window.location.href = data.redirectUrl` after a successful login, rather than
an in-app `navigate()`. This is a full browser page reload — the only navigation path in the app that
isn't a client-side route change. Two consequences:

1. It always resets scroll natively, unlike every other in-app link — before F1's fix, this made
   post-login navigation "just work" while every other nav button didn't, likely reinforcing the
   "sometimes it works" impression reported by the user.
2. It forces a full app remount and asset re-fetch on every login, which the rest of the app's
   client-side routing is otherwise designed to avoid.

**Recommendation:** replace with `navigate('/account')`-style in-app routing, **if** `redirectUrl` is
verified to always be a same-origin/internal path. This is unverified as part of this audit — check
whether the backend can return an off-app `redirectUrl` (e.g. an OAuth-style external redirect)
before changing this, since that would make an in-app `navigate()` incorrect.

**Status:** not fixed — flagged for follow-up.

### F3 (medium) — `LogoutButton.tsx` fires two navigations per click

`LogoutButton.tsx:43-53` renders `<NavLink to="" onClick={handleLogout}>`. The empty `to=""` triggers
an immediate client-side navigate on click (to the current path), and `handleLogout`'s async flow
separately calls `onLogout()` → `App.tsx`'s `handleLogout` → `navigate('/login')` once the `/logout`
request resolves. Two navigations fire back-to-back for a single click.

**Recommendation:** drop the `to=""` prop and drive the control purely off `onClick`/`handleLogout`
(e.g. render it as a `<button>` styled like the other nav icons, since it never actually needs to be
a link — `navigate('/login')` already happens imperatively once the logout request succeeds).

**Status:** not fixed — flagged for follow-up.

### F4 (low) — Unused `Persistence.tsx` navigation wrappers, re-confirmed dead

`NavLinkPersist`, `NavigatePersist`, and `useNavigatePersist` (`src/main/supports/Persistence.tsx`)
are not imported anywhere outside that file — confirmed via a full-repo search during this audit.
Every navigation control listed under F1 uses stock `react-router-dom`/`react-router` primitives
instead. This reconfirms what `CLAUDE.md`'s "Routing & auth" section already documents: these
wrappers carry a latent string-concatenation bug (`NavLinkPersist`/`NavigatePersist` naively
concatenate the current query string rather than merging via `URLSearchParams`) that isn't currently
exercised by anything in the app. No action taken here; see `CLAUDE.md` for the existing guidance on
fixing the concatenation properly if either wrapper is ever wired into a real component.

**Status:** no change — informational re-confirmation only.

---

## 3. Summary table

| # | Severity | File(s) | Status |
|---|---|---|---|
| F1 | High | `src/App.tsx`, new `ScrollToTop.tsx` | Resolved |
| F2 | Medium | `Login.tsx:38` | Flagged, not fixed |
| F3 | Medium | `LogoutButton.tsx:43-53` | Flagged, not fixed |
| F4 | Low | `Persistence.tsx` | Informational, no change |
