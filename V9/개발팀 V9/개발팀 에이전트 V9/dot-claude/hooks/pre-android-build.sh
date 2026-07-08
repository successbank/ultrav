#!/usr/bin/env bash
# pre-android-build.sh — 안드로이드 빌드 전 게이트 (wrapper·정적분석·lint)
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 Gradle 빌드 명령을 감지해 동작
# 계약: 차단 = exit 2 + stderr(사유), 통과 = exit 0
# 가드: 안드로이드 프로젝트 디렉토리(gradlew, apps/android 등) 부재 시 조용히 exit 0 (이 저장소는 안드로이드 대상 아님)
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

# 안드로이드 빌드 성격 명령만 검사 (릴리스 명령은 pre-android-release.sh 담당)
printf '%s' "$CMD" | grep -qiE 'gradlew|gradle[[:space:]]+(assemble|build|bundle)' || exit 0
printf '%s' "$CMD" | grep -qiE 'bundlerelease|assemblerelease' && exit 0

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
ROOT="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

# ── 디렉토리 가드: gradlew 탐색, 없으면 exit 0 ──
AND_DIR=""
for d in "$ROOT" "$ROOT/apps/android" "$ROOT/android"; do
  if [ -f "$d/gradlew" ]; then AND_DIR="$d"; break; fi
done
[ -z "$AND_DIR" ] && exit 0

cd "$AND_DIR" || exit 0
chmod +x ./gradlew 2>/dev/null || true

# ktlint / detekt (태스크가 정의된 경우에만 게이트, 없으면 안내 후 통과)
TASKS=$(./gradlew tasks --all 2>/dev/null || true)
if printf '%s' "$TASKS" | grep -q 'ktlintCheck'; then
  if ! ./gradlew ktlintCheck >&2; then
    echo "[pre-android-build] ktlint 위반 — 빌드 차단" >&2
    exit 2
  fi
else
  echo "[pre-android-build] ktlintCheck 태스크 없음 — ktlint 플러그인 도입 권장" >&2
fi
if printf '%s' "$TASKS" | grep -q 'detekt'; then
  if ! ./gradlew detekt >&2; then
    echo "[pre-android-build] detekt 위반 — 빌드 차단" >&2
    exit 2
  fi
else
  echo "[pre-android-build] detekt 태스크 없음 — detekt 도입 권장" >&2
fi

# Android Lint 게이트
if ! ./gradlew lintDebug >&2; then
  echo "[pre-android-build] lintDebug 실패 — 빌드 차단" >&2
  exit 2
fi

echo "[pre-android-build] 통과" >&2
exit 0
