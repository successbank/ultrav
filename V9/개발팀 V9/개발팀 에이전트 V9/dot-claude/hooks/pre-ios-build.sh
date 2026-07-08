#!/usr/bin/env bash
# pre-ios-build.sh — iOS 빌드 전 게이트 (프로젝트·정적분석·빌드)
# 등록: settings.json > hooks > PreToolUse, matcher: "Bash" — command에서 iOS 빌드 명령을 감지해 동작
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

# iOS 빌드 성격 명령만 검사
printf '%s' "$CMD" | grep -qiE 'xcodebuild|fastlane[[:space:]]+ios|swift[[:space:]]+build|eas[[:space:]]+build.*ios' || exit 0

CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
ROOT="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

# ── 디렉토리 가드: iOS 프로젝트 마커(.xcworkspace/.xcodeproj/Package.swift) 탐색, 없으면 exit 0 ──
IOS_DIR=""
for d in "$ROOT" "$ROOT/apps/ios" "$ROOT/ios"; do
  [ -d "$d" ] || continue
  if ls -d "$d"/*.xcworkspace "$d"/*.xcodeproj "$d"/Package.swift >/dev/null 2>&1; then
    IOS_DIR="$d"; break
  fi
done
[ -z "$IOS_DIR" ] && exit 0

cd "$IOS_DIR" || exit 0

# SwiftFormat / SwiftLint (설치된 경우에만 게이트, 미설치는 안내 후 통과)
if command -v swiftformat >/dev/null 2>&1; then
  if ! swiftformat --lint . >&2; then
    echo "[pre-ios-build] swiftformat 위반 — 빌드 차단. swiftformat . 로 정리 후 재시도." >&2
    exit 2
  fi
else
  echo "[pre-ios-build] swiftformat 미설치 — 도입 권장 (brew install swiftformat)" >&2
fi
if command -v swiftlint >/dev/null 2>&1; then
  if ! swiftlint --strict >&2; then
    echo "[pre-ios-build] swiftlint 위반 — 빌드 차단. 위반 룰을 수정하세요." >&2
    exit 2
  fi
else
  echo "[pre-ios-build] swiftlint 미설치 — 도입 권장 (brew install swiftlint)" >&2
fi

# macOS가 아니면 사전 빌드 검증은 생략 (실 빌드는 macOS 또는 클라우드 CI)
if [ "$(uname)" != "Darwin" ] || ! command -v xcodebuild >/dev/null 2>&1; then
  echo "[pre-ios-build] macOS/xcodebuild 아님 — 정적 검사까지만 수행" >&2
fi

echo "[pre-ios-build] 통과" >&2
exit 0
