---
name: loop-postmortem
description: loop_runs 기록을 분석해 루프 개선안과 eval 후보를 도출. 루프 종료 후 또는 주기적 회고 시 트리거.
---

# Loop Postmortem

## 흐름
1. `loop_run_get`으로 대상 루프의 최근 실행들 조회
2. 지표 분석: 평균 반복·토큰·비용, stop_reason 분포, outcome 비율
3. 거짓 완료 점검: outcome=success인데 목표 미충족 흔적 대조
4. 비효율 식별: 예산 상한으로 잦은 조기 종료 / 반복만 소진 / grader 반려율
5. 개선안 도출: BUDGET 재조정·STOP 정교화·루브릭 보강·SCOPE 축소

## 산출물
1. 루프 개선 제안(변경할 6요소 항목 + 근거)
2. eval 후보 1건(`.claude/evals/loop/*.eval.yaml`, `eval-golden-from-issue` 형식)
3. 재발 방지 메모(`loop_runs` 근거 인용)
