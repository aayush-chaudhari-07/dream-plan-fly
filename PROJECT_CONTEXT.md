# PROJECT CONTEXT: SmartTrip (dream-plan-fly)

> Comprehensive architectural, structural, and technical documentation of the codebase for AI assistants and developers without direct repository access.

---

## 1. PROJECT OVERVIEW

### 1.1 Project Identity & Purpose
- **Project Name**: SmartTrip (Repository: `dream-plan-fly`, Package name: `tanstack_start_ts`)
- **Live Deployment**: `https://dream-plan-fly.lovable.app`
- **Connected Platform**: [Lovable](https://lovable.dev) (Project ID: `8b5525ae-697f-49d0-bec2-441537132cbf`)
- **Tagline**: *"Plan Less. Travel More."* / *"Travel smarter. Explore more."*
- **Core Concept**: `Dream → Ask AI → Plan → Save → Book → Travel`
- **Problem Solved**: Traditional travel planning is disjointed and stressful. Travelers juggle multiple tabs for inspiration, itinerary builders, price comparisons, savings calculators, and booking platforms. SmartTrip unifies destination discovery, rule-based/AI trip planning, future trip savings tracking, and end-to-end demo bookings into a cohesive, travel-tech product with modern aesthetics.

### 1.2 Target Users
- Leisure travelers looking for curated destinations and quick itinerary inspiration.
- Group and family vacationers coordinating multi-day itineraries and budgets.
- Future trip planners wanting to create savings targets and track progress over months/years (e.g., Japan 2027, Kashmir Winter).
- Travelers looking for categorized options across Hill Stations, Beaches, Heritage, and Adventure spots.

### 1.3 Main Features
1. **Interactive Hero & Search**: Destination search form with fields for Destination, Travel Dates, Travelers, and Budget, styled over an animated sky canvas (clouds, flying birds, and transiting aircraft via CSS animations).
2. **Quick Booking Panel**: Dynamic multi-tab booking search interface for Flights, Hotels/Stays, Car/Bike Rentals, Train/Bus, and Packages.
3. **Explore Destinations**: Categorized destination catalog (Hill Stations, Beaches, Adventure, Heritage, Nature, International, Weekend Getaways) with real pricing in INR (₹), ratings, blurbs, and instant wishlist toggling.
4. **AI Trip Planner**: Heuristic itinerary engine (`buildPlan`) that generates personalized multi-day schedules, estimated budgets, lodging recommendations, transport modes, food trail ideas, packing lists, weather alerts, tips, and carbon footprint estimations. Features PDF/print export, shareable URLs, and dynamic budget/day recalculations.
5. **Trip Fund (Save for Future Trip)**: Travel dream tracker enabling users to create dedicated funds for specific destinations and dates, make quick contributions (+₹500, +₹1,000, +₹2,500, or custom), track percentage completion, and view required monthly savings.
6. **Escape to the Hills**: Dedicated scenic showcase featuring 8 hill stations (Manali, Shimla, Munnar, Ooty, Lonavala, Mahabaleshwar, Darjeeling, Kashmir) with temperatures and rich visual presentation.
7. **"My Trips" Dashboard**: Central traveler hub featuring aggregate statistics (trips tracked, bookings, fund totals, wishlisted spots), active booking management with cancellation, and trip classification into three buckets: Upcoming, Past, and Saved.
8. **Travel Safety & Support Dock**: Safety guidance checklist and floating 24/7 support trigger with quick access to the AI planner, help center, and support hotline simulation.

### 1.4 Current Status
- **Current Status**: **Working Prototype / In Progress**
- **Working**: All UI pages, client-side routing, responsive layouts, animated hero layers, heuristic AI itinerary generation, reactive `localStorage` persistence, booking creation/cancellation, savings fund contributions, and wishlisting are functional.
- **Partially Working / Mocked**: All flight, hotel, rental, rail, and package inventory is backed by static demo data in `src/data/travel.ts`. Bookings generate simulated reference numbers without payment gateways or external GDS/OTA APIs. AI generation uses a client-side regex and template builder rather than an external LLM.
- **Incomplete / Pending**: The interactive map section described in `README.md` (which utilizes the `mapPlaces` dataset defined in `src/data/travel.ts`) is not yet wired into any component or page. Drag-and-drop itinerary reordering, automated price-drop alerts, and persistent cloud authentication are pending.

---

## 2. TECH STACK

### 2.1 Languages, Frameworks & Libraries
*(Exact versions extracted from `package.json`)*

#### Core & Runtime
- **Language**: TypeScript (`^5.8.3`), Node.js (tested on Node v24.20.0 / npm 11.19.0; bun configuration present)
- **UI Library**: React 19 (`react: ^19.2.0`, `react-dom: ^19.2.0`)
- **SSR & Fullstack Framework**: TanStack Start (`@tanstack/react-start: 1.168.32`)
- **Router**: TanStack Router (`@tanstack/react-router: 1.170.18`, `@tanstack/router-plugin: 1.168.23`)
- **Async State Management**: TanStack Query (`@tanstack/react-query: ^5.101.1`)

#### Build Tools & Bundler
- **Build Tool**: Vite (`vite: 8.1.5`, `@vitejs/plugin-react: ^5.2.0`)
- **SSR Server Engine**: Nitro (`nitro: 3.0.260603-beta`)
- **Configuration Preset**: `@lovable.dev/vite-tanstack-config: 2.23.1`
- **Path Resolution**: `vite-tsconfig-paths: ^6.0.2`
- **Overrides**: `rolldown: 1.2.1`

#### Styling & Design System
- **CSS Engine**: Tailwind CSS v4 (`tailwindcss: ^4.2.1`, `@tailwindcss/vite: ^4.2.1`)
- **Animations**: `tw-animate-css: ^1.3.4` + custom keyframes in `src/styles.css`
- **Class Utilities**: `clsx: ^2.1.1`, `tailwind-merge: ^3.5.0`, `class-variance-authority: ^0.7.1`
- **Color System**: OKLCH semantic tokens defined in `src/styles.css` with dark mode support
- **Fonts**: Manrope (Body sans-serif), Sora (Headings display) from Google Fonts

#### UI Component Primitives & Utilities
- **Radix UI Primitives**:
  - `@radix-ui/react-accordion: ^1.2.12`
  - `@radix-ui/react-alert-dialog: ^1.1.15`
  - `@radix-ui/react-aspect-ratio: ^1.1.8`
  - `@radix-ui/react-avatar: ^1.1.11`
  - `@radix-ui/react-checkbox: ^1.3.3`
  - `@radix-ui/react-collapsible: ^1.1.12`
  - `@radix-ui/react-context-menu: ^2.2.16`
  - `@radix-ui/react-dialog: ^1.1.15`
  - `@radix-ui/react-dropdown-menu: ^2.1.16`
  - `@radix-ui/react-hover-card: ^1.1.15`
  - `@radix-ui/react-label: ^2.1.8`
  - `@radix-ui/react-menubar: ^1.1.16`
  - `@radix-ui/react-navigation-menu: ^1.2.14`
  - `@radix-ui/react-popover: ^1.1.15`
  - `@radix-ui/react-progress: ^1.1.8`
  - `@radix-ui/react-radio-group: ^1.3.8`
  - `@radix-ui/react-scroll-area: ^1.2.10`
  - `@radix-ui/react-select: ^2.2.6`
  - `@radix-ui/react-separator: ^1.1.8`
  - `@radix-ui/react-slider: ^1.3.6`
  - `@radix-ui/react-slot: ^1.2.4`
  - `@radix-ui/react-switch: ^1.2.6`
  - `@radix-ui/react-tabs: ^1.1.13`
  - `@radix-ui/react-toggle: ^1.1.10`
  - `@radix-ui/react-toggle-group: ^1.1.11`
  - `@radix-ui/react-tooltip: ^1.2.8`
- **Icons**: `lucide-react: ^0.575.0`
- **Toasts**: `sonner: ^2.0.7`
- **Form Handling & Validation**: `react-hook-form: ^7.71.2`, `@hookform/resolvers: ^5.2.2`, `zod: ^3.24.2`
- **Date Handling**: `date-fns: ^4.1.0`, `react-day-picker: ^9.14.0`
- **Charts & Drawers & Carousel**: `recharts: ^2.15.4`, `vaul: ^1.1.2`, `embla-carousel-react: ^8.6.0`, `cmdk: ^1.1.1`, `input-otp: ^1.4.2`, `react-resizable-panels: ^4.6.5`

#### Linting & Formatting
- **Linter**: ESLint 9 (`eslint: ^9.32.0`, `@eslint/js: ^9.32.0`, `typescript-eslint: ^8.56.1`, `eslint-plugin-react-hooks: ^5.2.0`, `eslint-plugin-react-refresh: ^0.4.20`)
- **Formatter**: Prettier 3 (`prettier: ^3.7.3`, `eslint-config-prettier: ^10.1.1`, `eslint-plugin-prettier: ^5.2.6`)

### 2.2 Database, APIs & External Services
- **Database**: None. State is held in-memory and synced to the browser's `localStorage` via `src/lib/smarttrip-store.ts`.
- **APIs**: None currently connected. Data is local and statically seeded (`src/data/travel.ts`).
- **External Web Services**:
  - Google Fonts CDN (`https://fonts.googleapis.com` for Manrope and Sora).
  - Lovable runtime integration (`@lovable.dev/vite-tanstack-config` and `window.__lovableEvents` / `window.__lovableReportRuntimeError`).

### 2.3 Installation & Run Commands
```bash
# 1. Install dependencies
npm install
# (Alternatively, if bun is installed: bun install)

# 2. Run local development server
npm run dev
# Starts Vite development server with SSR support at http://localhost:3000 (or first open port)

# 3. Build for production
npm run build

# 4. Build development bundle
npm run build:dev

# 5. Preview production build locally
npm run preview

# 6. Run linter
npm run lint

# 7. Run code formatter
npm run format
```

---

## 3. FOLDER STRUCTURE

```
dream-plan-fly/
├── .gitignore                      # Git ignore file (excludes build outputs, node_modules, logs)
├── .lovable/
│   └── project.json                # Lovable project metadata and template revision pointer
├── .prettierignore                 # Prettier ignore rules
├── .prettierrc                     # Prettier formatting configuration
├── AGENTS.md                       # Project instructions for AI agents regarding Lovable commit sync
├── README.md                       # Product specification, design guidelines, and feature requirements
├── bun.lock                        # Bun lockfile for reproducible package installation
├── bunfig.toml                     # Bun configuration (supply chain security 24h release age guard)
├── components.json                 # Shadcn-UI configuration file (New York style, slate color base)
├── eslint.config.js                # ESLint configuration supporting React Hooks, Refresh, and Prettier
├── package.json                    # Dependencies, build scripts, engine overrides
├── public/
│   ├── favicon.ico                 # Application favicon
│   └── robots.txt                  # Search engine crawler permissions (allows all search crawlers)
├── src/
│   ├── assets/                     # High-resolution static photography used across the app
│   │   ├── dest-goa.jpg            # Beach and sunset photography for Goa destinations/stays
│   │   ├── dest-japan.jpg          # Kyoto/Tokyo photography for Japan destinations/funds
│   │   ├── dest-kashmir.jpg        # Dal Lake and mountains photography for Kashmir
│   │   ├── dest-maldives.jpg       # Turquoise lagoon and villa imagery for Maldives
│   │   ├── dest-manali.jpg         # Snow peak and valley imagery for Manali / hill stations
│   │   └── hero-mountains.jpg      # High-res panoramic landscape for the Hero background
│   ├── components/
│   │   ├── smarttrip/              # Core business components implementing the SmartTrip experience
│   │   │   ├── AiPlanner.tsx       # AI prompt box, quick buttons, itinerary generator, and plan viewer
│   │   │   ├── EscapeHills.tsx     # Scenic showcase section featuring 8 hill station destinations
│   │   │   ├── ExploreDestinations.tsx # Catalog of destinations with category filtering and wishlist actions
│   │   │   ├── Footer.tsx          # Multi-column footer, newsletter subscribe form, social links
│   │   │   ├── Hero.tsx            # Hero banner with animated sky elements and multi-field search
│   │   │   ├── HowItWorks.tsx      # 4-step visual flow (Ask AI -> Explore -> Save -> Book & Go)
│   │   │   ├── Navbar.tsx          # Sticky glassmorphic navbar with desktop/mobile navigation menus
│   │   │   ├── PageHeader.tsx      # Reusable sub-page banner header with breadcrumb navigation
│   │   │   ├── QuickBooking.tsx    # Multi-tab booking search bar (Flights, Stay, Rental, Rail, Packages)
│   │   │   ├── Reveal.tsx          # IntersectionObserver scroll-reveal animations and section headers
│   │   │   ├── SupportDock.tsx     # Floating bottom-right 24/7 support trigger and speed-dial actions
│   │   │   ├── Testimonials.tsx    # Social proof traveler review cards with star ratings
│   │   │   ├── TravelSafe.tsx      # Health, safety, verified stays, and emergency support section
│   │   │   └── TripFund.tsx        # Dream trip savings tracker with progress bars and contribution inputs
│   │   └── ui/                     # Shadcn-UI component library primitives (Radix UI wrappers)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx          # Customized button with hero, glass, sunset, leaf, soft variants
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx           # Styled text/number input primitive
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx          # Sonner toast provider container
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx        # Styled textarea primitive
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       └── tooltip.tsx
│   ├── data/
│   │   └── travel.ts               # Static datasets: destinations, hill stations, flights, hotels, map places, etc.
│   ├── hooks/
│   │   └── use-mobile.tsx          # React hook detecting viewport width < 768px
│   ├── lib/
│   │   ├── error-capture.ts        # Out-of-band error recorder for SSR unhandled exceptions in h3
│   │   ├── error-page.ts           # Pure HTML/CSS fallback page rendered when catastrophic SSR fails
│   │   ├── lovable-error-reporting.ts # Telemetry hook forwarding React Error Boundary errors to Lovable
│   │   ├── smarttrip-store.ts      # Reactive external store with localStorage sync for trips, bookings, funds
│   │   ├── trip-plan.ts            # Heuristic algorithm for parsing travel prompts and building itineraries
│   │   └── utils.ts                # Tailwind class merge helper (`cn()`)
│   ├── routeTree.gen.ts            # Auto-generated TanStack Router route tree definition
│   ├── router.tsx                  # Factory initializing TanStack Router with QueryClient
│   ├── routes/                     # TanStack Start file-based route definitions
│   │   ├── README.md               # Guide explaining file-based route conventions
│   │   ├── __root.tsx              # Root HTML shell, QueryClientProvider, Toaster, and global Error Boundary
│   │   ├── index.tsx               # Route `/` — Complete SmartTrip landing page
│   │   ├── ai-planner.tsx          # Route `/ai-planner` — Dedicated AI Trip Planner page
│   │   ├── bookings.tsx            # Route `/bookings` — Multi-category booking catalog and booking triggers
│   │   ├── explore.tsx             # Route `/explore` — Full-page destination discovery grid
│   │   ├── my-trips.tsx            # Route `/my-trips` — Dashboard for bookings, trips, funds, and wishlist
│   │   └── save.tsx                # Route `/save` — Dedicated page for Trip Fund savings management
│   ├── server.ts                   # TanStack Start SSR server entrypoint with error interception
│   ├── start.ts                    # TanStack Start application setup with CSRF and error middlewares
│   └── styles.css                  # Tailwind v4 theme, OKLCH semantic tokens, and custom keyframe animations
├── tsconfig.json                   # TypeScript compiler options, path alias `@/* -> ./src/*`
└── vite.config.ts                  # Vite configuration utilizing `@lovable.dev/vite-tanstack-config`
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
       ├──> [ src/server.ts ] (Server Entry Wrapper)
       │         │
       │         ├──> Catches / unwraps h3 swallowed 500 errors
       │         └──> Delegates to @tanstack/react-start/server-entry
       │
       ▼
[ src/start.ts ] (TanStack Start Middlewares)
       │
       ├──> errorMiddleware (Server function exception handling)
       └──> csrfMiddleware (Cross-Site Request Forgery protection for serverFn)
       │
       ▼
[ src/router.tsx & src/routeTree.gen.ts ] (File-based Route Resolution)
       │
       ▼
[ src/routes/__root.tsx ] (App Shell)
       │
       ├──> Head metadata & Google Fonts
       ├──> QueryClientProvider (TanStack Query)
       ├──> Sonner Toaster (Global Toast Notifications)
       └──> <Outlet /> (Renders Route Component)
                 │
                 ├──> / (routes/index.tsx)
                 ├──> /ai-planner (routes/ai-planner.tsx)
                 ├──> /bookings (routes/bookings.tsx)
                 ├──> /explore (routes/explore.tsx)
                 ├──> /my-trips (routes/my-trips.tsx)
                 └──> /save (routes/save.tsx)
```

### 4.2 State Architecture & Client Persistence
The project uses a reactive **External Store** pattern (`src/lib/smarttrip-store.ts`) paired with React's `useSyncExternalStore`:
1. **Initial Seed**: If `localStorage` is empty, state initializes with seed trips from `src/data/travel.ts` (Goa, Manali, Kashmir, Kyoto), initial funds (Japan 2027, Kashmir Winter, Maldives Escape), empty bookings, and empty wishlist.
2. **Hydration**: On mount, `hydrate()` parses `localStorage.getItem("smarttrip.state.v1")` and emits an update.
3. **Reactivity**: Mutations (`savePlan`, `moveTrip`, `removeTrip`, `addBooking`, `cancelBooking`, `addFund`, `contribute`, `removeFund`, `toggleWish`, `reset`) update the internal state object, write to `localStorage`, and notify all subscribed components.
4. **SSR Safety**: Server renders default `SEED` data; client hydrates seamlessly without hydration mismatches.

### 4.3 Key User & Data Flows

#### Flow 1: AI Itinerary Creation & Saving
1. **Input**: User enters a prompt in `Hero.tsx` or `AiPlanner.tsx` (e.g., *"I want a 5-day trip to Himachal Pradesh for 3 people under ₹35,000"*).
2. **Parsing**: `buildPlan()` in `src/lib/trip-plan.ts` uses regex to extract the budget (defaults to ₹35,000), passenger count (defaults to 2), duration (between 2 and 10 days, default 5), and destination keywords.
3. **Synthesis**: The algorithm generates day-by-day itineraries, lodging recommendations, transport guidance, dining trails, weather warnings, packing lists, money-saving tips, budget breakdowns, and an estimated carbon footprint.
4. **Interaction**: User can adjust budget, days, or traveler counts and trigger `onReplan()`.
5. **Persistence**: Clicking *"Save to My Trips"* calls `smartTrip.savePlan(plan)`. This generates an ID (`trip-*`), places it into the `"Saved"` bucket, updates `localStorage`, and displays a success toast.

#### Flow 2: Booking Flights, Hotels, Rentals, Rails, or Packages
1. **Selection**: User goes to `/bookings` and chooses a tab (Flights, Hotels, Rentals, Train/Bus, Packages).
2. **Booking Action**: User clicks *"Book"* or *"Reserve"*.
3. **Execution**: `smartTrip.addBooking(...)` is invoked. It generates a reference code (e.g. `ST4X89K`), adds an item to `state.bookings`, and automatically generates an accompanying `"Upcoming"` trip entry in `state.trips`.
4. **Notification**: Sonner toast notifies the user that the demo booking was confirmed. The booking immediately appears in `/my-trips`.

#### Flow 3: Trip Fund & Future Savings
1. **Creation**: User enters a trip name (e.g., *"Santorini 2027"*) and target budget (e.g., `₹80,000`) in `TripFund.tsx`.
2. **Action**: `smartTrip.addFund(...)` stores the goal.
3. **Contributions**: User clicks quick-add buttons (`+₹500`, `+₹1,000`, `+₹2,500`) or enters a custom sum.
4. **Calculation**: `smartTrip.contribute(fundId, amount)` increments `saved` (capped at `target`). The UI updates the progress percentage and recalculates the required monthly rate: `(target - saved) / monthsLeft`.

#### Flow 4: Wishlisting Destinations
1. **Trigger**: User clicks the heart icon on any destination card in `ExploreDestinations.tsx`.
2. **Execution**: `smartTrip.toggleWish(destinationId)` adds or removes the ID in `state.wishlist`.
3. **Sync**: All wishlisted destinations are aggregated and displayed inside the `"Places You Loved"` section of `/my-trips`.

---

## 5. KEY FILES IN DETAIL

### 5.1 `src/server.ts`
- **Purpose**: Custom SSR entry wrapper for TanStack Start and Nitro builds.
- **Critical Logic**: h3 (Nitro's underlying HTTP layer) swallows in-handler errors into generic 500 JSON responses (`{"unhandled":true,"message":"HTTPError"}`). `src/server.ts` checks for this condition, pulls the original stack trace via `consumeLastCapturedError()`, logs the details, and returns a clean HTML fallback page using `renderErrorPage()`.
```typescript
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
```

### 5.2 `src/start.ts`
- **Purpose**: Defines TanStack Start instance configuration, error middleware, and CSRF protection.
- **Critical Logic**: Installs `csrfMiddleware` filtered to `serverFn` handlers to secure server actions from cross-site request attacks.

### 5.3 `src/router.tsx` & `src/routes/__root.tsx`
- **Purpose**: Defines router context and root application shell.
- **Key Elements**:
  - Sets up `QueryClient` and scroll restoration.
  - Injects global HTML `<head>` tags (meta descriptions, OG tags, Google Fonts stylesheets).
  - Contains `NotFoundComponent` (404 UI) and `ErrorComponent` (React Error Boundary catching client route failures and calling `reportLovableError`).
  - Wraps children in `<QueryClientProvider>` and mounts `<Toaster position="bottom-right" richColors />`.

### 5.4 `src/lib/smarttrip-store.ts`
- **Purpose**: Centralized application state management and `localStorage` synchronization.
- **Exported API**:
  - `useSmartTrip()`: Hook for components to subscribe to state updates.
  - `smartTrip`: Object containing action methods:
    - `savePlan(plan: GeneratedPlan): StoredTrip`
    - `moveTrip(tripId: string, bucket: TripBucket): void`
    - `removeTrip(tripId: string): void`
    - `addBooking(input): StoredBooking`
    - `cancelBooking(bookingId: string): void`
    - `addFund(input): FutureTrip`
    - `contribute(fundId: string, amount: number): void`
    - `removeFund(fundId: string): void`
    - `toggleWish(destinationId: string): boolean`
    - `reset(): void`
- **State Interface**:
```typescript
export type SmartTripState = {
  trips: StoredTrip[];
  bookings: StoredBooking[];
  funds: FutureTrip[];
  wishlist: string[];
};
```

### 5.5 `src/lib/trip-plan.ts`
- **Purpose**: Local deterministic travel planner and budget estimation engine.
- **Main Function**: `buildPlan(prompt: string, opts: PlanOptions): GeneratedPlan`
  - Parses budget via regex `(\d{4,7})`.
  - Parses passenger count via `(\d+)\s*(people|persons|travell?ers|friends|adults)`.
  - Parses day count via `(\d+)\s*-?\s*day` (clamped between 2 and 10 days).
  - Determines destination category (beach, mountain, international) based on prompt keyword matching.
  - Returns structured plan with budget allocation: Transport (30%), Stays (35%), Food (20%), Activities (10%), Buffer (5%).
  - Computes approximate carbon footprint (`distKm * 2 * perKm`).

### 5.6 `src/data/travel.ts`
- **Purpose**: Primary database of static mock items.
- **Exported Collections**:
  - `destinations`: 9 destinations (Manali, Goa, Kashmir, Kyoto, Maldives, Lonavala, Munnar, Rishikesh, Jaipur).
  - `destinationCategories`: 8 category filters.
  - `hillStations`: 8 hill stations with simulated current temperatures.
  - `mapPlaces`: 6 points of interest with coordinates and categories (*Note: Defined here, but currently unused in the UI*).
  - `flights`, `hotels`, `rentals`, `railBus`, `packages`: Booking mock inventory.
  - `initialFutureTrips`: 3 starter savings goals.
  - `myTrips`: Starter trips classified by bucket.
  - `inr(n: number)`: Currency formatter returning `₹XX,XXX`.

### 5.7 Route Files (`src/routes/*.tsx`)
- `routes/index.tsx`: Main landing page assembling Navbar, Hero, QuickBooking, ExploreDestinations, HowItWorks, EscapeHills, AiPlanner, TripFund, Testimonials, TravelSafe, Footer, and SupportDock.
- `routes/ai-planner.tsx`: Dedicated full page for the AI Trip Planner with a `PageHeader`.
- `routes/bookings.tsx`: Booking catalog supporting 5 tabs (flights, stays, rentals, rail, packages) with instant booking triggers.
- `routes/explore.tsx`: Dedicated destination catalog in responsive grid view.
- `routes/my-trips.tsx`: Full traveler dashboard displaying stat cards, active bookings, 3 trip buckets with collapsible itineraries, wishlisted items, and a demo reset trigger.
- `routes/save.tsx`: Dedicated page for the Future Trip Fund.

### 5.8 Key UI Components (`src/components/smarttrip/`)
- `Hero.tsx`: Implements the hero visual with `SkyLayer` (CSS-animated clouds, birds, and plane) and responsive search card.
- `QuickBooking.tsx`: Floating booking widget supporting tab switches with specialized form inputs per tab.
- `AiPlanner.tsx`: Two-column planning interface featuring prompt input, quick suggestion pills, animated typing skeleton, and rich generated plan view.
- `TripFund.tsx`: Savings goal creator and list of cards with animated progress bars, monthly required contributions, and quick add buttons.
- `Reveal.tsx`: Wraps elements in an `IntersectionObserver` to apply `.reveal.is-visible` CSS animations on scroll.
- `SupportDock.tsx`: Fixed floating headset button toggling a quick-help glassmorphic modal.

---

## 6. DATA MODELS AND API

### 6.1 Data Models (TypeScript Types)

#### Destination
```typescript
export type Destination = {
  id: string;
  name: string;
  region: string;
  category: string;
  price: number;
  rating: number;
  blurb: string;
  image: string;
};
```

#### Stored Trip & Trip Buckets
```typescript
export type TripBucket = "Upcoming" | "Past" | "Saved";

export type StoredTrip = {
  id: string;
  name: string;
  dates: string;
  status: string[];
  image: string;
  bucket: TripBucket;
  plan?: GeneratedPlan;
};
```

#### Booking
```typescript
export type BookingKind = "flight" | "stay" | "rental" | "rail" | "package";

export type StoredBooking = {
  id: string;
  kind: BookingKind;
  title: string;
  subtitle: string;
  price: number;
  reference: string;
  createdAt: number;
};
```

#### Future Trip (Trip Fund)
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

#### Generated AI Plan
```typescript
export type GeneratedPlan = {
  title: string;
  budget: number;
  summary: string;
  days: { day: string; title: string; items: string[] }[];
  stays: string[];
  transport: string;
  food: string[];
  weather: string;
  packing: string[];
  tips: string[];
  travelers: number;
  nights: number;
  breakdown: { label: string; amount: number }[];
  carbonKg: number;
};
```

#### Map Place
```typescript
export type MapPlace = {
  id: string;
  name: string;
  type: "Attractions" | "Hotels" | "Restaurants" | "Activities";
  rating: number;
  distance: string;
  note: string;
  x: number;
  y: number;
};
```

### 6.2 Routes and Endpoints

#### File Routes (Client / SSR Web Pages)
| Route | File Path | Method | Description |
|---|---|---|---|
| `/` | `src/routes/index.tsx` | GET | Full SmartTrip homepage |
| `/ai-planner` | `src/routes/ai-planner.tsx` | GET | AI Trip Planner page |
| `/bookings` | `src/routes/bookings.tsx` | GET | Booking catalog (flights, hotels, rentals, rail, packages) |
| `/explore` | `src/routes/explore.tsx` | GET | Destination discovery grid |
| `/my-trips` | `src/routes/my-trips.tsx` | GET | User trips dashboard, bookings list, and wishlist |
| `/save` | `src/routes/save.tsx` | GET | Save for Future Trip / Trip Fund page |

#### Backend API Endpoints
- **Not found / None implemented**: There are no custom API route files (e.g. `src/routes/api/*.ts`) or server functions (`createServerFn`) currently defined. All actions are handled client-side via `src/lib/smarttrip-store.ts`.

### 6.3 Environment Variables
- **Status**: No `.env` or required secrets exist in the codebase.
- The project config (`@lovable.dev/vite-tanstack-config`) is pre-configured to inject any variables prefixed with `VITE_*` into the client build.

---

## 7. UI / UX

### 7.1 Visual Identity & Color Palette
- The interface adheres to an **OKLCH Semantic Color System** defined in `src/styles.css`:
  - **Primary**: Deep travel blue `oklch(0.42 0.14 260)`
  - **Ink (Dark Neutral)**: Deep navy `oklch(0.26 0.08 262)`
  - **Sky Accent**: Bright sky blue `oklch(0.72 0.14 232)`
  - **Teal Accent**: Turquoise `oklch(0.74 0.12 187)`
  - **Leaf Accent**: Nature green `oklch(0.7 0.14 152)`
  - **Sunset Accent**: Warm orange `oklch(0.75 0.15 62)`
  - **Background**: Soft off-white `oklch(0.995 0.004 230)`
  - **Card / Surface**: Pure white `oklch(1 0 0)` / Subtle slate `oklch(0.972 0.012 230)`
  - **Dark Mode Support**: Complete dark-theme token override mapping in `.dark`.

### 7.2 Typography & Spacing
- **Display Typography**: **Sora** (`font-display`), with tight tracking (`-0.02em`) for titles and headers.
- **Body Typography**: **Manrope** (`font-sans`), an open, geometric sans-serif optimized for legibility.
- **Card Geometry**: Large rounded radiuses (`--radius-3xl` ~ `2.4rem`, `--radius-4xl` ~ `3.15rem`).
- **Shadows**: Multi-layered soft shadows (`--shadow-soft`, `--shadow-lift`, `--shadow-glass`).

### 7.3 Motion & Micro-interactions
- **Keyframe Animations**:
  - `drift` / `drift-slow`: Continuous horizontal translation of clouds across the hero.
  - `fly-across`: Slow 34-second translation of an airplane icon crossing the upper hero.
  - `bird`: Floating SVG bird flock animation.
  - `pulse-ring`: Radiating ring animation behind the SmartTrip AI bot icon.
  - `blink`: Dot loading animation indicating AI generation.
  - `card-hover`: 320ms smooth lift (`translateY(-6px)`) with shadow elevation.
- **Scroll Reveal**: `src/components/smarttrip/Reveal.tsx` triggers opacity and transform transitions as elements scroll into view.
- **Accessibility**: `@media (prefers-reduced-motion: reduce)` resets all transitions and animations to `0.001ms`.

---

## 8. CODING CONVENTIONS

### 8.1 Naming & Organization
- **Components**: PascalCase filenames (e.g. `AiPlanner.tsx`, `TripFund.tsx`) located in `src/components/smarttrip/` and `src/components/ui/`.
- **Utilities & State**: kebab-case filenames (e.g. `smarttrip-store.ts`, `trip-plan.ts`, `use-mobile.tsx`) located in `src/lib/` and `src/hooks/`.
- **Routes**: kebab-case filenames matching URL paths in `src/routes/` (e.g. `ai-planner.tsx` -> `/ai-planner`).
- **Path Aliases**: `@/*` maps to `./src/*` across all imports via `tsconfig.json`.

### 8.2 State Management & React Patterns
- Component-level state is handled with standard `useState`, `useRef`, and `useMemo`.
- Global domain state uses the **External Store** pattern with `useSyncExternalStore` for flicker-free, SSR-safe hydration.
- User feedback is communicated via `sonner` toasts (`toast.success()`, `toast.error()`, `toast.message()`).

### 8.3 Error Handling Approach
1. **Catastrophic SSR Error Capture**: `src/lib/error-capture.ts` intercepts and retains unhandled server errors out-of-band so `src/server.ts` can recover the stack before serving a 500 response.
2. **SSR Fallback Page**: `src/lib/error-page.ts` returns lightweight HTML with "Try again" and "Go home" actions when rendering fails entirely.
3. **Client Route Error Boundary**: `ErrorComponent` in `src/routes/__root.tsx` renders a graceful recovery UI and forwards telemetry to `reportLovableError` in `src/lib/lovable-error-reporting.ts`.

---

## 9. KNOWN ISSUES AND INCOMPLETE WORK

### 9.1 Incomplete Features & Specification Gaps
1. **Unused Interactive Map Dataset**: `src/data/travel.ts` exports `mapPlaces: MapPlace[]` containing coordinates and attraction data, but there is no interactive map component implemented or mounted on any page. (Requested in `README.md` Section 9: "INTERACTIVE MAP / EXPLORE AROUND YOU").
2. **Quick Travel Guide**: The 3-stage travel guide section described in `README.md` Section 10 ("Before You Go", "During Your Trip", "Smart Tips") is not yet implemented.
3. **Simulated AI Planning**: The AI Trip Planner does not call an actual LLM (OpenAI, Gemini, Anthropic); it uses a deterministic regex parsing and string interpolation engine (`src/lib/trip-plan.ts`).
4. **Header Navigation Placeholders**: The Search, Wishlist, Notifications, and Profile buttons in `Navbar.tsx` only trigger toast notifications saying *"panel coming up next"* rather than opening functional dialogs or drawers.
5. **No Persistent Backend / Authentication**: All user modifications (saved plans, bookings, funds, wishlist) reside strictly in single-browser `localStorage`. There is no multi-user database, session handling, or cross-device synchronization.
6. **Confetti Animation Unused in Logic**: `@keyframes confetti` is declared in `src/styles.css` (lines 346–355), but is never triggered by `TripFund.tsx` when a savings goal reaches 100%.
7. **Itinerary Re-ordering**: The AI itinerary view does not support drag-and-drop re-ordering of activities, which was specified in `README.md` Section 19.

### 9.2 Fragility & Technical Debt
1. **Over-provisioned UI Directory**: `src/components/ui/` contains 46 Shadcn UI component files, of which only `button.tsx`, `input.tsx`, `textarea.tsx`, and `sonner.tsx` are actively imported by application code. The remaining 42 files are unused template scaffolding.
2. **Missing Test Suite**: There are no automated unit tests, integration tests, or end-to-end tests in the repository (`no test script in package.json`).
3. **Package Name Mismatch**: `package.json` retains the default template name `"tanstack_start_ts"` instead of `"smarttrip"` or `"dream-plan-fly"`.
4. **Missing Dependencies on Clean Clone**: Running `npm run lint` immediately after cloning fails because `node_modules` is not present; developers must execute `npm install` first.

---

## 10. SUGGESTED IMPROVEMENTS

### 10.1 High Priority (Immediate Value)
1. **Implement the Interactive Travel Map**:
   - Create `src/components/smarttrip/InteractiveMap.tsx` using the existing `mapPlaces` dataset from `src/data/travel.ts`.
   - Implement category filters (Attractions, Hotels, Restaurants, Activities) and clickable pins displaying place details and an *"Add to Trip"* button.
2. **Integrate Real LLM API for Trip Planning**:
   - Replace or supplement `buildPlan()` with a TanStack Start server function (`createServerFn`) that queries an LLM (e.g., Google Gemini 2.5 Flash or OpenAI GPT-4o-mini).
   - Use structured JSON output adhering to the existing `GeneratedPlan` schema.
3. **Database & Authentication Integration**:
   - Add Supabase or Cloudflare D1/KV to store user accounts, bookings, and savings funds in a persistent remote database.

### 10.2 Medium Priority (UX Polish & Completeness)
4. **Implement Header Modals**:
   - Replace placeholder toasts in `Navbar.tsx` with functional modals:
     - Search: Connect Shadcn's `command.tsx` (`cmdk`) to search destinations and trips.
     - Wishlist: Open a side drawer (`sheet.tsx`) listing wishlisted items.
5. **Goal Reached Celebration**:
   - Trigger a canvas confetti animation (using `canvas-confetti`) when a fund's progress reaches 100% in `TripFund.tsx`.
6. **Drag-and-Drop Itinerary Editor**:
   - Incorporate drag-and-drop reordering for itinerary items inside `AiPlanner.tsx` using `dnd-kit` or `@hello-pangea/dnd`.
7. **Quick Travel Guide Component**:
   - Implement the "Before You Go", "During Your Trip", and "Smart Tips" accordion component specified in `README.md` Section 10.

### 10.3 Low Priority (Maintenance & Cleanup)
8. **Prune Unused UI Components**:
   - Remove or archive unused component files from `src/components/ui/` to reduce repository bloat.
9. **Add Unit & Smoke Tests**:
   - Add Vitest test suites for `src/lib/trip-plan.ts` (verifying plan generation calculations) and `src/lib/smarttrip-store.ts` (verifying state operations and `localStorage` syncing).
10. **Clean Up `package.json`**:
    - Update `"name": "tanstack_start_ts"` to `"smarttrip"`.
