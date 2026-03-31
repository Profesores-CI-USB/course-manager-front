# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Run production build
```

There is no test runner configured. The package manager is **pnpm**.

## Environment

Copy `.env.example` to `.env.local` and set:
```
NEXT_PUBLIC_API_URL=http://localhost:8000   # Backend FastAPI URL
```

## Architecture: Hexagonal

The codebase follows a hexagonal (ports & adapters) architecture adapted for Next.js App Router.

```
src/
├── domain/                    # Core — no framework dependencies
│   ├── entities/              # TypeScript interfaces (auth.ts, academic.ts)
│   └── ports/                 # Repository contracts (auth.port.ts, academic.port.ts)
│
├── infrastructure/            # Adapters — implements ports
│   ├── http/api-client.ts     # Fetch wrapper (BASE_URL, auth header, error parsing)
│   └── repositories/         # One file per entity, implements the port interface
│
├── app/
│   ├── actions/               # Server Actions (application layer — calls repositories)
│   │   └── *.ts               # auth.ts, subject.ts, course.ts, etc.
│   ├── (auth)/                # Public routes: /login, /register, /forgot-password, /reset-password
│   └── (dashboard)/           # Protected routes (middleware + layout auth guard)
│
├── components/                # UI components
│   ├── ui/                    # Primitive components (Input, Label, Select, Badge, Dialog, Alert)
│   ├── nav/                   # SideNav (receives UserOut prop from server layout), TopNav
│   └── page-header.tsx        # Reusable page header with title + actions slot + ThemeToggle
│
├── lib/session.ts             # HttpOnly cookie helpers: getAccessToken, setSession, clearSession
├── middleware.ts              # Route protection: redirects unauthenticated to /login
└── config/site.tsx            # Navigation links array (navigations[])
```

### Dependency flow

```
app/actions  →  infrastructure/repositories  →  infrastructure/http/api-client  →  API
    ↕                     ↕
domain/ports          domain/entities
```

Pages (server components) may also call repositories directly for reads.

### Session management

Tokens are stored as **HttpOnly cookies** (`access_token`, `refresh_token`). Never accessible from client JS.

- `src/lib/session.ts` — `getAccessToken()`, `setSession()`, `clearSession()` (all async, Next.js 15)
- `src/middleware.ts` — reads `access_token` cookie; redirects unauthenticated users to `/login` and authenticated users away from auth routes
- Dashboard layout (`src/app/(dashboard)/layout.tsx`) — server component that also verifies token and fetches `UserOut` to pass as prop to SideNav

### Adding a new entity

1. Add interfaces to `src/domain/entities/academic.ts`
2. Add port interface to `src/domain/ports/academic.port.ts`
3. Create `src/infrastructure/repositories/<entity>.repository.ts`
4. Create `src/app/actions/<entity>.ts` (server actions with `revalidatePath`)
5. Create `src/app/(dashboard)/<entity>/page.tsx` (server component, fetches data)
6. Create `src/app/(dashboard)/<entity>/client.tsx` (client component, table + Dialog CRUD)
7. Add navigation entry to `src/config/site.tsx`

### CRUD page pattern

Every CRUD page follows the same structure:
- **`page.tsx`** — async server component, calls repository with token, passes data to client
- **`client.tsx`** — `"use client"`, single controlled `<Dialog>` for create/edit, `router.refresh()` after mutations, `useTransition` for pending state

### Routing & Layouts

- Root layout (`src/app/layout.tsx`): just providers + font, no sidebar
- `(auth)` layout: centered card, no sidebar
- `(dashboard)` layout (server): fetches user, renders `SideNav` + content; redirects to `/login` if unauthenticated
- Ticket page moved to `src/app/(dashboard)/ticket/`

### Charts

Charts live in `src/components/chart-blocks/charts/`, each in its own directory. They use **VChart** (`@visactor/react-vchart`). Chart theme is in `src/config/chart-theme.ts` via `ChartThemeProvider`.

### Path Aliases

`@/*` maps to `src/*`.

### Styling Conventions

- Tailwind CSS; custom breakpoints: `phone` (370px), `tablet` (750px), `laptop` (1000px), `desktop` (1200px)
- Dark mode is class-based; toggle via `ThemeToggle`
- Merge classes with `cn()` from `src/lib/utils.ts`
- Shadcn UI components in `src/components/ui/`; Dialog uses `@radix-ui/react-dialog`

### Linting & Formatting

- ESLint: no `console.log`, prefer type-only imports, no unused variables
- Prettier: sorts imports (`@trivago/prettier-plugin-sort-imports`) and Tailwind classes

## Documentation

Frontend documentation lives in `docs/frontend/` and **must be kept up to date** when views are added or modified.

| File | Contents |
|---|---|
| `docs/frontend/index.md` | Route index and tech stack overview |
| `docs/frontend/dashboard.md` | Dashboard stats page: charts, data flow, API fields |
| `docs/frontend/crud-views.md` | CRUD pattern shared by all academic entity pages |
| `docs/frontend/auth-views.md` | Login, register, password reset views |

Backend API documentation (`docs/backend/`) is maintained manually by the backend project and should **not** be edited here.
