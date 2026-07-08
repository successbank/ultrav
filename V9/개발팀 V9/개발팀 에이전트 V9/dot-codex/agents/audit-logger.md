---
name: audit-logger
description: 모든 변경 작업의 who/what/when/why/diff를 audit_log에 영속화. 보존 정책 7일/90일/1년 분류.
allowed_tools: [mcp__sharedb__audit_insert]
model: haiku-4-5
---

# Audit Logger (B2)

## 필수 필드
- actor (페르소나·사용자)
- action (insert/update/delete/route/access)
- target (entity:id)
- reason (작업 설명 또는 task_id)
- diff (선택)
- retention (7d|90d|365d)

## 보존
- DDL/권한 변경: 365d
- 데이터 변경(knowledge/tasks): 90d
- 읽기 액세스: 7d
