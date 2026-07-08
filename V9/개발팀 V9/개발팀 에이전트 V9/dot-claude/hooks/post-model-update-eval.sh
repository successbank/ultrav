#!/usr/bin/env bash
# post-model-update-eval.sh — 모델 업그레이드 후 자동 회귀 비교
# [공유DB 인프라 V2 필요] — 골든 케이스 러너(scripts/eval-runner.js)가 있는 환경에서만 동작.
#   러너/노드 부재 시 조용히 exit 0 (fail-open).
# 등록: settings.json > hooks > PostToolUse, matcher: "Edit|Write" — 모델 설정 파일 변경 감지 시 회귀 비교
#   (onModelUpdate 같은 전용 이벤트는 Claude Code에 존재하지 않음)
# 계약: 항상 exit 0 — 관측/보고 목적, 차단하지 않음. 회귀 발견 시 stderr 경고만 남긴다.
set -uo pipefail

# stdin JSON 수신: {..., cwd, tool_input:{file_path, new_string|content}}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0
command -v jq >/dev/null 2>&1 || exit 0

FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.new_string // .tool_input.content // empty' 2>/dev/null || true)

# 모델 관련 변경만 대상 (파일명 또는 내용에 모델 식별자가 있을 때)
if ! printf '%s\n%s' "$FILE_PATH" "$CONTENT" | grep -qiE 'model|claude-|gpt-|anthropic'; then
  exit 0
fi

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
ROOT="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

# ── 인프라 가드: eval 러너 부재 시 조용히 종료 ──
[ -f "$ROOT/scripts/eval-runner.js" ] || exit 0
command -v node >/dev/null 2>&1 || exit 0

echo "[post-model-update-eval] 모델 관련 변경 감지 — 골든 케이스 회귀 비교 실행" >&2
(cd "$ROOT" && node scripts/eval-runner.js --against-baseline --threshold=0.95 --report=eval-reports/) \
  || echo "[post-model-update-eval] WARN: 회귀 비교에서 기준 미달 — eval-reports/ 확인 필요" >&2

exit 0
