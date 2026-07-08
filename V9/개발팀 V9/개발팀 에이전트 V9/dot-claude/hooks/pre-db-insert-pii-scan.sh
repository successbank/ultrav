#!/usr/bin/env bash
# pre-db-insert-pii-scan.sh — DB 적재(INSERT/psql/prisma) 명령 직전 PII 검사
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 DB 쓰기 명령을 감지해 검사
# 계약: 차단 = exit 2 + stderr(사유), 통과 = exit 0, 파싱 실패/jq 부재 = exit 0 (fail-open)
set -uo pipefail

# stdin JSON 수신: {..., tool_name:"Bash", tool_input:{command}}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0
command -v jq >/dev/null 2>&1 || exit 0

CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || true)
[ -z "$CMD" ] && exit 0

# DB 쓰기 성격 명령만 검사 (그 외 Bash 명령은 통과)
if ! printf '%s' "$CMD" | grep -qiE 'insert[[:space:]]+into|copy[[:space:]].+[[:space:]]from|psql|prisma[[:space:]]+db[[:space:]]+execute'; then
  exit 0
fi

# 주민등록번호 / 휴대전화번호 / sk- API키 패턴
PII_RE='([0-9]{6}-[0-9]{7})|(01[016789]-[0-9]{3,4}-[0-9]{4})|(sk-[A-Za-z0-9]{20,})'

if printf '%s' "$CMD" | grep -E -q "$PII_RE"; then
  echo "[pre-db-insert-pii-scan] DB 적재 명령에서 PII/시크릿 패턴 감지 — 실행 차단" >&2
  echo "  주민등록번호/휴대전화/API키로 보이는 값이 포함되어 있습니다. 마스킹 또는 해시 처리 후 적재하세요." >&2
  exit 2
fi

exit 0
