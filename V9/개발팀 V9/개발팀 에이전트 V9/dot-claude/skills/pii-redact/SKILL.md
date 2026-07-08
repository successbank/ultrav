---
name: pii-redact
description: 입력 텍스트에서 PII/시크릿을 자동 마스킹. pre-edit-pii-scan / pre-db-insert-pii-scan 훅의 본체.
---

# PII Redact

## 마스킹 규칙
- 주민번호 6자리-2자리 → `XXXXXX-XXXXXXX`
- 전화번호 → `XXX-XXXX-XXXX`
- 이메일 → 도메인 보존 + 로컬파트 마스킹
- API key 패턴 → `[REDACTED]`

## 출력
- 마스킹된 텍스트 + 발견 항목 카운트(JSON)
