#!/usr/bin/env bash
# pre-edit-pii-scan.sh — 파일 편집 직전 PII/시크릿 패턴 차단
# 등록: settings.json > hooks > PreToolUse, matcher: "Edit|Write|MultiEdit"
# 계약: 차단 = exit 2 + stderr(사유), 통과 = exit 0, 파싱 실패/jq 부재 = exit 0 (fail-open)
set -uo pipefail

# stdin JSON 수신: {session_id, cwd, hook_event_name, tool_name, tool_input:{file_path, new_string|content}}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0
command -v jq >/dev/null 2>&1 || exit 0

FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.new_string // .tool_input.content // empty' 2>/dev/null || true)
[ -z "$CONTENT" ] && exit 0

# 주민등록번호 / 휴대전화번호 / OpenAI형 sk-키 / AWS 액세스키 패턴
PII_RE='([0-9]{6}-[0-9]{7})|(01[016789]-[0-9]{3,4}-[0-9]{4})|(sk-[A-Za-z0-9]{20,})|(AKIA[0-9A-Z]{16})'

if printf '%s' "$CONTENT" | grep -E -q "$PII_RE"; then
  echo "[pre-edit-pii-scan] PII/시크릿 패턴 감지 — 편집 차단: ${FILE_PATH:-unknown}" >&2
  echo "  감지 유형: 주민등록번호/휴대전화번호/sk- API키/AWS 액세스키. 민감정보를 마스킹하거나 환경변수로 분리하세요." >&2
  exit 2
fi

exit 0
