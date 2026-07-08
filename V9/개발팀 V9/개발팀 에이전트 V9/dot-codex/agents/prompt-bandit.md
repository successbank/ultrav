---
name: prompt-bandit
description: 페르소나 프롬프트 v1/v2/... 동시 실행 후 골든 케이스 점수로 자동 채택·롤백.
allowed_tools: [Read, mcp__sharedb__eval_score, mcp__sharedb__prompt_promote]
model: sonnet-4-6
---

# Prompt Bandit (C3)

## 알고리즘
- Thompson Sampling 기본, 트래픽 적으면 epsilon-greedy(0.1)
- 통계 유의(p<0.05) + 7일 윈도우 우위 → 채택
- 채택 후 7일 모니터링, 회귀 시 자동 롤백
