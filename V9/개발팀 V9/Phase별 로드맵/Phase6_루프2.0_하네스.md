# Phase 6 — 루프 엔지니어링 2.0 · 하네스 (V9, 1~1.5개월)

> 선행조건: **Phase 5 완료**(루프 6요소 정식화 · loop-orchestrator/grader/budget-guard · 009_loop_runs 가동). Phase 6은 "정식화된 루프"를 "하네스 등급 운영"으로 끌어올린다.

## 채택 트랙
- **트랙 F⁺ — 루프 엔지니어링 2.0**: 6요소(구조)에 **3 운영 규율(CONTEXT·PROGRESS·REFLECT)** + **패턴 라이브러리** + **하네스 5계층** 을 더한다.

## 산출 (V8 → V9 증분)
- 에이전트 +1: `loop-reflector`(sonnet, Reflexion 자기성찰) → 총 17
- 훅 +2: `loop-no-progress-check.sh` · `loop-context-compact.sh` → 총 17
- 스킬 +2: `loop-reflect` · `loop-pattern-select` → 총 24
- eval +3: `evals/loop/` no-progress-stop · reflection-memory · context-compaction → loop 6골든
- 공유DB +1: `010_loop_lessons.sql`(에피소드 메모리) + MCP `loop_lesson_record`/`loop_lesson_search`
- 문서 +2: `루프_패턴_라이브러리.md` · `하네스_엔지니어링_가이드.md` (+ 방법론·카탈로그·체크리스트·완료조건 보강)
- 템플릿: `T16_LOOP` 확장(패턴 선택 + 3규율)

## 주차별 목표 (5주)
| 주차 | 규율/항목 | 목표 |
|---|---|---|
| 1 | PROGRESS | `loop-no-progress-check.sh` 가동, 지표 델타 기반 STOP `no_progress_ticks` 적용, `no-progress-stop.eval` 그린 |
| 2 | CONTEXT | `loop-context-compact.sh` 가동(tick 컨텍스트 예산), 플랜·누적치 외부화(변수/DB) 강제, `context-compaction.eval` 그린 |
| 3 | REFLECT | `010_loop_lessons` 적용, `loop-reflector`로 실패 교훈 적재·시작 주입, `reflection-memory.eval` 그린 |
| 4 | 패턴·하네스 | `loop-pattern-select`로 패턴 선택 표준화, 카탈로그 ⑦⑧ 시범 실행, 하네스 5계층으로 자산 점검 |
| 5 | 통합·사다리 | fan-out+grade-revise+reflect 조합 루프 1건 완주, control-before-autonomy 사다리 한 칸 상승, `loop-postmortem`로 교정 |

## 성공지표
- **무진행 조기종료율**: 상한 도달 전 `no_progress`로 종료한 비율 ↑ (낭비 tick 감소, `loop_runs.stop_reason`)
- **교훈 재사용률**: 주입된 `loop_lessons.reuse_count` 증가 + 동일 실패 재발 감소
- **컨텍스트 위생 준수**: tick 컨텍스트 예산 초과 시 압축 동작 100% (`context-compaction.eval` 그린)
- **거짓완료 0건 유지**(계승) — 완료 판정은 hook/grader, postmortem이 `stop_reason` 대조

## 위험·완화
| 위험 | 완화 |
|---|---|
| REFLECT 메모리 오염(틀린 교훈) | 행동가능·일반화 교훈만, 중복 억제(`reuse_count`), postmortem이 `outcome_delta`로 효과 검증·폐기 |
| 무진행 오판(개선 중 조기 종료) | 무진행 상한 보수적(기본 3) + 사람 게이트, 지표는 결정적 델타만 |
| 컨텍스트 압축 핵심 유실 | 요약은 외부 상태(파일/DB) 병행, 원시는 `loop_runs` 보존 |
| 하네스 복잡도 | 5계층은 기존 자산 재배치(신규 인프라 최소), 드롭인 시 무관 계층 비활성 |

## 검증
- `evals/loop/` 6골든(stop-condition·grader-rubric·budget-respect + no-progress-stop·reflection-memory·context-compaction) 전부 그린
- env:dev 소규모 실행 → REPORT·`loop_runs`·`loop_lessons` 확인 후에만 확장
- 자율성 사다리(`루프엔지니어링_방법론.md` §9)를 한 칸씩 — 동시 다단계 활성 금지

> 참고: 방법론 `루프엔지니어링 V9/`, 비평·미해결 `검증_회의_비평 V9/`.
