---
name: loop-reflect
description: 루프 도중 Reflexion. 실패/반송에서 교훈을 뽑아 loop_lessons에 적재하고 시작 시 관련 교훈을 주입. loop-run 내부 또는 반복 실패 시 트리거.
---

# Loop Reflect (V9 신규)

## 흐름
1. 루프/tick 시작: `loop_lesson_search(loop_name, tags)` → 관련 교훈 상위 N개 선별 주입(요약만)
2. tick 실패 / grader `pass=false`: "무엇이·왜·다음엔" 1~2줄 교훈 작성 → `loop_lesson_record`
3. 유사 교훈 중복 시 새로 만들지 않고 `reuse_count` 증가
4. 루프 종료 후 종합 분석은 `loop-postmortem`으로 위임(REFLECT는 도중, postmortem은 이후)

## 산출물
- 주입된 교훈 id 목록 + 신규 교훈 1건(또는 reuse 증가)
- `loop_lessons` 적재(loop_name·tags·lesson·trigger_ctx)

## 경계
- 행동 가능·일반화 가능한 교훈만(1회성 PR 번호 등 금지)
- 완료/정지 판정 안 함(hook/grader 영역) — 학습만 담당
