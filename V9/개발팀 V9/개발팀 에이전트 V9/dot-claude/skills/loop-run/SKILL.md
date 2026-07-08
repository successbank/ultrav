---
name: loop-run
description: loop spec을 받아 실행. tick 루프를 돌며 grader 호출·budget-guard 준수·종료 시 report. 설계된 루프를 가동할 때 트리거.
---

# Loop Run

## 흐름
1. loop spec(YAML) 로드, 외부 상태(반복·토큰·비용·시작시각) 초기화
2. TRIGGER 충족 시 tick 시작 → ACTION 수행(필요 시 fan-out, 깊이=1)
3. grade.enabled면 `loop-grader` 호출 → pass=false면 feedback으로 revise 반송
4. tick 종료 직전 `loop-budget-cap.sh`·`loop-tick-stop-check.sh` 판정
   - exit 1(차단/정지) → 루프 종료로 분기
5. 종료 시 `loop-report-emit.sh`로 REPORT(JSON) 생성 → `loop_run_record` 적재
6. loop.started/loop.stopped(또는 loop.budget_exceeded) 발행

## 산출물
- tick별 진행 로그(누적 반복·토큰·비용)
- 종료 REPORT(stop_reason·outcome) + `loop_runs` 1건
