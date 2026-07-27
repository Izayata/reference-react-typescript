# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A Create React App (react-scripts 5) + TypeScript single-page app for a restaurant ordering site (menu browsing, food details, allergens, gallery, shopping cart, checkout, registration/login, account/profile management). Bootstrapped from CRA's Redux+TypeScript template (`package.json` name is still `redux-typescript-router`, and `src/main/features/counter` is the original template's demo Redux slice, largely unused by app logic) and then heavily extended into the restaurant domain.

The app talks to a separate backend (proxied at `localhost:8080` in dev via the `proxy` field in `package.json`; in the Docker/nginx setup, `nginx.conf` proxies `/auth-status`, `/csrf-token`, `/login`, `/v1`, `/actuator` to a service named `app:8080` — the `/actuator` path suggests a Spring Boot backend). Auth is cookie/session-based (`credentials: 'include'`) with CSRF token fetching (`src/main/supports/fetch-utilities/fetchCsrfToken.tsx`).

## Known issues — read before touching `fetch()` calls or error handling

`AUDIT.md` is a living audit of this codebase (security, correctness bugs, test coverage, tooling/CI, accessibility, and a full frontend/backend API cross-check) — check it before assuming existing code is correct, and update the relevant finding (mark it fixed, adjust severity, etc.) when you fix or materially change something it describes.

`API_ENDPOINTS.md` documents the backend's actual request/response contract (paths, methods, CSRF requirements, body shapes). Per `AUDIT.md` §8, most of the frontend's current `fetch()` calls use a URL path (and in two cases an HTTP method) that does **not** match what's documented there — e.g. `Register.tsx` posts to `/v1/req/signup` but the documented endpoint is `/v1/registration`. This was diagnosed but is **not yet fixed**. Don't copy an existing `fetch()` call's path as "known-good" just because it's already in the codebase — cross-check it against `API_ENDPOINTS.md` first.

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
- `src/main/pages/` — route-level page components (thin, one `index.tsx` per route) wired up in `src/App.tsx`'s `<Routes>`.
- `src/main/components/` — reusable components, split into `page/` (page-specific sections like `Menu`, `Checkout`, `UserProfile`), `input/` (form inputs grouped by domain: `customer/`, `myUser/`), `navigation-bar/`, `header/`, and `functional/` (behavioral wrappers: `AccountRouteGuard`, `Modal`, `LoadingOverlay`, etc).
- `src/main/features/` — CRA-template-style Redux "feature" folders (slice + component colocated), e.g. `counter/`. Not the primary pattern used elsewhere in the app.
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

Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) is wired up via `src/app/store.ts`, but only the template's `counter` slice is registered — most app state is local component state (`useState`) or the `ModalMessageContext`. `PersistSelectedStates` (`src/main/supports/Persistence.tsx`) syncs selected Redux state into the URL query string on change, and exposes `NavLinkPersist`/`NavigatePersist`/`useNavigatePersist` helpers that preserve the current query string across navigation — use these instead of `NavLink`/`useNavigate` directly when a component needs query params to survive navigation.

### Routing & auth

Routes are declared directly in `src/App.tsx` (`react-router-dom` v6). Authentication status is checked once on mount via `GET /auth-status` (`credentials: 'include'`) and passed down as `isAuthenticated`; `/account` is wrapped in `AccountRouteGuard`, which redirects to `/login` if unauthenticated. There's no auth context/hook — `isAuthenticated` and login/logout handlers live in `App.tsx` and are prop-drilled to `Nav`, `LoginPage`, and `CheckoutPage`.

## Linting conventions

`.eslintrc.json` enforces (beyond `eslint:recommended` / `plugin:react/recommended` / `@typescript-eslint/recommended`): 2-space indent, single quotes, **no semicolons**. `react/react-in-jsx-scope`, `react/prop-types`, and `@typescript-eslint/no-non-null-assertion` are disabled — non-null assertions (`!`) are used freely, especially in Builders' `build()` methods.
