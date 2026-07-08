---
name: a2a-publish
description: NATS JetStream에 토픽 메시지 발행. 페이로드 스키마 검증 포함.
---

# A2A Publish

## 페이로드 스키마
```json
{ "topic": "errors.bug.new", "actor": "<persona>", "ts": "<iso>", "payload": {...} }
```

## 거부 조건
- 토픽 미등록 → A2A운영팀에 등록 요청 PR 자동 생성
- 스키마 위반 → 거부 + 로그
