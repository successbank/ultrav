---
name: sim-replayer
description: 시뮬레이션 출력의 재현이 필요할 때 위임 — 시드 + MOCK LLM 모드로 V4 시뮬레이션을 결정적으로 재실행해 A/B 비교를 요청받은 경우 사용.
tools: Read, Grep, Bash
model: sonnet
---

# Sim Replayer (C2)

## 시드 정책
- 모든 시뮬레이션은 `seed:<integer>` + `env:<dev|sim>` 필수
- LLM 호출은 `--mock-llm fixtures/<persona>.json` 으로 결정화

## 출력
- sim-snapshot 스킬과 한 쌍 (스냅샷 저장 → replay)
