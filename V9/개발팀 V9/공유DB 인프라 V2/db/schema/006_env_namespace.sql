-- V7 B3: 환경 네임스페이스 + RLS
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS env text NOT NULL DEFAULT 'prod';
ALTER TABLE errors    ADD COLUMN IF NOT EXISTS env text NOT NULL DEFAULT 'prod';
ALTER TABLE tasks     ADD COLUMN IF NOT EXISTS env text NOT NULL DEFAULT 'prod';

ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE errors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks     ENABLE ROW LEVEL SECURITY;

-- 현재 세션의 env 변수와 일치하는 행만 노출
CREATE POLICY IF NOT EXISTS env_isolation_knowledge ON knowledge
  USING (env = current_setting('app.env', true));
CREATE POLICY IF NOT EXISTS env_isolation_errors ON errors
  USING (env = current_setting('app.env', true));
CREATE POLICY IF NOT EXISTS env_isolation_tasks ON tasks
  USING (env = current_setting('app.env', true));
