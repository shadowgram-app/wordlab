-- ============================================================
-- WordLab · Supabase 스키마
-- 사용법: Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN
-- ============================================================

-- 진도 테이블 (이메일을 PK로 사용 — 인증 없는 식별자 방식)
create table if not exists public.progress (
  email        text primary key,
  known        jsonb       not null default '{}'::jsonb,  -- { "word": true, ... }
  known_count  int         not null default 0,
  quiz_score   int         not null default 0,
  dict_score   int         not null default 0,
  level        text        not null default 'L3',
  updated_at   timestamptz not null default now()
);

-- 실시간(Realtime) 활성화: 관리자 대시보드가 변경을 즉시 받도록
alter publication supabase_realtime add table public.progress;

-- ============================================================
-- RLS (Row Level Security)
-- ⚠ 식별자 전용(인증 없음) 방식이라 anon 키로 읽기/쓰기를 허용합니다.
--   → 단어 암기 진도라는 낮은 민감도 데이터에 맞춘 설정입니다.
--   → 보안을 강화하려면 README의 "보안 업그레이드 경로" 참고.
-- ============================================================
alter table public.progress enable row level security;

-- 누구나(anon) 본인 진도를 저장(업서트)하고 이어보기 위해 read/insert/update 허용
drop policy if exists "anon read"   on public.progress;
drop policy if exists "anon insert" on public.progress;
drop policy if exists "anon update" on public.progress;
drop policy if exists "anon delete" on public.progress;

create policy "anon read"   on public.progress for select using (true);
create policy "anon insert" on public.progress for insert with check (true);
create policy "anon update" on public.progress for update using (true) with check (true);
-- 삭제(진도 초기화)도 허용하려면 아래 주석 해제:
create policy "anon delete" on public.progress for delete using (true);

-- 참고: known_count 는 앱에서 계산해 함께 저장합니다(대시보드 정렬·표시용).
