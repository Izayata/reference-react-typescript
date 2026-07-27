# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A Create React App (react-scripts 5) + TypeScript single-page app for a restaurant ordering site (menu browsing, food details, allergens, gallery, shopping cart, checkout, registration/login, account/profile management). Bootstrapped from CRA's Redux+TypeScript template (`package.json` name is still `redux-typescript-router`, and `src/main/features/counter` is the original template's demo Redux slice, largely unused by app logic) and then heavily extended into the restaurant domain.

The app talks to a separate backend (proxied at `localhost:8080` in dev via the `proxy` field in `package.json`; in the Docker/nginx setup, `nginx.conf` proxies `/auth-status`, `/csrf-token`, `/login`, `/v1`, `/actuator` to a service named `app:8080` — the `/actuator` path suggests a Spring Boot backend). Auth is cookie/session-based (`credentials: 'include'`) with CSRF token fetching (`src/main/supports/fetch-utilities/fetchCsrfToken.tsx`).

## Known issues — check `AUDIT.md` before assuming existing code is correct

`AUDIT.md` is a living audit of this codebase (security, correctness bugs, test coverage, tooling/CI, accessibility, and a full frontend/backend API cross-check against `API_ENDPOINTS.md`) — check it before assuming an issue is still open or that existing code is correct, and update the relevant finding (mark it fixed, correct a stale line citation, etc.) when you fix or materially change something it describes.

Most of the originally-found issues are now fixed: the three silent-error-swallowing bugs, the empty `App.test.tsx` suite, all 15 `fetch()` calls that used a URL path not matching `API_ENDPOINTS.md` (§8.1/§8.2 — endpoint paths now match the doc, including `Register.tsx`'s signup call), the `nginx.conf` CORS wildcard, `AccountRouteGuard`'s dead state, and `/logout`'s CSRF transport. `npm audit`'s 2 critical vulnerabilities are also fixed (§2.4) — but that fix (a routine `npm audit fix`) surfaced a new, separate finding: `react-router` itself (a real runtime dependency, not build tooling) has a moderate open-redirect advisory with no non-breaking fix available — only a major version bump to `react-router-dom` 7.x, which is a real breaking change needing manual route-by-route testing this repo has no coverage for (§2.6, not yet fixed). All §3 code-quality/architecture findings are also fixed: no more `any` at the form/error boundary, the dead `counter` feature and stray `console.log`s are gone, `AddressModelConverter` is de-duplicated, non-JSX files use `.ts` not `.tsx`, and `Checkout.tsx` is split into an orchestrator plus two presentational sub-components (see "Directory layout" and the Checkout section above). That pass also surfaced that `CI=true npm run build` fails outright on pre-existing lint debt (CRA treats warnings as build errors under `CI=true`) — folded into §5.1, not yet fixed. **Still open:** ~72 remaining `npm audit` vulnerabilities in the `react-scripts`/CRA build toolchain, none critical, no safe non-breaking fix beyond what's already applied (§2.4); the §2.6 `react-router` upgrade; no CI/CD, so lint/test/build regressions aren't caught automatically, and `CI=true npm run build` would fail immediately if CI were added today (§5); no test coverage on any interactive component — only the model/builder layer and one root-level `App.test.tsx` smoke test (§4); several accessibility gaps, notably the checkout submit button and the shared `Modal` (§6).

One thing the endpoint-path fix did **not** cover: request/response **body shapes** were only spot-checked against two documented endpoints, not exhaustively verified for all of them. Don't assume a `fetch()` call's body shape is correct just because its URL now matches `API_ENDPOINTS.md` — cross-check the body too before relying on it.

## Commands

```bash
npm start          # run dev server (react-scripts start)
npm run build       # production build
npm test             # run tests in watch mode (react-scripts test / Jest + React Testing Library)
npm run lint          # eslint src --ext .js,.ts,.jsx,.tsx
npm run lint:fix       # eslint --fix
```

- Run a single test file: `npm test -- src/test/model/customer/AddressModel.test.tsx`
- Run tests matching a name: `npm test -- -t "should throw required error"`
- `npm test` runs in Jest watch mode by default (CRA); pass `CI=true npm test` for a single non-interactive run.
- There is no separate typecheck script; `npm run build` (or `tsc --noEmit`) surfaces type errors since `tsconfig.json` has `noEmit: true`.

Docker: `Dockerfile` builds with `node:18`, then serves the static build via `nginx:stable-alpine` using `nginx.conf` (which also reverse-proxies API paths to the `app` backend service — see above).

## Architecture

### Directory layout

- `src/app/` — Redux store setup (`store.ts`) and typed hooks (`useAppDispatch`/`useAppSelector` in `hooks.ts`).
- `src/main/pages/` — route-level page components (thin, one `index.tsx` per route) wired up in `src/App.tsx`'s `<Routes>`. **Naming note:** these `pages/*Page` directories (e.g. `pages/LoginPage`) are distinct from the similarly-named `components/page/*` directories below (e.g. `components/page/Login`) — a page is a thin route wrapper that renders the matching presentational component; don't confuse the two when navigating the tree.
- `src/main/components/` — reusable components, split into `page/` (page-specific sections like `Menu`, `Checkout`, `UserProfile` — see the naming note above), `input/` (form inputs grouped by domain: `customer/`, `myUser/`), `navigation-bar/`, `header/`, and `functional/` (behavioral wrappers: `AccountRouteGuard`, `Modal`, `LoadingOverlay`, etc).
- `src/main/features/` — only `footer/` remains here (a plain component, not a Redux slice). The CRA-template Redux "feature" folder pattern (slice + component colocated) this directory was originally for has been removed entirely — it's not a pattern used anywhere in the app.
- `src/main/model/`, `src/main/builder/`, `src/main/converter/`, `src/main/myDecorators/`, `src/main/utils/` — the domain model layer (see below); mirrored file-for-file by tests under `src/test/`.
- `src/main/context/` — React context providers (e.g. `ModalMessageContext` for a global message modal).
- `src/main/supports/` — cross-cutting helpers: `Persistence.tsx` (query-string state persistence + nav helpers), `fetch-utilities/` (CSRF token fetch).
- CSS is plain `.css` (Sass is a dependency but plain CSS is the convention seen), organized per-component in local `css/` subfolders plus shared styles in `src/main/css/`.

### Domain model pattern (the core architecture to understand)

Almost every domain concept follows the same four-layer pattern, and understanding one instance (e.g. `AddressModel`) explains the rest:

1. **Model** (`src/main/model/**`) — a class wrapping one value or composing sub-models. Validated in the constructor via `class-validator`'s `validateSync`, throwing the validation errors array if invalid. Composite models (e.g. `AddressModel`) hold nested leaf models (e.g. `ZipCodeModel`, `CityModel`); leaf models wrap a primitive (usually `string`) with decorators like `@NotBlank`, `@Matches`, `@Length`. Every model implements a manual `equals(other)` method (no `===`/deep-equal library). Custom decorators live in `src/main/myDecorators/` (`NotBlank`, `NotNull`, `NotUndefined`, `ValidPhoneNumber`, `NoZeroNorZeroSlash`), built with `class-validator`'s `registerDecorator`.
2. **Builder** (`src/main/builder/**`) — one builder class per composite model, with chainable `setX()` methods and a `build()` that calls the model constructor (and thus triggers validation). Used instead of large constructors/object literals to build composite models incrementally.
3. **Converter** (`src/main/converter/**`) — free functions that turn raw form data (typically `any`, e.g. from a `FormData`/registration form) into a model instance, using the corresponding Builder.
4. **Utils** (`src/main/utils/**`, mirrored per model) — colocated constants and pure helpers for a given model: error message strings (Hungarian-language user-facing text, e.g. `ERR_MSG_ZIP_CODE_REQUIRED`), regexes, and validation constants referenced by both the Model and its tests.

Tests live in `src/test/**`, mirroring the `src/main/**` path of the thing under test (e.g. `src/main/model/customer/AddressModel.tsx` → `src/test/model/customer/AddressModel.test.tsx`). Test files exhaustively cover required/null/undefined cases for every validated field plus `equals()` behavior, using the shared assertion helper `expectErrorMessages` (`src/main/utils/test/ExpectErrorMessages.tsx`).

When adding a new domain field or model, follow this same Model → Builder → Converter → Utils (+ mirrored test) shape rather than introducing a different pattern.

### State management

Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) is wired up via `src/app/store.ts` (`Provider` in `index.tsx`), but the store currently has **no reducers registered** — the CRA-template `counter` slice that used to be the only one was removed as dead code. All app state is local component state (`useState`) or the `ModalMessageContext`; the Redux plumbing is kept in place as scaffolding for future state, not because anything reads from it today. `PersistSelectedStates` (`src/main/supports/Persistence.tsx`) is a similar placeholder — it's structured to sync selected Redux state into the URL query string on change (see the comment inside it for where to add a key), but has nothing to persist yet. It still exposes `NavLinkPersist`/`NavigatePersist`/`useNavigatePersist` helpers that preserve the current query string across navigation — use these instead of `NavLink`/`useNavigate` directly when a component needs query params to survive navigation.

### Routing & auth

Routes are declared directly in `src/App.tsx` (`react-router-dom` v6). Authentication status is checked once on mount via `GET /auth-status` (`credentials: 'include'`) and passed down as `isAuthenticated`; `/account` is wrapped in `AccountRouteGuard`, which redirects to `/login` if unauthenticated. There's no auth context/hook — `isAuthenticated` and login/logout handlers live in `App.tsx` and are prop-drilled to `Nav`, `LoginPage`, and `CheckoutPage`.

## Linting conventions

`.eslintrc.json` enforces (beyond `eslint:recommended` / `plugin:react/recommended` / `@typescript-eslint/recommended`): 2-space indent, single quotes, **no semicolons**. `react/react-in-jsx-scope`, `react/prop-types`, and `@typescript-eslint/no-non-null-assertion` are disabled — non-null assertions (`!`) are used freely, especially in Builders' `build()` methods.
