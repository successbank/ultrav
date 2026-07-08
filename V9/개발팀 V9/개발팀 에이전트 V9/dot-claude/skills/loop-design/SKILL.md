---
name: loop-design
description: 목표 한 줄을 6요소(TRIGGER/SCOPE/ACTION/BUDGET/STOP/REPORT) loop spec(YAML)으로 변환. 새 루프를 설계할 때 트리거.
---

# Loop Design

## 흐름
1. 목표 한 줄 + 트리거 후보 수신
2. 6요소 채우기: TRIGGER(언제)·SCOPE(어디)·ACTION(무엇)·BUDGET(얼마)·STOP(끝)·REPORT(알림)
3. STOP을 결정적 OR 결합으로(목표 OR 반복 OR 토큰 OR 비용 OR 시간 OR 사람개입)
4. BUDGET을 tick당 + 누적 두 층으로 명시
5. 비가역 행동에 human_gate 삽입
6. `루프_설계_체크리스트.md` 12항목으로 self-check

## 산출물 (loop spec YAML)
```yaml
name: <slug>
trigger: { on: <event|schedule>, scope_filter: <opt> }
scope: { repos: [...], paths: [...], env: dev }
action: "<측정 가능한 행동>"
budget: { tokens_per_tick: 30000, cost_usd_max: 3, max_iterations: 8 }
stop: { any_of: [<goal>, "iterations>=8", "cost_usd>=3"] }
report: { to: ["slack:#eng-bots"], sink: loop_runs }
grade: { enabled: true, rubric: "<객관적 통과선 + 금지조건>" }
human_gate: { before: merge }   # 선택
```
