#!/usr/bin/env bash
# loop-no-progress-check.sh (V9) — 지표가 N tick 연속 개선 없으면 종료 신호("헛도는 루프" 차단)
# ⚠️ onLoopTick/onLoopEnd 이벤트는 Claude Code에 존재하지 않음 — settings.json에 등록해도 조용히 무시된다.
#    Stop 훅 또는 스킬 내부 절차(스크립트 직접 호출)로만 사용 가능.
# 계약(스킬 내부 절차): exit 1 = 정지(무진행 상한 도달), exit 0 = 계속.
#                       stdout = 갱신된 무진행 카운트(호출측이 영속화).
set -uo pipefail

# stdin JSON 수신(훅으로 연결된 경우 대비 — 파이프 입력을 소비만 하고 판정은 외부 상태 env로 수행)
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi

# 입력: 외부 상태(환경변수). 지표는 "낮을수록 좋음" 기준(예: 실패 테스트 수, grader 미달 수).
METRIC_NOW="${LOOP_METRIC:-}"             # 이번 tick 지표값(정수)
METRIC_PREV="${LOOP_METRIC_PREV:-}"       # 직전 tick 지표값(정수)
NOPROG="${LOOP_NOPROGRESS_TICKS:-0}"      # 현재까지 무진행 누적 tick
MAX_NOPROG="${LOOP_MAX_NOPROGRESS:-3}"    # 무진행 상한(기본 3)

case "$NOPROG" in (''|*[!0-9]*) NOPROG=0 ;; esac

# 지표 미설정/비정수면 판정 보류(계속). 진전 측정 불가 루프는 상한(STOP)에 의존.
case "$METRIC_NOW" in (''|*[!0-9]*) METRIC_NOW="" ;; esac
case "$METRIC_PREV" in (''|*[!0-9]*) METRIC_PREV="" ;; esac
if [ -z "$METRIC_NOW" ] || [ -z "$METRIC_PREV" ]; then
  echo "$NOPROG"
  echo "[no-progress] metric unset → skip(continue)" >&2
  exit 0
fi

# 개선 = 지표 감소. 개선되면 카운터 리셋.
if [ "$METRIC_NOW" -lt "$METRIC_PREV" ]; then
  echo "0"
  echo "[progress] $METRIC_PREV -> $METRIC_NOW (reset)" >&2
  exit 0
fi

# 개선 없음(동일/악화) → 무진행 카운트 증가
NOPROG=$((NOPROG + 1))
echo "$NOPROG"
if [ "$NOPROG" -ge "$MAX_NOPROG" ]; then
  echo "[stop] no progress for ${NOPROG} ticks (metric=$METRIC_NOW)" >&2
  exit 1
fi
echo "[continue] no-progress ${NOPROG}/${MAX_NOPROG}" >&2
exit 0
