#!/usr/bin/env bash
# loop-context-compact.sh (V9) — tick 경계에서 컨텍스트 예산 초과 시 압축/외부화 요청
# ⚠️ onLoopTick/onLoopEnd 이벤트는 Claude Code에 존재하지 않음 — settings.json에 등록해도 조용히 무시된다.
#    Stop 훅 또는 스킬 내부 절차(스크립트 직접 호출)로만 사용 가능. (압축 필요 시점 감지는 PreCompact 훅과는 별개)
# 계약(스킬 내부 절차): exit 2 = 압축 필요(요약·원시제거·재주입), exit 0 = ok. (정지 아님 — 정지는 stop-check가 담당)
set -uo pipefail

# stdin JSON 수신(훅으로 연결된 경우 대비 — 파이프 입력을 소비만 하고 판정은 외부 상태 env로 수행)
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
fi

CTX_TOKENS="${LOOP_CTX_TOKENS:-0}"          # 현재 컨텍스트 추정 토큰
CTX_BUDGET="${LOOP_CTX_BUDGET:-120000}"     # tick 컨텍스트 예산(기본 120k)
STATE_FILE="${LOOP_STATE_FILE:-}"           # 외부 상태(플랜·누적치) 파일 경로

case "$CTX_TOKENS" in (''|*[!0-9]*) CTX_TOKENS=0 ;; esac

# 플랜/누적치는 컨텍스트가 아니라 파일/변수에 둬야 한다(Dynamic Workflows 원칙).
if [ -z "$STATE_FILE" ] || [ ! -f "$STATE_FILE" ]; then
  echo "[context] WARN: 외부 상태 파일 미지정 — 플랜/누적치를 변수·파일로 외부화하라" >&2
fi

# 컨텍스트 예산 초과 시 압축 신호.
if [ "$CTX_TOKENS" -ge "$CTX_BUDGET" ]; then
  echo "[context] over budget: ${CTX_TOKENS}>=${CTX_BUDGET}" >&2
  echo "[context] action: 직전 tick 로그 요약 · 원시 dump 제거 · 다음 tick 관련 조각만 재주입" >&2
  exit 2
fi
echo "[context] ok: ${CTX_TOKENS}/${CTX_BUDGET}" >&2
exit 0
