#!/usr/bin/env bash
# post-edit-format.sh — PostToolUse(Edit|MultiEdit|Write) 훅
# src/ 하위 TS/JS 파일 편집 후 prettier 자동 포맷. 항상 exit 0 (non-blocking).

INPUT="$(cat 2>/dev/null)" || exit 0
[ -z "$INPUT" ] && exit 0

command -v jq >/dev/null 2>&1 || exit 0

FILE_PATH="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)" || exit 0
[ -z "$FILE_PATH" ] && exit 0

SRC_DIR="/data/successbank/projects/ultra/src"

# src/ 하위 파일만 대상
case "$FILE_PATH" in
  "$SRC_DIR"/*) ;;
  *) exit 0 ;;
esac

# .ts/.tsx/.js/.jsx 만 대상
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' 2>/dev/null | grep -qx 'ultra_app'; then
  # 컨테이너 우선: 호스트 경로 → 컨테이너 경로(/app) 변환
  REL_PATH="${FILE_PATH#"$SRC_DIR"/}"
  if ! docker exec ultra_app npx --no-install prettier --write "/app/$REL_PATH" >/dev/null 2>&1; then
    echo "[post-edit-format] 경고: ultra_app 컨테이너에서 prettier 실행 실패 (미설치 가능성 — src/package.json devDependencies 확인 후 컨테이너에서 npm install --legacy-peer-deps)" >&2
  fi
elif command -v npx >/dev/null 2>&1 && [ -d "$SRC_DIR/node_modules" ]; then
  if ! (cd "$SRC_DIR" && npx --no-install prettier --write "$FILE_PATH") >/dev/null 2>&1; then
    echo "[post-edit-format] 경고: 호스트에서 prettier 실행 실패 (prettier 미설치 가능성)" >&2
  fi
fi

exit 0
