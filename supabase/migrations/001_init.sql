-- ==============================================================================
-- Migration: 001_init.sql
-- Description: Core Schema for SmartTrip Backend (Profiles, Trips, Bookings, Funds,
--              Fund Contributions, Wishlist, Notifications) with strict RLS.
-- ==============================================================================

-- 1. Custom Types & Enums
create type trip_bucket as enum ('Upcoming', 'Past', 'Saved');

-- 2. Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to auto-create profile on auth.users signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Trips Table
create table if not exists public.trips (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  dates text not null,
  status text[] not null default '{}',
  image text not null,
  bucket trip_bucket not null default 'Saved',
  plan jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trips_user_id_idx on public.trips(user_id);
create index if not exists trips_bucket_idx on public.trips(bucket);

-- 4. Bookings Table
create table if not exists public.bookings (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('flight', 'stay', 'rental', 'rail', 'package')),
  title text not null,
  subtitle text not null,
  price numeric not null check (price >= 0),
  reference text not null,
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_reference_idx on public.bookings(reference);

-- 5. Funds Table (Trip Fund / Dream Fund)
create table if not exists public.funds (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target numeric not null check (target > 0),
  saved numeric not null default 0 check (saved >= 0),
  emoji text not null default '✈️',
  target_date text not null default 'Date flexible',
  months_left integer not null default 12,
  travelers integer not null default 2,
  image text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists funds_user_id_idx on public.funds(user_id);

-- 6. Fund Contributions Table (History of deposits)
create table if not exists public.fund_contributions (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  fund_id text not null references public.funds(id) on delete cascade,
  amount numeric not null check (amount > 0),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists fund_contributions_user_id_idx on public.fund_contributions(user_id);
create index if not exists fund_contributions_fund_id_idx on public.fund_contributions(fund_id);

-- 7. Wishlist Table
create table if not exists public.wishlist (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id text not null,
  created_at timestamptz not null default now(),
  constraint wishlist_user_destination_unique unique (user_id, destination_id)
);

create index if not exists wishlist_user_id_idx on public.wishlist(user_id);

-- 8. Notifications Table
create table if not exists public.notifications (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean not null default false,
  type text not null default 'info',
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: users can only view, create, edit, and delete their own rows.
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.bookings enable row level security;
alter table public.funds enable row level security;
alter table public.fund_contributions enable row level security;
alter table public.wishlist enable row level security;
alter table public.notifications enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trips Policies
create policy "Users can view their own trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "Users can create their own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trips"
  on public.trips for update
  using (auth.uid() = user_id);

create policy "Users can delete their own trips"
  on public.trips for delete
  using (auth.uid() = user_id);

-- Bookings Policies
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bookings"
  on public.bookings for delete
  using (auth.uid() = user_id);

-- Funds Policies
create policy "Users can view their own funds"
  on public.funds for select
  using (auth.uid() = user_id);

create policy "Users can create their own funds"
  on public.funds for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own funds"
  on public.funds for update
  using (auth.uid() = user_id);

create policy "Users can delete their own funds"
  on public.funds for delete
  using (auth.uid() = user_id);

-- Fund Contributions Policies
create policy "Users can view their own fund contributions"
  on public.fund_contributions for select
  using (auth.uid() = user_id);

create policy "Users can create their own fund contributions"
  on public.fund_contributions for insert
  with check (auth.uid() = user_id);

-- Wishlist Policies
create policy "Users can view their own wishlist"
  on public.wishlist for select
  using (auth.uid() = user_id);

create policy "Users can add to their wishlist"
  on public.wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from their wishlist"
  on public.wishlist for delete
  using (auth.uid() = user_id);

-- Notifications Policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);
