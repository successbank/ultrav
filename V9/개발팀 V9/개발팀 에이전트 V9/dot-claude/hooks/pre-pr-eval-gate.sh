#!/usr/bin/env bash
# pre-pr-eval-gate.sh — PR 생성 직전 품질 게이트 (lint + typecheck)
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 `gh pr create`/`git push`를 감지해 동작
#       (prePR 같은 전용 이벤트는 Claude Code에 존재하지 않음)
# 참고: 기존 scripts/eval-runner.js(존재하지 않는 골든 케이스 러너) 호출을
#       npm run lint + npx tsc --noEmit 로 교체함.
# 계약: 차단 = exit 2 + stderr(사유), 통과 = exit 0, 인프라 부재(package.json 없음 등) = exit 0 (fail-open)
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

# PR 생성/푸시 명령만 검사
printf '%s' "$CMD" | grep -qE 'gh[[:space:]]+pr[[:space:]]+create|git[[:space:]]+push' || exit 0

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
ROOT="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

# package.json 탐색 (프로젝트 루트 → src/)
PKGDIR=""
for d in "$ROOT" "$ROOT/src"; do
  if [ -f "$d/package.json" ]; then PKGDIR="$d"; break; fi
done
[ -z "$PKGDIR" ] && exit 0           # 인프라 부재 → fail-open
command -v npx >/dev/null 2>&1 || exit 0

echo "[pre-pr-eval-gate] PR 게이트 실행: lint + tsc --noEmit ($PKGDIR)" >&2

# 1) npm run lint (lint 스크립트가 정의된 경우에만)
if jq -e '.scripts.lint // empty' "$PKGDIR/package.json" >/dev/null 2>&1; then
  LINT_OUT=$(cd "$PKGDIR" && npm run lint 2>&1)
  if [ $? -ne 0 ]; then
    echo "[pre-pr-eval-gate] lint 실패 — PR 차단. 위반 사항을 수정하세요." >&2
    printf '%s\n' "$LINT_OUT" | tail -40 >&2
    exit 2
  fi
fi

# 2) npx tsc --noEmit (tsconfig.json 있는 경우에만)
if [ -f "$PKGDIR/tsconfig.json" ]; then
  TSC_OUT=$(cd "$PKGDIR" && npx --no-install tsc --noEmit 2>&1)
  TSC_RC=$?
  if [ $TSC_RC -ne 0 ] && printf '%s' "$TSC_OUT" | grep -qi 'not found\|could not determine executable'; then
    exit 0                            # tsc 미설치 → fail-open
  fi
  if [ $TSC_RC -ne 0 ]; then
    echo "[pre-pr-eval-gate] 타입 오류 — PR 차단. 오류를 수정하세요." >&2
    printf '%s\n' "$TSC_OUT" | head -40 >&2
    exit 2
  fi
fi

echo "[pre-pr-eval-gate] 통과 (lint·typecheck OK)" >&2
exit 0
