create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists public.knowledge_files (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  course_id text,
  file_name text not null,
  mime_type text,
  source_type text not null default 'upload',
  source_uri text,
  source_label text,
  metadata jsonb not null default '{}'::jsonb,
  text_char_count integer not null default 0,
  chunk_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references public.knowledge_files(id) on delete cascade,
  user_id text not null,
  course_id text,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536) not null,
  source_type text not null default 'upload',
  source_uri text,
  source_label text,
  char_start integer,
  char_end integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (file_id, chunk_index)
);

create table if not exists public.knowledge_source_boundaries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  course_id text not null default '',
  boundary_text text not null default '',
  parsed_filter jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists knowledge_files_user_course_idx
  on public.knowledge_files (user_id, course_id, created_at desc);

create index if not exists knowledge_chunks_user_course_idx
  on public.knowledge_chunks (user_id, course_id, created_at desc);

create index if not exists knowledge_chunks_file_idx
  on public.knowledge_chunks (file_id, chunk_index);

create index if not exists knowledge_chunks_metadata_gin_idx
  on public.knowledge_chunks using gin (metadata);

create index if not exists knowledge_chunks_embedding_idx
  on public.knowledge_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_user_id text,
  match_course_id text default null,
  match_count integer default 8,
  source_filter jsonb default '{}'::jsonb
)
returns table (
  chunk_id uuid,
  file_id uuid,
  file_name text,
  chunk_index integer,
  content text,
  metadata jsonb,
  source_type text,
  source_uri text,
  source_label text,
  similarity double precision
)
language sql
stable
as $$
  with filters as (
    select
      coalesce(array(select jsonb_array_elements_text(source_filter -> 'file_ids')), array[]::text[]) as file_ids,
      coalesce(array(select lower(jsonb_array_elements_text(source_filter -> 'source_types'))), array[]::text[]) as source_types,
      coalesce(array(select lower(jsonb_array_elements_text(source_filter -> 'extensions'))), array[]::text[]) as extensions,
      coalesce(array(select lower(jsonb_array_elements_text(source_filter -> 'uploaded_extensions'))), array[]::text[]) as uploaded_extensions,
      coalesce(array(select lower(jsonb_array_elements_text(source_filter -> 'domains'))), array[]::text[]) as domains,
      coalesce(array(select lower(jsonb_array_elements_text(source_filter -> 'labels'))), array[]::text[]) as labels
  )
  select
    kc.id as chunk_id,
    kc.file_id,
    kf.file_name,
    kc.chunk_index,
    kc.content,
    kc.metadata,
    kc.source_type,
    kc.source_uri,
    kc.source_label,
    1 - (kc.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks kc
  join public.knowledge_files kf on kf.id = kc.file_id
  cross join filters f
  where kc.user_id = match_user_id
    and (match_course_id is null or kc.course_id = match_course_id)
    and (
      (
        cardinality(f.file_ids) = 0 and
        cardinality(f.source_types) = 0 and
        cardinality(f.extensions) = 0 and
        cardinality(f.uploaded_extensions) = 0 and
        cardinality(f.domains) = 0 and
        cardinality(f.labels) = 0
      )
      or kc.file_id::text = any(f.file_ids)
      or lower(coalesce(kc.source_type, '')) = any(f.source_types)
      or lower(coalesce(kc.metadata ->> 'extension', '')) = any(f.extensions)
      or (lower(coalesce(kc.source_type, '')) = 'upload' and lower(coalesce(kc.metadata ->> 'extension', '')) = any(f.uploaded_extensions))
      or exists (
        select 1
        from unnest(f.domains) as domain
        where lower(coalesce(kc.source_uri, '')) like '%' || domain || '%'
           or lower(coalesce(kc.metadata ->> 'source_uri', '')) like '%' || domain || '%'
      )
      or exists (
        select 1
        from unnest(f.labels) as label
        where lower(coalesce(kc.source_label, '')) like '%' || label || '%'
           or lower(kf.file_name) like '%' || label || '%'
           or lower(coalesce(kc.metadata ->> 'source_label', '')) like '%' || label || '%'
      )
    )
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;

alter table public.knowledge_files enable row level security;
alter table public.knowledge_chunks enable row level security;
alter table public.knowledge_source_boundaries enable row level security;

drop policy if exists "knowledge_files_owner_read" on public.knowledge_files;
create policy "knowledge_files_owner_read"
  on public.knowledge_files
  for select
  using (user_id = auth.uid()::text);

drop policy if exists "knowledge_chunks_owner_read" on public.knowledge_chunks;
create policy "knowledge_chunks_owner_read"
  on public.knowledge_chunks
  for select
  using (user_id = auth.uid()::text);

drop policy if exists "knowledge_source_boundaries_owner_read" on public.knowledge_source_boundaries;
create policy "knowledge_source_boundaries_owner_read"
  on public.knowledge_source_boundaries
  for select
  using (user_id = auth.uid()::text);
