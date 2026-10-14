# 🔐 Environment Variables & Infrastructure Setup Guide

> **Zero Paid Services Guarantee**: SmartTrip is engineered to run 100% free forever. No credit cards, paid subscriptions, or premium accounts are required for local development, automated CI testing, or production hosting.

---

## 📋 Complete Environment Variable Reference Matrix

| Variable Name               | Scope               | Tier                                                | Purpose & Impact                                                                                                                                                | Free-Tier Source URL                                                                                                    | Graceful Fallback if Missing                                                                                                                                    | Where to Set                                                          |
| :-------------------------- | :------------------ | :-------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| `VITE_SITE_URL`             | **Public** (Client) | **Optional** (Dev) / **Recommended** (Prod)         | Base domain used for OpenGraph sharing cards, canonical tags, sitemaps, and Supabase auth email redirects.                                                      | Vercel free subdomain (`https://*.vercel.app`) or `http://localhost:3000`                                               | Defaults to `http://localhost:3000` locally, or `window.location.origin` in the browser.                                                                        | Local `.env`<br>Vercel (Prod & Preview)<br>GitHub Actions Secrets     |
| `VITE_SUPABASE_URL`         | **Public** (Client) | **Required for Cloud Sync** / **Optional for Demo** | HTTPS REST and Auth API endpoint for Supabase PostgreSQL database. Enables cloud user authentication, saved trips, multi-device sync, and bookings persistence. | [supabase.com](https://supabase.com)<br>_(Settings → API → Project URL)_                                                | Gracefully operates in **Offline Guest Mode** using browser `localStorage` and seed mock data. Zero UI crashes.                                                 | Local `.env`<br>Vercel (Prod, Preview, Dev)<br>GitHub Actions Secrets |
| `VITE_SUPABASE_ANON_KEY`    | **Public** (Client) | **Required for Cloud Sync** / **Optional for Demo** | Anonymous client API key safe for browser exposure. Scoped strictly by PostgreSQL Row Level Security (RLS) policies.                                            | [supabase.com](https://supabase.com)<br>_(Settings → API → Project API Keys → `anon public`)_                           | Same as above: operates in **Offline Guest Mode** with local browser persistence.                                                                               | Local `.env`<br>Vercel (Prod, Preview, Dev)<br>GitHub Actions Secrets |
| `SUPABASE_URL`              | **Server-only**     | **Optional**                                        | Server-side Supabase URL fallback for server functions and cron endpoints.                                                                                      | [supabase.com](https://supabase.com)                                                                                    | Automatically reads `VITE_SUPABASE_URL` if unset.                                                                                                               | Local `.env`<br>Vercel (Prod & Preview)                               |
| `SUPABASE_ANON_KEY`         | **Server-only**     | **Optional**                                        | Server-side Supabase anon key fallback for server functions.                                                                                                    | [supabase.com](https://supabase.com)                                                                                    | Automatically reads `VITE_SUPABASE_ANON_KEY` if unset.                                                                                                          | Local `.env`<br>Vercel (Prod & Preview)                               |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only**     | **Optional** (Admin Only)                           | Administrative service role key that **bypasses Row Level Security**. Used for background error log pruning and keep-alive pings. **NEVER expose to client**.   | [supabase.com](https://supabase.com)<br>_(Settings → API → Project API Keys → `service_role secret`)_                   | Background cleanup routines are safely skipped; standard features utilize the scoped `anon` client.                                                             | Local `.env`<br>Vercel (Prod Only)                                    |
| `GEMINI_API_KEY`            | **Server-only**     | **Optional** (Recommended)                          | Powers AI itinerary generation with Google Gemini 2.5 Flash (`generatePlan`). Never bundled into client assets.                                                 | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)<br>_(15 RPM / 1,500 RPD free, no card needed)_ | Automatically and seamlessly falls back to the built-in deterministic heuristic engine (`buildPlan()`), providing complete multi-day itineraries with 0 errors. | Local `.env`<br>Vercel (Prod & Preview)                               |
| `DEMO_PAY_SECRET`           | **Server-only**     | **Optional**                                        | 32+ character secret string used as salt for HMAC-SHA256 signature verification on simulated demo booking vouchers and E-tickets.                               | Any random string:<br>`openssl rand -hex 32`                                                                            | Falls back to internal development default secret (`smarttrip-demo-secret-key-do-not-use-in-real-prod`).                                                        | Local `.env`<br>Vercel (Prod & Preview)                               |
| `CRON_SECRET`               | **Server-only**     | **Optional** (Dev) / **Required for Cron** (Prod)   | Bearer token authenticating scheduled HTTP invocations to `/api/cron/price-fluctuations` from GitHub Actions.                                                   | Any random string:<br>`openssl rand -hex 32`                                                                            | Defaults to `"dev-cron-secret"` in non-production environments.                                                                                                 | Local `.env`<br>Vercel (Prod & Preview)<br>GitHub Actions Secrets     |
| `NITRO_PRESET`              | **CI / Deploy**     | **Optional**                                        | Sets the deployment build output target for Nitro SSR runtime engine (`vercel`, `netlify`, `node-server`).                                                      | Auto-detected on Vercel                                                                                                 | Auto-detected when `VERCEL=1` or `NETLIFY=true`; defaults to `node-server`.                                                                                     | Vercel (Prod & Preview)<br>Local `.env`                               |
| `RAZORPAY_KEY_ID`           | **Server-only**     | **Optional** (Disabled by default)                  | Razorpay Test Mode Key ID if testing simulated Razorpay transactions.                                                                                           | [dashboard.razorpay.com](https://dashboard.razorpay.com)<br>_(Settings → API Keys)_                                     | Uses the built-in 100% free `DemoPayProvider` (card, UPI, net banking) with instant simulated checkout.                                                         | Local `.env` (optional)                                               |
| `RAZORPAY_KEY_SECRET`       | **Server-only**     | **Optional** (Disabled by default)                  | Razorpay Test Mode Key Secret for HMAC signature validation.                                                                                                    | [dashboard.razorpay.com](https://dashboard.razorpay.com)                                                                | Uses the built-in free `DemoPayProvider`.                                                                                                                       | Local `.env` (optional)                                               |
| `VITE_SENTRY_DSN`           | **Public** (Client) | **Optional**                                        | Client-side error tracking endpoint for Sentry.                                                                                                                 | [sentry.io](https://sentry.io)<br>_(Free tier: 5k events/mo)_                                                           | Errors log to browser console and local database telemetry table (`error_logs`).                                                                                | Local `.env` (optional)                                               |

---

## 🛠️ Step-by-Step Manual Setup Checklist

### 1. Supabase Cloud Database & Auth

1. **Create Free Project**:
   - Go to [supabase.com](https://supabase.com), log in with GitHub, and click **New Project**.
   - Choose a project name (e.g. `smarttrip-production`), select a nearby free region, and set a database password.
2. **Run Migrations in SQL Editor**:
   - In your Supabase dashboard, navigate to **SQL Editor** (left navigation).
   - Execute the SQL migration files located in `supabase/migrations/` sequentially in this exact order:
     1. `supabase/migrations/001_init.sql` — Profiles, trips, bookings, funds, wishlist, notifications, and RLS policies.
     2. `supabase/migrations/002_shared_plans.sql` — Public shared AI trip plans schema and access rules.
     3. `supabase/migrations/003_features.sql` — Reviews and support tickets tables with user isolation.
     4. `supabase/migrations/004_free_tier_optimizations.sql` — Composite indexes for lightning-fast queries and user filters.
     5. `supabase/migrations/005_booking_system.sql` — Enhanced demo booking reference indices and idempotency tracking.
     6. `supabase/migrations/006_price_alerts.sql` — Watch price alert subscriptions with RLS.
     7. `supabase/migrations/007_error_logs.sql` — Telemetry logging with automated row-limit pruning trigger.
3. **Configure Auth Redirect URLs**:
   - In Supabase, go to **Authentication → URL Configuration**.
   - Set **Site URL** to:
     - `http://localhost:3000` (for local development) OR `https://<your-project>.vercel.app` (for production).
   - In **Redirect URLs**, add:
     - `http://localhost:3000/**`
     - `https://<your-project>.vercel.app/**`
     - `https://<your-project>-*.vercel.app/**` (allows preview branch deployments)
4. **Storage Buckets**:
   - **None required**. SmartTrip does not consume Supabase storage quotas:
     - Destination photography is hosted via Unsplash CDN.
     - E-Ticket boarding vouchers generate client-side QR codes dynamically using HTML5 Canvas (`qrcode`).
5. **Database Triggers Verified**:
   - Migration `001_init.sql` automatically registers trigger `on_auth_user_created` to sync user profiles from `auth.users` to `public.profiles`.
   - Migration `007_error_logs.sql` registers trigger `trigger_prune_error_logs` to automatically prune logs when rows exceed 10,000, keeping free storage usage minimal.

---

### 2. Third-Party Free Tiers & External APIs

| Provider              | Purpose                              | Free Quota                            | Key Required?      | How to Get / Configure                                                                                                                                                                                                   |
| :-------------------- | :----------------------------------- | :------------------------------------ | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google AI Studio**  | Gemini 2.5 Flash Itinerary Generator | 15 requests/min<br>1,500 requests/day | **Yes** (Free key) | 1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)<br>2. Sign in with Google account (no credit card needed)<br>3. Click "Create API Key"<br>4. Paste key into `GEMINI_API_KEY` in `.env` |
| **Open-Meteo**        | Live weather & 7-day forecast        | 10,000 calls/day                      | **No** (Key-less)  | Built-in client in `src/server/services/weather.ts` with 30-min in-memory cache and OpenStreetMap attribution.                                                                                                           |
| **Frankfurter (ECB)** | Live currency conversion & rates     | Unlimited free                        | **No** (Key-less)  | Built-in client in `src/server/services/currency.ts` with 24-hr in-memory cache.                                                                                                                                         |
| **OpenStreetMap**     | Interactive Leaflet maps             | Unlimited free tile access            | **No** (Key-less)  | Dynamic SSR Leaflet map client in `src/client/features/map/` with idle tile caching and copyright attribution.                                                                                                           |
| **OpenFlights**       | 100+ global & domestic airport codes | Zero runtime calls                    | **No** (Bundled)   | Bundled static dataset in `src/shared/constants/airports.ts`.                                                                                                                                                            |

---

### 3. Vercel Production Deployment Settings

1. **Project Setup**:
   - Import your GitHub repository into [Vercel](https://vercel.com).
   - **Framework Preset**: Select **Other**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `.vercel/output` (Nitro handles output automatically).
   - **Install Command**: `npm install`
2. **Environment Variables on Vercel**:
   Add the following under **Project Settings → Environment Variables**:

   | Variable                 | Target Environments              | Recommended Value                        |
   | :----------------------- | :------------------------------- | :--------------------------------------- |
   | `VITE_SITE_URL`          | Production, Preview              | `https://your-app.vercel.app`            |
   | `VITE_SUPABASE_URL`      | Production, Preview, Development | `https://<your-project-ref>.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | Production, Preview, Development | `<your-supabase-anon-key>`               |
   | `GEMINI_API_KEY`         | Production, Preview              | `<your-google-gemini-api-key>`           |
   | `DEMO_PAY_SECRET`        | Production, Preview              | `<32-character-random-hex-string>`       |
   | `CRON_SECRET`            | Production, Preview              | `<32-character-random-hex-string>`       |
   | `NITRO_PRESET`           | Production, Preview              | `vercel`                                 |

---

### 4. GitHub Actions Automation Workflows

Configure secrets in **Repository Settings → Secrets and variables → Actions** to activate automated background jobs:

| Secret Name              | Required By                                | What It Does                                                                  |
| :----------------------- | :----------------------------------------- | :---------------------------------------------------------------------------- |
| `VITE_SITE_URL`          | `keep-alive.yml`, `daily-price-alerts.yml` | Sets base target domain for automated cron requests                           |
| `CRON_SECRET`            | `daily-price-alerts.yml`                   | Authorizes price fluctuations cron endpoint at 04:00 UTC                      |
| `VITE_SUPABASE_URL`      | `keep-alive.yml`                           | Pings Supabase PostgREST endpoint to prevent free-tier 7-day inactivity pause |
| `VITE_SUPABASE_ANON_KEY` | `keep-alive.yml`                           | Authorized client key for keep-alive ping                                     |

#### Workflows Summary:

1. `.github/workflows/ci.yml`: Runs on push/PR to `main` and `production-ready`. Executes `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check:boundaries`, and `npx playwright test`.
2. `.github/workflows/keep-alive.yml`: Runs Mondays and Thursdays at 06:00 UTC. Sends a lightweight ping to `/api/keep-alive` to reset Supabase's free project inactivity pause timer.
3. `.github/workflows/daily-price-alerts.yml`: Runs daily at 04:00 UTC. Simulates realistic market price shifts and checks user price watch subscriptions.

---

## ⚡ "Do This Now" Summary (Quick Start Checklist)

Before running or deploying the app, complete these 3 external steps:

1. **Get Free Google Gemini API Key** (1 minute):
   - Visit [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and create a key.
2. **Create Free Supabase Project & Run Migrations** (3 minutes):
   - Create project on [supabase.com](https://supabase.com).
   - In SQL Editor, run `001_init.sql` through `007_error_logs.sql`.
   - Copy your **Project URL** and **anon public key**.
3. **Configure Local `.env`**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Paste your `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` into `.env`.

### 🔍 Verification Commands

Run these exact commands in your terminal to verify your environment and codebase health:

```bash
# 1. Audit your environment variables (100% privacy, zero secret leaks)
npm run check:env

# 2. Verify architectural boundaries (guarantees client/server isolation)
npm run check:boundaries

# 3. Launch local development server
npm run dev
```
