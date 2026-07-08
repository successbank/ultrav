#!/usr/bin/env bash
# loop-report-emit.sh — 루프 종료 시 요약 REPORT 생성(stdout JSON) + 공유DB loop_run_record 적재
# ⚠️ onLoopTick/onLoopEnd 이벤트는 Claude Code에 존재하지 않음 — settings.json에 등록해도 조용히 무시된다.
#    Stop 훅(루프 종료 시점) 또는 스킬 내부 절차(스크립트 직접 호출)로만 사용 가능.
# [공유DB 적재는 인프라 V2 필요] — V7_API/V7_TOKEN 미설정 시 stdout REPORT만 출력하고 적재는 건너뜀.
# 계약: 항상 exit 0. stdout = REPORT JSON(Slack 게시/PR 코멘트에 그대로 사용).
set -uo pipefail

# stdin JSON 수신(훅으로 연결된 경우 대비 — session_id를 REPORT에 포함)
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
SESSION_ID=""
if [ -n "$INPUT" ] && command -v jq >/dev/null 2>&1; then
  SESSION_ID=$(printf '%s' "$INPUT" | jq -r '.session_id // empty' 2>/dev/null || true)
fi

LOOP_NAME="${LOOP_NAME:-unnamed-loop}"
TRIGGER="${LOOP_TRIGGER:-manual}"
SCOPE="${LOOP_SCOPE:-unknown}"
ITER="${LOOP_ITER:-0}"
TOKENS_USED="${LOOP_TOKENS_USED:-0}"
COST_USD="${LOOP_COST_USD:-0}"
STOP_REASON="${LOOP_STOP_REASON:-unknown}"
OUTCOME="${LOOP_OUTCOME:-unknown}"      # success|partial|failed
ENV="${LOOP_ENV:-dev}"
ACTION_SUMMARY="${LOOP_ACTION_SUMMARY:-}"

# 숫자 필드 방어 (JSON 깨짐 방지)
case "$ITER" in (''|*[!0-9]*) ITER=0 ;; esac
case "$TOKENS_USED" in (''|*[!0-9]*) TOKENS_USED=0 ;; esac
case "$COST_USD" in (''|*[!0-9.]*) COST_USD=0 ;; esac

# 1) REPORT를 stdout JSON으로
REPORT=$(cat <<JSON
{
  "loop_name": "$LOOP_NAME",
  "session_id": "${SESSION_ID:-}",
  "trigger": "$TRIGGER",
  "scope": "$SCOPE",
  "iterations": $ITER,
  "tokens_used": $TOKENS_USED,
  "cost_usd": $COST_USD,
  "stop_reason": "$STOP_REASON",
  "outcome": "$OUTCOME",
  "env": "$ENV",
  "action_summary": "$ACTION_SUMMARY"
}
JSON
)
printf '%s\n' "$REPORT"

# 2) 공유DB 적재 — [공유DB 인프라 V2 필요] 인프라 부재 시 조용히 건너뜀 (보고 자체는 위 stdout으로 완료)
if [ -n "${V7_API:-}" ] && [ -n "${V7_TOKEN:-}" ] && command -v curl >/dev/null 2>&1; then
  curl -fsS --max-time 5 \
    -H "Authorization: Bearer $V7_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$REPORT" "$V7_API/api/v2/loop_runs" >/dev/null 2>&1 || true
fi

exit 0
