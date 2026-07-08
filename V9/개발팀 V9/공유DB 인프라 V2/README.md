# 공유DB 인프라 V2 (V7)

V6의 공유DB V1 위에 V7 트랙 A·B·D 요구사항을 충족하기 위한 스키마/인프라 확장.

## 추가/변경 요약
| ID | 항목 | V1 → V2 | 트랙 |
|---|---|---|---|
| S2 | pgvector + embedding 컬럼 | 신규 | A1 |
| S3 | devices (멀티 디바이스) | 신규 | 크로스 |
| S4 | sync_oplog (CRDT-ready) | 신규 | 크로스 |
| S5 | audit_log + 트리거 | 신규 | B2 |
| S6 | env 컬럼 + RLS | 신규 | B3 |
| S7 | usage_tracking | 신규 | A2/FinOps |
| S8 | RBAC (roles, role_grants) | 신규 | B1 |
| S9 | loop_runs (루프 실행 기록) | 신규 V8 | F/루프 |
| S10 | loop_lessons (Reflexion 에피소드 메모리) | 신규 V9 | F⁺/루프 2.0 |
| OBS | OpenTelemetry + Prometheus + Grafana | 신규 | A4 |
| MCP | hybrid_search / route_model / audit_insert / pairing_token + **loop_run_record/get · loop_lesson_record/search(V9)** | 신규 | A1/A2/B1/크로스/F |

## 디렉터리
- `db/schema/*.sql` — 신규 마이그레이션 (V1과 합쳐 적용)
- `api/openapi-v2.yaml` — REST API 명세
- `mcp-server/src/index.ts` — MCP 서버 신규 도구
- `sync-gateway/` — WebSocket + oplog 처리
- `embedding-worker/` — 임베딩 백그라운드
- `observability/` — otel-collector·Prometheus·Grafana
- `integration/` — V6/V1 연동 가이드
- `docs/` — 아키텍처·보안·FinOps
