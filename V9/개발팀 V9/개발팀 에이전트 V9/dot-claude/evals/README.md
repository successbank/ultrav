# 골든 케이스 (evals/)

## 카테고리
- `persona/` — 페르소나 정합성 회귀
- `platform/` — 플랫폼별(mobile/desktop/wearable/xr) 빌드·동기화 회귀
- `search/` — 하이브리드 검색 적중률
- `routing/` — 모델 라우팅 비용·정확도
- `safety/` — Trust&Safety 차단 정확도
- `regression/` (선택) — 자유 회귀

## YAML 스키마
- name, category, env(dev|staging|prod), inputs, expected, score_weights, baseline
