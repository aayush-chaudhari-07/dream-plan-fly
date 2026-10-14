# 🏛️ SmartTrip Architecture Specification

> **Architectural Standard**: Clean 3-Tier Separation of Concerns with Compile-Time and Runtime Boundary Enforcement.

---

## 1. Architectural Philosophy

SmartTrip employs an isomorphic React full-stack architecture powered by **TanStack Start**, **TanStack Router**, and **Nitro SSR**. To eliminate security vulnerabilities, prevent server secrets from leaking into client browser bundles, and maintain deterministic modularity, the codebase is partitioned into three strictly decoupled domains:

```
┌─────────────────────────────────────────────────────────────┐
│                        src/routes/                          │
│        (Thin file-based routes, loaders, SEO metadata)      │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│         src/client/          │ │        src/server/         │
│  - components/ & ui/         │ │  - functions/ (RPCs)       │
│  - features/ (domain slices) │ │  - services/ (LLM, APIs)   │
│  - hooks/ & client lib       │ │  - db/ & config/ (Secrets) │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        src/shared/                          │
│   (Universal Pure Models: types/, constants/, utils/)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout & Layer Responsibilities

### `src/routes/` — Thin Presentation & Routing

- **Responsibility**: TanStack Router file-based route definitions (`__root.tsx`, `index.tsx`, `ai-planner.tsx`, `bookings.tsx`, etc.).
- **Rules**:
  - Keep routes thin and declarative.
  - Perform route-level SEO and Schema.org JSON-LD generation (`createSeoHead`).
  - Wire client feature components to data loaders and server action triggers.

### `src/client/` — Client-Only Browser Code

- **Responsibility**: Interactive React components, client state management, browser hooks, and UI primitives.
- **Subdirectories**:
  - `components/`: Generic layout elements (`Navbar`, `Footer`, `Hero`, `PageHeader`, `Reveal`) and Radix UI primitives (`components/ui/`).
  - `features/`: Modular domain slices (`planner/`, `bookings/`, `trips/`, `map/`, `destinations/`, `fund/`, `wishlist/`, `search/`, `reviews/`, `support/`).
  - `hooks/`: Browser React hooks (`use-mobile.tsx`).
  - `lib/`: Browser utilities, reactive client store (`smarttrip-store.ts`), Supabase auth context (`auth-context.tsx`), and client env validator (`client-env.ts`).
- **Boundaries**:
  - **CANNOT** import from `src/server/services/**`, `src/server/db/**`, or `src/server/config/**`.
  - May **ONLY** import typed RPC wrappers from `src/server/functions/*`.
  - May **NEVER** reference server-only environment variables or Node built-in APIs (`node:crypto`, `node:fs`, etc.).

### `src/server/` — Server Runtime & Backend Services

- **Responsibility**: Database connectivity, third-party API interactions, cryptographic signing, rate limiting, and scheduled cron jobs.
- **Subdirectories**:
  - `functions/`: TanStack Start `createServerFn` RPC endpoints (`planner-actions.ts`, `booking-actions.ts`, `live-data-actions.ts`, `trip-actions.ts`). These compile to lightweight HTTP client calls on the client side while executing purely on the server.
  - `services/`: Core backend engines (`gemini-planner.ts`, `weather.ts`, `currency.ts`, `rate-limiter.ts`, `rate-limit-guard.ts`, `price-fluctuations.ts`, `payments/demo-provider.ts`, `payments/razorpay-provider.ts`).
  - `db/`: Server-side Supabase client (`supabase-server.ts`) with session cookie extraction.
  - `config/`: Validated server environment (`env.server.ts`).
- **Boundaries**:
  - Contains all server secrets (`GEMINI_API_KEY`, `DEMO_PAY_SECRET`, `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`).
  - Is isolated from client bundling by TanStack Start server function tree-shaking.

### `src/shared/` — Universal Pure Contracts

- **Responsibility**: Environment-agnostic data models, constants, and pure algorithms.
- **Subdirectories**:
  - `types/`: Domain models (`travel.ts`, `trip-plan.ts`, `weather.ts`).
  - `constants/`: Static reference datasets (`airports.ts`, `inventory-data.ts`, `flight-generator.ts`).
  - `utils/`: Pure utilities (`card-validator.ts`).
- **Boundaries**:
  - **100% PURE**: Zero imports from `src/client/**` or `src/server/**`.
  - Zero references to `process.env` or `import.meta.env`.

---

## 3. Boundary Enforcement Mechanisms

| Layer               | Mechanism                 | Tool                                                        | Rule / Description                                                                                                                                                       |
| :------------------ | :------------------------ | :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lint Time**       | Static Import Restriction | ESLint (`eslint.config.js`)                                 | Prohibits `src/client/**` from importing `@/server/services`, `@/server/db`, `@/server/config`. Prohibits `src/shared/**` from importing `@/client/**` or `@/server/**`. |
| **Pre-Commit / CI** | Source Code Boundary Scan | `scripts/check-boundaries.mjs` (`npm run check:boundaries`) | Inspects all imports and tokens in `src/client/` and `src/shared/`. Asserts zero server secret references and zero public prefix pollution (`VITE_GEMINI`, etc.).        |
| **Post-Build**      | Client Bundle Secret Scan | `scripts/scan-client-secrets.mjs` (`npm run scan-secrets`)  | Scans all generated assets in `.output/public/` to confirm zero secret tokens or service keys leaked into production JS bundles.                                         |

---

## 4. Path Change Mapping (Historical Reference)

| Old Path                                 | New Path                                    | Reason                                    |
| :--------------------------------------- | :------------------------------------------ | :---------------------------------------- |
| `src/components/smarttrip/AiPlanner.tsx` | `src/client/features/planner/AiPlanner.tsx` | Feature slice modularity                  |
| `src/components/smarttrip/booking/*`     | `src/client/features/bookings/*`            | Feature slice modularity                  |
| `src/components/smarttrip/map/*`         | `src/client/features/map/*`                 | Feature slice modularity                  |
| `src/components/smarttrip/Hero.tsx`      | `src/client/components/Hero.tsx`            | Brand component layout                    |
| `src/components/ui/*`                    | `src/client/components/ui/*`                | UI primitives categorization              |
| `src/lib/server/trip-actions.ts`         | `src/server/functions/trip-actions.ts`      | Dedicated server function RPC namespace   |
| `src/lib/server/booking-actions.ts`      | `src/server/functions/booking-actions.ts`   | Dedicated server function RPC namespace   |
| `src/lib/server/live-data-actions.ts`    | `src/server/functions/live-data-actions.ts` | Dedicated server function RPC namespace   |
| `src/server/generate-plan.ts`            | `src/server/services/gemini-planner.ts`     | Backend service categorization            |
| `src/server/weather.ts`                  | `src/server/services/weather.ts`            | Backend service categorization            |
| `src/server/currency.ts`                 | `src/server/services/currency.ts`           | Backend service categorization            |
| `src/server/price-fluctuations.ts`       | `src/server/services/price-fluctuations.ts` | Backend service categorization            |
| `src/server/payments/*`                  | `src/server/services/payments/*`            | Backend service categorization            |
| `src/lib/supabase/server.ts`             | `src/server/db/supabase-server.ts`          | Server database categorization            |
| `src/data/airports.ts`                   | `src/shared/constants/airports.ts`          | Pure shared constant                      |
| `src/data/inventory-data.ts`             | `src/shared/constants/inventory-data.ts`    | Pure shared constant                      |
| `src/data/flight-generator.ts`           | `src/shared/constants/flight-generator.ts`  | Pure shared algorithm                     |
| `src/server/payments/card-validator.ts`  | `src/shared/utils/card-validator.ts`        | Pure shared Luhn validator (no Node APIs) |
