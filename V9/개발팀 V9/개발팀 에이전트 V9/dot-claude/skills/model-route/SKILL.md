---
name: model-route
description: 호출 페르소나/작업 분류로 최적 모델을 선택하고 비용을 usage_tracking에 적재.
---

# Model Route

## 의사결정 트리
1. critical 키워드 (security, architecture, decision) → Opus / GPT-5 Pro
2. escalate_on 매칭 → Sonnet / GPT-5
3. 그 외 → Haiku / GPT-5-mini

## 비용 기록
- (model, in_tokens, out_tokens, persona, task_type, project) → usage_tracking
