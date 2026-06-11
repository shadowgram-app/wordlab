-- ============================================================
-- WordLab 초등 · Supabase 스키마 (별도 테이블 progress_elem)
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN
-- ============================================================
create table if not exists public.progress_elem (
  email        text primary key,
  known        jsonb       not null default '{}'::jsonb,
  known_count  int         not null default 0,
  quiz_score   int         not null default 0,
  dict_score   int         not null default 0,
  level        text        not null default 'E1',
  updated_at   timestamptz not null default now()
);

-- 실시간(Realtime) 활성화
alter publication supabase_realtime add table public.progress_elem;

-- RLS (식별자 전용 방식 — anon 읽기/쓰기 허용, 낮은 민감도 데이터)
alter table public.progress_elem enable row level security;
drop policy if exists "anon read"   on public.progress_elem;
drop policy if exists "anon insert" on public.progress_elem;
drop policy if exists "anon update" on public.progress_elem;
drop policy if exists "anon delete" on public.progress_elem;
create policy "anon read"   on public.progress_elem for select using (true);
create policy "anon insert" on public.progress_elem for insert with check (true);
create policy "anon update" on public.progress_elem for update using (true) with check (true);
create policy "anon delete" on public.progress_elem for delete using (true);
