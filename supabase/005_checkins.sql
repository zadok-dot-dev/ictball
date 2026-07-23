create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  venue_id uuid not null references venues(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table checkins enable row level security;

create policy "Anyone can read checkins"
  on checkins for select
  using (true);

create policy "Users can insert their own checkins"
  on checkins for insert
  with check (auth.uid() = user_id);
