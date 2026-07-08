#!/usr/bin/env bash
# pre-android-release.sh — Play 릴리스 전 게이트 (서명·정책 체크리스트)
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 릴리스 빌드 명령을 감지해 동작
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

# Play 릴리스 성격 명령만 검사
printf '%s' "$CMD" | grep -qiE 'bundlerelease|assemblerelease|fastlane[[:space:]]+(android[[:space:]]+)?(release|supply|deploy)|eas[[:space:]]+submit' || exit 0

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

# 1) 서명 설정 확인 (keystore 환경변수) — 누락 시 릴리스 차단
for v in ANDROID_KEYSTORE_PATH ANDROID_KEYSTORE_PASSWORD ANDROID_KEY_ALIAS ANDROID_KEY_PASSWORD; do
  if [ -z "${!v:-}" ]; then
    echo "[pre-android-release] 서명 환경변수 누락: $v (Play App Signing 업로드 키) — 릴리스 차단" >&2
    exit 2
  fi
done

# 2) Play 정책 체크리스트 (위반 시 차단)
MANIFEST="app/src/main/AndroidManifest.xml"
GRADLE="app/build.gradle.kts"
[ -f "$GRADLE" ] || GRADLE="app/build.gradle"

# 2-1) 타겟 SDK 최신 정책 충족 (>= 35)
TARGET=$(grep -oE 'targetSdk[ =]+[0-9]+' "$GRADLE" 2>/dev/null | grep -oE '[0-9]+' | head -1 || true)
case "$TARGET" in (''|*[!0-9]*) TARGET=0 ;; esac
if [ "$TARGET" -lt 35 ]; then
  echo "[pre-android-release] targetSdk=$TARGET — Play 정책 최소 미달(>=35 필요), 릴리스 차단" >&2
  exit 2
fi

# 2-2) 권한 최소화 — 위험 권한 감지 시 차단
if [ -f "$MANIFEST" ]; then
  if grep -qE 'android.permission.(READ_SMS|RECEIVE_SMS|QUERY_ALL_PACKAGES|MANAGE_EXTERNAL_STORAGE)' "$MANIFEST"; then
    echo "[pre-android-release] 고위험 권한 감지 — Play 선언 양식·정당성 필요(권한 최소화 위반 가능), 릴리스 차단" >&2
    exit 2
  fi
fi

# 2-3) 개인정보처리방침 링크 확인 (릴리스 노트/설정 파일)
if ! grep -rqiE 'privacy.?policy|개인정보처리방침|https?://[^ ]+privacy' release/ 2>/dev/null; then
  echo "[pre-android-release] 개인정보처리방침 링크 미확인 — Play 콘솔·앱 내 노출 필요, 릴리스 차단" >&2
  exit 2
fi

echo "[pre-android-release] 통과 (서명·정책 OK)" >&2
exit 0
