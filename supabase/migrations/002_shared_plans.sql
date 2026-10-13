-- ==============================================================================
-- Migration: 002_shared_plans.sql
-- Description: Public shared plans table for public read-only /plan/$id links.
-- ==============================================================================

create table if not exists public.shared_plans (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete set null,
  plan jsonb not null,
  title text not null,
  destination text not null,
  budget numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists shared_plans_user_id_idx on public.shared_plans(user_id);
create index if not exists shared_plans_created_at_idx on public.shared_plans(created_at);

alter table public.shared_plans enable row level security;

-- Public read-only access for sharing
create policy "Anyone can view shared plans"
  on public.shared_plans for select
  using (true);

-- Anyone (guests and authenticated users) can generate a share link
create policy "Anyone can create a shared plan"
  on public.shared_plans for insert
  with check (true);
