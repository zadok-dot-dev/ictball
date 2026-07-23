create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Anyone can read profiles"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
