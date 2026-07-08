# INDEX — 개발팀 V9 산출물 인덱스

> **정본: 이 디렉토리(`개발팀 V9/`) / Ultra 적용본: `/data/successbank/projects/ultra/.claude/`**
> 검토 시작점. 모든 경로는 `개발팀 V9/` 기준 상대.
> 소스 폴더 `dot-claude/` · `dot-codex/` · `dot-github/`는 숨김 폴더 방지용 개명이며, 설치 시 각각 `.claude/` · `.codex/` · `.github/`로 변환된다.
> 작성일: 2026-06-30 (V8 2026-06-27 / V7 2026-05-31 계승)

## 0. 핵심 제안 문서
- [V9 업그레이드 제안서](./V9_업그레이드_제안서.md) — V8→V9 결정사항 (트랙 F⁺ 루프 2.0, 갭 G19~G23)
- [V9 Claude Code · Codex 최적화 지침](./V9_ClaudeCode_Codex_최적화지침.md)
- [V9 크로스플랫폼 개발제안서](./V9_크로스플랫폼_개발제안서.md)
- [V9 사용자 지침 · 요청 템플릿](./V9_사용자지침_요청템플릿.md)
- [최상위 README](./README.md)

## 1. 루프 엔지니어링 2.0 (V9 핵심 — 트랙 F⁺) ⭐
- [루프엔지니어링 V9 README](./루프엔지니어링%20V9/README.md)
- [루프 엔지니어링 방법론](./루프엔지니어링%20V9/루프엔지니어링_방법론.md) — 6요소 + **3 운영 규율(CONTEXT·PROGRESS·REFLECT)** · 성숙도(프롬프트→컨텍스트→하네스) · `/goal`·자율성 사다리
- [루프 패턴 라이브러리 ⭐](./루프엔지니어링%20V9/루프_패턴_라이브러리.md) — ReAct/Plan-Execute/Evaluator-Optimizer/Reflexion/fan-out/조합형 (V9 신규)
- [하네스 엔지니어링 가이드 ⭐](./루프엔지니어링%20V9/하네스_엔지니어링_가이드.md) — 하네스 5계층 ↔ V9 자산 (V9 신규)
- [루프 카탈로그](./루프엔지니어링%20V9/루프_카탈로그.md) — 재사용 루프 **8종**(+⑦Reflexion ·⑧멀티에이전트)
- [루프 설계 체크리스트](./루프엔지니어링%20V9/루프_설계_체크리스트.md) — 6요소 + 3규율 점검
- [완료조건 가이드](./루프엔지니어링%20V9/완료조건_가이드.md) — STOP·무진행·`/goal`·grade-revise·거짓완료 방지

## 2. AI 주도 개발 (트랙 H)
- [드롭인 & 최적화 가이드](./사용방법/AI주도개발_드롭인_최적화.md) — "V9 시스템을 현재 개발에 맞게 최적화"
- [Claude Code 적용 가이드](./사용방법/Claude_Code_적용가이드.md) · 설치/검증: `./사용방법/install-to-project.sh`, `verify.sh`

## 3. 페르소나 (확장 16팀 — 핵심 10팀 정본은 프로젝트 `.claude/personas/`)
- [페르소나 V9 README](./개발팀%20페르소나%20V9/README.md)
- 루프엔지니어팀(4인, V9 강화) · **iOS_Native(V9 신규)** · Android_Native · OnDevice_AI · FinOps · SRE · Trust&Safety · DataOps · A2A운영 · 프롬프트엔지니어 · Mobile/Desktop/Wearable/XR/Companion/Release

## 4. 에이전트·스킬·훅·evals
- [에이전트 V9 README](./개발팀%20에이전트%20V9/README.md)
- 서브에이전트 **18**: `./개발팀 에이전트 V9/dot-claude/agents/`
  - 루프: `loop-orchestrator` · `loop-grader` · `loop-budget-guard` · **`loop-reflector`(V9)**
  - 네이티브: `android-native-builder` · **`ios-native-builder`(V9)**
- 스킬 **28**: `./개발팀 에이전트 V9/dot-claude/skills/`
  - 루프: `loop-design` · `loop-run` · `loop-postmortem` · **`loop-reflect`(V9)** · **`loop-pattern-select`(V9)**
  - 네이티브: android(compose-screen·gradle-module·appfunctions-mcp·release-play) · **iOS(swiftui-screen·spm-module·appintents-foundation·release-appstore)(V9)**
- 훅 **19**: `./개발팀 에이전트 V9/dot-claude/hooks/`
  - 루프: `loop-tick-stop-check.sh` · `loop-budget-cap.sh` · `loop-report-emit.sh` · **`loop-no-progress-check.sh`(V9)** · **`loop-context-compact.sh`(V9)**
  - 네이티브: `pre-android-build/release.sh` · **`pre-ios-build/release.sh`(V9)**
- evals (loop 카테고리 **6골든**): `./개발팀 에이전트 V9/dot-claude/evals/loop/` — evals는 Claude Code 네이티브 기능이 아니며 **별도 러너 필요**
  - stop-condition · grader-rubric · budget-respect + **no-progress-stop · reflection-memory · context-compaction(V9)**
- Codex 미러 18: `./개발팀 에이전트 V9/dot-codex/agents/` · GitHub Actions: `./개발팀 에이전트 V9/dot-github/workflows/`

## 5. 공유DB 인프라 V2
- [README](./공유DB%20인프라%20V2/README.md) · [ARCHITECTURE](./공유DB%20인프라%20V2/docs/ARCHITECTURE_V7.md)
- 마이그레이션 SQL: `db/schema/` — 002 pgvector … 008 rbac · 009 loop_runs · **010 loop_lessons(V9)**
- [MCP Server](./공유DB%20인프라%20V2/mcp-server/src/index.ts) — +루프 도구 4(`loop_run_record`/`get`, `loop_lesson_record`/`search`)
- DB 식별자 `v7`은 인프라 고정값(버전 폴더와 무관, 변경 금지)

## 6. 크로스플랫폼 V9
- [README](./크로스플랫폼%20V9/README.md) · [안드로이드 네이티브 가이드](./크로스플랫폼%20V9/안드로이드_네이티브_가이드.md) · [iOS 네이티브 가이드 ⭐](./크로스플랫폼%20V9/iOS_네이티브_가이드.md)
- 모노레포 · 스택 결정 · 동기화 충돌 · 보안/디바이스 테스트 매트릭스

## 7. 도구설정 V9 (Claude Code + Codex)
- [README](./도구설정%20V9/README.md) · [9섹션 체크리스트](./도구설정%20V9/9섹션_체크리스트.md) · [모델 라우팅 정책](./도구설정%20V9/모델_라우팅_정책.md)
- 템플릿: `CLAUDE.md.template` · `AGENTS.md.template` · `settings.json.template` · `config.toml.template`

## 8. 사용자 지침 — 요청 템플릿 T1~T18
- [README](./사용자지침%20V9/README.md) · [머리말 규칙](./사용자지침%20V9/머리말_규칙.md)
- T1 PRD … T15 INCIDENT · **T16 LOOP(패턴·3규율 반영) ⭐ · T17 ANDROID_NATIVE · T18 IOS_NATIVE ⭐**

## 9. 검증·회의·비평 V9 (근거)
- [최신 트렌드 웹 리서치 보고서](./검증_회의_비평%20V9/최신트렌드_웹리서치_보고서.md) — +⑧ V9 Loop 2.0 보강
- [페르소나 가상 회의록](./검증_회의_비평%20V9/페르소나_가상회의록.md) — +V9 Loop 2.0 보강 회의
- [레드팀 비평·반론](./검증_회의_비평%20V9/비평_레드팀_반론.md) — #1~#12 + #13~#15(V9)

## 10. Phase 로드맵
- Phase 1~4 (V7): 핵심인프라 · 거버넌스 · 자율성 · UX
- [Phase 5 — 루프·안드로이드](./Phase별%20로드맵/Phase5_루프_안드로이드.md)
- [Phase 6 — 루프 2.0·하네스 ⭐](./Phase별%20로드맵/Phase6_루프2.0_하네스.md)

## 11. 가장 먼저 손댈 단 하나
기존 루프 1종에 **`loop-no-progress-check.sh` + `loop-context-compact.sh`** 를 붙이고 env:dev 1회 실행 → `loop_runs`로 효과 확인 → `loop-reflector`로 교훈 누적. (저위험·즉효의 루프 2.0 진입점)
