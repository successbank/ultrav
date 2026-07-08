# Phase 1 — 핵심 인프라 (1개월)

## 채택 트랙
- A1 하이브리드 검색 (pgvector + RRF)
- A2 모델 라우팅 (default/escalate/critical)
- B3 환경 네임스페이스 (dev/staging/prod + RLS)

## 산출
- 공유DB V2: 002·006·007 SQL 적용
- 신규 스킬: hybrid-search, embed-knowledge, model-route
- 신규 서브에이전트: hybrid-searcher, model-router
- 신규 페르소나: DataOps팀(부분), FinOps팀(부분)

## 검증 지표
- 검색 적중률(@k=5) ≥ 80% (`hybrid-recall.eval.yaml`)
- 평균 비용 -40% (`model-cost.eval.yaml`)
- env cross-write 0건 (audit_log)
