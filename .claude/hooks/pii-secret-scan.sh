#!/usr/bin/env bash
# pii-secret-scan.sh — PreToolUse(Edit|MultiEdit|Write) 훅
# 파일에 기록될 내용에서 PII/시크릿 패턴을 검출하면 차단(exit 2).
# jq 부재/파싱 실패 시 fail-open(exit 0).

# stdin에서 훅 JSON 수신
INPUT="$(cat 2>/dev/null)" || exit 0
[ -z "$INPUT" ] && exit 0

# jq 없으면 통과 (fail-open)
command -v jq >/dev/null 2>&1 || exit 0

FILE_PATH="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)" || exit 0
CONTENT="$(printf '%s' "$INPUT" | jq -r '.tool_input.new_string // .tool_input.content // empty' 2>/dev/null)" || exit 0
[ -z "$CONTENT" ] && exit 0

# .env 파일 자체는 검사 제외 (환경설정 파일은 원래 시크릿을 담음)
BASENAME="${FILE_PATH##*/}"
case "$BASENAME" in
  .env|.env.*) exit 0 ;;
esac

# *.md 문서는 예시 라인(placeholder/example/<...> 포함) 오탐 제외
SCAN_CONTENT="$CONTENT"
case "$FILE_PATH" in
  *.md|*.MD)
    SCAN_CONTENT="$(printf '%s\n' "$CONTENT" | grep -viE 'placeholder|example|<[^>]*>' 2>/dev/null || true)"
    ;;
esac
[ -z "$SCAN_CONTENT" ] && exit 0

FOUND=""

check_pattern() {
  # $1: 패턴 이름, $2: ERE 정규식
  local hits
  hits="$(printf '%s\n' "$SCAN_CONTENT" | grep -nE "$2" 2>/dev/null | cut -d: -f1 | head -5 | tr '\n' ',' | sed 's/,$//')" || true
  if [ -n "$hits" ]; then
    FOUND="${FOUND}  - ${1} (라인: ${hits})
"
  fi
}

# 한국 주민등록번호: 6자리-[1-4]+6자리
check_pattern "주민등록번호" '(^|[^0-9])[0-9]{6}-[1-4][0-9]{6}($|[^0-9])'
# Google API 키: AIza + 35자
check_pattern "Google API 키(AIza...)" '(^|[^A-Za-z0-9])AIza[0-9A-Za-z_-]{35}'
# sk- 로 시작하는 20자 이상 시크릿 키 (OpenAI/Anthropic/Stripe 등)
check_pattern "시크릿 키(sk-...)" '(^|[^A-Za-z0-9])sk-[A-Za-z0-9_-]{20,}'
# PostgreSQL 접속 문자열 (아이디:비밀번호@ 포함)
check_pattern "PostgreSQL 접속문자열(비밀번호 포함)" 'postgresql://[^:/@[:space:]]+:[^@[:space:]]+@'
# AWS Access Key ID
check_pattern "AWS Access Key(AKIA...)" '(^|[^A-Za-z0-9])AKIA[0-9A-Z]{16}'

if [ -n "$FOUND" ]; then
  {
    echo "[pii-secret-scan] 차단: 기록하려는 내용에서 PII/시크릿 패턴이 검출되었습니다."
    echo "대상 파일: ${FILE_PATH:-알 수 없음}"
    echo "검출 내역:"
    printf '%s' "$FOUND"
    echo "실제 값 대신 환경변수 참조나 placeholder(예: <YOUR_KEY>)를 사용하세요."
  } >&2
  exit 2
fi

exit 0
