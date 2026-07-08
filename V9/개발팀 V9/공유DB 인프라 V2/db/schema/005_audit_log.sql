-- V7 B2: 감사 로그
CREATE TABLE IF NOT EXISTS audit_log (
  id          bigserial PRIMARY KEY,
  actor       text NOT NULL,                 -- 페르소나 또는 사용자
  action      text NOT NULL,                 -- insert|update|delete|route|access|deny
  target      text NOT NULL,                 -- entity:id 또는 endpoint
  reason      text,
  diff        jsonb,
  retention   text NOT NULL DEFAULT '90d' CHECK (retention IN ('7d','90d','365d')),
  env         text NOT NULL DEFAULT 'prod',
  ts          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor_ts ON audit_log (actor, ts);
CREATE INDEX IF NOT EXISTS idx_audit_target ON audit_log (target);

-- 보존 정책 정리 잡 (cron으로 일 1회)
-- DELETE FROM audit_log WHERE ts < now() - INTERVAL '7 days'  AND retention='7d';
-- DELETE FROM audit_log WHERE ts < now() - INTERVAL '90 days' AND retention='90d';
-- DELETE FROM audit_log WHERE ts < now() - INTERVAL '1 year'  AND retention='365d';

-- 트리거 예시 (knowledge에 자동 audit)
CREATE OR REPLACE FUNCTION audit_knowledge_changes()
RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_log(actor, action, target, diff, env)
  VALUES (
    coalesce(current_setting('app.actor', true), 'unknown'),
    TG_OP,
    'knowledge:' || COALESCE(NEW.id::text, OLD.id::text),
    to_jsonb(NEW) - to_jsonb(OLD),
    coalesce(current_setting('app.env', true), 'prod')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_knowledge ON knowledge;
CREATE TRIGGER trg_audit_knowledge
AFTER INSERT OR UPDATE OR DELETE ON knowledge
FOR EACH ROW EXECUTE FUNCTION audit_knowledge_changes();
