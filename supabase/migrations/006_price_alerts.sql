-- Migration: 006_price_alerts.sql
-- Create price_alerts table with Row Level Security for flight, stay, and package price tracking

create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_type text not null check (item_type in ('flight', 'stay', 'package')),
  item_id text not null,
  title text not null,
  target_price numeric not null,
  base_price numeric not null,
  current_price numeric not null,
  is_active boolean default true not null,
  last_checked_at timestamptz default now(),
  last_notified_at timestamptz,
  created_at timestamptz default now() not null
);

-- Indexes for efficient queries during daily cron evaluation
create index if not exists idx_price_alerts_user on public.price_alerts(user_id);
create index if not exists idx_price_alerts_active on public.price_alerts(is_active);
create index if not exists idx_price_alerts_item on public.price_alerts(item_id);

-- Row Level Security
alter table public.price_alerts enable row level security;

create policy "Users can view own price alerts"
  on public.price_alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert own price alerts"
  on public.price_alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own price alerts"
  on public.price_alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete own price alerts"
  on public.price_alerts for delete
  using (auth.uid() = user_id);
