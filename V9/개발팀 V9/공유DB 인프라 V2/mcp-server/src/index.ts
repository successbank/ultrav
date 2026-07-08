// V7 MCP Server — 신규 도구
// V1의 11 도구 + V7 신규 도구 = 총 16개
// + V9 루프 도구 4개(loop_run_record/get, loop_lesson_record/search) = 총 20개
import { McpServer } from '@modelcontextprotocol/sdk/server';

const server = new McpServer({ name: 'v7-shareddb', version: '2.0.0' });

// === V1 도구 (knowledge_search, knowledge_insert, errors_insert, tasks_insert, ...) ===
// (V1 정의 import — 생략)

// === V7 신규 도구 ===
server.tool('search_hybrid', '하이브리드 검색 (RRF)', async ({ q, k = 5, alpha = 0.5, env = 'prod' }) => {
  // pgvector + tsvector RRF
});

server.tool('route_model', '모델 라우팅 결정', async ({ persona, task_type, est_tokens }) => {
  // policy + escalate_on + critical
});

server.tool('audit_insert', '감사 로그 적재', async ({ actor, action, target, reason, diff, retention }) => {});

server.tool('pairing_token_issue', '컴패니언 페어링 토큰 발급', async ({ parent_device, child_platform }) => {});

server.tool('sync_push', 'oplog push', async ({ user_id, ops, vector_clock }) => {});

server.tool('usage_record', '토큰·비용 적재', async ({ persona, model, in_tokens, out_tokens, cost_usd }) => {});

// === V9 루프 도구 (009_loop_runs, 010_loop_lessons) ===
server.tool('loop_run_record', '루프 실행 기록 적재', async ({ loop_name, trigger, scope, action_summary, iterations, tokens_used, cost_usd, stop_reason, outcome, env = 'dev' }) => {
  // INSERT INTO loop_runs (...)
});

server.tool('loop_run_get', '루프 실행 조회(이름·기간·결과 필터)', async ({ loop_name, since, outcome, limit = 20 }) => {
  // SELECT FROM loop_runs WHERE ...
});

server.tool('loop_lesson_record', '루프 교훈 적재(Reflexion 에피소드 메모리)', async ({ loop_name, tags = [], lesson, trigger_ctx, env = 'dev' }) => {
  // INSERT INTO loop_lessons (...); 유사 교훈은 reuse_count 증가
});

server.tool('loop_lesson_search', '관련 교훈 상위 N개(loop_name+tags, reuse_count·최근성 순)', async ({ loop_name, tags = [], k = 5 }) => {
  // SELECT FROM loop_lessons WHERE loop_name=? AND tags && ? ORDER BY reuse_count DESC, last_used_at DESC LIMIT k
});

server.start();
