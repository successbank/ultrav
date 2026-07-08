-- 010_loop_lessons.sql — V9 Reflexion 에피소드 메모리: 루프 도중 얻은 교훈(다음 tick/루프에 재주입)
-- 009_loop_runs(실행 기록)와 짝. runs=무엇이 일어났나, lessons=무엇을 배웠나.
CREATE TABLE IF NOT EXISTS loop_lessons (
  id            bigserial PRIMARY KEY,
  loop_name     text NOT NULL,                  -- 어느 루프에서 얻은 교훈인가 (loop_runs.loop_name과 연결)
  tags          text[] NOT NULL DEFAULT '{}',   -- repo·작업유형 등 검색 태그
  lesson        text NOT NULL,                  -- "무엇이·왜·다음엔" 행동 가능한 한두 줄
  trigger_ctx   text,                           -- 교훈을 유발한 실패/반송 요약
  outcome_delta text,                           -- 적용 후 효과(개선/무효) — postmortem이 갱신
  reuse_count   int NOT NULL DEFAULT 0,         -- 재사용(주입) 횟수 — 유용한 교훈일수록 큼
  env           text NOT NULL DEFAULT 'dev',
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_used_at  timestamptz
);
CREATE INDEX IF NOT EXISTS idx_loop_lessons_name ON loop_lessons (loop_name);
CREATE INDEX IF NOT EXISTS idx_loop_lessons_tags ON loop_lessons USING gin (tags);
-- 검색(loop_lesson_search): loop_name + tags 교집합으로 관련 교훈 상위 N개를 reuse_count·최근성 순으로.
