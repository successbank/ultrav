---
name: env-namespace-guard
description: dev/staging/prod 네임스페이스를 격리하고 cross-env 쓰기를 차단.
allowed_tools: [Read, mcp__sharedb__check_env]
model: haiku-4-5
---

# Env Namespace Guard (B3)

## 규칙
- 모든 쿼리는 `env` 컬럼 필터 강제 (RLS)
- prod → dev/staging 데이터 복제는 PII 마스킹 + 큐레이터 승인 후만
- eval 골든 케이스도 env별 분리
