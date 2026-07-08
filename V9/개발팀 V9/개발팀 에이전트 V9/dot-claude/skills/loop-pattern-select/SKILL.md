---
name: loop-pattern-select
description: 목적·작업 성격을 받아 루프 패턴(ReAct/Plan-Execute/Evaluator-Optimizer/Reflexion/fan-out/조합형)을 추천하고 6요소 기본값을 제안. 새 루프 설계 직전 트리거.
---

# Loop Pattern Select (V9 신규)

## 입력
- 목적 한 줄 + 작업 성격(길이·병렬성·품질게이트 필요·반복실패 여부)

## 흐름
1. `루프엔지니어링 V9/루프_패턴_라이브러리.md` 빠른 표로 1차 후보 선정
2. 판단 기준:
   - 짧음/단일 → **ReAct**
   - 길고 다단계 → **Plan-and-Execute**
   - 품질 통과선 필요 → **Evaluator-Optimizer(grade-revise)**
   - 같은 실수 반복 → **Reflexion(reflect)**
   - 대량/병렬 → **fan-out**
   - 복합 → **조합형**(fan-out+grade-revise+reflect)
3. 선택 패턴의 6요소 기본값 + 권장 카탈로그 항목(①~⑧) 제시

## 산출물
- 추천 패턴 + 근거 1줄 + 6요소 초안 → `loop-design`으로 인계
