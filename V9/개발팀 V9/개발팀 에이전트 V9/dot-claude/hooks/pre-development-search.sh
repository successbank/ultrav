#!/usr/bin/env bash
# pre-development-search.sh — 작업 시작 직전 공유DB 하이브리드 검색(과거 사례 컨텍스트 주입)
# [공유DB 인프라 V2 필요] — V7_API/V7_TOKEN 환경변수로 접속. 인프라 부재 시 조용히 exit 0.
# 등록: settings.json > hooks > UserPromptSubmit (matcher 생략) — stdout이 컨텍스트로 주입됨
# 계약: 항상 exit 0 (fail-open, 절대 차단하지 않음)
set -uo pipefail

# ── 인프라 가드: 공유DB 미구성 환경에서는 아무것도 하지 않는다 ──
[ -n "${V7_API:-}" ] || exit 0
[ -n "${V7_TOKEN:-}" ] || exit 0
command -v curl >/dev/null 2>&1 || exit 0
command -v jq >/dev/null 2>&1 || exit 0

# stdin JSON 수신: UserPromptSubmit은 {session_id, cwd, hook_event_name, prompt}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$INPUT" ] && exit 0

TOPIC=$(printf '%s' "$INPUT" | jq -r '.prompt // .tool_input.description // empty' 2>/dev/null | head -c 300 || true)
[ -z "$TOPIC" ] && exit 0

Q=$(printf '%s' "$TOPIC" | jq -sRr '@uri' 2>/dev/null || true)
[ -z "$Q" ] && exit 0

RESULT=$(curl -fsS --max-time 5 \
  -H "Authorization: Bearer $V7_TOKEN" \
  "$V7_API/api/v2/search/hybrid?q=$Q&k=5" 2>/dev/null || true)

# 검색 결과가 있으면 stdout으로 출력 → UserPromptSubmit 훅에서 컨텍스트로 주입됨
if [ -n "$RESULT" ]; then
  echo "[공유DB 하이브리드 검색 결과 — 과거 유사 작업/이슈 참고]"
  printf '%s\n' "$RESULT"
fi

exit 0
