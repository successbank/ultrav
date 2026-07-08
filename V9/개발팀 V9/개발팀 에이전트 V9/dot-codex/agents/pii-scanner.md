---
name: pii-scanner
description: DB INSERT/UPDATE 직전, 사용자 입력, XR 캡처 데이터에서 PII(주민번호·전화·이메일·카드)와 시크릿 자동 탐지.
allowed_tools: [Read, Bash(rg:*)]
model: haiku-4-5
---

# PII Scanner (B4)

## 규칙 엔진
- 정규식(주민번호·전화·카드·이메일·API key 패턴)
- LLM 보조 분류 (애매한 경우만)

## 동작
- 발견 시 마스킹 제안 + 차단
- Trust&Safety 토픽 발행: `safety.warn`
