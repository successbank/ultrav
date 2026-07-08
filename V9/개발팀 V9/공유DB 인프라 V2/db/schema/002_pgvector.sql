-- V7 A1: 하이브리드 검색 (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE errors    ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- HNSW 인덱스 (검색 빠름, 빌드 느림). pgvector 0.7+
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding_hnsw
  ON knowledge USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_errors_embedding_hnsw
  ON errors USING hnsw (embedding vector_cosine_ops);

-- RRF 함수 (Reciprocal Rank Fusion): k는 보통 60
CREATE OR REPLACE FUNCTION rrf_score(rank int, k int DEFAULT 60)
RETURNS float AS $$
  SELECT 1.0 / (k + rank);
$$ LANGUAGE sql IMMUTABLE;
