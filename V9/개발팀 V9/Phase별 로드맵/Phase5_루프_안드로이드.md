# Phase 5 — 루프 엔지니어링·안드로이드 네이티브 (V9, 2개월+)

> 선행조건: **Phase 1~4 완료**(하이브리드 검색·모델 라우팅·거버넌스·관찰성·자율성·UX). 루프는 검색·라우팅·eval·audit 위에서만 안전하게 돈다.

## 채택 트랙
- **트랙 F — 루프 엔지니어링**: one-shot 프롬프팅 → "좋은 루프 설계"로 전환. 6요소(TRIGGER/SCOPE/ACTION/BUDGET/STOP/REPORT) 기반 자율 반복.
- **트랙 G — 안드로이드 네이티브**: RN 병행. Kotlin/Compose-first·온디바이스 AI(Gemini Nano/AppFunctions)·Play 릴리스 전담 트랙.
- **트랙 H — AI 주도 개발 드롭인**: AI Studio/Antigravity 생성 → Android CLI 빌드·실행 → `android-native-builder`가 루프로 그린까지 자율 반복(F·G 결합).

## 산출
- 신규 페르소나 3팀: **루프엔지니어팀 · Android_Native팀 · OnDevice_AI팀** (총 31팀)
- 신규 서브에이전트 4종: `loop-orchestrator`(opus) · `loop-grader`(sonnet) · `loop-budget-guard`(haiku) · `android-native-builder`(sonnet) (총 16종)
- 신규 훅 5: `loop-tick-stop-check.sh` · `loop-budget-cap.sh` · `loop-report-emit.sh` · `pre-android-build.sh` · `pre-android-release.sh` (총 15종)
- 신규 스킬 7: loop-design / loop-run / loop-postmortem / android-compose-screen / android-gradle-module / android-appfunctions-mcp / android-release-play (총 22종)
- 신규 eval: `evals/loop/` 3종(stop-condition·grader-rubric·budget-respect) + 안드로이드 플랫폼 eval 2종 (eval 14개, loop 카테고리 추가)
- 공유DB: `009_loop_runs.sql`(loop_runs) + MCP `loop_run_record`/`loop_run_get`
- 문서: `루프엔지니어링 V9/`(방법론 5문서) · `크로스플랫폼 V9/안드로이드_네이티브_가이드.md` · 요청 템플릿 `T16_LOOP`/`T17_ANDROID_NATIVE`

## 주차별 목표 (8주)
| 주차 | 트랙 | 목표 |
|---|---|---|
| 1 | F | `009_loop_runs.sql` 적용, `loop-design`로 첫 loop spec 작성, env:dev 낮은 BUDGET 1회 실행·REPORT 확인 |
| 2 | F | `loop-tick-stop-check.sh`+`loop-budget-cap.sh` 가동, STOP 결정적 판정·예산 차단 검증, `evals/loop/*` 그린 |
| 3 | F | grade-revise 루프(`loop-grader` 루브릭) + fan-out 도입, `loop-postmortem`으로 1차 개선 |
| 4 | G | 안드로이드 모듈 골격(app/feature/core/build-logic), `android-gradle-module`·convention plugin, `pre-android-build.sh` 게이트 |
| 5 | G | `android-compose-screen`으로 첫 화면(UiState·상태 매트릭스·접근성), Compose UI·Maestro 스모크 |
| 6 | G/H | `android-native-builder` + `loop-run` 결합 → assembleDebug·lint·test 그린까지 자율 반복(트랙 H) |
| 7 | G | 온디바이스 AI(`android-appfunctions-mcp`, Gemini Nano 라우팅), 권한 최소화·프라이버시 점검 |
| 8 | G | `android-release-play`·`pre-android-release.sh`, internal→closed 단계적 출시(staged rollout) 리허설 |

## 성공지표
- **루프 자율 완주율**: 사람 개입 없이 STOP(목표 또는 상한)으로 정상 종료한 비율 ≥ <목표%> (`loop_runs.outcome`)
- **비용상한 준수율**: BUDGET 초과 없이 종료한 비율 100% (`loop-budget-cap.sh` 차단 정상 동작, `budget-respect.eval` 그린)
- **안드로이드 빌드그린 자동화율**: PR 중 `android-native-builder` 루프로 사람 수정 없이 빌드-그린 도달한 비율 ≥ <목표%>
- (보조) 거짓완료 0건 — `loop-postmortem`이 `stop_reason` 대조로 검증

## 위험·완화
| 위험 | 완화 |
|---|---|
| 무한루프·비용폭발 | **BUDGET**(토큰·비용·반복·시간) 상한 최소 2종을 STOP에 OR 결합, `loop-budget-cap.sh` exit 1로 결정적 차단 |
| 거짓 완료(false done) | **STOP**을 코드 판정으로 강제(테스트 exit code·커버리지), 완료 선언 권한을 hook/grader에 두고 실행 LLM에 두지 않음 |
| 폭주·SCOPE 이탈 | **사람 승인 게이트**: 시작 전 spec 확인, 예산 80%·위험 변경(스키마·릴리스) 시 일시정지, 머지/롤백은 사람 결정 |
| 안드로이드 서명 노출 | 서명·실기기 실행 **로컬 전용**, Codex 미러는 빌드·lint·단위 테스트까지만 |
| 릴리스 사고 | 단계적 출시(1→10→50→100%), 크래시·ANR 임계 초과 시 자동 중단/롤백 권고 |
| RN과 중복 구현 | 화면 소유권 트랙별 단일, 신규 기능은 트랙 먼저 확정·도메인 로직 KMP 공유 검토 |

## 검증
- `evals/loop/`(stop-condition·grader-rubric·budget-respect) + 안드로이드 플랫폼 eval 2종 전부 그린
- env:dev 소규모 실행 → REPORT 확인 후에만 staging 확장 (빅뱅 금지)
- 모든 루프 실행이 `loop_runs`에 적재되고 `loop-postmortem`이 주기적으로 개선·eval 후보 제출

> 참고: 방법론 `루프엔지니어링 V9/`, 안드로이드 `크로스플랫폼 V9/안드로이드_네이티브_가이드.md`, 요청 `사용자지침 V9/templates/T16_LOOP.md`·`T17_ANDROID_NATIVE.md`.
