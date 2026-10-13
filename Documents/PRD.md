# SmartTrip: Product Requirements Document (PRD)

| Field | Value |
|---|---|
| **Product** | SmartTrip (repo: `dream-plan-fly`) |
| **Tagline** | Plan Less. Travel More. |
| **Document version** | 1.0 |
| **Date** | 13 October 2026 |
| **Status** | Draft for build |
| **Owner** | _(add your name)_ |
| **Baseline** | Working front-end prototype (localStorage, mock data, rule-based "AI") |
| **Target** | Production-ready, standalone web app (no third-party app-builder dependencies) |

---

## 1. Executive Summary

Travel planning today is fragmented. Travelers juggle separate tabs for inspiration, itinerary building, price comparison, budgeting and booking. SmartTrip unifies this into one flow:

**Dream → Ask AI → Plan → Save → Book → Travel**

The current codebase is a polished prototype: UI, routing, animations and local state all work, but data is mocked, the AI is a regex/template engine, there are no accounts, and bookings are simulated. This PRD defines what is required to turn it into a complete, real product: real accounts and database, a real LLM planner, real search data (sandbox/test mode where commercial agreements are required), real payments (test mode), live weather, an interactive map, and a clean, independent, production-grade codebase.

---

## 2. Problem Statement

| Pain point | Impact |
|---|---|
| Planning requires many disconnected tools | Time-consuming, stressful, high drop-off |
| Generic itineraries ignore budget, group size and season | Plans are not actionable |
| No easy way to save toward a future trip | Dream trips stay dreams |
| Prices, weather and options are scattered | Poor decisions, overspending |
| Plans and bookings live in different places | No single source of truth for a trip |

---

## 3. Goals and Non-Goals

### 3.1 Goals
1. Let a user go from a one-line idea to a saved, budgeted, day-by-day plan in under 60 seconds.
2. Provide real, persistent user accounts so trips, funds, bookings and wishlists survive across devices.
3. Deliver real search results and a complete checkout flow (sandbox/test mode for payments and travel inventory).
4. Help users save for future trips with a progress-tracked fund.
5. Ship a secure, accessible, fast, SEO-ready app that is fully independent of any app-builder platform.

### 3.2 Non-Goals (v1)
- Live production payments with real money and real ticketing (requires commercial/licensing agreements; v1 runs in test mode).
- Native iOS/Android apps (responsive web only).
- Multi-language UI (English, INR as default currency).
- Social network features (following, feeds, group chat).
- Visa/immigration processing.

---

## 4. Target Users and Personas

| Persona | Description | Key needs |
|---|---|---|
| **Riya, the weekend explorer** | 24-30, city professional, short trips | Fast ideas, budget clarity, quick booking |
| **The Sharma family** | Group of 3-6, multi-day vacations | Coordinated itinerary, per-person budget, safety info |
| **Arjun, the dream saver** | Planning a big trip 6-24 months out | Savings target, monthly amount, motivation |
| **Meera, the international first-timer** | Planning first trip abroad | Packing, weather, money tips, safety checklist |

---

## 5. Success Metrics

| Metric | Target (first 90 days after launch) |
|---|---|
| Visitor → plan generated | ≥ 25% |
| Plan generated → saved (signed-in) | ≥ 40% |
| Signup conversion (from plan save prompt) | ≥ 20% |
| Test-mode checkout completion rate | ≥ 60% of started checkouts |
| Trip Fund creation rate (of registered users) | ≥ 15% |
| p75 Largest Contentful Paint | ≤ 2.5 s |
| Lighthouse (performance, accessibility, SEO, best practices) | ≥ 90 each |
| Crash-free sessions | ≥ 99.5% |
| LLM plan schema-validation success (first try) | ≥ 95% |

---

## 6. Scope Overview

### 6.1 Feature Map

| ID | Feature | Baseline | Required |
|---|---|---|---|
| F1 | Landing and hero search | Done (UI) | Wire to planner, real destination autocomplete |
| F2 | Destination discovery and detail pages | List only | Detail pages, wishlist, map, weather |
| F3 | AI Trip Planner | Regex templates | Real LLM, structured output, refine, editor, share |
| F4 | Interactive Map | Dataset only | Real map, filters, geolocation, add-to-trip |
| F5 | Trip Fund | localStorage | Persistent, contribution history, milestones, celebration |
| F6 | Bookings and checkout | Simulated | Real search (sandbox), checkout, payments (test), e-ticket |
| F7 | My Trips dashboard | localStorage | Persistent, multi-bucket, per-user |
| F8 | Accounts and profile | None | Auth, profile, settings |
| F9 | Navbar tools | Toast placeholders | Search palette, wishlist, notifications, profile menu |
| F10 | Escape to the Hills + live weather | Fake temps | Live weather |
| F11 | Quick Travel Guide | Missing | 3-stage guide |
| F12 | Safety and support | Static | Real contact form, FAQ, tickets |
| F13 | Reviews and newsletter | Fake / non-functional | Real, validated, stored |
| F14 | Price alerts | None | Watchlist and daily checks |
| F15 | Platform independence | Platform-coupled | Zero third-party app-builder traces |
| F16 | Production readiness | None | SEO, security, perf, a11y, tests, CI/CD |

---

## 7. Functional Requirements

Priority key: **P0** = must have, **P1** = should have, **P2** = nice to have.

### F1. Landing Page and Hero Search
| ID | Requirement | Priority |
|---|---|---|
| F1.1 | Hero with animated sky layer (clouds, birds, aircraft), respecting `prefers-reduced-motion` | P0 |
| F1.2 | Search form: destination, dates (range picker), travelers, budget | P0 |
| F1.3 | Submitting the form opens the AI Planner pre-filled and generates a plan | P0 |
| F1.4 | Destination field offers autocomplete suggestions | P1 |
| F1.5 | Page sections: Quick Booking, Explore, How It Works, Escape to the Hills, AI Planner, Trip Fund, Reviews, Travel Safe, Footer, Support dock | P0 |

**Acceptance:** A guest can enter "Goa, 4 days, 2 people, ₹30,000" in the hero and see a generated plan without signing in.

### F2. Destination Discovery
| ID | Requirement | Priority |
|---|---|---|
| F2.1 | Catalog with category filters (Hill Stations, Beaches, Adventure, Heritage, Nature, International, Weekend) | P0 |
| F2.2 | Each card shows image, region, INR price, rating, blurb, wishlist heart | P0 |
| F2.3 | `/destination/$id` detail page: gallery, description, best time to visit, map, 7-day forecast, "Plan this trip" CTA | P0 |
| F2.4 | Wishlist toggle persists per user (guest: local, signed-in: database) | P0 |
| F2.5 | Sort and search within the catalog | P1 |
| F2.6 | Catalog stored in the database, not hardcoded in source | P1 |

### F3. AI Trip Planner
| ID | Requirement | Priority |
|---|---|---|
| F3.1 | Free-text prompt plus structured controls (budget, days, travelers, interests) | P0 |
| F3.2 | Plan generated by an LLM via a **server function** (API key never exposed to the client) | P0 |
| F3.3 | Output is structured JSON validated with a schema; one retry on failure, then fall back to the rule-based `buildPlan()` | P0 |
| F3.4 | Plan includes: summary, day-by-day itinerary, stays, transport, food trail, weather, packing list, tips, budget breakdown (sums to total), carbon estimate | P0 |
| F3.5 | Quick-refine buttons: Regenerate, Make it cheaper, Add more adventure | P1 |
| F3.6 | Itinerary editor: add, edit, delete, drag-and-drop reorder across days, with Undo | P1 |
| F3.7 | Save to My Trips (requires sign-in; guests are prompted and their draft is preserved through signup) | P0 |
| F3.8 | Export to PDF / print | P0 |
| F3.9 | Public share link `/plan/$id` (read-only) | P1 |
| F3.10 | Rate limiting and input-length limits per user/IP | P0 |
| F3.11 | Loading state (typing skeleton), error state with retry | P0 |

**Acceptance:** Given a valid prompt, a plan is returned in ≤ 15 s (p90) with a budget breakdown whose items sum to the stated total (±₹1). If the LLM fails twice, a rule-based plan is shown with no error screen.

### F4. Interactive Map ("Explore Around You")
| ID | Requirement | Priority |
|---|---|---|
| F4.1 | Real map (OpenStreetMap tiles) rendered client-side, SSR-safe | P0 |
| F4.2 | Real latitude/longitude for all places (replacing percentage x/y) | P0 |
| F4.3 | Category filters: Attractions, Hotels, Restaurants, Activities | P0 |
| F4.4 | Clickable pins with popup (name, rating, distance, note) and "Add to Trip" | P0 |
| F4.5 | "Use my location" with browser geolocation; sorts by distance | P1 |
| F4.6 | Keyboard-accessible filters and labelled controls | P0 |

### F5. Trip Fund (Save for a Future Trip)
| ID | Requirement | Priority |
|---|---|---|
| F5.1 | Create a fund: name, emoji, target amount, target date, travelers | P0 |
| F5.2 | Quick contributions (+₹500, +₹1,000, +₹2,500) and custom amount | P0 |
| F5.3 | Contributions capped at target; every deposit stored with timestamp (history list) | P0 |
| F5.4 | Progress %, required monthly savings = `(target − saved) / monthsLeft` | P0 |
| F5.5 | Edit and delete funds with confirmation | P1 |
| F5.6 | Notifications at 25%, 50%, 75%, 100% | P1 |
| F5.7 | Confetti celebration at 100% | P2 |
| F5.8 | Input validation (positive numbers, sensible limits, future dates) | P0 |

> Note: the Trip Fund is a **goal tracker**, not a bank or wallet. No money is held by the product.

### F6. Bookings and Checkout
| ID | Requirement | Priority |
|---|---|---|
| F6.1 | Tabs: Flights, Stays, Rentals, Train/Bus, Packages | P0 |
| F6.2 | Flight and hotel search backed by a travel-inventory API (Amadeus Self-Service, test environment) via server functions | P0 |
| F6.3 | Origin/destination with IATA airport autocomplete; date-range picker; travelers; class | P0 |
| F6.4 | Results with loading, empty and error states; filters and sorting | P0 |
| F6.5 | Trains, buses, rentals, packages served from database tables with a seed script | P1 |
| F6.6 | Checkout: traveler details form with validation, price summary with taxes | P0 |
| F6.7 | Payments through Razorpay in **test mode**; payment signature verified on the server before confirming | P0 |
| F6.8 | Booking statuses: pending, confirmed, cancelled, failed | P0 |
| F6.9 | Idempotency so double-clicks or retries cannot create duplicate bookings | P0 |
| F6.10 | On success: booking reference, auto-created Upcoming trip, notification, confirmation page, PDF e-ticket/itinerary | P0 |
| F6.11 | Cancellation with a clear refund-policy message | P1 |
| F6.12 | No card data is ever stored or touched by our servers | P0 |

### F7. My Trips Dashboard
| ID | Requirement | Priority |
|---|---|---|
| F7.1 | Stat cards: trips tracked, bookings, fund totals, wishlisted spots | P0 |
| F7.2 | Trips grouped into Upcoming, Past, Saved; move between buckets; delete | P0 |
| F7.3 | Expandable itinerary per trip | P0 |
| F7.4 | Active bookings list with status and cancellation | P0 |
| F7.5 | "Places You Loved" wishlist section | P0 |
| F7.6 | Empty states for every list | P0 |

### F8. Accounts and Profile
| ID | Requirement | Priority |
|---|---|---|
| F8.1 | Email/password signup and login | P0 |
| F8.2 | Google OAuth | P1 |
| F8.3 | Session handling that works with server-side rendering | P0 |
| F8.4 | Protected routes (`/my-trips`, `/save`, checkout) with redirect-back after login | P0 |
| F8.5 | Logout; password reset by email | P0 |
| F8.6 | `/settings`: name, avatar, home city, currency | P1 |
| F8.7 | Guest-to-account migration: local data merged into the account on first signup | P1 |

### F9. Navbar Tools
| ID | Requirement | Priority |
|---|---|---|
| F9.1 | **Search:** command palette (Ctrl/Cmd+K) across destinations, saved trips, bookings; recent searches | P0 |
| F9.2 | **Wishlist:** side sheet with remove and "Plan a trip" actions | P0 |
| F9.3 | **Notifications:** popover with unread count, mark-all-read | P1 |
| F9.4 | **Profile:** dropdown with My Trips, Trip Fund, Settings, Logout; Login/Signup buttons for guests | P0 |
| F9.5 | Mobile menu exposes the same features | P0 |

### F10. Escape to the Hills and Live Weather
| ID | Requirement | Priority |
|---|---|---|
| F10.1 | 8 hill stations (Manali, Shimla, Munnar, Ooty, Lonavala, Mahabaleshwar, Darjeeling, Kashmir) | P0 |
| F10.2 | Live temperatures from a free weather API (Open-Meteo), cached 30 min, graceful fallback | P0 |
| F10.3 | 7-day forecast and best-time-to-visit on destination pages and plans | P1 |

### F11. Quick Travel Guide
| ID | Requirement | Priority |
|---|---|---|
| F11.1 | 3-stage accordion: Before You Go, During Your Trip, Smart Tips | P0 |
| F11.2 | Real checklists: documents, health, packing, money, safety, etiquette | P0 |
| F11.3 | Shown on landing page and inside the plan view | P1 |

### F12. Safety and Support
| ID | Requirement | Priority |
|---|---|---|
| F12.1 | Travel safety checklist section | P0 |
| F12.2 | Floating support dock opens a real contact form and FAQ | P0 |
| F12.3 | Tickets stored in `support_tickets` with validation and rate limiting | P1 |

### F13. Reviews and Newsletter
| ID | Requirement | Priority |
|---|---|---|
| F13.1 | Real reviews, only from signed-in users who have a trip or booking; no fabricated testimonials | P1 |
| F13.2 | Newsletter signup stores email with validation and duplicate protection | P1 |

### F14. Price Alerts and Currency
| ID | Requirement | Priority |
|---|---|---|
| F14.1 | Users can watch a flight route or destination with a target price | P2 |
| F14.2 | Scheduled daily job checks price and creates a notification on drop | P2 |
| F14.3 | Currency switcher with daily-cached exchange rates for international destinations | P2 |

### F15. Platform Independence
| ID | Requirement | Priority |
|---|---|---|
| F15.1 | Remove all app-builder platform packages, files, telemetry, metadata and references; global search returns zero hits | P0 |
| F15.2 | Hand-written `vite.config.ts` using official TanStack Start, React, Tailwind, tsconfig-paths and Nitro packages | P0 |
| F15.3 | Replace platform error telemetry with a neutral `reportError()` helper (Sentry-ready) | P0 |
| F15.4 | Rename package to `smarttrip`; single package manager (npm) | P0 |
| F15.5 | SSR, path alias `@/*`, and `VITE_*` env variables continue to work | P0 |

### F16. Production Readiness
| ID | Requirement | Priority |
|---|---|---|
| F16.1 | Per-route SEO: titles, descriptions, OG/Twitter tags, sitemap, robots, canonical, JSON-LD | P0 |
| F16.2 | Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy), CSRF on, Zod validation on all server functions | P0 |
| F16.3 | Lighthouse ≥ 90 in all four categories; lazy-load images; code-split map and drag-and-drop | P0 |
| F16.4 | WCAG 2.1 AA: keyboard, focus, contrast, aria, axe audit | P0 |
| F16.5 | Unit tests (Vitest) and end-to-end tests (Playwright) for critical flows | P0 |
| F16.6 | CI pipeline: install, lint, typecheck, test, build on every push and PR | P0 |
| F16.7 | Deployment config (Vercel or Netlify via Nitro preset) and deployment guide | P0 |

---

## 8. Key User Flows

### Flow A: Plan and save
1. User lands on `/`, enters a prompt or fills the hero form.
2. Server function calls the LLM; plan renders with a loading skeleton first.
3. User refines (cheaper, more adventure) or edits the itinerary.
4. User clicks **Save to My Trips**. Guests are prompted to sign up; draft is preserved.
5. Trip appears under **Saved** in `/my-trips`.

### Flow B: Search and book
1. User opens `/bookings`, picks a tab, enters search inputs.
2. Results load from the inventory API (or database for non-API categories).
3. User selects an option → `/checkout` → enters traveler details → pays (test mode).
4. Server verifies payment signature → booking confirmed → trip created under **Upcoming** → notification and PDF e-ticket.

### Flow C: Save for a dream trip
1. User opens `/save`, creates a fund (name, target, date).
2. User adds contributions; progress and required monthly amount update.
3. Milestone notifications fire; at 100% a celebration shows.

### Flow D: Discover and wishlist
1. User browses `/explore`, filters by category, hearts destinations.
2. Opens a destination page: map, forecast, best time to visit.
3. Clicks **Plan this trip** → planner pre-filled.

---

## 9. Information Architecture

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/explore` | Public | Destination grid |
| `/destination/$id` | Public | Destination detail |
| `/ai-planner` | Public | Planner (saving needs login) |
| `/plan/$id` | Public | Shared read-only plan |
| `/bookings` | Public (search), login (checkout) | Booking catalog |
| `/checkout` | Login | Traveler details and payment |
| `/booking/$id` | Login | Confirmation and e-ticket |
| `/my-trips` | Login | Dashboard |
| `/save` | Login | Trip Fund |
| `/settings` | Login | Profile preferences |
| `/login`, `/signup`, `/reset-password` | Public | Authentication |
| `/support`, `/faq` | Public | Help center |

---

## 10. Data Model (high level)

All tables carry `id`, `created_at`, and (where user-owned) `user_id`. Row-level security ensures users can access only their own rows.

| Table | Key fields |
|---|---|
| `profiles` | user_id, name, avatar_url, home_city, currency |
| `destinations` | slug, name, region, category, price_from, rating, blurb, image, lat, lng, best_months |
| `places` | destination_id, name, type, rating, note, lat, lng |
| `trips` | user_id, name, dates, status[], image, bucket (Upcoming / Past / Saved), plan (jsonb), is_public |
| `bookings` | user_id, trip_id, kind, title, subtitle, price, reference, status, payment_id, idempotency_key |
| `funds` | user_id, emoji, name, target, saved, target_date, travelers, image |
| `fund_contributions` | fund_id, user_id, amount, created_at |
| `wishlist` | user_id, destination_id |
| `notifications` | user_id, type, title, body, read_at |
| `watches` | user_id, kind, params, target_price, last_price |
| `reviews` | user_id, destination_id, rating, body |
| `newsletter_subscribers` | email (unique) |
| `support_tickets` | user_id (nullable), email, subject, message, status |
| `catalog_*` | rentals, rail/bus, packages (seeded, editable) |

### Core plan schema (validated)
```ts
type GeneratedPlan = {
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
  breakdown: { label: string; amount: number }[]; // sums to budget
  carbonKg: number;
};
```

---

## 11. Technical Architecture

| Layer | Choice |
|---|---|
| Framework | TanStack Start (SSR), TanStack Router, TanStack Query |
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn/Radix primitives |
| Design system | Existing OKLCH tokens, Sora (headings) and Manrope (body) |
| Backend logic | TanStack Start server functions (`createServerFn`) with Zod validation |
| Database and auth | Supabase (Postgres, Auth, Row Level Security) |
| LLM | Google Gemini via server function, structured JSON output |
| Maps | Leaflet / react-leaflet with OpenStreetMap |
| Travel inventory | Amadeus Self-Service API (test environment) |
| Payments | Razorpay (test mode), server-side signature verification |
| Weather and FX | Open-Meteo, free exchange-rate API (cached) |
| Drag and drop | `@dnd-kit` |
| Testing | Vitest, Testing Library, Playwright |
| CI/CD | GitHub Actions; deploy via Nitro preset (Vercel or Netlify) |

**Principles:** secrets only on the server; all external calls proxied through server functions; guests work offline-first with localStorage and migrate on signup; optimistic UI via TanStack Query; graceful degradation when any external API fails.

---

## 12. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Performance** | LCP ≤ 2.5 s (p75), CLS ≤ 0.1, INP ≤ 200 ms; heavy modules lazy-loaded |
| **Security** | RLS on every table; Zod on every input; CSP and security headers; rate limits; no secrets in client bundle; payment signature verified; no card data stored |
| **Privacy** | Collect only necessary data; privacy policy and terms pages; account deletion that removes user data |
| **Accessibility** | WCAG 2.1 AA; reduced-motion support; keyboard-only operation of all features |
| **Reliability** | Fallbacks for LLM, weather and inventory failures; idempotent booking; error boundaries and 404/500 pages |
| **Compatibility** | Latest two versions of Chrome, Edge, Safari, Firefox; responsive from 360 px |
| **Observability** | Central `reportError()` helper, Sentry-ready; server logs for failed payments and LLM errors |
| **Maintainability** | Strict TypeScript, ESLint and Prettier, ≥ 70% coverage on `lib/` and server functions |

---

## 13. Release Plan

| Phase | Scope | Exit criteria |
|---|---|---|
| **0. Setup** | Branch, baseline build, migration log | Build and lint report captured |
| **1. Independence** | F15 | Zero platform references; dev, build, preview all pass |
| **2. Foundation** | Cleanup, tests, CI | Lint, typecheck, test, build green in CI |
| **3. Backend and auth** | F8, F7, F5 persistence, F2.4 | Signup, login, RLS verified; guest migration works |
| **4. Real AI** | F3 | Schema-valid LLM plans, fallback tested |
| **5. Map and destinations** | F4, F2.3 | Map with real coordinates, detail pages |
| **6. Navbar and missing sections** | F9, F11, F12, F13, F5 extras, F3.6 | No placeholder toasts remain |
| **7. Bookings and payments** | F6 | Test-mode end-to-end booking with e-ticket |
| **8. Live data** | F10, F14 | Live weather, FX, alerts |
| **9. Production** | F16 | Lighthouse ≥ 90, axe clean, Playwright green, deployed |
| **10. Final audit** | Cleanup and docs | No TODO/mock/placeholder hits; context doc regenerated |

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Replacing the platform Vite config breaks SSR or build | Medium | High | Do it first, in isolation; verify dev, build and preview; follow current official docs |
| LLM returns invalid or low-quality plans | Medium | Medium | Zod validation, one retry, rule-based fallback, prompt constraints |
| LLM or API cost abuse | Medium | Medium | Per-user/IP rate limits, input caps, caching |
| Travel inventory API limits (test data only) | High | Medium | Clearly label sandbox results; keep architecture provider-agnostic |
| Payment fraud or duplicate charges | Low | High | Server-side signature verification, idempotency keys, test mode until agreements exist |
| Scope creep ("fully real" is open-ended) | High | High | Phase gating; P0 first; non-goals listed in section 3.2 |
| Secrets leaked to client or repo | Low | High | Server-only env, `.env.example` with names only, bundle scan in CI |
| Legal exposure (reviews, travel advice, data) | Medium | Medium | Terms, privacy policy, disclaimers on AI-generated advice |

---

## 15. Dependencies and Prerequisites

| Item | Needed for | Owner |
|---|---|---|
| Supabase project (URL, anon key, service key) | Phases 3+ | Product owner |
| Gemini API key | Phase 4 | Product owner |
| Amadeus Self-Service test credentials | Phase 7 | Product owner |
| Razorpay test keys | Phase 7 | Product owner |
| Google OAuth client | Phase 3 (P1) | Product owner |
| Hosting account and domain | Phase 9 | Product owner |
| Image rights for destination photos | Launch | Product owner |

---

## 16. Open Questions

1. Should the first public launch stay in test mode for payments and inventory, or is a licensed booking partner planned?
2. Is Razorpay the final choice, or should Stripe be supported for international users?
3. Which LLM provider and budget cap per month is acceptable?
4. Is admin tooling (catalog and ticket management UI) needed in v1, or is the database console enough?
5. Which regions and currencies should be supported beyond India and INR?
6. What is the content policy for user reviews (moderation, reporting)?

---

## 17. Acceptance Checklist (Definition of Done)

- [ ] Global case-insensitive search for the old platform name returns zero results (excluding `node_modules`, `.git`)
- [ ] Every route loads with no console errors; every button performs a real action
- [ ] No "coming up next" toasts, mock banners, or placeholder text remain
- [ ] Auth, RLS, and guest migration verified with tests
- [ ] LLM planner passes schema validation tests and fallback tests
- [ ] Test-mode checkout works end to end with verified payment signatures
- [ ] Lint, typecheck, unit, e2e and production build all pass in CI
- [ ] Lighthouse ≥ 90 across categories; axe audit clean
- [ ] README, `.env.example`, deployment guide and regenerated `PROJECT_CONTEXT.md` are complete
- [ ] No secrets in the repo or client bundle
