---
name: embed-knowledge
description: 새 knowledge/errors 삽입 시 자동으로 임베딩 생성. embedding-worker가 큐를 폴링하여 호출.
---

# Embed Knowledge

## 트리거
- knowledge.inserted 토픽 수신 (A3)
- 또는 nightly 재임베딩 잡

## 모델
- 기본: text-embedding-3-large (1536d)
- 대체(저비용): text-embedding-3-small (1536d 절단)

## 실패 정책
- 3회 재시도 (exponential backoff)
- 최종 실패 시 errors 테이블에 `embedding_failed` 라벨로 적재
