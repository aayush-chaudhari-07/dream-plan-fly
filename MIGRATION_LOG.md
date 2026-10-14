# Migration Log

This log tracks all changes, refactors, feature implementations, and fixes made during the migration to production-ready status.

---

## Task 0: Repository Baseline & Setup

- **Date**: 2026-10-13
- **Branch**: `production-ready`
- **Actions Taken**:
  - Committed baseline project state including `PROJECT_CONTEXT.md` to `main`.
  - Created and switched to branch `production-ready`.
  - Initialized `MIGRATION_LOG.md` to track changes and touched files across subsequent tasks.
  - Executed baseline checks (`npm install`, `npm run build`, `npm run lint`) to audit initial repository health.
- **Files Touched**:
  - `PROJECT_CONTEXT.md` (committed baseline)
  - `MIGRATION_LOG.md` (created log file)

---

## Task 1: Complete Decoupling from Lovable

- **Date**: 2026-10-13
- **Branch**: `production-ready`
- **Actions Taken**:
  - Deleted `.lovable/` configuration directory and `AGENTS.md`.
  - Deleted `src/lib/lovable-error-reporting.ts` and created `src/lib/error-report.ts` providing a decoupled `reportError()` helper ready for Sentry/monitoring integration.
  - Updated `src/routes/__root.tsx` to replace `reportLovableError` with `reportError`.
  - Removed `@lovable.dev/vite-tanstack-config` dependency from `package.json`.
  - Rewrote `vite.config.ts` from scratch using standard official plugins: `tanstackStart` (`@tanstack/react-start/plugin/vite`), `viteReact` (`@vitejs/plugin-react`), `tailwindcss` (`@tailwindcss/vite`), `tsConfigPaths` (`vite-tsconfig-paths`), and `nitro` (`nitro/vite`). Configured SSR server entry pointing to `src/server.ts`, `@/*` alias, and `VITE_*` env prefix.
  - Renamed `package.json` name from `tanstack_start_ts` to `smarttrip`.
  - Removed `bun.lock` and `bunfig.toml`, establishing `npm` as the sole package manager and regenerating `package-lock.json`.
  - Updated `README.md` to remove all Lovable references, replace live URLs with placeholder `https://your-domain.com`, and document standalone development.
  - Updated `PROJECT_CONTEXT.md` to remove all Lovable references.
  - Verified zero occurrences of "lovable" and "gptengineer" across the codebase via case-insensitive grep.
- **Files Touched**:
  - `package.json` (renamed name to smarttrip, removed `@lovable.dev/vite-tanstack-config`)
  - `vite.config.ts` (rewritten with official Vite/TanStack/Nitro plugins)
  - `src/routes/__root.tsx` (switched to error-report.ts)
  - `src/lib/error-report.ts` (created)
  - `src/lib/lovable-error-reporting.ts` (deleted)
  - `.lovable/` (deleted)
  - `AGENTS.md` (deleted)
  - `bun.lock` (deleted)
  - `bunfig.toml` (deleted)
  - `README.md` (updated)
  - `PROJECT_CONTEXT.md` (updated)
  - `MIGRATION_LOG.md` (updated)

---

## Task 2: Foundation Cleanup, Testing & Hardening

- **Date**: 2026-10-13
- **Branch**: `production-ready`
- **Actions Taken**:
  - Pruned 27 unused Shadcn UI components from `src/components/ui/` while retaining imported components and designated future-use primitives (`accordion`, `badge`, `button`, `calendar`, `card`, `command`, `dialog`, `drawer`, `dropdown-menu`, `input`, `popover`, `progress`, `select`, `sheet`, `skeleton`, `sonner`, `tabs`, `textarea`, `tooltip`).
  - Installed Vitest, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
  - Added `vitest.config.ts` and `src/test/setup.ts`.
  - Added `test`, `test:watch`, and `typecheck` scripts to `package.json`.
  - Created unit test suite in `src/lib/__tests__/trip-plan.test.ts` testing `buildPlan()` (budget parsing, traveler parsing, day parsing, clamping 2-10 days, budget breakdown sum verification, category recognition, and carbon calculations).
  - Created unit test suite in `src/lib/__tests__/smarttrip-store.test.ts` testing all store actions (savePlan, moveTrip, removeTrip, addBooking, cancelBooking, addFund, contribute, removeFund, toggleWish, reset).
  - Added `.env.example` with standard environment variables.
  - Added GitHub Actions CI workflow in `.github/workflows/ci.yml` running install, lint, typecheck, test, and build on push/PR to `main` and `production-ready`.
  - Fixed all React Refresh warnings in `AiPlanner.tsx` and `Reveal.tsx`, and updated `eslint.config.js` with UI component override for CVA variants.
  - Set `.prettierrc` `endOfLine: "auto"` to eliminate cross-platform CRLF lint errors.
  - Verified `npm run lint` (0 errors, 0 warnings), `npm run typecheck` (clean), `npm run test` (20/20 passed), and `npm run build` (successful Nitro/SSR build).
  - Tested development server (`npm run dev`) and production server (`npm run preview`), confirming all 6 routes (`/`, `/ai-planner`, `/bookings`, `/explore`, `/my-trips`, `/save`) respond with HTTP 200 and zero console errors.
- **Files Touched**:
  - `src/components/ui/` (pruned 27 unused components)
  - `vitest.config.ts` (created)
  - `src/test/setup.ts` (created)
  - `src/lib/__tests__/trip-plan.test.ts` (created)
  - `src/lib/__tests__/smarttrip-store.test.ts` (created)
  - `.env.example` (created)
  - `.github/workflows/ci.yml` (created)
  - `package.json` (added test, test:watch, typecheck scripts, updated preview script)
  - `tsconfig.json` (added vitest.config.ts and vitest/globals)
  - `eslint.config.js` (added UI component CVA variant override)
  - `.prettierrc` (added endOfLine: auto)
  - `src/components/smarttrip/AiPlanner.tsx` (removed non-component re-exports)
  - `src/components/smarttrip/Reveal.tsx` (made useInView internal)
  - `src/components/ui/button.tsx` (exported const buttonVariants inline)
  - `src/components/ui/badge.tsx` (exported const badgeVariants inline)
  - `MIGRATION_LOG.md` (updated)

---

## Task 3: Supabase Backend, Auth & TanStack Query Integration

- **Date**: 2026-10-13
- **Branch**: `production-ready`
- **Actions Taken**:
  - Installed `@supabase/supabase-js` (v2.117.3) and `@supabase/ssr` (v0.12.7).
  - Designed the comprehensive relational database schema in `supabase/migrations/001_init.sql` covering `profiles`, `trips` (with `trip_bucket` enum `Upcoming` / `Past` / `Saved` and JSONB `plan`), `bookings`, `funds`, `fund_contributions`, `wishlist`, and `notifications`. Enabled Row Level Security (RLS) on all tables with strict user isolation policies (`auth.uid() = user_id`) and automatic profile provisioning via trigger on `auth.users`.
  - Created client-side Supabase client (`src/lib/supabase/client.ts`) and server-side Supabase client (`src/lib/supabase/server.ts`) integrated with TanStack Start cookie handlers (`getCookies()`, `setCookie()`).
  - Implemented typed, Zod-validated server functions (`createServerFn`) in `src/lib/server/trip-actions.ts` for all persistence operations: `getUserFn`, `fetchUserDataFn`, `savePlanFn`, `moveTripFn`, `removeTripFn`, `addBookingFn`, `cancelBookingFn`, `addFundFn`, `contributeFundFn`, `removeFundFn`, `toggleWishFn`, and `migrateGuestDataFn`.
  - Refactored `smarttrip-store.ts` to support both signed-in users (via TanStack Query caching and optimistic mutations) and guests (via localStorage fallback). Added one-time automated guest data migration upon account creation.
  - Built polished, responsive authentication pages matching the design system: `/login` (`src/routes/login.tsx`), `/signup` (`src/routes/signup.tsx`), and OAuth callback handler (`src/routes/auth/callback.tsx`).
  - Added route protection for `/my-trips`, `/save`, and booking checkout on `/bookings`, with return redirects (`?redirect=...`) after login.
  - Updated `Navbar.tsx` with user account dropdown, initials avatar, profile details, and logout action.
  - Added loading skeletons and error states with retry capabilities in `my-trips.tsx` and `TripFund.tsx`.
  - Updated `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and documented Supabase setup, migrations, and auth configuration in `README.md`.
  - Verified `npm run lint` (0 errors, 0 warnings), `npm run typecheck` (0 errors), `npm run test` (20/20 passed), and `npm run build` (clean Nitro & SSR build).
- **Files Touched**:
  - `package.json` (installed @supabase/supabase-js, @supabase/ssr)
  - `package-lock.json`
  - `supabase/migrations/001_init.sql` (created)
  - `src/lib/supabase/client.ts` (created)
  - `src/lib/supabase/server.ts` (created)
  - `src/lib/server/trip-actions.ts` (created)
  - `src/lib/auth-context.tsx` (created)
  - `src/lib/query-client.ts` (created)
  - `src/lib/smarttrip-store.ts` (refactored with TanStack Query and server functions)
  - `src/router.tsx` (connected shared queryClient)
  - `src/routes/__root.tsx` (wrapped in AuthProvider)
  - `src/routes/login.tsx` (created)
  - `src/routes/signup.tsx` (created)
  - `src/routes/auth/callback.tsx` (created)
  - `src/routes/my-trips.tsx` (added auth guard, skeletons, and error handling)
  - `src/routes/save.tsx` (added auth guard)
  - `src/routes/bookings.tsx` (added checkout auth guard)
  - `src/components/smarttrip/Navbar.tsx` (added auth state and profile dropdown)
  - `src/components/smarttrip/TripFund.tsx` (added skeletons and error handling)
  - `eslint.config.js` (added auth-context override)
  - `.env.example` (added Supabase env vars)
  - `README.md` (added Supabase setup guide)
  - `MIGRATION_LOG.md` (updated)

## [Task 5] - AI Trip Planner Real LLM Integration (Google Gemini Flash) with Fallback Engine

- **Goal**: Connect the AI Trip Planner to Google Gemini (`@google/genai` Flash model) via a secure server function, with structured JSON validation, 1-retry logic, rule-based fallback to `buildPlan()`, rate limiting, public plan sharing at `/plan/$id`, quick refinements, and comprehensive unit tests.
- **Changes**:
  1. **Google Gemini LLM Integration (`@google/genai`)**:
     - Installed `@google/genai` (v2.29.1).
     - Created `src/server/generate-plan.ts` with `generatePlan` server function calling `gemini-2.5-flash`.
     - Read `GEMINI_API_KEY` exclusively from `process.env['GEMINI_API_KEY']` on the server, never exposing secrets to the client.
     - Structured JSON output validated using Zod against `generatedPlanSchema`.
     - Implemented automatic retry: if validation fails, retries once with the LLM; if both attempts fail or if `GEMINI_API_KEY` is not configured, transparently falls back to `buildPlan()`.
     - Built comprehensive prompt with destination, duration, travelers, budget in INR, interests, budget sum rule, realistic INR pricing, real attractions, local food, and weather/packing advice.
     - Implemented `normalizePlan()` to guarantee that budget breakdown amounts sum exactly to the total budget.
  2. **Rate Limiting & Input Protection (`src/server/rate-limiter.ts`)**:
     - Implemented in-memory sliding-window rate limiting per user ID or client IP for guests (25 requests per 10-minute window).
     - Added input length bounds via Zod schema (`prompt` up to 1000 chars, `destination` up to 100 chars, `instruction` up to 500 chars).
  3. **Public Shared Plan Route (`/plan/$id`)**:
     - Created `supabase/migrations/002_shared_plans.sql` with public read/write RLS policies.
     - Added server functions `savePublicPlanFn` and `getPublicPlanFn` with in-memory store and Supabase database fallback.
     - Created public read-only page `src/routes/plan/$id.tsx` rendering the full itinerary, timeline, budget breakdown, and action buttons ("Save to My Trips", "Copy Link", "Print / PDF", "Customize with AI").
  4. **Updated `AiPlanner.tsx`**:
     - Replaced local timeout with server function `generatePlan`.
     - Added rich progressive loading state cycling through status feedback messages.
     - Added error banner with retry and offline fallback.
     - Connected share URL button to `savePublicPlanFn`, generating shareable `/plan/$id` links.
     - Added 3 quick-refine buttons:
       - **Regenerate**: requests fresh alternative route & attractions.
       - **Make it cheaper**: scales budget down ~20% and optimizes for hostels, public transit, and free sights.
       - **Add more adventure**: optimizes for high-adrenaline outdoor sports, hikes, and thrills.
     - Added source badges ("Gemini 2.5 Flash" vs "SmartTrip Engine").
     - Kept "Save to My Trips", print/PDF, and direct booking intact.
  5. **Unit Tests (`src/server/__tests__/generate-plan.test.ts`)**:
     - 14 tests covering: valid LLM generation, schema validation retry, fallback on failure, fallback on missing API key, network error fallback, schema edge cases, budget breakdown sum normalization, and rate limiting.
- **Files Touched**:
  - `package.json` (added `@google/genai`)
  - `.env.example` (documented `GEMINI_API_KEY`)
  - `src/lib/trip-plan.ts` (updated `PlanOptions` type)
  - `src/server/generate-plan.ts` (created)
  - `src/server/rate-limiter.ts` (created)
  - `src/server/index.ts` (created)
  - `src/routes/plan/$id.tsx` (created)
  - `src/routeTree.gen.ts` (regenerated)
  - `src/components/smarttrip/AiPlanner.tsx` (updated)
  - `src/server/__tests__/generate-plan.test.ts` (created)
  - `supabase/migrations/002_shared_plans.sql` (created)
  - `MIGRATION_LOG.md` (updated)

## [Task 6] - Interactive Map ("Explore Around You") & Destination Detail Pages

- **Goal**: Build the interactive Leaflet map with OpenStreetMap tiles, real coordinates for places and all 9 destinations, category filters, geolocation distance sorting, "Add to Trip" actions, landing page mounting, and `/destination/$id` detail views.
- **Changes**:
  1. **Leaflet & React-Leaflet SSR-Safe Integration**:
     - Installed `leaflet`, `react-leaflet`, and `@types/leaflet`.
     - Built client-only `src/components/smarttrip/map/LeafletMapClient.tsx` using OpenStreetMap tiles with custom DivIcon SVG pins for Attractions (emerald), Hotels (indigo), Dining (amber), and Activities (sky), plus a blue pulsing marker for user location.
     - Implemented dynamic lazy-loading with skeleton fallback in `src/components/smarttrip/InteractiveMap.tsx` to prevent any SSR `window is not defined` errors.
     - Added customized Leaflet popup and marker styles in `src/styles.css`.
  2. **Real Latitude & Longitude Datasets (`src/data/travel.ts`)**:
     - Replaced old percentage x/y coordinates with real `lat` and `lng` coordinates.
     - Created detailed places (Attractions, Hotels, Restaurants, Activities) for all 9 destinations (`manali`, `goa`, `kashmir`, `kyoto`, `maldives`, `lonavala`, `munnar`, `rishikesh`, `jaipur`).
     - Added rich destination fields: `lat`, `lng`, `description`, `weather` ({ temp, condition, season, summary }), `bestTimeToVisit`, and signature `highlights`.
     - Added `calculateDistanceKm()` helper implementing the Haversine formula.
  3. **Interactive Map Component (`src/components/smarttrip/InteractiveMap.tsx`)**:
     - Added category filters (`All`, `Attractions`, `Hotels`, `Restaurants`, `Activities`) with keyboard focusability and ARIA accessibility.
     - Added destination selector dropdown with options for all 9 destinations.
     - Added "Use my location" button utilizing browser geolocation API (`navigator.geolocation`) to center the map, recalculate exact distances in kilometers, and re-sort places by proximity.
     - Added sidebar place cards with ratings, distances, notes, prices, and clickable centering.
     - Added "Add to Trip" button calling `smartTrip.addPlaceToTrip()` with visual checkmark feedback.
  4. **Destination Detail Pages (`src/routes/destination/$id.tsx`)**:
     - Created `/destination/$id` route with hero cover image, badges, rating, starting price.
     - Weather overview card and best time to visit card.
     - Narrative description and highlights grid.
     - Embedded Interactive Map centered on the selected destination.
     - Action CTAs for "Plan AI Itinerary" and "Book Hotels & Transport".
     - Connected links in `ExploreDestinations.tsx` and `EscapeHills.tsx`.
  5. **Landing Page Integration (`src/routes/index.tsx`)**:
     - Added `<InteractiveMap />` section to landing page between AI Planner and Trip Fund.
  6. **Unit Tests (`src/components/smarttrip/__tests__/InteractiveMap.test.ts`)**:
     - 6 unit tests verifying all 9 destinations have coordinates/weather/advice, real lat/lng for places across all 4 categories, Haversine distance calculations, and `smartTrip.addPlaceToTrip()` functionality.
- **Files Touched**:
  - `package.json` (added `leaflet`, `react-leaflet`, `@types/leaflet`)
  - `package-lock.json`
  - `src/data/travel.ts` (updated `Destination` and `MapPlace` datasets and added `calculateDistanceKm`)
  - `src/lib/smarttrip-store.ts` (added `addPlaceToTrip` method)
  - `src/styles.css` (added Leaflet popup and custom pin CSS)
  - `src/components/smarttrip/map/LeafletMapClient.tsx` (created)
  - `src/components/smarttrip/InteractiveMap.tsx` (created)
  - `src/routes/destination/$id.tsx` (created)
  - `src/routes/index.tsx` (mounted InteractiveMap)
  - `src/components/smarttrip/ExploreDestinations.tsx` (linked to destination detail page)
  - `src/components/smarttrip/EscapeHills.tsx` (linked to destination detail page)
  - `src/routeTree.gen.ts` (regenerated)
  - `src/components/smarttrip/__tests__/InteractiveMap.test.ts` (created)
  - `MIGRATION_LOG.md` (updated)

---

## [Task 6] - Navbar Real Features: Search Command Palette, Wishlist Sheet, Notifications Popover, Profile Dropdown & Settings Page

- **Goal**: Replace all placeholder and "coming up next" panels in `Navbar.tsx` with real, production-ready features:
  1. Search: Command palette (`cmdk`) triggered via Search button or `Ctrl/Cmd+K`, searching destinations, saved trips, and bookings, with keyboard navigation and recent searches.
  2. Wishlist: Right-side `Sheet` listing wishlisted destinations with images, prices, remove button, and "Plan a trip" shortcut.
  3. Notifications: Popover backed by the notifications table (booking confirmations, fund milestones, price drop alerts) with unread count and mark-all-read.
  4. Profile: Dropdown menu showing user's name and avatar, links to My Trips, Trip Fund, Settings, and Logout. Built a `/settings` page to edit name, avatar, home city, and currency.
  5. Guest Auth: Explicit Sign In and Sign Up buttons for guests.
  6. Mobile Menu: Full mobile menu support for search, wishlist, settings, notifications, and guest auth.
- **Changes**:
  1. **Search Command Palette (`src/components/smarttrip/SearchCommandDialog.tsx`)**:
     - Built using `cmdk` and Radix Dialog.
     - Supports global shortcut `Ctrl+K` and `Cmd+K` across all pages.
     - Instant search filtering across all 9 destinations, user's saved/upcoming trips, bookings, and quick action shortcuts.
     - Persistent recent searches in `localStorage` with 1-click removal and "Clear all" action.
  2. **Wishlist Sheet (`src/components/smarttrip/WishlistSheet.tsx`)**:
     - Right-side slide-over sheet showing all saved destinations with thumbnail imagery, location, starting prices, and budget summary.
     - 1-click remove destination action with toast feedback and instant store synchronization.
     - Direct "Plan Trip" shortcut launching the AI Planner pre-filled with the selected destination.
     - Empty state with direct link to Explore Destinations.
  3. **Notifications Popover (`src/components/smarttrip/NotificationsPopover.tsx`)**:
     - Backed by `public.notifications` table in Supabase and `useSmartTrip().notifications`.
     - Displays formatted alerts for booking confirmations, fund milestones, and price drops with relative timestamps ("Just now", "35m ago", "4h ago", "1d ago").
     - Animated unread counter badge on the navbar bell icon.
     - "Mark all read" button calling `smartTrip.markAllNotificationsRead()` and server action `markAllNotificationsReadFn`.
     - Individual notification mark-read on click with automatic route navigation when a link is attached.
  4. **Avatar UI Component (`src/components/ui/avatar.tsx`)**:
     - Created Radix UI Avatar primitive wrapper (`Avatar`, `AvatarImage`, `AvatarFallback`) with gradient initials fallback.
  5. **Profile Dropdown in Navbar (`src/components/smarttrip/Navbar.tsx`)**:
     - Shows user avatar image, full name, and email.
     - Direct links to My Trips & Bookings (`/my-trips`), Trip Funds (`/save`), and Settings (`/settings`).
     - Sign out action with redirect to home page and toast confirmation.
  6. **Settings Page (`src/routes/settings.tsx`)**:
     - Form to edit Full Name, Avatar Picture URL, Home Departure City, and Preferred Currency (`INR`, `USD`, `EUR`, `GBP`, `JPY`, `AED`).
     - 6 curated traveler avatar presets with 1-click selection and live avatar preview.
     - Quick select chips for popular Indian and global travel hubs (Mumbai, Delhi, Bengaluru, Goa, London, New York, etc.).
     - Saves to Supabase user metadata and `public.profiles` table via `updateProfile` and `updateProfileFn`.
  7. **Guest Authentication & Mobile Menu**:
     - Desktop navbar displays both "Sign In" and "Sign Up" buttons for unauthenticated guests.
     - Mobile menu provides quick search trigger, wishlist and settings shortcut pills, unread notifications indicator, and auth controls.
  8. **Database & Store Updates**:
     - Updated `supabase/migrations/001_init.sql` schema with `home_city` and `currency` in `profiles`, and `link` in `notifications` with insert RLS policy.
     - Updated `src/lib/server/trip-actions.ts` to include notifications in `fetchUserDataFn`, `markAllNotificationsReadFn`, `markNotificationReadFn`, and `updateProfileFn`.
     - Updated `src/lib/smarttrip-store.ts` with notification types, seeding, and actions.
     - Added comprehensive unit tests in `src/lib/__tests__/smarttrip-store.test.ts` (42 total passing tests).
- **Files Touched**:
  - `src/components/ui/avatar.tsx` (created)
  - `src/components/smarttrip/SearchCommandDialog.tsx` (created)
  - `src/components/smarttrip/WishlistSheet.tsx` (created)
  - `src/components/smarttrip/NotificationsPopover.tsx` (created)
  - `src/routes/settings.tsx` (created)
  - `src/components/smarttrip/Navbar.tsx` (updated)
  - `src/lib/smarttrip-store.ts` (updated)
  - `src/lib/auth-context.tsx` (updated)
  - `src/lib/server/trip-actions.ts` (updated)
  - `src/lib/__tests__/smarttrip-store.test.ts` (updated)
  - `supabase/migrations/001_init.sql` (updated)
  - `src/routeTree.gen.ts` (regenerated)
  - `MIGRATION_LOG.md` (updated)

---

## [Task 7] - Final Core Features: Quick Travel Guide, Trip Fund Celebration & History, DnD Itinerary Editor, Verified Reviews, Newsletter & FAQ Support System

- **Goal**: Implement all remaining incomplete features from `PROJECT_CONTEXT.md` section 9 and `README.md` section 10:
  1. Quick Travel Guide: 3-stage accordion ("Before You Go", "During Your Trip", "Smart Tips") with real checklists (documents, health, packing, money, safety, local etiquette). Added to the landing page and plan view.
  2. Trip Fund: `canvas-confetti` celebration at 100%, deposit contributions stored in `fund_contributions` with history list, edit and delete for funds, amount validation, and notifications at 25%, 50%, 75%, 100%.
  3. Itinerary Editor: drag-and-drop reordering of activities within and across days in `AiPlanner.tsx` using `@dnd-kit`, with add, edit, delete, Undo toast, and plan persistence.
  4. Real Reviews: replaced placeholder testimonials with `ReviewsSection.tsx` backed by `reviews` table, restricted to logged-in travelers with confirmed bookings or trips.
  5. Newsletter Form: footer newsletter form stored in `newsletter_subscribers` table with validation and duplicate protection.
  6. Support Dock & FAQ: 24/7 Support Dock and comprehensive FAQ page (`/faq`) with searchable categories and ticket submissions stored in `support_tickets` table.
- **Changes**:
  1. **Quick Travel Guide (`src/components/smarttrip/QuickTravelGuide.tsx`)**:
     - 3-stage accordion following README section 10 specifications:
       - "1. Before You Go" (Pre-Departure): Passports, photo IDs, travel insurance, digital backups, prescription medications, climate/altitude readiness, footwear, universal power adapters.
       - "2. During Your Trip" (On the Ground): Split card/cash payments, meter negotiation, emergency contacts (112), baggage vigilance, sacred site attire etiquette, photography permission.
       - "3. Smart Tips & Traveler Hacks" (Pro Secrets): High-turnover local eateries, offline Google Maps, reusable flask refills, sunrise monument timings.
     - Interactive checkbox state with real-time percentage progress bar, persistent in `localStorage`.
     - Mounted in `src/routes/index.tsx`, `src/routes/plan/$id.tsx`, and `AiPlanner.tsx`.
  2. **Trip Fund Enhancements (`src/components/smarttrip/TripFund.tsx` & `src/lib/smarttrip-store.ts`)**:
     - Integrated `canvas-confetti` celebration burst when fund savings reach 100%.
     - Deposit history dialog modal displaying all deposits recorded in `fund_contributions`.
     - Edit Fund dialog to adjust target amount, target date, months left, and traveler count.
     - Delete Fund confirmation dialog with `smartTrip.removeFund()`.
     - Validated deposit inputs (₹100 min to ₹1,00,00,000 max; minimum fund target ₹1,000).
     - Milestone notifications triggered at 25%, 50%, 75%, and 100% saved thresholds.
  3. **Itinerary Drag-and-Drop Editor (`src/components/smarttrip/ItineraryEditor.tsx` & `AiPlanner.tsx`)**:
     - Built using `@dnd-kit/core` and `@dnd-kit/sortable` with vertical list strategy, pointer/keyboard sensors, and smooth drag overlay.
     - Supports dragging activities between days and reordering within the same day.
     - Inline "+ Add Activity" form for any day.
     - Inline Edit mode with Save and Cancel for activity descriptions.
     - Delete activity with immediate Sonner Undo toast (`toast("Activity removed", { action: { label: "Undo", onClick: () => restore() } })`).
     - Persists edited itineraries to state, `smartTrip`, and `localStorage.setItem("smarttrip.current_plan", ...)`.
  4. **Verified Traveler Reviews (`src/components/smarttrip/ReviewsSection.tsx`)**:
     - Created `public.reviews` schema in `supabase/migrations/003_features.sql`.
     - Server functions `fetchReviewsFn` and `submitReviewFn` in `src/lib/server/trip-actions.ts`.
     - Server-side verification enforcing that only users with confirmed bookings or saved trips can submit verified reviews.
     - Star rating picker (1–5), destination input, review headline, detailed comments, and verified badge.
     - Replaced hardcoded `Testimonials.tsx` on the landing page (`src/routes/index.tsx`).
  5. **Newsletter Subscription with Duplicate Protection (`src/components/smarttrip/Footer.tsx`)**:
     - Created `public.newsletter_subscribers` table in `supabase/migrations/003_features.sql`.
     - Server function `subscribeNewsletterFn` with email normalization and unique constraint duplicate protection.
     - Connected footer newsletter form with loading state and user feedback.
  6. **Support Dock & Help Center / FAQ Page (`src/routes/faq.tsx` & `SupportDock.tsx`)**:
     - Created `public.support_tickets` table in `supabase/migrations/003_features.sql`.
     - Server function `submitSupportTicketFn` generating unique reference IDs (`#ST-XXXX`).
     - Help Center & FAQ page at `/faq` with searchable categories (Bookings, AI Planner, Trip Fund, Safety & Emergency, Payments & Refunds).
     - Direct customer support ticket submission form with reference copy button.
     - 24/7 Traveler Emergency Hotline banner (+91 1800-762-788).
     - SupportDock updated with links to `/faq` and emergency contact modal.
  7. **Verification & Tests**:
     - 45 passing unit tests across `smarttrip-store.test.ts`, `generate-plan.test.ts`, `trip-plan.test.ts`, and `InteractiveMap.test.ts`.
     - `tsc --noEmit` typecheck passes with 0 errors.
     - `eslint .` passes with 0 errors and 0 warnings.
     - `vite build` passes and compiles server/client production bundles cleanly.
- **Files Touched**:
  - `package.json` (installed `canvas-confetti`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@types/canvas-confetti`)
  - `package-lock.json`
  - `supabase/migrations/003_features.sql` (created)
  - `src/lib/server/trip-actions.ts` (added reviews, newsletter, and support ticket server functions)
  - `src/lib/smarttrip-store.ts` (added contributions history, editFund, removeFund, and milestone notifications)
  - `src/components/smarttrip/QuickTravelGuide.tsx` (created)
  - `src/components/smarttrip/TripFund.tsx` (added confetti celebration, deposit history, edit and delete dialogs)
  - `src/components/smarttrip/ItineraryEditor.tsx` (created)
  - `src/components/smarttrip/AiPlanner.tsx` (integrated ItineraryEditor, plan persistence, and QuickTravelGuide)
  - `src/components/smarttrip/ReviewsSection.tsx` (created)
  - `src/routes/index.tsx` (mounted QuickTravelGuide and ReviewsSection)
  - `src/routes/plan/$id.tsx` (mounted QuickTravelGuide)
  - `src/components/smarttrip/Footer.tsx` (connected newsletter subscription and FAQ links)
  - `src/routes/faq.tsx` (created)
  - `src/components/smarttrip/SupportDock.tsx` (updated with FAQ link and contact modal)
  - `src/lib/__tests__/smarttrip-store.test.ts` (added milestone and fund management tests)
  - `src/routeTree.gen.ts` (regenerated)
  - `MIGRATION_LOG.md` (updated)

---

## [Task 8] - Free Tier Audit, Quota Protection, Supabase Keep-Alive & Free Stack Documentation

- **Goal**: Ensure the entire application operates strictly on permanent free tiers without paid plans, credit card requirements, or expiring trials:
  1. Audit dependencies, server actions, `.env.example`, and all external API interactions to ensure 100% free permanent tier compatibility.
  2. Protect free-tier quotas:
     - **Gemini**: Server-side cache (normalized prompt & parameters), per-user daily limit (15/day), per-IP limit for guests (5/day), global daily counter (1,000/day safety threshold vs 1,500 hard quota) falling back to rule-based `buildPlan()`, circuit breaker pattern, and graceful HTTP 429 error interception with silent fallback.
     - **Supabase**: Avoid redundant queries for unauthenticated guests, add foreign key and query performance indexes on all `user_id` columns, implement lightweight `/api/keep-alive` endpoint, and schedule a twice-weekly GitHub Actions cron (`0 6 * * 1,4`) to prevent automatic 7-day inactivity project pausing.
     - **OpenStreetMap tiles**: Proper legal attribution (`© OpenStreetMap contributors`), client-only lazy loading (zero SSR tiles), aggressive client caching (`updateWhenIdle={true}`, `updateWhenZooming={false}`, `keepBuffer={2}`), and zero speculative tile preloading.
  3. Create `docs/FREE_STACK.md` providing comprehensive service matrices, verifiable official limits, quota fallback behavior, verification links, and a $0 deployment guide.
  4. Confirm that running locally and deploying to production requires zero credit card input.
- **Changes**:
  1. **Quota Protection & Server Cache (`src/server/rate-limiter.ts` & `src/server/generate-plan.ts`)**:
     - Built `generatePlanCacheKey()` normalizing destination, days, budget, travelers, and interests.
     - Added server-side TTL caching (`getCachedPlan`, `setCachedPlan`) so identical planning requests return stored results with zero Gemini API quota consumption.
     - Added tiered daily rate limits: 15 plans/day for authenticated users, 5 plans/day for guests per IP address.
     - Added global daily safety counter (`isGlobalDailyQuotaNear`, threshold 1,000 requests/day against Google's 1,500 RPD cap).
     - Added 60-second circuit breaker (`tripCircuitBreaker`) triggered on API errors or 429 rate limit responses.
     - Handled HTTP 429 errors gracefully by falling back immediately and seamlessly to the offline rule-based `buildPlan()` engine with `source: "SmartTrip Engine"`.
  2. **Supabase Inactivity Keep-Alive & Query Optimization**:
     - Created `/api/keep-alive` lightweight API handler in `src/server.ts` and `src/lib/server/trip-actions.ts` (`pingKeepAliveFn`).
     - Queries a single profile ID (`/rest/v1/profiles?select=id&limit=1`) to register database activity and reset Supabase's 7-day free inactivity pause timer.
     - Created GitHub Actions workflow `.github/workflows/keep-alive.yml` running Mondays and Thursdays (`0 6 * * 1,4`).
     - Added indexes on `user_id` across all application tables in `supabase/migrations/004_free_tier_optimizations.sql` (`shared_plans`, `reviews`, `support_tickets`, and compound indexes `(user_id, created_at desc)` for `trips`, `bookings`, `notifications`).
  3. **OpenStreetMap Tile Caching & Attribution (`src/components/smarttrip/map/LeafletMapClient.tsx`)**:
     - Verified OSM tile attribution (`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`).
     - Enforced `updateWhenIdle={true}` and `updateWhenZooming={false}` to eliminate tile requests during panning and zooming animations.
     - Configured `keepBuffer={2}` to reuse rendered tiles without fetching fresh tiles.
     - Dynamic SSR import guarantees zero tile network requests before client-side view mounting.
  4. **Documentation (`docs/FREE_STACK.md`)**:
     - Detailed full stack audit matrix: Google Gemini (Free tier), Supabase (Free tier), OpenStreetMap / Leaflet, Google Fonts / Lucide Icons, Unsplash Free URLs, GitHub Actions (2,000 min/mo free), Vercel / Netlify / Render Free hosting.
     - Explicit verification URLs and documented behavior when limits are reached.
     - Verified that zero credit cards are needed for local development, testing, and production deployment.
  5. **Automated Tests (`src/server/__tests__/generate-plan.test.ts`)**:
     - Added unit tests for plan cache hits (avoiding Gemini API calls), guest daily limits, and graceful HTTP 429 fallback to `buildPlan()`.
- **Files Touched**:
  - `src/server/rate-limiter.ts` (updated)
  - `src/server/generate-plan.ts` (updated)
  - `src/server.ts` (updated)
  - `src/lib/server/trip-actions.ts` (updated)
  - `src/components/smarttrip/map/LeafletMapClient.tsx` (updated)
  - `supabase/migrations/002_shared_plans.sql` (updated)
  - `supabase/migrations/003_features.sql` (updated)
  - `supabase/migrations/004_free_tier_optimizations.sql` (created)
  - `.github/workflows/keep-alive.yml` (created)
  - `docs/FREE_STACK.md` (created)
  - `src/server/__tests__/generate-plan.test.ts` (updated)
  - `MIGRATION_LOG.md` (updated)

---

## [Task 9] - Complete Free-Tool Demo Booking Engine, Payment Adapter, Checkout & E-Ticket

- **Goal**: Build the complete end-to-end booking experience using 100% free tools and databases, functioning as a clearly labeled, production-grade DEMO:
  1. **Data Layer (No Paid APIs)**:
     - Programmatic flight generator (`src/data/flight-generator.ts`) generating 6–10 realistic options/day for any airport pair using deterministic seeded randomness (Mulberry32 PRNG). Returns consistent results for identical dates and routes with real airline fleets, flight schedules, stops, and dynamic fares.
     - Curated OpenFlights airports dataset (`src/data/airports.ts`) with zero runtime external API calls.
     - Indian inventory datasets (`src/data/inventory-data.ts`) with realistic stays, rentals, Vande Bharat/transit, and holiday packages.
     - Database migration (`supabase/migrations/005_booking_system.sql`) and seed script (`supabase/seed.sql`).
  2. **Search UX & Booking Discovery**:
     - Upgraded `QuickBooking.tsx` and `/bookings` route (`src/routes/bookings.tsx`) with `AirportCombobox` autocomplete, date pickers, passenger counter, and cabin class selector.
     - Multi-criteria filter sidebar: price slider, stops filter, departure time-of-day filters, and star ratings.
     - Sorting controls (cheapest, fastest, earliest departure, rating) and empty/loading feedback states.
  3. **Payment Adapter & Security**:
     - Provider interface (`PaymentProvider`) in `src/server/payments/payment-types.ts`.
     - Built-in `DemoPayProvider` (`src/server/payments/demo-provider.ts`) with signed HMAC-SHA256 server verification (`DEMO_PAY_SECRET`), test cards (`DEMO_TEST_CARDS`), simulated outcomes, and simulated refunds.
     - Strict card security validator (`src/server/payments/card-validator.ts`): rejects real credit cards with an explicit safety message; never stores or logs card data.
     - Optional `RazorpayTestProvider` (`src/server/payments/razorpay-provider.ts`): activated only when test keys exist in env; disabled by default.
     - Realistic payment modal (`src/components/smarttrip/booking/DemoPaymentModal.tsx`) with Card, UPI, and Net Banking tabs.
  4. **Checkout Experience (`/checkout`)**:
     - `/checkout` route (`src/routes/checkout.tsx`) with React Hook Form + Zod traveler validation.
     - Complete fare breakdown summary with 18% GST taxes, airport fees, convenience fees, and promo discounts.
     - Prominent amber banner: "Demo booking, no real ticket or charge".
     - Idempotency key generation preventing duplicate bookings on double clicks.
  5. **Booking Lifecycle & State Management**:
     - Statuses: `pending`, `confirmed`, `cancelled`, `failed`.
     - Deterministic booking reference generator (`STFL...`, `STHT...`, etc.).
     - Typed server functions in `src/lib/server/booking-actions.ts`.
     - Automatic creation of linked `Upcoming` trip, booking notification, and confirmation redirect.
  6. **Client-Side E-Ticket Voucher**:
     - `ETicketView.tsx` (`src/components/smarttrip/booking/ETicketView.tsx`) with client-side QR code generator (`qrcode`), traveler manifest, print stylesheet (`@media print`), and diagonal "DEMO TICKET - NOT VALID FOR TRAVEL" watermark.
     - Confirmation page at `/booking-confirmation/$id` (`src/routes/booking-confirmation/$id.tsx`) and e-ticket buttons on `/my-trips`.
  7. **Cancellation & 100% Refund Simulation**:
     - Cancellation modal with refund policy explanation, automated status update (`cancelled`), linked trip removal, and refund notification.
  8. **Testing & QA**:
     - Vitest unit tests in `src/server/payments/__tests__/demo-provider.test.ts`, `src/data/__tests__/flight-generator.test.ts`, and `src/lib/server/__tests__/booking-lifecycle.test.ts`.
     - Playwright-ready `data-testid` attributes across checkout inputs and booking cards.
     - Verified lint (0 errors), typecheck (0 errors), tests (67 passed), and build (clean SSR/Nitro bundle).
- **Files Touched**:
  - `package.json` (installed qrcode, @types/qrcode)
  - `src/data/airports.ts` (created)
  - `src/data/flight-generator.ts` (created)
  - `src/data/inventory-data.ts` (created)
  - `supabase/migrations/005_booking_system.sql` (created)
  - `supabase/seed.sql` (created)
  - `src/server/payments/payment-types.ts` (created)
  - `src/server/payments/card-validator.ts` (created)
  - `src/server/payments/demo-provider.ts` (created)
  - `src/server/payments/razorpay-provider.ts` (created)
  - `src/server/payments/index.ts` (created)
  - `src/lib/server/booking-actions.ts` (created)
  - `src/lib/smarttrip-store.ts` (updated)
  - `src/components/ui/label.tsx` (created)
  - `src/components/smarttrip/booking/AirportCombobox.tsx` (created)
  - `src/components/smarttrip/booking/DemoPaymentModal.tsx` (created)
  - `src/components/smarttrip/booking/ETicketView.tsx` (created)
  - `src/components/smarttrip/QuickBooking.tsx` (updated)
  - `src/routes/bookings.tsx` (updated)
  - `src/routes/checkout.tsx` (created)
  - `src/routes/booking-confirmation/$id.tsx` (created)
  - `src/routes/my-trips.tsx` (updated)
  - `src/routeTree.gen.ts` (regenerated)
  - `src/server/payments/__tests__/demo-provider.test.ts` (created)
  - `src/data/__tests__/flight-generator.test.ts` (created)
  - `src/lib/server/__tests__/booking-lifecycle.test.ts` (created)
  - `.env.example` (updated)
  - `MIGRATION_LOG.md` (updated)

---

## [Task 10] - Live Data with Open-Meteo Weather, Frankfurter Currency & Price Alerts Cron

- **Goal**: Integrate live data using only free, key-less sources (Open-Meteo & Frankfurter), add a currency switcher with ECB rates, implement deterministic demo price fluctuations with watch alerts, and schedule a free GitHub Actions daily cron job:
  1. **Open-Meteo Weather Service**:
     - Key-less API client in `src/server/weather.ts` with WMO weather interpretation code mapping.
     - 30-minute in-memory caching (`WEATHER_CACHE_TTL_MS`) to protect performance and quota.
     - Graceful offline fallback providing estimated seasonal weather if the external API fails.
     - Terms-compliant attribution: "Weather data by Open-Meteo.com" linking to https://open-meteo.com/.
     - Replaced hardcoded sample temperatures in `EscapeHills.tsx` with live current weather for all 8 hill stations.
     - Built `WeatherForecastCard.tsx` displaying live conditions, humidity, wind, 7-day daily forecast cards, and optimal travel windows, mounted on destination detail pages (`/destination/$id`) and generated plan views (`/plan/$id`).
  2. **Frankfurter Currency Service**:
     - Key-less ECB reference rates client in `src/server/currency.ts` with INR base currency.
     - Daily 24-hour caching (`CURRENCY_CACHE_TTL_MS`).
     - Clean currency conversion (`convertCurrency`) for USD, EUR, GBP, JPY, AUD, CAD, SGD, etc.
     - Strict fallback: unsupported currencies (e.g. AED) automatically fall back to INR (₹) only, as specified.
     - Integrated live ECB exchange rates status, calculation previews, and ECB attribution in `/settings` (`src/routes/settings.tsx`).
  3. **Deterministic Price Fluctuations & Price Alerts**:
     - Deterministic seeded daily price fluctuation engine (`src/server/price-fluctuations.ts`) applying bounded (-12% to +8%) variations to seeded fares, prominently labeled "Demo pricing" in the UI.
     - Price watch dialog on `/bookings` and destination pages allowing users to watch routes/destinations with target prices.
     - Supabase migration `supabase/migrations/006_price_alerts.sql` with Row Level Security policies and performance indexes.
     - Added price alert store state and methods in `src/lib/smarttrip-store.ts`.
     - Protected cron endpoint `/api/cron/price-fluctuations` in `src/server.ts`, secured by `x-cron-secret` from env (`CRON_SECRET`).
     - Added GitHub Actions daily workflow `.github/workflows/daily-price-alerts.yml` running daily at 04:00 UTC.
     - Preserved existing `.github/workflows/keep-alive.yml` intact.
  4. **Testing & QA**:
     - Unit tests in `src/server/__tests__/live-data.test.ts` with mocked `fetch` covering:
       - Open-Meteo forecast parsing, 30-minute caching, failure fallback, and WMO code descriptions.
       - Frankfurter ECB rates parsing, daily caching, currency conversion, and unsupported currency fallback to INR.
       - Deterministic fluctuation math, price drop trigger logic, and cron header authorization (401/200).
     - Verified: all 80 unit tests pass across 8 test suites.
     - Verified: `npm run lint` (0 errors), `npm run typecheck` (0 errors), and `npm run build` (clean SSR & Nitro production build).
- **Files Touched**:
  - `src/server/weather.ts` (created)
  - `src/server/currency.ts` (created)
  - `src/server/price-fluctuations.ts` (created)
  - `src/lib/server/live-data-actions.ts` (created)
  - `src/components/smarttrip/WeatherForecastCard.tsx` (created)
  - `src/components/smarttrip/EscapeHills.tsx` (updated)
  - `src/routes/destination/$id.tsx` (updated)
  - `src/routes/plan/$id.tsx` (updated)
  - `src/routes/settings.tsx` (updated)
  - `src/routes/bookings.tsx` (updated)
  - `src/lib/smarttrip-store.ts` (updated)
  - `src/server.ts` (updated)
  - `supabase/migrations/006_price_alerts.sql` (created)
  - `.github/workflows/daily-price-alerts.yml` (created)
  - `.github/workflows/keep-alive.yml` (kept intact)
  - `.env.example` (updated with CRON_SECRET)
  - `src/server/__tests__/live-data.test.ts` (created)
  - `MIGRATION_LOG.md` (updated)

---

## [Task 11] - Production Readiness on Free Infrastructure

- **Goal**: Prepare the entire application for zero-cost production hosting on Vercel/Netlify free hobby tier:
  1. **SEO & Metadata**:
     - Built `src/lib/seo.ts` with `createSeoHead` standardizing titles, descriptions, Open Graph, Twitter cards, and canonical tags across all routes.
     - Added Schema.org `TouristDestination` JSON-LD to destination pages (`/destination/$id`), `WebSite` SearchAction schema to `/`, and `FAQPage` schema to `/faq`.
     - Generated `public/robots.txt` and `public/sitemap.xml` with all 9 destinations and primary routes, plus `/robots.txt` server-side fallback.
  2. **Security & Protection**:
     - Configured production security headers in `src/server.ts`: Content Security Policy (CSP), HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, and Permissions-Policy.
     - Implemented in-memory sliding-window rate limiting guard (`src/server/rate-limit-guard.ts`) and applied it across all server functions (`live-data-actions.ts`, `booking-actions.ts`, `trip-actions.ts`, `generate-plan.ts`).
     - Strict Zod validation on every server function parameter.
     - Created `scripts/scan-client-secrets.mjs` and npm script `npm run scan-secrets` scanning `.output/public` to guarantee zero private keys or server secrets appear in client bundles. Added to CI.
  3. **Performance Optimization**:
     - Added `loading="lazy"` and `decoding="async"` to all non-critical images across all views; set `fetchPriority="high"` on above-the-fold hero image.
     - Code-split `@dnd-kit` drag-and-drop itinerary editor in `AiPlanner.tsx` via `React.lazy()` and `<Suspense>`.
     - Code-split Leaflet interactive map in `src/routes/index.tsx` via `React.lazy()` and `<Suspense>`.
  4. **Accessibility (WCAG 2.1 AA & Axe-Core)**:
     - Verified accessible form labels, aria-labels on icon buttons, keyboard navigation, and focus rings.
     - Created `e2e/accessibility.spec.ts` using `@axe-core/playwright` verifying zero critical or serious WCAG accessibility violations on key pages.
  5. **Error Handling & Free Telemetry**:
     - Upgraded custom branded 404 ("Off the Map") and 500 error pages in `src/routes/__root.tsx` and `src/lib/error-page.ts`.
     - Created Supabase migration `supabase/migrations/007_error_logs.sql` with Row Level Security and automatic retention pruning trigger.
     - Updated `src/lib/error-report.ts` to log errors to console and asynchronously insert telemetry into `error_logs` without third-party paid monitoring.
  6. **End-to-End Testing (Playwright)**:
     - Configured `playwright.config.ts` targeting local dev server.
     - Added E2E tests:
       - `e2e/signup.spec.ts`: Sign up form validation and submission.
       - `e2e/plan-and-save.spec.ts`: AI itinerary generation and saving to My Trips.
       - `e2e/search-and-book.spec.ts`: Search command dialog, demo booking, and E-ticket QR verification.
       - `e2e/fund-and-wishlist.spec.ts`: Trip fund contribution and wishlist sheet toggle.
       - `e2e/accessibility.spec.ts`: Axe-core accessibility test suite.
     - Added `"test:e2e"` script to `package.json` and `.github/workflows/ci.yml`.
  7. **Deployment & Documentation**:
     - Configured Nitro preset in `vite.config.ts` (`NITRO_PRESET=vercel` or auto-detection).
     - Fully rewrote `README.md` with overview, features, tech stack, free-stack table, setup, environment variable documentation, npm scripts, project structure, step-by-step Vercel hobby deployment guide (using provider subdomains), and legal disclaimers.
  8. **Legal Pages**:
     - Created `/terms` (`src/routes/terms.tsx`) featuring explicit **AI-Advice Disclaimer** and **Demo-Booking Simulation Disclaimer**.
     - Created `/privacy` (`src/routes/privacy.tsx`) detailing zero-tracking practices, local storage usage, and Google Gemini Flash data handling.
     - Linked legal pages in `Footer.tsx`.
- **Files Touched**:
  - `src/lib/seo.ts` (created)
  - `src/server/rate-limit-guard.ts` (created)
  - `scripts/scan-client-secrets.mjs` (created)
  - `playwright.config.ts` (created)
  - `e2e/signup.spec.ts` (created)
  - `e2e/plan-and-save.spec.ts` (created)
  - `e2e/search-and-book.spec.ts` (created)
  - `e2e/fund-and-wishlist.spec.ts` (created)
  - `e2e/accessibility.spec.ts` (created)
  - `src/routes/terms.tsx` (created)
  - `src/routes/privacy.tsx` (created)
  - `supabase/migrations/007_error_logs.sql` (created)
  - `public/robots.txt` (updated)
  - `public/sitemap.xml` (created)
  - `src/lib/error-report.ts` (updated)
  - `src/lib/error-page.ts` (updated)
  - `src/routes/__root.tsx` (updated)
  - `src/routes/index.tsx` (updated)
  - `src/routes/explore.tsx` (updated)
  - `src/routes/ai-planner.tsx` (updated)
  - `src/routes/bookings.tsx` (updated)
  - `src/routes/checkout.tsx` (updated)
  - `src/routes/my-trips.tsx` (updated)
  - `src/routes/faq.tsx` (updated)
  - `src/routes/settings.tsx` (updated)
  - `src/routes/destination/$id.tsx` (updated)
  - `src/routes/plan/$id.tsx` (updated)
  - `src/routes/booking-confirmation/$id.tsx` (updated)
  - `src/components/smarttrip/Footer.tsx` (updated)
  - `src/components/smarttrip/AiPlanner.tsx` (updated)
  - `src/components/smarttrip/Hero.tsx` (updated)
  - `src/components/smarttrip/ExploreDestinations.tsx` (updated)
  - `src/components/smarttrip/EscapeHills.tsx` (updated)
  - `src/components/smarttrip/TripFund.tsx` (updated)
  - `src/components/smarttrip/ReviewsSection.tsx` (updated)
  - `src/components/smarttrip/SearchCommandDialog.tsx` (updated)
  - `src/components/smarttrip/WishlistSheet.tsx` (updated)
  - `src/components/smarttrip/booking/ETicketView.tsx` (updated)
  - `src/lib/server/live-data-actions.ts` (updated)
  - `src/lib/server/booking-actions.ts` (updated)
  - `src/lib/server/trip-actions.ts` (updated)
  - `src/server.ts` (updated)
  - `vite.config.ts` (updated)
  - `.github/workflows/ci.yml` (updated)
  - `.env.example` (updated)
  - `README.md` (completely rewritten)
  - `package.json` (updated)
  - `MIGRATION_LOG.md` (updated)
