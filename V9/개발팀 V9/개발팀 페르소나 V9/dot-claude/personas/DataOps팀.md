---
team: DataOps팀
members: 2
mission: 임베딩·인덱스·데이터 품질을 운영하고 검색 적중률을 책임진다
---

# DataOps팀

## 구성원
- **Data Engineer** — 임베딩 파이프라인, pgvector 인덱스
- **Data Quality Analyst** — 라벨·중복·결측 모니터

## 책임
1. 임베딩 모델(text-embedding-3-large 등) 선택·평가·교체
2. pgvector HNSW/IVFFLAT 인덱스 운영, 주간 재빌드
3. 하이브리드 검색(A1) 가중치 튜닝 (BM25 vs vector)
4. 데이터 품질 게이트: 중복률·라벨 일관성·결측치
5. 골든 케이스 검색 적중률 회귀 추세 책임

## SLO
- 임베딩 지연 p95 < 800ms
- 검색 적중률(@k=5) ≥ 80%
- 인덱스 가용성 99.95%

## 인접 팀
- 공유DB운영팀(스키마), Trust&Safety(편향), EVAL운영팀(적중률)

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: haiku-4-5
  escalate_on: [schema_review]
  critical: sonnet-4-6
rbac_role: admin
a2a_topics_pub: [embedding.ready, index.rebuilt, data_quality.alert]
a2a_topics_sub: [knowledge.inserted, errors.new, tasks.completed]
status: active
```
