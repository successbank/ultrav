-- V7 B1: RBAC
CREATE TABLE IF NOT EXISTS roles (
  name text PRIMARY KEY,        -- admin|curator|reader|agent
  description text
);
INSERT INTO roles(name, description) VALUES
  ('admin','전체 권한'),
  ('curator','쓰기·승인'),
  ('reader','읽기 전용'),
  ('agent','자동 에이전트(쓰기 제한)') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS role_grants (
  id          bigserial PRIMARY KEY,
  subject     text NOT NULL,    -- user_email | persona | service
  role        text NOT NULL REFERENCES roles(name),
  scope       text NOT NULL,    -- env:dev | project:flipbook | global
  granted_by  text,
  granted_at  timestamptz DEFAULT now(),
  expires_at  timestamptz
);

-- MCP 도구 권한 매트릭스
CREATE TABLE IF NOT EXISTS tool_permissions (
  tool        text NOT NULL,
  role        text NOT NULL REFERENCES roles(name),
  allow       boolean NOT NULL DEFAULT false,
  PRIMARY KEY (tool, role)
);
