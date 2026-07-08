-- V7 크로스 플랫폼: 디바이스 등록·페어링
CREATE TABLE IF NOT EXISTS devices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,
  platform      text NOT NULL CHECK (platform IN
    ('web','ios','android','macos','windows','watchos','wearos',
     'visionos','android-xr','quest','glasses-pair')),
  device_name   text,
  last_seen     timestamptz DEFAULT now(),
  push_token    text,
  public_key    text,                 -- E2E 페어링용
  parent_device uuid REFERENCES devices(id),  -- 페어 디바이스 체이닝
  status        text DEFAULT 'active' CHECK (status IN ('active','revoked','lost')),
  created_at    timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
