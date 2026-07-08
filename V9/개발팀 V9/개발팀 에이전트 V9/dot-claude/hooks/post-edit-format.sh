#!/usr/bin/env bash
# post-edit-format.sh — 편집 후 자동 포매팅
# 등록: settings.json > hooks > PostToolUse, matcher: "Edit|Write|MultiEdit"
# 계약: 항상 exit 0 — 포매터 부재/실패 시 조용히 통과(fail-open). 편집 결과를 훼손하지 않는다.
set -uo pipefail

# stdin JSON 수신: {..., tool_input:{file_path}}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0
command -v jq >/dev/null 2>&1 || exit 0

FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
[ -z "$FILE" ] && exit 0
[ -f "$FILE" ] || exit 0

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md)
    if command -v npx >/dev/null 2>&1; then
      npx --no-install prettier --write "$FILE" >/dev/null 2>&1 || true
    fi ;;
  *.swift)
    if command -v swiftformat >/dev/null 2>&1; then
      swiftformat "$FILE" >/dev/null 2>&1 || true
    fi ;;
  *.kt|*.kts)
    if command -v ktlint >/dev/null 2>&1; then
      ktlint -F "$FILE" >/dev/null 2>&1 || true
    fi ;;
  *.rs)
    if command -v rustfmt >/dev/null 2>&1; then
      rustfmt "$FILE" >/dev/null 2>&1 || true
    fi ;;
esac

exit 0
