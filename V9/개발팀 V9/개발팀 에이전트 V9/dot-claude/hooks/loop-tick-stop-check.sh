#!/usr/bin/env bash
# loop-tick-stop-check.sh — 매 tick STOP 조건 평가
# ⚠️ onLoopTick/onLoopEnd 이벤트는 Claude Code에 존재하지 않음 — settings.json에 등록해도 조용히 무시된다.
#    Stop 훅 또는 스킬 내부 절차(스크립트 직접 호출)로만 사용 가능.
#
# [모드 1] Stop 훅 등록 (settings.json > hooks > Stop, matcher 생략):
#   LOOP_ACTIVE=true인 루프 세션에서 STOP 조건 미충족이면 exit 2(정지 차단 → 루프 계속),
#   STOP 조건 충족이면 exit 0(정지 허용). stop_hook_active=true면 무한루프 방지 위해 항상 통과.
# [모드 2] 스킬 내부 절차 직접 호출 (stdin 없이 env만):
#   exit 0 = 계속, exit 1 = 정지 신호. 정지 시 stderr에 사유 한 줄.
set -uo pipefail

# stdin JSON 수신(훅 모드): {session_id, cwd, hook_event_name, stop_hook_active, ...}
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi
EVENT=""
if [ -n "$INPUT" ] && command -v jq >/dev/null 2>&1; then
  EVENT=$(printf '%s' "$INPUT" | jq -r '.hook_event_name // empty' 2>/dev/null || true)
fi

# 입력: 외부 상태(환경변수). LLM 기억이 아닌 실측 누적치를 사용한다.
ITER="${LOOP_ITER:-0}"               # 현재 반복 수
MAX_ITER="${LOOP_MAX_ITER:-10}"      # 반복 상한
GOAL_MET="${LOOP_GOAL_MET:-false}"   # 목표 달성(grader/명령 결과로 결정)
ELAPSED_MIN="${LOOP_ELAPSED_MIN:-0}" # 경과 분
MAX_MIN="${LOOP_MAX_MIN:-60}"        # 시간 상한
HUMAN_ABORT="${LOOP_HUMAN_ABORT:-false}"

# STOP = 조건들의 OR 결합
STOP_REASON=""
if [ "$GOAL_MET" = "true" ]; then STOP_REASON="goal met"
elif [ "$ITER" -ge "$MAX_ITER" ] 2>/dev/null; then STOP_REASON="iterations>=$MAX_ITER"
elif [ "$ELAPSED_MIN" -ge "$MAX_MIN" ] 2>/dev/null; then STOP_REASON="elapsed>=${MAX_MIN}min"
elif [ "$HUMAN_ABORT" = "true" ]; then STOP_REASON="human abort"
fi

# ── 모드 1: Stop 훅으로 등록된 경우 ──
if [ "$EVENT" = "Stop" ]; then
  # 루프 세션이 아니면 관여하지 않음(일반 대화 정지를 막지 않는다)
  [ "${LOOP_ACTIVE:-false}" = "true" ] || exit 0
  # stop_hook_active=true → 이미 이 훅 때문에 계속된 상태. 무한루프 방지 위해 통과.
  SHA=$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null || echo "false")
  [ "$SHA" = "true" ] && exit 0
  if [ -n "$STOP_REASON" ]; then
    echo "[stop-check] STOP: $STOP_REASON — 루프 종료 허용" >&2
    exit 0                            # 정지 허용
  fi
  echo "[stop-check] STOP 조건 미충족(iter=$ITER/$MAX_ITER, elapsed=${ELAPSED_MIN}/${MAX_MIN}min) — 다음 tick을 계속 진행하라" >&2
  exit 2                              # 정지 차단 → 루프 계속
fi

# ── 모드 2: 스킬 내부 절차 직접 호출 ──
if [ -n "$STOP_REASON" ]; then
  echo "[stop] $STOP_REASON" >&2
  exit 1
fi
echo "[continue] iter=$ITER/$MAX_ITER elapsed=${ELAPSED_MIN}min" >&2
exit 0
