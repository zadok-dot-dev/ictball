create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  surface_type text not null,
  indoor_outdoor text not null check (indoor_outdoor in ('indoor', 'outdoor')),
  amenities text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table venues enable row level security;

create policy "Anyone can read venues"
  on venues for select
  using (true);
