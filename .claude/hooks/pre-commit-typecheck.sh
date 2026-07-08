#!/usr/bin/env bash
# pre-commit-typecheck.sh — PreToolUse(Bash) 훅
# 'git commit' 실행 직전 TypeScript 타입체크. 실패 시 커밋 차단(exit 2).
# 실행 환경(컨테이너/호스트 node_modules) 모두 불가하면 fail-open(exit 0).

INPUT="$(cat 2>/dev/null)" || exit 0
[ -z "$INPUT" ] && exit 0

command -v jq >/dev/null 2>&1 || exit 0

CMD="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)" || exit 0

# git commit 이 포함된 커맨드만 검사
case "$CMD" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

SRC_DIR="/data/successbank/projects/ultra/src"
TSC_OUTPUT=""
STATUS=0

if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' 2>/dev/null | grep -qx 'ultra_app'; then
  # 1순위: ultra_app 컨테이너에서 타입체크
  TSC_OUTPUT="$(docker exec ultra_app npx tsc --noEmit 2>&1)"
  STATUS=$?
elif command -v npx >/dev/null 2>&1 && [ -d "$SRC_DIR/node_modules" ]; then
  # 2순위: 호스트 node_modules로 타입체크
  TSC_OUTPUT="$(cd "$SRC_DIR" && npx tsc --noEmit 2>&1)"
  STATUS=$?
else
  # 실행 수단 없음 — fail-open
  exit 0
fi

if [ "$STATUS" -ne 0 ]; then
  {
    echo "[pre-commit-typecheck] 차단: TypeScript 타입 에러가 있어 커밋할 수 없습니다."
    echo "--- tsc --noEmit 에러 요약 (앞 30줄) ---"
    printf '%s\n' "$TSC_OUTPUT" | head -30
    echo "----------------------------------------"
    echo "타입 에러를 수정한 뒤 다시 커밋하세요."
  } >&2
  exit 2
fi

exit 0
