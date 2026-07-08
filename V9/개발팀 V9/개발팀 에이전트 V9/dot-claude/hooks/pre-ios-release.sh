#!/usr/bin/env bash
# pre-ios-release.sh — App Store 릴리스 전 게이트 (서명·정책 체크리스트)
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 릴리스 명령을 감지해 동작
# 계약: 차단 = exit 2 + stderr(사유), 통과 = exit 0
# 가드: iOS 프로젝트 디렉토리(apps/ios 등) 부재 시 조용히 exit 0 (이 저장소는 iOS 대상 아님)
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

# App Store 릴리스 성격 명령만 검사
printf '%s' "$CMD" | grep -qiE 'fastlane[[:space:]]+(ios[[:space:]]+)?(release|deliver|pilot)|xcodebuild.*archive|altool|xcrun[[:space:]]+notarytool|eas[[:space:]]+submit' || exit 0

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
ROOT="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

# ── 디렉토리 가드: iOS 프로젝트 마커 탐색, 없으면 exit 0 ──
IOS_DIR=""
for d in "$ROOT" "$ROOT/apps/ios" "$ROOT/ios"; do
  [ -d "$d" ] || continue
  if ls -d "$d"/*.xcworkspace "$d"/*.xcodeproj "$d"/Package.swift >/dev/null 2>&1; then
    IOS_DIR="$d"; break
  fi
done
[ -z "$IOS_DIR" ] && exit 0

cd "$IOS_DIR" || exit 0

# 1) 서명/계정 환경변수 확인 (App Store Connect API 키 등) — 누락 시 릴리스 차단
for v in APPLE_TEAM_ID IOS_BUNDLE_ID ASC_KEY_ID ASC_ISSUER_ID; do
  if [ -z "${!v:-}" ]; then
    echo "[pre-ios-release] App Store 환경변수 누락: $v (서명/App Store Connect API) — 릴리스 차단" >&2
    exit 2
  fi
done

# 2) Info.plist 정책 점검 (민감 권한 용도 문자열 필수)
PLIST=$(find . -name 'Info.plist' -not -path '*/Pods/*' -not -path '*/build/*' 2>/dev/null | head -1 || true)
if [ -n "${PLIST:-}" ]; then
  for key in NSCameraUsageDescription NSLocationWhenInUseUsageDescription NSMicrophoneUsageDescription NSUserTrackingUsageDescription; do
    if grep -q "$key" "$PLIST" 2>/dev/null; then
      VAL=$(grep -A1 "$key" "$PLIST" | tail -1 | tr -d ' \t' || true)
      if [ -z "$VAL" ] || printf '%s' "$VAL" | grep -q '<string></string>'; then
        echo "[pre-ios-release] $key 용도 문자열 비어있음 — App Store 거절 사유, 릴리스 차단" >&2
        exit 2
      fi
    fi
  done
fi

# 3) 개인정보처리방침(App Privacy) 링크 확인
if ! grep -rqiE 'privacy.?policy|개인정보처리방침|https?://[^ ]+privacy' release/ fastlane/ 2>/dev/null; then
  echo "[pre-ios-release] 개인정보처리방침/App Privacy 링크 미확인 — App Store Connect 노출 필요, 릴리스 차단" >&2
  exit 2
fi

echo "[pre-ios-release] 통과 (서명 env·정책 OK)" >&2
exit 0
