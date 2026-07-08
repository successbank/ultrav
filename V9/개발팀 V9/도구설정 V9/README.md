# 도구설정 V9 (Claude Code · Codex)

본 폴더는 두 도구가 같은 리포에서 일관되게 동작하도록 하기 위한 진입점·설정 템플릿.

## 파일
- `CLAUDE.md.template` — Claude Code 진입점 (≤200줄)
- `AGENTS.md.template` — Codex 진입점 (≤200줄)
- `settings.json.template` — Claude Code settings (.claude/)
- `config.toml.template` — Codex CLI 설정 (.codex/)
- `9섹션_체크리스트.md` — 양 진입점 공통 9섹션
- `모델_라우팅_정책.md` — model_policy 상세

## V9 자산 카운트 (설치 대상)
- 페르소나 **32팀** (신규 4팀: 루프엔지니어·Android_Native·OnDevice_AI·iOS_Native 포함)
- 서브에이전트 **18종** (.claude/agents + .codex/agents) — 루프 4(orchestrator·grader·budget-guard·reflector) · 네이티브 2(android/ios-native-builder)
- 스킬 **28종** — 루프 5(design·run·postmortem·reflect·pattern-select) · android 4 · ios 4
- 훅 **19종** — 루프 5 · android 2(pre-android-build/release) · ios 2(pre-ios-build/release)
- eval **20개 / 6 카테고리** (loop 6골든 + android/ios platform eval 포함)
- 공유DB 스키마: `009_loop_runs.sql`(loop_runs) · `010_loop_lessons.sql`(loop_lessons, V9)

## 신규 트랙 연결
- 루프 엔지니어링: `../루프엔지니어링 V9/README.md` (TRIGGER/SCOPE/ACTION/BUDGET/STOP/REPORT)
- 안드로이드 네이티브: `../크로스플랫폼 V9/안드로이드_네이티브_가이드.md`
- iOS 네이티브: `../크로스플랫폼 V9/iOS_네이티브_가이드.md`
- 훅 연결·모델 라우팅 행은 `settings.json.template`·`모델_라우팅_정책.md` 참조
