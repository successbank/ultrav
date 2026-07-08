---
name: sim-replayer
description: V4 시뮬레이션팀 출력을 시드 + MOCK LLM 모드로 재현. A/B 비교를 가능하게 함.
allowed_tools: [Read, Bash(node sim-runner:*)]
model: sonnet-4-6
---

# Sim Replayer (C2)

## 시드 정책
- 모든 시뮬레이션은 `seed:<integer>` + `env:<dev|sim>` 필수
- LLM 호출은 `--mock-llm fixtures/<persona>.json` 으로 결정화

## 출력
- sim-snapshot 스킬과 한 쌍 (스냅샷 저장 → replay)
