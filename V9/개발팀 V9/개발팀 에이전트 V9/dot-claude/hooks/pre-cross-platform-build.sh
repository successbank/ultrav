#!/usr/bin/env bash
# pre-cross-platform-build.sh — 플랫폼 빌드 전 영향 매트릭스 산정 (정보성 — 차단하지 않음)
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 빌드 명령을 감지해 동작
# 계약: 항상 exit 0 — stderr로 빌드 대상 플랫폼 목록만 안내
# 가드: 멀티플랫폼 모노레포 구조(apps/ 디렉토리) 부재 시 조용히 exit 0 (이 저장소는 대상 아님)
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

# 빌드 성격 명령만 검사
printf '%s' "$CMD" | grep -qiE '(npm|pnpm|yarn)[[:space:]]+(run[[:space:]]+)?build|turbo[[:space:]]+(run[[:space:]]+)?build|gradlew|xcodebuild|eas[[:space:]]+build' || exit 0

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
ROOT="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

# ── 디렉토리 가드: apps/ 모노레포 구조가 아니면 관여하지 않음 ──
[ -d "$ROOT/apps" ] || exit 0
command -v git >/dev/null 2>&1 || exit 0

# 변경 파일 산정: origin/main 기준, 없으면 HEAD 작업트리 기준으로 폴백
CHANGED=$(git -C "$ROOT" diff --name-only origin/main...HEAD 2>/dev/null || true)
[ -z "$CHANGED" ] && CHANGED=$(git -C "$ROOT" diff --name-only HEAD 2>/dev/null || true)
[ -z "$CHANGED" ] && { echo "[pre-cross-platform-build] 변경 없음" >&2; exit 0; }

PLATFORMS=""
printf '%s\n' "$CHANGED" | grep -q '^apps/mobile/'  && PLATFORMS+=" mobile"
printf '%s\n' "$CHANGED" | grep -q '^apps/web/'     && PLATFORMS+=" web"
printf '%s\n' "$CHANGED" | grep -q '^apps/desktop/' && PLATFORMS+=" desktop"
printf '%s\n' "$CHANGED" | grep -q '^apps/watch-'   && PLATFORMS+=" wear"
printf '%s\n' "$CHANGED" | grep -q '^apps/xr-'      && PLATFORMS+=" xr"
printf '%s\n' "$CHANGED" | grep -q '^packages/'     && PLATFORMS+=" (shared-packages→전체 재빌드 검토)"

echo "[pre-cross-platform-build] 빌드 대상 플랫폼:${PLATFORMS:- none}" >&2
exit 0
