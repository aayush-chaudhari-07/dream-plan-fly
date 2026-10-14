# PROJECT CONTEXT: SmartTrip (dream-plan-fly)

> Comprehensive architectural, structural, and technical documentation of the codebase for AI assistants, engineers, and developers.

---

## 1. PROJECT OVERVIEW

### 1.1 Project Identity & Purpose

- **Project Name**: SmartTrip (Repository: `dream-plan-fly`, Package name: `smarttrip`)
- **Live Deployment**: `https://dream-plan-fly.vercel.app` (or custom domain)
- **Platform**: Fullstack TanStack Start SSR web application (Nitro server engine)
- **Tagline**: _"Plan Less. Travel More."_ / _"Travel smarter. Explore more."_
- **Core Concept**: `Dream → Ask AI → Plan → Save → Book → Travel`
- **Problem Solved**: Traditional travel planning is fragmented and expensive. Travelers juggle multiple tabs for inspiration, itinerary builders, price comparisons, savings calculators, and booking platforms, often trapped by paid API keys and trial subscriptions. SmartTrip unifies destination discovery, Google Gemini AI trip planning with quota protection, future trip savings tracking, and an end-to-end simulated booking experience with zero-cost demo payment gateways on **100% permanent free tiers**.

### 1.2 Target Users

- Leisure travelers seeking curated destination inspiration and automated AI itineraries.
- Budget-conscious travelers and families coordinating multi-day itineraries, group sizes, and cost ceilings.
- Future trip dreamers creating dedicated savings funds with monthly targets (e.g., Japan 2027, Kashmir Winter).
- Travelers exploring Indian and international routes across Hill Stations, Beaches, Heritage, and Adventure spots.

### 1.3 Main Features

1. **Interactive Hero & Search**: Destination search form (Destination, Dates, Travelers, Budget) styled over an animated sky canvas (clouds, birds, aircraft).
2. **Quick Booking Panel**: Multi-tab search for Flights, Hotels/Stays, Car/Bike Rentals, Train/Bus, and Curated Packages.
3. **Airport Autocomplete**: Instant search backed by the offline OpenFlights dataset (zero external API calls).
4. **Programmatic Flight Schedules**: Deterministic schedule and fare generator producing 6–10 realistic flight options per route with live-looking demo price fluctuations.
5. **Explore Destinations**: Categorized catalog (7 categories, 9 core destinations) with INR pricing, ratings, blurbs, and instant wishlist toggling.
6. **AI Trip Planner**: Powered by **Google Gemini 2.5 Flash** with an offline heuristic fallback (`buildPlan`). Features server-side query caching, user/guest daily quota limits, circuit breaker, drag-and-drop itinerary reordering, activity add/edit/delete, and PDF export.
7. **Interactive Leaflet & OpenStreetMap**: Fullscreen/card interactive map featuring 54 points of interest across destinations, category filters, browser geolocation distance sorting, and strict OSM attribution compliance.
8. **Real-Time Weather & Currency**: Current weather and 7-day forecast via Open-Meteo API (cached 30m); real-time currency conversion (INR, USD, EUR, GBP) via Frankfurter ECB reference rates (cached 24h).
9. **Trip Savings Fund**: Dedicated savings goals with animated progress bars, monthly savings calculators, quick contributions (+₹500, +₹1,000, +₹2,500), and canvas confetti celebrations upon completion.
10. **Zero-Cost Demo Checkout & E-Ticket**: Complete booking experience with idempotency protection, mock payment gateway (Card, UPI, NetBanking with real Luhn safety guards), and printable E-tickets with dynamic QR codes.
11. **My Trips Dashboard**: Central traveler hub managing active bookings, trip buckets (Upcoming, Past, Saved), savings funds, and wishlisted places with cancellation and demo reset actions.
12. **Supabase Cloud Sync & Keep-Alive**: Multi-user cloud persistence with Row Level Security and indexed foreign keys, paired with an automated GitHub Actions keep-alive workflow that pings `/api/keep-alive` twice weekly to prevent 7-day inactivity pause.

### 1.4 Current Status

- **Current Status**: **Production-Ready (100% Free Tier Architecture)**
- **Working**: All UI pages, SSR rendering, responsive layouts, Gemini AI integration, offline fallbacks, Supabase auth/sync, Leaflet map, booking lifecycle, checkout flow, price alerts, weather, currency, unit tests (80 tests), and E2E tests (9 tests) are fully passing and verified.
- **Demo Guarding**: All booking inventory and payment transactions are strictly simulated demo operations, prominently labeled with "Demo pricing", "Demo Safe Gateway", and test card numbers. Real payment numbers and credit cards are strictly refused.

---

## 2. TECH STACK

### 2.1 Languages, Frameworks & Libraries

#### Core & Runtime

- **Language**: TypeScript (`^5.8.3`), Node.js (v20+ / v22+ / v24+)
- **UI Framework**: React 19 (`react: ^19.2.0`, `react-dom: ^19.2.0`)
- **SSR & Fullstack Framework**: TanStack Start (`@tanstack/react-start: 1.168.32`)
- **Router**: TanStack Router (`@tanstack/react-router: 1.170.18`, `@tanstack/router-plugin: 1.168.23`)
- **Async State Management**: TanStack Query (`@tanstack/react-query: ^5.101.1`)

#### Build Tools & Server Engine

- **Bundler**: Vite (`vite: 8.1.5`, `@vitejs/plugin-react: ^5.2.0`)
- **Server Engine**: Nitro (`nitro: 3.0.260603-beta`) outputting standalone `.output/server/index.mjs`
- **Path Resolution**: `vite-tsconfig-paths: ^6.0.2`
- **Engine Overrides**: `rolldown: 1.2.1`

#### Styling & Design System

- **CSS Engine**: Tailwind CSS v4 (`tailwindcss: ^4.2.1`, `@tailwindcss/vite: ^4.2.1`)
- **Animations**: `tw-animate-css: ^1.3.4` + custom CSS keyframe animations
- **Class Utilities**: `clsx: ^2.1.1`, `tailwind-merge: ^3.5.0`, `class-variance-authority: ^0.7.1`
- **Color System**: Semantic OKLCH tokens with full Dark/Light theme switching
- **Typography**: Sora (display headings) & Manrope (body sans) via Google Fonts CDN

#### UI Components & Interactive Libraries

- **UI Primitives**: Radix UI (dialog, dropdown, popover, sheet, tabs, accordion, avatar, select, slider, tooltip)
- **Drag & Drop**: `@dnd-kit/core: ^6.3.1`, `@dnd-kit/sortable: ^10.0.0`, `@dnd-kit/utilities: ^3.2.2`
- **Mapping**: `leaflet: ^1.9.4`, `react-leaflet: ^5.0.0`, `@types/leaflet: ^1.9.22`
- **Command Palette**: `cmdk: ^1.1.1`
- **QR Codes**: `qrcode: ^1.5.4`, `@types/qrcode: ^1.5.6`
- **Confetti**: `canvas-confetti: ^1.9.4`, `@types/canvas-confetti: ^1.9.0`
- **Icons**: `lucide-react: ^0.575.0`
- **Toasts**: `sonner: ^2.0.7`
- **Validation**: `zod: ^3.24.2`, `react-hook-form: ^7.71.2`, `@hookform/resolvers: ^5.2.2`

#### Testing & Quality Assurance

- **Unit Testing**: Vitest (`vitest: ^5.0.4`, `@testing-library/react: ^16.3.3`, `jsdom: ^30.1.2`) — 8 test suites, 80 tests passing.
- **End-to-End Testing**: Playwright (`@playwright/test: ^1.64.0`, `@axe-core/playwright: ^4.13.0`) — 9 tests passing.
- **Linting & Formatting**: ESLint 9 (`eslint: ^9.32.0`, `typescript-eslint: ^8.56.1`), Prettier 3 (`prettier: ^3.7.3`).
- **Security Scanner**: Client bundle secret scanner (`scripts/scan-client-secrets.mjs`) verifying 0 secrets leaked across all client chunks.

### 2.2 Database, APIs & External Services

| Service / API           | Free Tier Terms                              | Purpose                                  | SmartTrip Integration                                                                             |
| ----------------------- | -------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Google Gemini Flash** | 15 RPM, 1M TPM, 1,500 RPD (Zero credit card) | AI Itinerary Generation                  | `@google/genai` via server function with in-memory caching, per-user limits, and offline fallback |
| **Supabase**            | 500 MB DB, 50k MAU (Zero credit card)        | Auth, Profiles, Bookings, Funds          | `@supabase/ssr` with RLS, indexed foreign keys, and `/api/keep-alive` cron                        |
| **Open-Meteo**          | 10,000 calls/day without API key             | Live weather & 7-day forecasts           | Cached 30 minutes in server memory with seasonal fallback                                         |
| **Frankfurter**         | Unlimited open ECB rates without API key     | Currency conversion (INR, USD, EUR, GBP) | Cached 24 hours in server memory with static fallback rates                                       |
| **OpenFlights**         | Open Data (ODbL)                             | Airport Autocomplete                     | Embedded offline JSON (`src/data/airports.json`), 0 external requests                             |
| **OpenStreetMap**       | Open Data (ODbL)                             | Interactive Map Tiles                    | Lazy-loaded client-only Leaflet with strict attribution & aggressive tile caching                 |

### 2.3 Installation & Run Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (copy example)
cp .env.example .env
# Edit .env with your free keys:
# GEMINI_API_KEY=[REDACTED_API_KEY]
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=[REDACTED_ANON_KEY]

# 3. Start local development server
npm run dev

# 4. Run linting & type checks
npm run lint
npm run typecheck

# 5. Run Vitest unit test suite (80 tests)
npm test

# 6. Run Playwright end-to-end tests (9 tests)
npm run test:e2e

# 7. Build production bundle & scan client chunks for secrets
npm run build
npm run scan-secrets

# 8. Run production server locally
npm run preview
```

---

## 3. FOLDER STRUCTURE

```
dream-plan-fly/
├── .agent/                         # Antigravity GSD workflow specifications
├── .agents/                        # Specialized agent definitions & skills
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI pipeline (lint, typecheck, vitest, build, secret-scan)
│       ├── daily-price-alerts.yml  # Daily price fluctuation trigger (runs at 04:00 UTC)
│       └── keep-alive.yml          # Supabase keep-alive cron (Mon & Thu 06:00 UTC)
├── docs/
│   └── FREE_STACK.md               # 100% Free Stack Architecture & Quota Protection Guide
├── Documents/
│   ├── PRD.md                      # Product Requirements Document
│   └── PROJECT_RULES.md            # Architectural rules & design specifications
├── e2e/                            # Playwright end-to-end test suites
│   ├── accessibility.spec.ts       # WCAG accessibility scans with axe-core
│   ├── fund-and-wishlist.spec.ts   # Trip fund deposits & wishlist drawer flows
│   ├── plan-and-save.spec.ts       # AI itinerary generation & save to trips flow
│   ├── search-and-book.spec.ts     # Destination search, demo booking & E-ticket verification
│   └── signup.spec.ts              # Authentication & form validation flows
├── scripts/
│   └── scan-client-secrets.mjs     # Production client bundle secret leak scanner
├── src/
│   ├── assets/                     # High-resolution static photography
│   ├── components/
│   │   ├── smarttrip/              # Core application business components
│   │   │   ├── booking/            # Booking dialogs, comboboxes, payments & E-tickets
│   │   │   │   ├── AirportCombobox.tsx
│   │   │   │   ├── DemoPaymentModal.tsx
│   │   │   │   └── ETicketView.tsx
│   │   │   ├── map/                # Client-only Leaflet map wrapper
│   │   │   │   └── LeafletMapClient.tsx
│   │   │   ├── AiPlanner.tsx       # AI prompt box, quick pills & itinerary display
│   │   │   ├── EscapeHills.tsx     # Scenic showcase with live Open-Meteo weather
│   │   │   ├── ExploreDestinations.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── InteractiveMap.tsx  # Interactive Leaflet map with 54 points of interest
│   │   │   ├── ItineraryEditor.tsx # Drag-and-drop itinerary editor powered by @dnd-kit
│   │   │   ├── Navbar.tsx          # Responsive navigation, search, wishlist & auth profile
│   │   │   ├── NotificationsPopover.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── QuickBooking.tsx
│   │   │   ├── QuickTravelGuide.tsx
│   │   │   ├── Reveal.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── SearchCommandDialog.tsx
│   │   │   ├── SupportDock.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── TravelSafe.tsx
│   │   │   ├── TripFund.tsx
│   │   │   ├── WeatherForecastCard.tsx
│   │   │   └── WishlistSheet.tsx
│   │   └── ui/                     # Accessible Shadcn UI component primitives
│   ├── data/
│   │   ├── airports.json           # Filtered OpenFlights global airports dataset
│   │   ├── airports.ts             # OpenFlights loader & autocomplete search index
│   │   ├── flight-generator.ts     # Deterministic daily flight schedule & fare engine
│   │   ├── inventory-data.ts       # Indian stays, car rentals, bus/train transit & packages
│   │   └── travel.ts               # Seed catalog, destinations, hill stations & 54 map places
│   ├── lib/
│   │   ├── server/                 # TanStack Start server functions (auth, bookings, trips, live data)
│   │   │   ├── booking-actions.ts
│   │   │   ├── live-data-actions.ts
│   │   │   └── trip-actions.ts
│   │   ├── supabase/               # Supabase SSR & client instances
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── auth-context.tsx        # React authentication provider with Supabase sync
│   │   ├── error-report.ts         # Centralized error reporting & Supabase error_logs logging
│   │   ├── seo.ts                  # Comprehensive SEO metadata, OG, Twitter & JSON-LD generator
│   │   ├── smarttrip-store.ts      # Reactive external store with localStorage persistence
│   │   └── trip-plan.ts            # Heuristic offline itinerary & budget estimation engine
│   ├── routes/                     # TanStack Start file-based routes
│   │   ├── __root.tsx              # Root HTML shell, SEO head, error boundary, Sonner toaster
│   │   ├── index.tsx               # Route `/` — Landing page
│   │   ├── ai-planner.tsx          # Route `/ai-planner`
│   │   ├── bookings.tsx            # Route `/bookings`
│   │   ├── checkout.tsx            # Route `/checkout`
│   │   ├── booking-confirmation/$id.tsx # Route `/booking-confirmation/$id`
│   │   ├── destination/$id.tsx     # Route `/destination/$id`
│   │   ├── explore.tsx             # Route `/explore`
│   │   ├── faq.tsx                 # Route `/faq`
│   │   ├── login.tsx               # Route `/login`
│   │   ├── my-trips.tsx            # Route `/my-trips`
│   │   ├── plan/$id.tsx            # Route `/plan/$id`
│   │   ├── privacy.tsx             # Route `/privacy`
│   │   ├── save.tsx                # Route `/save`
│   │   ├── settings.tsx            # Route `/settings`
│   │   ├── signup.tsx              # Route `/signup`
│   │   └── terms.tsx               # Route `/terms`
│   ├── server/                     # Server-side business logic & background adapters
│   │   ├── payments/               # Payment providers & Luhn card safety validator
│   │   ├── currency.ts             # Frankfurter currency exchange with daily cache
│   │   ├── generate-plan.ts        # Google Gemini Flash API with schema validation & caching
│   │   ├── price-fluctuations.ts   # Deterministic price fluctuation job & alert notifier
│   │   ├── rate-limit-guard.ts     # In-memory IP rate limiter for server functions
│   │   ├── rate-limiter.ts         # Gemini quota tracker, daily ceiling & circuit breaker
│   │   └── weather.ts              # Open-Meteo weather client with 30-minute cache
│   ├── server.ts                   # Nitro/SSR entrypoint with keep-alive, sitemap & robots.txt
│   ├── start.ts                    # TanStack Start bootstrap with CSRF & error middlewares
│   └── styles.css                  # Tailwind CSS v4 design tokens & keyframes
├── supabase/
│   ├── migrations/                 # PostgreSQL schema, RLS policies & B-tree indexes
│   └── seed.sql                    # Initial seed data for inventory and destinations
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 4. ARCHITECTURE AND FLOW

### 4.1 System Architecture

```
[ Browser Client ]
       │
       ▼
[ HTTP Request to Nitro / Vite Server ]
       │
       ├──> [ src/server.ts ] (Server Entrypoint)
       │         │
       │         ├──> /api/keep-alive (Resets Supabase 7-day inactivity pause)
       │         ├──> /api/cron/price-alerts (GitHub Actions secret-protected daily job)
       │         ├──> /sitemap.xml & /robots.txt (Dynamic SEO endpoints)
       │         └──> Delegates to @tanstack/react-start/server-entry
       │
       ▼
[ src/start.ts ] (TanStack Start Middlewares)
       │
       ├──> errorMiddleware (Server function exception capture)
       └──> csrfMiddleware (CSRF token verification on POST server functions)
       │
       ▼
[ src/router.tsx & src/routeTree.gen.ts ] (Route Resolution)
       │
       ▼
[ src/routes/__root.tsx ] (App Shell)
       │
       ├──> Head metadata & Open Graph / Twitter Tags
       ├──> QueryClientProvider (TanStack Query)
       ├──> AuthProvider (Supabase Auth Context)
       ├──> Sonner Toaster (Global Toast Container)
       └──> <Outlet /> (Renders Child Route)
```

### 4.2 State Architecture & Client Persistence

1. **Dual-Layer Persistence**:
   - **Local Tier**: Unauthenticated guests use an external reactive store (`smarttrip-store.ts`) synchronized to `localStorage` (`smarttrip.state.v1`), allowing full app functionality without an account or network dependency.
   - **Cloud Tier**: Authenticated users automatically synchronize bookings, saved trips, and future funds with Supabase PostgreSQL tables (`user_trips`, `user_bookings`, `trip_funds`, `user_profiles`).
2. **Deterministic Offline Fallbacks**:
   - If Supabase environment variables are omitted or invalid, the app falls back to safe local mock connections without throwing fatal errors.
   - If Google Gemini returns an HTTP 429 or reaches daily rate ceilings, itineraries are generated seamlessly via `buildPlan()`.

---

## 5. KEY FILES IN DETAIL

### 5.1 `src/server.ts`

- **Purpose**: Nitro SSR entrypoint handling security headers, SEO sitemaps, robots.txt, keep-alive pings, and price alerts.
- **Security Headers**: Injects `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Special Endpoints**:
  - `/api/keep-alive`: Executes a lightweight query against Supabase to reset the 7-day inactivity pause timer.
  - `/api/cron/price-alerts`: Authenticated via `x-cron-secret` header to simulate daily fare fluctuations and notify users with active price watches.
  - `/sitemap.xml`: Dynamically generated XML sitemap listing all static routes and destinations with change frequencies and priorities.

### 5.2 `src/server/generate-plan.ts` & `src/server/rate-limiter.ts`

- **Purpose**: Google Gemini 2.5 Flash itinerary generation with free-tier quota protection.
- **Protections**:
  - **In-Memory Cache**: Deterministic hash of prompt, destination, budget, days, and travelers. Exact queries are returned immediately with 0 API tokens consumed.
  - **Daily Limits**: 15 plans/day for signed-in users, 5/day for guests.
  - **Global Ceiling**: Halts external API calls after 1,000 calls/day (500-request safety cushion below Google's 1,500 daily limit).
  - **Circuit Breaker**: On HTTP 429 from Google, trips a 60-second backoff and seamlessly delivers an offline plan from `buildPlan()`.

### 5.3 `src/lib/server/live-data-actions.ts`

- **Purpose**: Free keyless live data integrations for weather and currency.
- **Open-Meteo Weather**: Fetches real-time temperature, weather codes, and 7-day daily forecasts for destination coordinates; cached 30 minutes in server memory.
- **Frankfurter Currency**: Fetches daily ECB reference exchange rates for INR against USD, EUR, and GBP; cached 24 hours in server memory.

### 5.4 `src/data/flight-generator.ts`

- **Purpose**: Generates realistic flight schedules between any origin and destination airport pair.
- **Features**: Deterministic pseudo-random seed based on route and date, producing 6 to 10 plausible airline options (IndiGo, Air India, Vistara, SpiceJet, Akasa Air) with realistic flight numbers, departure/arrival times, durations, stop counts, and class fares.

### 5.5 `src/components/smarttrip/booking/DemoPaymentModal.tsx`

- **Purpose**: Simulated zero-cost payment gateway supporting Card, UPI, and NetBanking.
- **Safety**: Uses `validateDemoCardSafety()` to reject real credit cards (via Luhn algorithm checks) and only permits explicitly declared test card numbers (e.g., `4111 1111 1111 1111`).

---

## 6. DATA MODELS AND API

### 6.1 Core Data Models

#### Flight Option

```typescript
export type FlightOption = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  originIata: string;
  originCity: string;
  destinationIata: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  durationFormatted: string;
  stopCount: number;
  stops: string;
  price: number;
  date: string;
  cabinClass: "economy" | "premium" | "business";
  seatsLeft: number;
  baggage: { cabin: string; checkIn: string };
  carbonKg: number;
};
```

#### Booking Record

```typescript
export type StoredBooking = {
  id: string;
  kind: "flight" | "stay" | "rental" | "rail" | "package";
  title: string;
  subtitle: string;
  price: number;
  reference: string;
  createdAt: number;
  status: "confirmed" | "cancelled" | "pending";
  paidAt?: number;
  origin?: string;
  destination?: string;
  date?: string;
  travelers?: number;
  cabinClass?: string;
  inventoryId?: string;
};
```

#### Trip Savings Fund

```typescript
export type FutureTrip = {
  id: string;
  emoji: string;
  name: string;
  target: number;
  saved: number;
  targetDate: string;
  monthsLeft: number;
  travelers: number;
  image: string;
};
```

---

## 7. UI / UX DESIGN SYSTEM

- **Design Philosophy**: High-fidelity, travel-tech aesthetic combining vibrant OKLCH gradients, glassmorphism, and micro-interactions.
- **Palette**:
  - Primary Brand: Deep travel blue `oklch(0.42 0.14 260)`
  - Sky Accent: Bright sky blue `oklch(0.72 0.14 232)`
  - Sunset Accent: Warm amber/orange `oklch(0.75 0.15 62)`
  - Leaf Accent: Emerald green `oklch(0.7 0.14 152)`
  - Surface: Elevated glassmorphic cards with soft borders (`border-border/50`) and soft shadows (`shadow-soft`, `shadow-elevated`).
- **Accessibility**: Passes WCAG AA axe accessibility scans with 0 critical violations. Full keyboard navigation support and dark-mode high contrast.

---

## 8. CODING CONVENTIONS

- **Component Architecture**: Modular presentation components in `src/components/smarttrip/`, atomic primitives in `src/components/ui/`.
- **Server Functions**: All backend logic encapsulated in TanStack Start `createServerFn` handlers located in `src/lib/server/` and `src/server/`.
- **Validation**: Strict input validation using Zod schemas for all route search parameters and server function payloads.
- **Error Handling**: Telemetry captured via `reportError()` and stored in Supabase `error_logs` without paid monitoring dependencies.
- **Formatting**: ESLint 9 + Prettier 3 standard rules with strict TypeScript compilation (`--noEmit`).

---

## 9. VERIFICATION & TEST METRICS

- **ESLint**: 0 errors, 0 warnings across entire codebase.
- **TypeScript**: 0 typecheck errors (`tsc --noEmit`).
- **Vitest**: 8 test suites, 80 unit tests passing (100% pass rate).
- **Playwright**: 9 end-to-end tests passing covering:
  - Accessibility audit with `@axe-core/playwright`
  - Authentication & signup flow validation
  - AI trip planner generation & saving
  - Search, booking flow, payment modal & E-ticket verification
  - Wishlist drawer & savings fund deposits
- **Secret Scanning**: Client bundle scanner verifies 0 secret tokens in 72 assets.
- **Production Build**: Standalone Nitro server bundle built and ready for zero-cost deployment.
