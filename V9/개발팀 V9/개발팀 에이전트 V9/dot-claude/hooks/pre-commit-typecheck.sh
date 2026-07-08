#!/usr/bin/env bash
# pre-commit-typecheck.sh — git commit 직전 스테이징된 TS 파일 타입체크 게이트
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 `git commit`을 감지해 동작
#       (preCommit 같은 전용 이벤트는 Claude Code에 존재하지 않음)
# 계약: 차단 = exit 2 + stderr(사유), 통과 = exit 0, 인프라 부재(tsc/tsconfig 없음) = exit 0 (fail-open)
set -uo pipefail

# stdin JSON 수신: {..., cwd, tool_name:"Bash", tool_input:{command}}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0
command -v jq >/dev/null 2>&1 || exit 0

CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || true)
[ -z "$CMD" ] && exit 0

# git commit 명령만 검사 (그 외 Bash 명령은 통과)
printf '%s' "$CMD" | grep -qE '(^|[;&|[:space:]])git([[:space:]]+-[^[:space:]]+)*[[:space:]]+commit([[:space:]]|$)' || exit 0

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
ROOT="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

command -v git >/dev/null 2>&1 || exit 0
CHANGED=$(git -C "$ROOT" diff --cached --name-only 2>/dev/null | grep -E '\.(ts|tsx)$' || true)
[ -z "$CHANGED" ] && exit 0

# tsconfig.json 탐색 (프로젝트 루트 → src/)
TSDIR=""
for d in "$ROOT" "$ROOT/src"; do
  if [ -f "$d/tsconfig.json" ]; then TSDIR="$d"; break; fi
done
[ -z "$TSDIR" ] && exit 0            # 인프라 부재 → fail-open
command -v npx >/dev/null 2>&1 || exit 0

echo "[pre-commit-typecheck] 스테이징된 TS 파일 감지 — tsc --noEmit 실행 ($TSDIR)" >&2
TSC_OUT=$(cd "$TSDIR" && npx --no-install tsc --noEmit 2>&1)
TSC_RC=$?

# tsc 자체가 설치되지 않은 경우(npx --no-install 실패) → fail-open
if [ $TSC_RC -ne 0 ] && printf '%s' "$TSC_OUT" | grep -qi 'not found\|could not determine executable'; then
  exit 0
fi

if [ $TSC_RC -ne 0 ]; then
  echo "[pre-commit-typecheck] 타입 오류 — 커밋 차단. 오류를 수정한 뒤 다시 커밋하세요." >&2
  printf '%s\n' "$TSC_OUT" | head -40 >&2
  exit 2
fi

exit 0
