# 개발팀 에이전트 V9

## 구성 (`.claude/` 기준, Codex 미러는 `.codex/agents/`)
- `agents/` — 서브에이전트 **18** (루프 4 · 네이티브 2[android/ios] 포함)
- `skills/` — 스킬 **28** (루프 5 · android 4 · ios 4 포함)
- `hooks/` — 결정적 게이트 **19** (루프 5 · android 2 · ios 2 포함)
- `evals/` — 골든 케이스 **20개 / 6 카테고리** (loop · persona · platform · search · routing · safety)
- `.codex/agents/` — Codex 측 미러 **18** (Claude 측과 같은 정의)
- `.github/workflows/` — eval / nightly / dual-review / cross-platform

## 신규 자산 (V8 → V9)
| 구분 | V9 신규 |
|---|---|
| 루프 2.0 | 에이전트 `loop-reflector` · 훅 `loop-no-progress-check`/`loop-context-compact` · 스킬 `loop-reflect`/`loop-pattern-select` · eval `no-progress-stop`/`reflection-memory`/`context-compaction` |
| iOS 네이티브 | 에이전트 `ios-native-builder`(+codex) · 훅 `pre-ios-build`/`pre-ios-release` · 스킬 `ios-swiftui-screen`/`ios-spm-module`/`ios-appintents-foundation`/`ios-release-appstore` · eval `ios-swiftui-state`/`ios-ondevice-ai` |

## 버전 계보 (참고)
- **V7**: 검색·라우팅·관찰성 (서브에이전트 12 신규)
- **V8**: 루프 정식화 + 안드로이드 네이티브 (→ 에이전트 16 · 스킬 22 · 훅 15)
- **V9**: 루프 2.0(하네스) + iOS 네이티브 대칭 (→ **에이전트 18 · 스킬 28 · 훅 19**)

## 파일 선두 메타 규약
```yaml
---
name: <kebab-case>
description: <한 줄, 언제 트리거되는지 구체적으로>
allowed_tools: [Read, Grep, Bash(npm test:*)]
model: haiku-4-5|sonnet-4-6|opus-4-6
---
```
