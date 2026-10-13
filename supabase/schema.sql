-- =====================================================================
-- City Bus and Metro Guide : database tables (run FIRST in Supabase)
-- Supabase > SQL Editor > New query > paste this > Run
-- =====================================================================

-- If you run this file again, these lines delete the old tables first.
drop table if exists route_stops;
drop table if exists routes;
drop table if exists stops;
drop table if exists fare_slabs;
drop table if exists concessions;

-- 1) STOPS: every bus stop / metro station, with accessibility facilities
create table stops (
  id                    text primary key,         -- short code, e.g. 'KSR'
  name_en               text not null,            -- English name
  name_kn               text not null,            -- Kannada name
  lat                   double precision not null,-- map position
  lng                   double precision not null,
  has_lift              boolean default false,
  has_escalator         boolean default false,
  has_ramp              boolean default false,
  has_tactile_path      boolean default false,    -- guide path for visually impaired
  has_accessible_toilet boolean default false
);

-- 2) ROUTES: one row per bus route or metro line
create table routes (
  id            text primary key,                 -- e.g. 'B-101', 'M-GRN'
  mode          text not null check (mode in ('bus', 'metro')),
  name_en       text not null,
  name_kn       text not null,
  color         text not null,                    -- colour used on the map
  low_floor     boolean default false,            -- low-floor (wheelchair friendly) vehicle
  frequency_min integer not null                  -- one bus/train every N minutes
);

-- 3) ROUTE_STOPS: the ORDER of stops on each route + each segment's distance and time
--    km_from_prev / min_from_prev = distance and time from the PREVIOUS stop on this route
create table route_stops (
  route_id      text references routes(id) on delete cascade,
  seq           integer not null,                 -- 1, 2, 3 ... (position on the route)
  stop_id       text references stops(id) on delete cascade,
  km_from_prev  numeric not null default 0,
  min_from_prev integer not null default 0,
  primary key (route_id, seq)
);

-- 4) FARE_SLABS: distance-based fares. max_km = null means "anything longer"
create table fare_slabs (
  id      serial primary key,
  mode    text not null check (mode in ('bus', 'metro')),
  max_km  numeric,
  fare    integer not null
);

-- 5) CONCESSIONS: discounts for passenger types
create table concessions (
  id           text primary key,
  name_en      text not null,
  name_kn      text not null,
  discount_pct integer not null default 0
);

-- =====================================================================
-- SECURITY (Row Level Security)
-- The website uses the public "anon" key, which anyone can see.
-- So we turn on RLS and allow ONLY reading (select). Nobody can
-- insert/update/delete from the website. You edit data in the dashboard.
-- =====================================================================
alter table stops       enable row level security;
alter table routes      enable row level security;
alter table route_stops enable row level security;
alter table fare_slabs  enable row level security;
alter table concessions enable row level security;

create policy "Public can read stops"       on stops       for select using (true);
create policy "Public can read routes"      on routes      for select using (true);
create policy "Public can read route_stops" on route_stops for select using (true);
create policy "Public can read fare_slabs"  on fare_slabs  for select using (true);
create policy "Public can read concessions" on concessions for select using (true);
