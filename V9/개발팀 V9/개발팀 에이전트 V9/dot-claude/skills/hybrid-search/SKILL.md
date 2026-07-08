---
name: hybrid-search
description: pgvector + tsvector를 Reciprocal Rank Fusion으로 결합하여 V7 공유DB에서 유사 사례를 검색한다. PRD·BUGFIX·FEATURE 작업 시작 시 컨텍스트 주입용으로 호출.
---

# Hybrid Search

## 입력
- query (자유 텍스트)
- k (default 5)
- alpha (BM25 vs vector 가중, default 0.5)
- env (dev|staging|prod)

## 절차
1. embed(query) → 1536-d 벡터
2. BM25 상위 50 + 벡터 상위 50 후보
3. RRF 점수 = Σ(1/(60+rank_i)) 합산 → 상위 k 선택
4. 결과를 (id, title, snippet, sim, source) 형식으로 반환
