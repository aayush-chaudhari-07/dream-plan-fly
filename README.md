# SmartTrip — AI Travel Planner & Booking Platform

> **Dream → Ask AI → Plan → Save → Book → Travel**
> A modern, production-grade travel platform engineered to run **100% permanently free** on zero-cost infrastructure.

[![CI](https://github.com/aayush-chaudhari-07/dream-plan-fly/actions/workflows/ci.yml/badge.svg)](https://github.com/aayush-chaudhari-07/dream-plan-fly/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Nitro Engine](https://img.shields.io/badge/SSR-TanStack%20Start%20%2B%20Nitro-orange)](https://tanstack.com/start)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20Postgres-emerald)](https://supabase.com)
[![Key-less APIs](https://img.shields.io/badge/Open%20Data-Open--Meteo%20%7C%20Frankfurter%20%7C%20OSM-blue)](https://open-meteo.com)

---

## 📖 Overview

**SmartTrip** is an all-in-one travel technology platform that combines real-time AI itinerary planning, interactive cartography, collaborative travel funds, live weather forecasts, foreign exchange conversions, and an end-to-end simulated booking engine.

Every architectural layer is specifically designed to operate indefinitely within **permanent free tiers** without requiring a credit card, trial expiration, or paid third-party add-ons.

---

## ✨ Features

- 🤖 **AI Trip Planner**: Generates personalized, paced daily itineraries, verified accommodations, transit options, and packing lists powered by **Google Gemini 2.5 Flash**, backed by an intelligent offline heuristic generator (`buildPlan`) with automatic retry and rate-limiting safeguards.
- 🗺️ **Interactive Explore Map**: Code-split Leaflet map powered by OpenStreetMap tiles featuring categorized filters (Attractions, Hotels, Restaurants, Activities), real coordinate geocoding across 9 major destinations, and browser geolocation with proximity sorting.
- ✈️ **Demo Booking Engine**: Production-like booking workflows for Flights (deterministic multi-flight daily schedules for any Indian route), Stays, Car Rentals, Rail, and Packages. Includes a simulated payment gateway (Card, UPI, Net Banking), cryptographic HMAC verification, cancellation refunds, and printable E-Tickets with QR code verification.
- 🌦️ **Live Weather & 7-Day Forecast**: Real-time hourly and weekly forecasts powered by the key-less **Open-Meteo API** with 30-minute server caching, WMO weather descriptions, hill-station temperatures, and graceful seasonal fallbacks.
- 💱 **Live Currency Conversion**: Real-time European Central Bank rates via the free, key-less **Frankfurter API**, cached daily with automatic fallback to INR for unsupported currencies.
- 🔔 **Deterministic Price Alerts & Scheduled Cron**: Watch any travel route or destination with a target price. A daily scheduled GitHub Actions cron job triggers deterministic market price fluctuations and sends notifications on price drops.
- 💰 **Trip Savings Fund**: Target-based group travel fund with deposit history, visual milestone tracking, and a canvas-confetti celebration at 100% completion.
- 🧭 **Quick Travel Guide**: 3-stage interactive checklist ("Before You Go", "During Your Trip", "Smart Tips") covering documentation, health, packing, money, and local etiquette.
- 🛡️ **Free-Tier Inactivity Guard**: Automated twice-weekly keep-alive GitHub Actions cron calling `/api/keep-alive` to prevent Supabase database pausing.
- 🔒 **Security & Production Hardening**: Strict Content Security Policy (CSP), HSTS, X-Frame-Options, in-memory sliding-window server function rate limiting, strict Zod validation on every input, and automated CI client secret scanning.

---

## 🛠️ Tech Stack

| Category            | Technology                                                                                                                            |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**       | [TanStack Start](https://tanstack.com/start) (Full-stack SSR with React 19)                                                           |
| **Server Engine**   | [Nitro](https://nitro.unjs.io) (Universal server engine supporting Node, Vercel, Netlify)                                             |
| **Routing**         | [TanStack Router](https://tanstack.com/router) (Type-safe client & server routing)                                                    |
| **State & Cache**   | [TanStack Query](https://tanstack.com/query) & Zustand-inspired local persistence                                                     |
| **Styling**         | [Tailwind CSS v4](https://tailwindcss.com) with custom glassmorphism and modern UI tokens                                             |
| **Icons & Motion**  | [Lucide React](https://lucide.dev) & CSS hardware-accelerated animations                                                              |
| **Database & Auth** | [Supabase](https://supabase.com) (PostgreSQL, Row Level Security, SSR Cookie Sessions)                                                |
| **AI Intelligence** | [Google Gemini 2.5 Flash](https://ai.google.dev) (`@google/genai` free tier)                                                          |
| **Maps**            | [Leaflet](https://leafletjs.com) & [OpenStreetMap](https://www.openstreetmap.org)                                                     |
| **Live Data**       | [Open-Meteo](https://open-meteo.com) & [Frankfurter API](https://www.frankfurter.app)                                                 |
| **Testing**         | [Vitest](https://vitest.dev), [Playwright](https://playwright.dev), [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) |

---

## 💸 Free-Stack Architecture

| Service                 | Role                        | Free Tier Quota                   | Quota Protection Mechanism                                              |
| :---------------------- | :-------------------------- | :-------------------------------- | :---------------------------------------------------------------------- |
| **Google Gemini Flash** | AI Itinerary Synthesis      | 1,500 requests / day (15 RPM)     | Server-side 24h cache, 1000 daily safety cap, fallback to `buildPlan()` |
| **Supabase**            | Postgres DB, Auth & Storage | 500 MB DB, 50,000 MAU             | RLS policies, connection reuse, twice-weekly keep-alive cron            |
| **Open-Meteo**          | Weather Forecasts           | 10,000 calls / day (Free, No Key) | 30-min in-memory server cache per coordinate, seasonal fallback         |
| **Frankfurter**         | Currency Exchange           | Unlimited public access (ECB)     | 24-hour daily server cache, strict INR fallback                         |
| **OpenStreetMap**       | Map Cartography             | Tile usage policy compliant       | Client-side lazy-load, no preloading, proper user-agent attribution     |
| **Vercel / Netlify**    | Edge Hosting                | 100 GB bandwidth, 300 build mins  | Client code-splitting, static asset caching, asset compression          |
| **GitHub Actions**      | CI & Scheduled Cron         | 2,000 minutes / month             | Lightweight curl triggers running in <10 seconds                        |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or newer
- **Supabase Account** (free tier at [supabase.com](https://supabase.com))
- **Google AI Studio Key** (free key at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone & Install

```bash
git clone https://github.com/aayush-chaudhari-07/dream-plan-fly.git
cd dream-plan-fly
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your values in `.env`:

```env
VITE_SITE_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
CRON_SECRET=your-random-cron-secret
DEMO_PAY_SECRET=your-random-payment-hmac-secret
NITRO_PRESET=vercel
```

_(Note: The application includes full offline fallbacks — if `GEMINI_API_KEY` or `VITE_SUPABASE_URL` are not provided, it gracefully defaults to local rule-based generation and `localStorage` persistence!)_

### 3. Run Database Migrations

Apply the SQL migration scripts in your Supabase SQL Editor in numerical order:

1. `supabase/migrations/001_init.sql`
2. `supabase/migrations/002_shared_plans.sql`
3. `supabase/migrations/003_features.sql`
4. `supabase/migrations/004_free_tier_optimizations.sql`
5. `supabase/migrations/005_booking_system.sql`
6. `supabase/migrations/006_price_alerts.sql`
7. `supabase/migrations/007_error_logs.sql`

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable Name            |  Required   | Description                                                                   |
| :----------------------- | :---------: | :---------------------------------------------------------------------------- |
| `VITE_SITE_URL`          |     No      | Base application URL (default: `https://dream-plan-fly.vercel.app`)           |
| `VITE_SUPABASE_URL`      |     Yes     | Supabase project URL (`https://xyz.supabase.co`)                              |
| `VITE_SUPABASE_ANON_KEY` |     Yes     | Supabase public anonymous client key                                          |
| `GEMINI_API_KEY`         | Recommended | Google Gemini Flash API key (server-only, never exposed to client)            |
| `CRON_SECRET`            | Recommended | Shared secret header (`x-cron-secret`) for scheduled GitHub Actions cron jobs |
| `DEMO_PAY_SECRET`        |     No      | HMAC key for demo payment signature generation                                |
| `NITRO_PRESET`           |     No      | Deployment server target (`vercel`, `netlify`, or `node-server`)              |

---

## 📜 Available Scripts

| Command                | Action                                                                          |
| :--------------------- | :------------------------------------------------------------------------------ |
| `npm run dev`          | Launches Vite local development server on port 3000 with HMR                    |
| `npm run build`        | Compiles client and SSR bundles with Nitro production output                    |
| `npm run preview`      | Runs the compiled Nitro production server locally                               |
| `npm run lint`         | Runs ESLint across all codebase files                                           |
| `npm run typecheck`    | Runs TypeScript compiler checks without emitting code (`tsc --noEmit`)          |
| `npm test`             | Executes unit tests with Vitest (80+ test cases)                                |
| `npm run test:watch`   | Runs Vitest in interactive watch mode                                           |
| `npm run test:e2e`     | Runs Playwright end-to-end tests (auth, planner, booking, funds, accessibility) |
| `npm run scan-secrets` | Inspects `.output/public` to confirm zero secrets are leaked in client bundles  |
| `npm run format`       | Formats all source files using Prettier                                         |

---

## 📂 Project Structure

```
dream-plan-fly/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Automated lint, typecheck, unit test, build, secret scan & e2e
│       ├── keep-alive.yml            # Twice-weekly Supabase inactivity pause prevention
│       └── daily-price-alerts.yml    # Daily cron job triggering demo price fluctuations
├── e2e/                              # Playwright end-to-end and accessibility test suites
│   ├── accessibility.spec.ts         # Axe-core WCAG 2.1 AA automated compliance tests
│   ├── fund-and-wishlist.spec.ts     # Collaborative fund and wishlist drawer tests
│   ├── plan-and-save.spec.ts         # AI itinerary generator and save tests
│   ├── search-and-book.spec.ts       # Command search dialog and demo booking flow
│   └── signup.spec.ts                # User registration form and validation tests
├── public/                           # Static assets, robots.txt, and sitemap.xml
├── scripts/                          # Client bundle secret scanner
├── src/
│   ├── components/                   # UI primitives and domain components
│   │   ├── smarttrip/                # SmartTrip widgets (Hero, AiPlanner, Map, Fund, etc.)
│   │   │   ├── booking/              # Airport search, E-ticket view, payment modal
│   │   │   └── map/                  # Code-split Leaflet map client
│   │   └── ui/                       # Accessible Radix UI primitives
│   ├── data/                         # Static datasets (airports, flight generator, inventory)
│   ├── lib/                          # Client utilities, Supabase client, auth context
│   │   ├── server/                   # Typed TanStack Start server functions
│   │   ├── smarttrip-store.ts        # Client state management & synchronization
│   │   └── trip-plan.ts              # Heuristic offline itinerary generator & math
│   ├── routes/                       # File-based routes with per-route SEO & JSON-LD
│   │   ├── __root.tsx                # App shell, 404 handler, error boundary, Sonner toaster
│   │   ├── index.tsx                 # Landing page
│   │   ├── ai-planner.tsx            # AI trip planner route
│   │   ├── bookings.tsx              # Flight, hotel, rental, and rail booking engine
│   │   ├── checkout.tsx              # Demo checkout with traveler validation
│   │   ├── destination/$id.tsx       # Destination detail with weather & TouristDestination JSON-LD
│   │   ├── explore.tsx               # Curated destination directory
│   │   ├── faq.tsx                   # Support center with FAQPage JSON-LD schema
│   │   ├── my-trips.tsx              # Authenticated user dashboard (Upcoming, Past, Saved)
│   │   ├── plan/$id.tsx              # Shared public AI trip plan route
│   │   ├── privacy.tsx               # Privacy policy & cookie practice disclosure
│   │   ├── settings.tsx              # Profile preferences & live currency switcher
│   │   └── terms.tsx                 # Terms of service, AI advice & demo booking disclaimers
│   └── server/                       # Backend services (Gemini, weather, currency, rate limiter)
├── supabase/
│   └── migrations/                   # SQL migrations (RLS, schema, indexes, retention triggers)
└── vite.config.ts                    # Vite + TanStack Start + Nitro configuration
```

---

## 🌐 Step-by-Step Free Deployment Guide

Deploying SmartTrip to a free hobby tier requires **no custom domain** and **no credit card**. Follow these steps to deploy on Vercel:

### Step 1: Set up Supabase

1. Create a free organization and project on [Supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the migrations located in `supabase/migrations/` sequentially (`001_init.sql` through `007_error_logs.sql`).
4. Note your **Project URL** and **anon public key** from _Settings → API_.

### Step 2: Deploy to Vercel (Hobby Tier)

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) using your GitHub account.
3. Click **Add New... → Project** and import your `dream-plan-fly` repository.
4. Set the **Framework Preset** to **Other** (Nitro will automatically generate `.vercel/output`).
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `CRON_SECRET`: A secure random string (e.g. `openssl rand -hex 16`)
   - `NITRO_PRESET`: `vercel`
6. Click **Deploy**. Vercel will build the application and assign a free subdomain:
   `https://dream-plan-fly.vercel.app`

### Step 3: Configure GitHub Actions Cron Secrets

To keep your free Supabase database from pausing and to enable the daily price alerts job:

1. Navigate to your GitHub repository: _Settings → Secrets and variables → Actions_.
2. Add the following repository secrets:
   - `VITE_SITE_URL`: `https://your-app.vercel.app`
   - `CRON_SECRET`: The same secret string you configured in Vercel
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key
3. The workflows in `.github/workflows/` (`keep-alive.yml` and `daily-price-alerts.yml`) will now execute automatically on their free cron schedules.

---

## ⚖️ Legal & Disclaimers

### 1. Simulated Demo-Booking Engine

All flight listings, hotel properties, car rentals, train schedules, package tours, and checkout operations function exclusively in a **simulated demonstration mode**. No financial transactions are processed, and issued boarding passes or E-Tickets hold no legal validity with commercial carriers or travel providers.

### 2. AI Travel Advice

Day-by-day itineraries, estimated budgets, local recommendations, and weather insights generated by SmartTrip AI are provided as planning aids only. Travelers are advised to independently confirm attraction timings, transit schedules, health regulations, and government entry requirements before departure.

---

## 📄 License

This project is licensed under the terms of the [MIT License](LICENSE).
