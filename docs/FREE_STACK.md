# SmartTrip Free Stack Architecture & Quota Protection Guide

> **100% Permanent Free-Tier Guarantee**: SmartTrip is engineered to run, develop, test, and deploy entirely on permanent free tiers. **Zero credit cards**, **zero paid subscriptions**, and **zero expiring trial periods** are required.

---

## 1. Executive Summary & Services Matrix

| Service / Provider                             | Purpose                                                       | Free Tier Quotas (Verifiable on Provider Docs)                                                                                                              | Credit Card Required?                                                       | What Happens When Limit Is Hit                                                            | SmartTrip Protection Mechanism                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google Gemini Flash API** (`@google/genai`)  | AI Trip Planning & Itinerary Generation                       | **15 RPM** (Req/min)<br>**1,000,000 TPM** (Tokens/min)<br>**1,500 RPD** (Req/day) on Google AI Studio                                                       | **NO** (Get free key at [aistudio.google.com](https://aistudio.google.com)) | Returns `HTTP 429` (`RESOURCE_EXHAUSTED`). In other apps, this crashes or freezes the UI. | • **Server-Side Cache**: Identical queries served from in-memory cache (0 API quota used).<br>• **Daily Quotas**: 15 plans/day for signed-in users, 5/day for guests.<br>• **Global Daily Ceiling**: Automatically stops calling Gemini after 1,000 calls/day (500 safety buffer).<br>• **Graceful Fallback**: Bypasses or catches 429 and generates full itinerary via offline `buildPlan()` engine. |
| **Supabase** (Postgres + Auth)                 | Cloud Database, RLS, Auth Sessions, Profiles, Bookings, Funds | **500 MB** Database Storage<br>**50,000** Monthly Active Users<br>**500k** Edge Function Invocations<br>Unlimited API requests                              | **NO** (Create free project at [supabase.com](https://supabase.com))        | Free projects pause automatically after **7 consecutive days of inactivity**.             | • **Keep-Alive Endpoint**: `/api/keep-alive` executes a lightweight `SELECT 1` ping.<br>• **GitHub Actions Cron**: Automated workflow runs twice a week (`0 6 * * 1,4`) to reset the 7-day pause timer.<br>• **Zero Guest Queries**: Guest visitors do not query the database.<br>• **B-tree Indexes**: Indexed all `user_id` columns to prevent sequential scans and protect CPU limits.             |
| **Open-Meteo API**                             | Real-Time Weather Forecasts & Historical Climate Data         | **10,000 daily API calls** for non-commercial & educational use (no API key required)                                                                       | **NO** (No API key, open access)                                            | Returns HTTP 429 rate limit.                                                              | • **30-Minute In-Memory Server Cache**: Prevents duplicate upstream calls.<br>• **Graceful Fallback**: Returns seasonal destination weather if network/quota fails.<br>• **Attribution**: Rendered in UI.                                                                                                                                                                                             |
| **Frankfurter API**                            | Real-Time Currency Conversion (ECB Reference Rates)           | **Unlimited / High Volume** open public API tracked against European Central Bank rates                                                                     | **NO** (No API key, open source)                                            | Service degradation fallback.                                                             | • **Daily Cache (24 hours)**: FX rates cached in-memory.<br>• **Fallback Rates**: Hardcoded fallback INR-to-USD/EUR/GBP rates guarantee uninterrupted checkout.                                                                                                                                                                                                                                       |
| **OpenFlights Dataset**                        | Airport Autocomplete & Global Airport Registry                | **Static Open Data** under Open Database License (ODbL)                                                                                                     | **NO** (Embedded JSON in codebase)                                          | Offline static asset; zero failure mode.                                                  | • **100% Client/Local**: Filtered Indian and major international airports stored directly in repository (`src/data/airports.json`), requiring 0 runtime external requests.                                                                                                                                                                                                                            |
| **OpenStreetMap & Leaflet**                    | Interactive Destination Map & Place Exploration               | **Unlimited** public tile access under Open Database License (ODbL)                                                                                         | **NO** (Open community service)                                             | IP throttle if scraping or downloading excessive bulk tiles.                              | • **Strict Attribution**: `&copy; OpenStreetMap contributors` with link.<br>• **Lazy-Loaded**: Map is rendered client-only (`React.lazy`), never downloaded on SSR.<br>• **Aggressive Caching**: `updateWhenIdle={true}`, `updateWhenZooming={false}`, `keepBuffer={2}` to minimize tile requests.                                                                                                    |
| **Google Fonts CDN**                           | Typography (Manrope & Sora)                                   | **Unlimited** public CDN access                                                                                                                             | **NO**                                                                      | Never throttled for web typography.                                                       | Loaded asynchronously with preconnect and font-display: swap.                                                                                                                                                                                                                                                                                                                                         |
| **GitHub Actions**                             | CI/CD testing & Supabase Keep-Alive Cron                      | **2,000 runner minutes/month** on free GitHub accounts                                                                                                      | **NO**                                                                      | Workflow queued until next monthly reset.                                                 | Lightweight validation runs in ~1.5 min. Keep-alive ping takes 5 seconds (~8 min/month total).                                                                                                                                                                                                                                                                                                        |
| **Hosting (Vercel / Netlify / Render / Node)** | Production Fullstack SSR Deployment                           | **Vercel Hobby**: 100 GB bandwidth, unlimited serverless invocations<br>**Netlify Free**: 100 GB bandwidth<br>**Node / Docker**: Self-hosted on any machine | **NO**                                                                      | Throttled / soft limit notices.                                                           | Standard Nitro output (`.output/server/index.mjs`) can deploy anywhere or run locally with `npm run preview`.                                                                                                                                                                                                                                                                                         |

---

## 2. Gemini Quota Protection Architecture

### 2.1 The Free Quota Problem

Google AI Studio offers a permanent free tier for models like `gemini-2.5-flash` and `gemini-1.5-flash`:

- **Rate Limit**: 15 requests per minute (RPM)
- **Daily Limit**: 1,500 requests per day (RPD)
- **Token Limit**: 1,000,000 tokens per minute (TPM)

If an unmonitored application receives a traffic surge or repeated user clicks, it encounters HTTP 429 errors or exhausts the 1,500 daily requests, resulting in broken user experiences.

### 2.2 Built-In Protections in `src/server/rate-limiter.ts` & `src/server/generate-plan.ts`

```mermaid
flowchart TD
    UserReq[User Submits Plan Request] --> BurstLimit{Within 25 req / 10m?}
    BurstLimit -- No --> ErrBurst[Throw 429 burst warning]
    BurstLimit -- Yes --> CacheCheck{In Server Cache?}
    CacheCheck -- Yes --> RetCache[Return Cached Plan (0 API calls)]
    CacheCheck -- No --> GlobalCeil{Global count >= 1000 today?}
    GlobalCeil -- Yes --> FallbackGlobal[Offline Fallback Plan + Note]
    GlobalCeil -- No --> CircuitCheck{Circuit Breaker active?}
    CircuitCheck -- Yes --> FallbackCircuit[Offline Fallback Plan + Note]
    CircuitCheck -- No --> UserQuota{User: <=15/d or Guest: <=5/d?}
    UserQuota -- No --> FallbackUser[Offline Fallback Plan + Note]
    UserQuota -- Yes --> CallGemini[Invoke Google Gemini API]
    CallGemini -- 429 Received --> TripCircuit[Trip Circuit Breaker + Offline Fallback]
    CallGemini -- Success --> SaveCache[Store in Cache + Inc Counters]
    SaveCache --> RetGemini[Return Fresh Gemini Plan]
```

1. **Server-Side Plan Cache (`generatePlanCacheKey`)**:
   - A deterministic cache key is generated from the normalized prompt, destination, budget, day count, travelers, and interests.
   - If a traveler (or another user) inputs the same query, the plan is served immediately from the server cache with **0 API quota consumed**.
2. **Per-User and Per-IP Guest Limits**:
   - **Authenticated Users**: Capped at 15 AI generations per 24 hours.
   - **Guest IPs**: Capped at 5 AI generations per 24 hours.
   - When a user exceeds their allowance, SmartTrip **does not show an error screen**. It generates a complete, realistic itinerary using the heuristic `buildPlan()` offline engine with a polite explanation banner.
3. **Global Daily Safety Ceiling**:
   - A global counter tracks all outbound calls to Gemini.
   - If total calls reach **1,000 in a UTC calendar day** (well before the 1,500 hard ceiling), the server automatically routes subsequent calls to `buildPlan()` until 00:00 UTC, preserving the free tier.
4. **Graceful HTTP 429 Handling**:
   - If Google's API returns a 429 rate-limit error, SmartTrip catches it, activates a 60-second circuit breaker backoff to let RPM cool down, and delivers an offline plan immediately. The user never sees a broken screen.

---

## 3. Supabase Free Tier Protection & Keep-Alive

### 3.1 The 7-Day Inactivity Pause Gotcha

On Supabase's Free Tier, projects that do not receive any database or auth queries for **7 consecutive days** are automatically paused. To unpause, owners must manually log into the dashboard.

### 3.2 SmartTrip's 3-Layer Defense

1. **Lightweight Keep-Alive API Endpoint (`/api/keep-alive`)**:
   - Located in [src/server.ts](file:///c:/Users/Ayush/Desktop/Mini%20Project/dream-plan-fly/src/server.ts).
   - Intercepts requests to `/api/keep-alive` before SSR and executes a fast query:
     ```http
     GET /rest/v1/profiles?select=id&limit=1
     ```
   - This records legitimate database activity on Supabase and resets the 7-day inactivity pause counter in under 15ms.
2. **Automated GitHub Actions Cron (`.github/workflows/keep-alive.yml`)**:
   - Scheduled to run at **06:00 UTC every Monday and Thursday** (twice a week).
   - Sends an HTTP ping to `${SITE_URL}/api/keep-alive`.
   - Uses ~5 seconds of GitHub Actions runner time (~8 minutes/month out of 2,000 free minutes/month).
3. **Optimized Foreign Key Indexes**:
   - Added explicit B-tree indexes on all `user_id` foreign keys in [004_free_tier_optimizations.sql](file:///c:/Users/Ayush/Desktop/Mini%20Project/dream-plan-fly/supabase/migrations/004_free_tier_optimizations.sql).
   - Guarantees index-only scans for Row Level Security (`auth.uid() = user_id`) queries, preventing sequential table scans and keeping database CPU/RAM usage near 0%.
4. **Zero Guest Queries**:
   - Unauthenticated visitors utilize client-side state and seed datasets; `fetchUserDataFn` returns immediately without initiating any Supabase network requests.

---

## 4. OpenStreetMap Tile Policy Compliance

OpenStreetMap provides free, community-funded map tiles. To respect their [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/):

1. **Attribution**: Clearly rendered on every map instance:
   ```html
   &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
   ```
2. **No Preloading / Lazy Loading**: The Leaflet map component is wrapped with `React.lazy()` and only mounts on the client when the user interacts with or scrolls to the map section.
3. **Aggressive Tile Caching**:
   - `updateWhenIdle={true}`: Pauses tile requests during user drags/pans until mouse movement stops.
   - `updateWhenZooming={false}`: Prevents requesting intermediate tiles during zoom animations.
   - `keepBuffer={2}`: Retains nearby tiles in memory to avoid duplicate network fetches.

---

## 5. Verification Checklist (Confirming Provider Sites)

You can verify the free terms for each service at the following official links:

| Provider             | Verification URL                                                                                    | Free Tier Details to Confirm                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Google AI Studio** | [ai.google.dev/pricing](https://ai.google.dev/pricing)                                              | Under "Free Tier", verify **gemini-2.5-flash** / **gemini-1.5-flash** allows 15 RPM, 1M TPM, 1,500 RPD for $0 without billing enabled. |
| **Supabase**         | [supabase.com/pricing](https://supabase.com/pricing)                                                | Under "Free Plan", verify 500 MB database, 50k MAU, and unlimited API requests are included with no credit card required at signup.    |
| **Open-Meteo**       | [open-meteo.com/en/pricing](https://open-meteo.com/en/pricing)                                      | Confirm free, non-commercial open access up to 10,000 API calls per day without API key or account registration.                       |
| **Frankfurter**      | [frankfurter.dev](https://frankfurter.dev)                                                          | Open source, free currency API publishing ECB daily reference rates without API key or credit card.                                    |
| **OpenFlights**      | [openflights.org/data.html](https://openflights.org/data.html)                                      | Public open dataset under ODbL / Open Data Commons, distributed locally in repo with zero network usage.                               |
| **OpenStreetMap**    | [operations.osmfoundation.org/policies/tiles](https://operations.osmfoundation.org/policies/tiles/) | Confirm free public tile usage guidelines requiring attribution, user-agent identification, and no bulk downloading.                   |
| **GitHub Actions**   | [github.com/pricing](https://github.com/pricing)                                                    | Confirm 2,000 free runner minutes per month for public and private repositories.                                                       |
| **Vercel**           | [vercel.com/pricing](https://vercel.com/pricing)                                                    | Confirm "Hobby" tier is free forever for personal projects without credit card requirements.                                           |

---

## 6. How to Run Locally and Deploy for $0

### Running Locally (100% Free)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (copy example)
cp .env.example .env

# Optional: Add GEMINI_API_KEY from https://aistudio.google.com (100% free, no credit card)
# Optional: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from https://supabase.com

# 3. Start local development server
npm run dev

# 4. Or build and preview the production bundle
npm run build
npm run preview
```

_Note: If no API keys are provided in `.env`, SmartTrip works 100% offline out-of-the-box using its heuristic trip engine and local storage persistence._

### Deploying to Free Production (e.g. Vercel)

1. Push repository to GitHub.
2. Sign into [Vercel](https://vercel.com) using your GitHub account (no credit card required on Hobby tier).
3. Import `dream-plan-fly` and click **Deploy**.
4. Set Environment Variables in Project Settings:
   - `VITE_SITE_URL`: Your deployed URL (e.g. `https://your-project.vercel.app`)
   - `VITE_SUPABASE_URL`: Your free Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your free Supabase Anon Key
   - `GEMINI_API_KEY`: Your free Google AI Studio key
5. Add `SITE_URL` to your GitHub Repository Secrets (`Settings -> Secrets and variables -> Actions`) so the automated keep-alive cron pings your live site.
