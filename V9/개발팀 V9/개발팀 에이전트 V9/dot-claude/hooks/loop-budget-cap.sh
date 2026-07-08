#!/usr/bin/env bash
# loop-budget-cap.sh — 누적 토큰/비용 상한 초과 시 차단 신호
# ⚠️ onLoopTick/onLoopEnd 이벤트는 Claude Code에 존재하지 않음 — settings.json에 등록해도 조용히 무시된다.
#    Stop 훅 또는 스킬 내부 절차(스크립트 직접 호출)로만 사용 가능.
# 계약(스킬 내부 절차): exit 0 = 예산 내(계속), exit 1 = 차단(정지 신호). 차단 시 stderr에 사유 한 줄.
set -uo pipefail

# stdin JSON 수신(훅으로 연결된 경우 대비 — 파이프 입력을 소비만 하고 판정은 외부 상태 env로 수행)
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi

# 입력: 외부 상태(환경변수). 실측 누적치만 사용(환각 차단).
TOKENS_USED="${LOOP_TOKENS_USED:-0}"
TOKENS_MAX="${LOOP_TOKENS_MAX:-200000}"
COST_USD="${LOOP_COST_USD:-0}"                 # 달러(소수 허용). 정수부만 보수적으로 비교
COST_MAX_USD="${LOOP_COST_MAX_USD:-5}"

# 정수부 추출 (비정수 입력에도 안전)
COST_INT="${COST_USD%%.*}"
case "$COST_INT" in (''|*[!0-9]*) COST_INT=0 ;; esac
case "$TOKENS_USED" in (''|*[!0-9]*) TOKENS_USED=0 ;; esac
COST_CENTS=$(( COST_INT * 100 ))
COST_MAX_CENTS=$(( COST_MAX_USD * 100 ))

if [ "$TOKENS_USED" -ge "$TOKENS_MAX" ]; then
  echo "[block] tokens_used($TOKENS_USED)>=cap($TOKENS_MAX)" >&2; exit 1
fi
if [ "$COST_CENTS" -ge "$COST_MAX_CENTS" ]; then
  echo "[block] cost_usd>=cap(\$$COST_MAX_USD)" >&2; exit 1
fi

echo "[ok] tokens=$TOKENS_USED/$TOKENS_MAX cost<\$$COST_MAX_USD" >&2
exit 0
