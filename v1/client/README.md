# React + Vite Production Scaffold

A reusable, production-ready React starter built with Vite. Clone it, rename the app, and start building features — all the boring setup is already done.

---

## What's inside

- Absolute imports, code splitting, and lazy loading out of the box
- Auth-ready React Context with protected routes and role-based access
- Centralized Axios instance with request/response interceptors
- React Query wired up with a shared query client
- ESLint + Prettier enforced on every commit via Husky
- MSW for API mocking in development and tests
- CSS custom properties for theming (no CSS-in-JS overhead)

---

## Tech stack

| Package                                                                                          | Purpose                                                                  |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [Vite](https://vitejs.dev)                                                                       | Build tool. Near-instant HMR in dev, Rollup-based production builds      |
| [React 18](https://react.dev)                                                                    | UI library                                                               |
| [React Router v6](https://reactrouter.com)                                                       | Client-side routing with nested routes and layouts                       |
| [@tanstack/react-query](https://tanstack.com/query)                                              | Server state — fetching, caching, background sync, pagination            |
| [Axios](https://axios-http.com)                                                                  | HTTP client. One shared instance with auth interceptors                  |
| [react-hook-form](https://react-hook-form.com)                                                   | Performant forms — minimal re-renders, easy validation wiring            |
| [Zod](https://zod.dev)                                                                           | Schema validation. Pairs with react-hook-form via `@hookform/resolvers`  |
| [Zustand](https://zustand-demo.pmnd.rs)                                                          | Lightweight global state for cases where Context isn't enough            |
| [MSW](https://mswjs.io)                                                                          | Mock Service Worker — intercepts real network requests for dev and tests |
| [Vitest](https://vitest.dev)                                                                     | Unit and integration testing, same config as Vite                        |
| [React Testing Library](https://testing-library.com/react)                                       | Component testing focused on user behavior                               |
| [ESLint](https://eslint.org)                                                                     | Linting with react, react-hooks, and import-order rules                  |
| [Prettier](https://prettier.io)                                                                  | Code formatting, runs separately from ESLint                             |
| [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/okonet/lint-staged) | Runs lint + format on staged files before every commit                   |

---

## Folder structure

```
src/
├── api/                    # All network communication
│   ├── axiosInstance.js    # Shared Axios instance — base URL, auth headers, 401 handling
│   ├── authApi.js          # Login, logout, refresh token calls
│   ├── usersApi.js         # One file per resource
│   └── queryClient.js      # React Query client with global config
│
├── assets/                 # Static files (images, fonts, icons)
│
├── components/             # Shared UI — no business logic, no API calls
│   ├── ui/                 # Atoms: Button, Input, Modal, Select
│   ├── feedback/           # Toast, Spinner, ErrorBoundary, EmptyState
│   ├── forms/              # FormField, FormGroup — wrappers around react-hook-form
│   └── data-display/       # Table, Badge, Pagination, Stat
│
├── context/                # Global state via React Context
│   ├── AuthContext.jsx     # Authenticated user, token, login/logout helpers
│   ├── ThemeContext.jsx    # Light/dark mode
│   └── ToastContext.jsx    # App-wide notification queue
│
├── hooks/                  # Reusable hooks — generic, no page knowledge
│   ├── useAuth.js          # Consumes AuthContext with null-guard
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── usePermission.js    # RBAC check logic
│   └── useMediaQuery.js
│
├── layouts/                # Page shells — nav, sidebar, footer
│   ├── MainLayout.jsx      # Default app shell (post-login)
│   ├── AuthLayout.jsx      # Login / register shell
│   ├── DashboardLayout.jsx # Dashboard-specific chrome
│   └── BlankLayout.jsx     # 404, error pages
│
├── pages/                  # One folder per route — self-contained
│   ├── Dashboard/
│   │   ├── index.jsx
│   │   ├── hooks/          # Page-specific data fetching hooks
│   │   └── components/     # Components only used by this page
│   ├── Users/
│   ├── Settings/
│   └── Auth/               # Login, Register, ForgotPassword
│
├── router/
│   ├── index.jsx           # createBrowserRouter — full route tree
│   ├── ProtectedRoute.jsx  # Auth + role guard using Outlet
│   ├── routes.js           # Path constants (no raw strings in Link/navigate)
│   └── lazyRoutes.jsx      # React.lazy wrappers for every page
│
├── constants/
│   ├── apiEndpoints.js     # URL path segments
│   ├── permissions.js      # Role → feature mapping
│   ├── queryKeys.js        # React Query key factory (avoids typos)
│   └── appConfig.js        # All import.meta.env values in one place
│
├── utils/                  # Pure functions — no React imports
│   ├── formatters.js       # Date, currency, text formatting
│   ├── validators.js       # Reusable validation rules
│   ├── errorHandler.js     # Normalizes Axios errors → { message, code }
│   └── storageUtils.js     # localStorage helpers
│
├── styles/
│   ├── tokens.css          # CSS custom properties — colors, spacing, type scale
│   ├── globals.css         # Reset + base typography
│   └── mixins.css          # Reusable CSS patterns
│
├── mocks/                  # MSW — API mocking for dev and tests
│   ├── handlers.js         # Mock route definitions
│   ├── server.js           # MSW service worker setup
│   └── factories/          # Test data builders
│
├── setupTests.js           # Vitest + RTL global setup
├── App.jsx
└── main.jsx                # Root — QueryClientProvider, context providers, router
```

---

## Getting started

```bash
# 1. Clone and install
git clone <repo-url>
cd <project>
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start dev server
npm run dev
```

---

## Scripts

```bash
npm run dev        # Start dev server with HMR
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint across src/
npm run lint:fix   # Auto-fix lint issues
npm run format     # Run Prettier across src/
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once (CI)
```

---

## Environment variables

Copy `.env.example` to `.env` and fill in your values. All variables must be prefixed with `VITE_` to be accessible in the app.

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=MyApp
```

All env values are read through `src/constants/appConfig.js` — never access `import.meta.env` directly in components.

---

## How to reuse this for a new project

1. Clone the repo
2. Update `VITE_APP_NAME` in `.env`
3. Replace `authApi.js` with your real auth endpoints
4. Add your resource API files under `src/api/`
5. Add pages under `src/pages/` and register them in `src/router/index.jsx`
6. Update `src/constants/permissions.js` with your role definitions
