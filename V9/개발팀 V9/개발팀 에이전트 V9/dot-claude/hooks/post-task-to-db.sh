#!/usr/bin/env bash
# post-task-to-db.sh — 작업 완료 시 공유DB tasks 결과 기록
# [공유DB 인프라 V2 필요] — V7_API/V7_TOKEN 환경변수로 접속. 인프라 부재 시 조용히 exit 0.
# 등록: settings.json > hooks > Stop 또는 SubagentStop — 관측 목적, 절대 차단하지 않음
# 계약: 항상 exit 0 (fail-open)
set -uo pipefail

# ── 인프라 가드: 공유DB 미구성 환경에서는 아무것도 하지 않는다 ──
[ -n "${V7_API:-}" ] || exit 0
[ -n "${V7_TOKEN:-}" ] || exit 0
command -v curl >/dev/null 2>&1 || exit 0
command -v jq >/dev/null 2>&1 || exit 0

# stdin JSON 수신: {session_id, cwd, hook_event_name, ...}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0

PAYLOAD=$(printf '%s' "$INPUT" | jq -c '{
  session_id: (.session_id // "unknown"),
  event: (.hook_event_name // "unknown"),
  cwd: (.cwd // null),
  recorded_at: (now | todate)
}' 2>/dev/null || true)
[ -z "$PAYLOAD" ] && exit 0

curl -fsS --max-time 5 \
  -H "Authorization: Bearer $V7_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" "$V7_API/api/v2/tasks" >/dev/null 2>&1 || true

exit 0
