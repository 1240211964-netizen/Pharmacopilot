create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_members (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'teacher',
  created_at timestamptz not null default now(),
  unique (course_id, user_id)
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  uploaded_by_user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text,
  file_name text not null,
  storage_bucket text not null default 'course-materials',
  storage_path text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  status text not null default 'uploaded',
  parse_status text not null default 'pending',
  embedding_status text not null default 'pending',
  extracted_text text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  run_type text not null,
  status text not null default 'completed',
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  source_file_ids uuid[] not null default '{}',
  model_provider text,
  model_name text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_run_id uuid references public.lesson_runs(id) on delete set null,
  title text not null,
  asset_type text not null,
  payload jsonb not null default '{}'::jsonb,
  source_file_ids uuid[] not null default '{}',
  model_provider text,
  model_name text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_owner_id_idx on public.courses(owner_id);
create index if not exists course_members_course_user_idx on public.course_members(course_id, user_id);
create index if not exists files_course_id_idx on public.files(course_id);
create index if not exists files_user_course_idx on public.files(user_id, course_id);
create index if not exists lesson_runs_course_created_idx on public.lesson_runs(course_id, created_at desc);
create index if not exists assets_course_created_idx on public.assets(course_id, created_at desc);
create index if not exists assets_course_type_idx on public.assets(course_id, asset_type);

insert into storage.buckets (id, name, public, file_size_limit)
values ('course-materials', 'course-materials', false, 52428800)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.course_members enable row level security;
alter table public.files enable row level security;
alter table public.lesson_runs enable row level security;
alter table public.assets enable row level security;
