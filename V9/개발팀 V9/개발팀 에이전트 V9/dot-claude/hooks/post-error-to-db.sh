#!/usr/bin/env bash
# post-error-to-db.sh — 에러 발생 시 공유DB errors 적재
# [공유DB 인프라 V2 필요] — V7_API/V7_TOKEN 환경변수로 접속. 인프라 부재 시 조용히 exit 0.
# 등록: settings.json > hooks > PostToolUse, matcher: "Bash" (또는 Stop) — 관측 목적, 절대 차단하지 않음
# 계약: 항상 exit 0 (fail-open)
set -uo pipefail

# ── 인프라 가드: 공유DB 미구성 환경에서는 아무것도 하지 않는다 ──
[ -n "${V7_API:-}" ] || exit 0
[ -n "${V7_TOKEN:-}" ] || exit 0
command -v curl >/dev/null 2>&1 || exit 0
command -v jq >/dev/null 2>&1 || exit 0

# stdin JSON 수신: {session_id, cwd, hook_event_name, tool_name, tool_input, tool_response?}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0

# 훅 페이로드에서 에러 레코드 구성 (파싱 실패 시 조용히 종료)
PAYLOAD=$(printf '%s' "$INPUT" | jq -c '{
  session_id: (.session_id // "unknown"),
  event: (.hook_event_name // "unknown"),
  tool: (.tool_name // "unknown"),
  command: (.tool_input.command // null),
  file_path: (.tool_input.file_path // null),
  stderr: (.tool_response.stderr // null),
  recorded_at: (now | todate)
}' 2>/dev/null || true)
[ -z "$PAYLOAD" ] && exit 0

curl -fsS --max-time 5 \
  -H "Authorization: Bearer $V7_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" "$V7_API/api/v2/errors" >/dev/null 2>&1 || true

exit 0
