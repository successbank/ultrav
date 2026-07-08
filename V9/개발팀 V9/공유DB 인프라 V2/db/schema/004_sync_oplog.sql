-- V7 크로스 플랫폼: 동기화 oplog (CRDT 호환)
CREATE TABLE IF NOT EXISTS sync_oplog (
  id            bigserial PRIMARY KEY,
  user_id       uuid NOT NULL,
  entity        text NOT NULL,
  entity_id     uuid NOT NULL,
  op            text NOT NULL CHECK (op IN ('insert','update','delete','crdt_apply')),
  payload       jsonb,
  vector_clock  jsonb,                -- {device_uuid: counter, ...}
  server_ts     timestamptz NOT NULL DEFAULT now(),
  origin_device uuid NOT NULL REFERENCES devices(id),
  env           text NOT NULL DEFAULT 'prod' CHECK (env IN ('dev','staging','prod'))
) PARTITION BY RANGE (server_ts);

CREATE INDEX IF NOT EXISTS idx_oplog_user_ts ON sync_oplog (user_id, server_ts);
CREATE INDEX IF NOT EXISTS idx_oplog_entity ON sync_oplog (entity, entity_id);

-- 월 파티션 1개 생성 예시 (운영 시 자동화)
CREATE TABLE IF NOT EXISTS sync_oplog_2026_06
  PARTITION OF sync_oplog FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
