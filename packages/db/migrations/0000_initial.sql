create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  github_username text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, github_username)
  values (new.id, new.raw_user_meta_data ->> 'user_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();



create table if not exists public.repos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  github_owner text not null,
  github_repo text not null,
  commit_sha text not null,
  archetype text,
  status text not null default 'pending', -- pending|fetching|parsing|embedding|done|failed
  pinecone_index text,
  file_count int,
  created_at timestamptz default now(),
  unique (user_id, github_owner, github_repo, commit_sha)
);
alter table public.repos enable row level security;
drop policy if exists "owner_all" on public.repos;
create policy "owner_all" on public.repos for all using (auth.uid() = user_id);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  repo_id uuid not null references public.repos(id) on delete cascade,
  path text not null,
  file_count int,
  created_at timestamptz default now()
);
alter table public.modules enable row level security;
drop policy if exists "owner_all" on public.modules;
create policy "owner_all" on public.modules for all
  using (repo_id in (select id from public.repos where user_id = auth.uid()));

create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  repo_id uuid not null references public.repos(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  pinecone_vector_id text not null,
  file_path text not null,
  symbol_name text,
  symbol_type text, -- function|class|interface|coalesced
  start_line int,
  end_line int,
  content text not null,
  token_count int,
  created_at timestamptz default now()
);
alter table public.chunks enable row level security;
drop policy if exists "owner_all" on public.chunks;
create policy "owner_all" on public.chunks for all
  using (repo_id in (select id from public.repos where user_id = auth.uid()));
create index if not exists chunks_repo_id_idx on public.chunks(repo_id);
create index if not exists chunks_module_id_idx on public.chunks(module_id);

-- global, not per-user. gates new ingestion jobs near free-tier limits.
create table if not exists public.usage_counters (
  day date primary key default current_date,
  ingestion_jobs_count int not null default 0
);