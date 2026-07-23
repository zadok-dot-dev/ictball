create table planned_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  venue_id uuid not null references venues(id) on delete cascade,
  target_time timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, venue_id)
);

alter table planned_visits enable row level security;

create policy "Anyone can read planned visits"
  on planned_visits for select
  using (true);

create policy "Users can insert their own planned visits"
  on planned_visits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own planned visits"
  on planned_visits for update
  using (auth.uid() = user_id);
