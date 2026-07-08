-- 009_loop_runs.sql — V9 루프 엔지니어링: 루프 실행 기록(반복·토큰·비용·정지사유·결과)
CREATE TABLE IF NOT EXISTS loop_runs (
  id              bigserial PRIMARY KEY,
  loop_name       text NOT NULL,                 -- pr-green-loop|coverage-raise-loop|...
  trigger         text NOT NULL,                 -- ci.failed|schedule|errors.new|manual
  scope           text NOT NULL,                 -- repo:flipbook|paths:src/payments|env:dev
  action_summary  text,                          -- 이 루프에서 수행한 행동 요약
  iterations      int  NOT NULL DEFAULT 0,       -- 총 tick(반복) 수
  tokens_used     int  NOT NULL DEFAULT 0,       -- 누적 토큰
  cost_usd        numeric(10,4) NOT NULL DEFAULT 0,  -- 누적 비용(USD)
  stop_reason     text,                          -- all_ci_green|iterations>=N|cost_usd>=N|elapsed|human_abort
  outcome         text,                          -- success|partial|failed
  env             text NOT NULL DEFAULT 'dev',
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_loop_runs_name_ts ON loop_runs (loop_name, created_at);
CREATE INDEX IF NOT EXISTS idx_loop_runs_outcome ON loop_runs (outcome);
