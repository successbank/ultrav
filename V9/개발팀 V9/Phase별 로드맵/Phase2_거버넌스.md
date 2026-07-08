# Phase 2 — 거버넌스·협업·관찰성 (2개월)

## 채택 트랙
- A3 A2A 메시지 버스 (NATS)
- A4 OpenTelemetry → Grafana
- B1 RBAC + JWT
- B2 audit_log + 트리거

## 산출
- 공유DB V2: 005·008 SQL
- otel-collector·Prometheus·Grafana 대시보드 (persona-usage / eval-regression)
- 신규 페르소나: SRE팀, A2A운영팀
- 신규 서브에이전트: a2a-flow-auditor, otel-collector, rbac-enforcer, audit-logger
- GitHub Actions: personas-eval.yml + pr-review-dual.yml

## 검증
- p95 응답 SLO 달성
- 권한 분리 후 admin 외 쓰기 0건 (테스트)
- 모든 변경 audit_log 적재율 100%
