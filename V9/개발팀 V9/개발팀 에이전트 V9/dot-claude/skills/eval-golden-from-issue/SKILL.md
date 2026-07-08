---
name: eval-golden-from-issue
description: 재현 가능한 이슈/버그를 .claude/evals/<category>/*.eval.yaml 후보로 변환.
---

# Eval Golden From Issue

## 출력 YAML 골격
```yaml
name: <slug>
category: persona|platform|search|routing|safety|regression
inputs:
  prompt: |
    ...
expected:
  must_contain: [...]
  must_not_contain: [...]
  schema: <optional>
score_weights:
  correctness: 0.6
  cost: 0.2
  latency: 0.2
```
