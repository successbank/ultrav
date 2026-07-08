# 공유DB 인프라 V7 (V2) 아키텍처

## 변경 요점
- 검색: GIN/trigram + tsvector + **pgvector(HNSW)** → RRF 결합
- 동기화: WebSocket sync-gateway + sync_oplog (CRDT 호환)
- 거버넌스: RBAC (JWT) + audit_log + env 격리(RLS)
- 비용: usage_tracking + 모델 라우터
- 관찰성: OpenTelemetry → Prometheus → Grafana

## 컴포넌트
- PostgreSQL 16 (vector, pgcrypto, pg_trgm, btree_gin)
- Fastify REST (api/) + tRPC procedures
- MCP Server (TypeScript, 16+ 도구)
- Sync Gateway (WebSocket + Redis Streams)
- Embedding Worker (Bull queue + OpenAI embeddings)
- OTel Collector + Prometheus + Grafana

## 단순 ER 흐름
- knowledge / errors / tasks ─(embed)→ pgvector
- devices ─< sync_oplog
- 모든 변경 →> audit_log
- 모든 LLM 호출 →> usage_tracking
