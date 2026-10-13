-- ==============================================================================
-- Migration: 003_features.sql
-- Description: Reviews, Newsletter Subscribers, and Support Tickets tables
-- ==============================================================================

-- 1. Reviews Table
create table if not exists public.reviews (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  destination text not null,
  title text not null,
  comment text not null,
  author_name text not null,
  author_avatar text,
  trip_title text,
  verified boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reviews_user_id_idx on public.reviews(user_id);
create index if not exists reviews_destination_idx on public.reviews(destination);
create index if not exists reviews_created_at_idx on public.reviews(created_at);

alter table public.reviews enable row level security;

-- Anyone can read reviews
create policy "Anyone can read reviews"
  on public.reviews for select
  using (true);

-- Authenticated users can insert reviews
create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- 2. Newsletter Subscribers Table
create table if not exists public.newsletter_subscribers (
  id text primary key default gen_random_uuid()::text,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

-- 3. Support Tickets Table
create table if not exists public.support_tickets (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  category text not null default 'general',
  subject text not null,
  message text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  created_at timestamptz not null default now()
);

create index if not exists support_tickets_user_id_idx on public.support_tickets(user_id);
create index if not exists support_tickets_status_idx on public.support_tickets(status);

alter table public.support_tickets enable row level security;

create policy "Anyone can submit support tickets"
  on public.support_tickets for insert
  with check (true);

create policy "Users can view their own support tickets"
  on public.support_tickets for select
  using (auth.uid() = user_id);
