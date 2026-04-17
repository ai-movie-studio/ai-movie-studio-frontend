# AI Movie Studio — Frontend

Next.js 16 + React 19 + TypeScript + Tailwind 4 + shadcn/ui

## Quick Start

```bash
cp .env.example .env.local   # set your backend URL
npm install
npm run dev                   # http://localhost:3000
```

Backend must be running on `http://localhost:8080`.

## Required Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api` | Backend API root |
| `NEXT_PUBLIC_GOOGLE_OAUTH_URL` | `http://localhost:8080/api/oauth2/authorization/google` | Google OAuth entry |

## Architecture

```
app/
├── config/             # env.ts — single env read location
├── lib/                # Shared infra (no UI)
│   ├── api-client.ts   # Axios + interceptors + token refresh
│   ├── api-error.ts    # Centralised error normaliser
│   ├── auth.ts         # Token storage (sessionStorage)
│   ├── endpoints.ts    # URL builder — no magic strings
│   ├── query-keys.ts   # React Query key factory
│   └── schemas.ts      # Zod validation schemas
├── hooks/              # Shared hooks
├── providers/          # React context providers
│   ├── auth-provider   # Login/register/logout context
│   └── query-provider  # React Query client
├── store/              # Zustand — UI-only state (no server data)
├── types/              # All TypeScript interfaces
├── features/           # Feature modules
│   ├── auth/           # Google icon, OAuth flow
│   ├── movies/api/     # React Query hooks for movies
│   ├── characters/     # API + components
│   ├── scenes/         # API + components (script, scenes, storyboard)
│   ├── generation/     # API + components (video, render)
│   └── pipeline/       # derive-step.ts — pure function
├── (auth)/             # Auth pages (login, register, callback)
├── (dashboard)/        # Protected pages (projects list, editor)
└── (public)/           # Landing page
components/
└── ui/                 # shadcn/ui primitives
```

## Design Decisions

### Server state in React Query, UI state in Zustand
Server data (movies, scenes, characters, jobs) lives exclusively in React Query.
Zustand only holds transient UI state: step override, editing scene ID, expanded scene, preview modal.

### Centralised query keys + endpoints
`lib/query-keys.ts` and `lib/endpoints.ts` are the single source of truth.
No feature module contains inline URL strings or key arrays.

### Schema-driven validation
Auth forms use `react-hook-form` + `zod`. Schemas live in `lib/schemas.ts`.

### Error normalisation
`lib/api-error.ts` converts any Axios error into `{ status, message, fieldErrors }`.
Components never parse `err.response.data` directly.

### Auth via HTTP-only cookies
Tokens are set by the backend as `HttpOnly; SameSite=Lax` cookies.
JavaScript **never** has access to tokens. The browser sends them
automatically with every request via `withCredentials: true`.
Only non-sensitive user info (name, email) is stored in localStorage for display.

### Derived pipeline step
`features/pipeline/derive-step.ts` computes the step from server state.
Manual override via Zustand is only for when users navigate freely.

## Pipeline Flow (storyboard-first)

```
Characters (free) → Script (free) → Scenes (free)
→ Storyboard (cheap — iterate here!) → Video (expensive — one shot)
→ Final Render → Download
```
