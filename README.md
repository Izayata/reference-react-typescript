# reference-react-typescript

A Create React App (react-scripts 5) + TypeScript single-page app for a restaurant ordering site: menu browsing, food details, allergens, gallery, shopping cart, checkout, registration/login, and account/profile management.

Bootstrapped from CRA's Redux+TypeScript template (`package.json`'s name is still `redux-typescript-router`, and `src/main/features/counter` is the original template's demo Redux slice, largely unused by app logic) and then heavily extended into the restaurant domain.

The app talks to a separate backend (a Spring Boot service, based on its `/actuator` path and `PATCH`/`PUT` endpoints) that is **not** part of this repository. Auth is cookie/session-based (`credentials: 'include'`) with CSRF token fetching. See [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) for the full endpoint contract.

## For recruiters

This is a reference/portfolio project built to demonstrate senior-level frontend engineering practices, not a toy tutorial app:

- **Validated domain architecture** — a Model → Builder → Converter → Utils layer (`class-validator`) where every domain object validates itself in its constructor, so invalid state is structurally impossible. See [`docs/DESIGN.md`](./docs/DESIGN.md).
- **Testing discipline** — exhaustive per-field validation tests for every model plus component-level render/interaction tests, with a coverage floor enforced in CI (`npm run test:coverage`).
- **Security-conscious auth** — cookie/session-based authentication with CSRF token fetching on every mutating request.
- **Accessibility** — full `jsx-a11y` rule compliance, not just the defaults.
- **Internationalization** — `i18next`-backed, with module-load-time vs. component-time call patterns handled correctly.
- **Real CI/CD** — GitHub Actions pipeline (lint → typecheck → coverage-gated tests → build), pre-commit lint hooks, and a Dockerized nginx deployment.

## Documentation map

| Doc | Purpose |
| --- | --- |
| [`CLAUDE.md`](./CLAUDE.md) | Commands, directory layout, domain-model pattern, i18n, linting conventions — the day-to-day reference. |
| [`docs/DESIGN.md`](./docs/DESIGN.md) | Deep architecture treatment: full ERD, sequence diagrams for auth/registration/checkout, and the reasoning behind the Model→Builder→Converter→Utils pattern. |
| [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) | Field-level reference for every backend endpoint (request/response shapes, auth/CSRF requirements). |

## Tech stack

- **React 18** + **TypeScript**, bootstrapped with **Create React App** (`react-scripts` 5)
- **React Router v6** (`react-router-dom` 7)
- **Redux Toolkit** (`@reduxjs/toolkit`, `react-redux`) — wired up as scaffolding; the store currently has no reducers registered, so all app state is local component state or React context
- **class-validator** — powers the Model → Builder → Converter → Utils domain layer (see [`CLAUDE.md`](./CLAUDE.md))
- **i18next** / **react-i18next** — single `hu` locale, one flat translation namespace
- **Jest** + **React Testing Library** — unit and component tests
- **ESLint** (`eslint-config-react-app`, `@typescript-eslint`, `jsx-a11y`) + **Husky**/`lint-staged` pre-commit hook
- **Sass** available as a dependency, though plain `.css` is the project convention

## Prerequisites

- Node.js `>=20` (see `engines.node` in `package.json`)
- npm
- A running instance of the backend API (defaults to `localhost:8080`) if you want authenticated flows, menu data, etc. to work end-to-end

## Getting started

```bash
npm install
npm start
```

This runs the CRA dev server at `http://localhost:3000`. Requests to `/auth-status`, `/csrf-token`, `/login`, `/v1/*`, and `/actuator` are proxied to `http://localhost:8080` via the `proxy` field in `package.json` — point a locally running backend at that port, or requests to those paths will fail.

## Available scripts

```bash
npm start              # run dev server (react-scripts start)
npm run build           # production build
npm test                 # run tests in watch mode (Jest + React Testing Library)
npm run test:coverage     # single non-interactive run with coverage, enforces the coverage floor in package.json
npm run lint              # eslint src --ext .js,.ts,.jsx,.tsx
npm run lint:fix           # eslint --fix
```

- Run a single test file: `npm test -- src/test/model/customer/AddressModel.test.tsx`
- Run tests matching a name: `npm test -- -t "should throw required error"`
- For a single non-interactive test run: `CI=true npm test`
- There is no separate typecheck script; `npm run build` (or `tsc --noEmit`) surfaces type errors, since `tsconfig.json` sets `noEmit: true`.

## Project structure

```
src/
├── App.tsx                  route table + auth-status bootstrap
├── app/                       Redux store setup (store.ts) and typed hooks (hooks.ts)
├── main/
│   ├── pages/                   thin, route-level page components (one per route in App.tsx)
│   ├── components/
│   │   ├── page/                   page-specific sections (Menu, Checkout, UserProfile, ...)
│   │   ├── input/                   form inputs grouped by domain (customer/, myUser/)
│   │   ├── navigation-bar/, header/  global chrome
│   │   └── functional/               behavioral wrappers (AccountRouteGuard, Modal, LoadingOverlay, ...)
│   ├── features/footer/            plain footer component (not a Redux slice)
│   ├── model/, builder/, converter/, myDecorators/, utils/  domain model layer, mirrored file-for-file under src/test/
│   ├── context/                   React context providers (e.g. ModalMessageContext)
│   ├── supports/                   cross-cutting helpers: Persistence.tsx, fetch-utilities/ (CSRF token fetch)
│   ├── i18n/                       i18next config + hu locale JSON
│   └── css/                        shared styles (most components keep their own local css/ subfolder)
└── test/                     tests mirroring src/main/**, plus lighter component render/interaction smoke tests
```

See [`CLAUDE.md`](./CLAUDE.md) for a detailed explanation of the Model → Builder → Converter → Utils pattern that most domain concepts follow, and how i18n call patterns differ between components and module-level code.

## Testing

- **Model/builder/converter/utils tests** (`src/test/model`, `src/test/builder`, `src/test/converter`, `src/test/myDecorators`) exhaustively cover required/null/undefined validation cases and `equals()` behavior, using the shared `expectErrorMessages` helper.
- **Component tests** (`src/test/components`) are lighter render/interaction smoke tests — mocking `fetch` directly and asserting on rendered output and handler wiring — covering `AccountRouteGuard`, `Login`, `Register`, `Checkout`, `ShoppingCart`, `Modal`, `NavigationMenu`, `UsernameInput`, `EmailInput`, and the `UserProfile` feature area.
- `npm run test:coverage` enforces the `jest.coverageThreshold` floor in `package.json` — a regression gate, not an aspirational target.

## Linting

`.eslintrc.json` extends `eslint:recommended`, `plugin:react/recommended`, `plugin:jsx-a11y/recommended`, and `@typescript-eslint/recommended`, with 2-space indentation, single quotes, and no semicolons. `npm run lint` currently exits `0`; the 210 outstanding warnings are all `no-explicit-any` in `src/test/**`'s exhaustive validation tests (tracked but non-blocking). See [`CLAUDE.md`](./CLAUDE.md) for the a11y-specific conventions (e.g. handling click handlers on non-interactive elements).

## Docker

Build and serve the production build behind nginx:

```bash
docker compose up --build
```

This builds the app in a `node:20` stage (`Dockerfile`), then serves the static output via `nginx:stable-alpine` on `http://localhost:3000` (mapped to container port 80). `nginx.conf` serves `index.html` for client-side routing and reverse-proxies `/auth-status`, `/csrf-token`, `/login`, `/v1/*`, and `/actuator` to a backend service named `app`, which must be reachable from the container (see the `extra_hosts: app:host-gateway` entry in `docker-compose.yml`, which routes `app` to a backend running on the Docker host).

## CI/CD

`.github/workflows/ci.yml` runs on every push/PR to `main`: `npm ci` → `npm run lint` → `npx tsc --noEmit` → `npm run test:coverage` → `CI=true npm run build`. A pre-commit hook (`.husky/pre-commit`, via `lint-staged`) runs ESLint against staged files before they can be committed. `.github/dependabot.yml` runs weekly update checks against `npm`, `github-actions`, and `docker` ecosystem dependencies.
