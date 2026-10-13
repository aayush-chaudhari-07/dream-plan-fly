-- ==============================================================================
-- Migration: 005_booking_system.sql
-- Description: Inventory Tables (Stays, Rentals, Transit, Packages) and 
--              Enhanced Booking Lifecycle with Idempotency, Status & Payment Details.
-- ==============================================================================

-- 1. Enhance Bookings table with status, idempotency key and breakdown
alter table public.bookings
  add column if not exists status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled', 'failed')),
  add column if not exists idempotency_key text unique,
  add column if not exists traveler_details jsonb default '{}'::jsonb,
  add column if not exists payment_details jsonb default '{}'::jsonb,
  add column if not exists fare_breakdown jsonb default '{}'::jsonb,
  add column if not exists inventory_id text,
  add column if not exists start_date text,
  add column if not exists end_date text,
  add column if not exists origin text,
  add column if not exists destination text,
  add column if not exists passengers_count integer default 1,
  add column if not exists cabin_class text default 'economy';

create index if not exists bookings_idempotency_key_idx on public.bookings(idempotency_key);
create index if not exists bookings_status_idx on public.bookings(status);

-- 2. Inventory: Stays
create table if not exists public.inventory_stays (
  id text primary key,
  name text not null,
  destination text not null,
  location text not null,
  lat numeric not null,
  lng numeric not null,
  rating numeric not null default 4.5,
  reviews_count integer not null default 0,
  property_type text not null,
  amenities text[] not null default '{}',
  price numeric not null check (price >= 0),
  original_price numeric not null check (original_price >= 0),
  image text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create index if not exists inventory_stays_dest_idx on public.inventory_stays(destination);
create index if not exists inventory_stays_price_idx on public.inventory_stays(price);

-- 3. Inventory: Rentals
create table if not exists public.inventory_rentals (
  id text primary key,
  name text not null,
  category text not null,
  destination text not null,
  pickup_location text not null,
  seats integer not null default 4,
  transmission text not null,
  fuel text not null,
  rating numeric not null default 4.5,
  price numeric not null check (price >= 0),
  original_price numeric not null check (original_price >= 0),
  image text not null,
  included text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists inventory_rentals_dest_idx on public.inventory_rentals(destination);

-- 4. Inventory: Transit (Train & Bus)
create table if not exists public.inventory_transit (
  id text primary key,
  type text not null check (type in ('train', 'bus')),
  operator text not null,
  service_name text not null,
  number_or_code text not null,
  origin text not null,
  destination text not null,
  departure_time text not null,
  arrival_time text not null,
  duration text not null,
  classes jsonb not null default '[]'::jsonb,
  frequency text not null,
  rating numeric not null default 4.5,
  created_at timestamptz not null default now()
);

create index if not exists inventory_transit_route_idx on public.inventory_transit(origin, destination);

-- 5. Inventory: Packages
create table if not exists public.inventory_packages (
  id text primary key,
  name text not null,
  destination text not null,
  duration_days integer not null default 3,
  duration_nights integer not null default 2,
  rating numeric not null default 4.5,
  reviews_count integer not null default 0,
  includes text[] not null default '{}',
  highlights text[] not null default '{}',
  price numeric not null check (price >= 0),
  original_price numeric not null check (original_price >= 0),
  image text not null,
  created_at timestamptz not null default now()
);

create index if not exists inventory_packages_dest_idx on public.inventory_packages(destination);

-- Enable RLS and public read policies
alter table public.inventory_stays enable row level security;
alter table public.inventory_rentals enable row level security;
alter table public.inventory_transit enable row level security;
alter table public.inventory_packages enable row level security;

create policy "Allow public read on inventory_stays"
  on public.inventory_stays for select
  using (true);

create policy "Allow public read on inventory_rentals"
  on public.inventory_rentals for select
  using (true);

create policy "Allow public read on inventory_transit"
  on public.inventory_transit for select
  using (true);

create policy "Allow public read on inventory_packages"
  on public.inventory_packages for select
  using (true);
