-- ==============================================================================
-- Migration: 004_free_tier_optimizations.sql
-- Description: Indexes on all foreign key / user_id columns to ensure index-only scans
--              and protect Supabase Free-Tier compute / memory limits.
-- ==============================================================================

-- 1. Index on shared_plans(user_id)
create index if not exists shared_plans_user_id_idx on public.shared_plans(user_id);

-- 2. Index on reviews(user_id)
create index if not exists reviews_user_id_idx on public.reviews(user_id);

-- 3. Index on support_tickets(user_id) & status
create index if not exists support_tickets_user_id_idx on public.support_tickets(user_id);
create index if not exists support_tickets_status_idx on public.support_tickets(status);

-- 4. Compound indexes for high-frequency user_id + created_at queries
create index if not exists trips_user_id_created_at_idx on public.trips(user_id, created_at desc);
create index if not exists bookings_user_id_created_at_idx on public.bookings(user_id, created_at desc);
create index if not exists notifications_user_id_created_at_idx on public.notifications(user_id, created_at desc);
