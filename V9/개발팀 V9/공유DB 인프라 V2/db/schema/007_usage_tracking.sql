-- V7 A2 + FinOps: 모델·작업 단위 사용량
CREATE TABLE IF NOT EXISTS usage_tracking (
  id          bigserial PRIMARY KEY,
  ts          timestamptz NOT NULL DEFAULT now(),
  project     text NOT NULL,
  persona     text NOT NULL,
  task_type   text NOT NULL,            -- prd|feature|bugfix|...
  tool        text NOT NULL,            -- claude-code|codex|api
  model       text NOT NULL,            -- haiku-4-5|sonnet-4-6|opus-4-6|gpt-5|...
  in_tokens   bigint NOT NULL,
  out_tokens  bigint NOT NULL,
  cost_usd    numeric(10,4) NOT NULL,
  env         text NOT NULL DEFAULT 'prod'
);
CREATE INDEX IF NOT EXISTS idx_usage_project_ts ON usage_tracking (project, ts);
CREATE INDEX IF NOT EXISTS idx_usage_persona ON usage_tracking (persona);

-- 일별 집계 뷰
CREATE OR REPLACE VIEW usage_daily AS
SELECT date_trunc('day', ts) AS day,
       project, persona, model,
       sum(in_tokens) AS in_tok, sum(out_tokens) AS out_tok,
       sum(cost_usd)  AS cost
FROM usage_tracking
GROUP BY 1,2,3,4;
