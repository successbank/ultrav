# 루프엔지니어링 V9

> AI 코딩 에이전트의 "계획→코드변경→결과관찰→수정" 피드백 루프를 **설계·운영·개선**하는 V9 정식 방법론.
> V9 진화: 루프를 **하네스(harness)** 안에 넣고, **3 운영 규율(CONTEXT·PROGRESS·REFLECT)** 과 **패턴 라이브러리**로 더 오래·안전하게 돌린다.

## 왜 V9의 핵심 엔진인가
V6는 같은 실수를 두 번 안 하게 했고(eval 회귀), V7은 더 싸고 빠르게 학습하게 했다(라우팅·검색), V8은 루프를 6요소로 정식화했다. V9은 한 단계 더 나아가 **사람이 매번 프롬프트하지 않아도 에이전트가 목표에 도달할 때까지 스스로, 오래, 안전하게 돌게** 만든다. 2026년 들어 핵심 기술은 "좋은 프롬프트 한 번"이 아니라 "좋은 루프(와 그 루프를 감싼 하네스)를 설계하는 것"으로 이동했다. 슬로건: **이제 에이전트에게 프롬프트하지 말고, 에이전트를 프롬프트하는 루프를 설계하라.**

## 파일 목록
| 파일 | 내용 |
|---|---|
| `README.md` | 본 개요 + 5분 시작법 |
| `루프엔지니어링_방법론.md` | 본편. 정의·성숙도(프롬프트→컨텍스트→하네스)·계보·6요소·**3 운영 규율(V9)**·루프 유형·Claude Code/`goal` 매핑·자율성 사다리·안티패턴·V9 연결 |
| `루프_패턴_라이브러리.md` | **(V9 신규)** ReAct/Plan-Execute/Evaluator-Optimizer/Reflexion/fan-out/조합형 — 패턴 선택 |
| `하네스_엔지니어링_가이드.md` | **(V9 신규)** 하네스 5계층 ↔ V9 자산 매핑, 30분 적용 레시피 |
| `루프_카탈로그.md` | 즉시 재사용 루프 **8종**(①~⑥ + ⑦Reflexion·⑧멀티에이전트, 각 6요소 표 + loop spec YAML) |
| `루프_설계_체크리스트.md` | 새 루프 설계 점검표(6요소+3규율) + 위험한 루프 경고 |
| `완료조건_가이드.md` | STOP/Completion conditions 심화 + 무진행·`/goal` + grade-revise 루브릭 + 거짓 완료 방지 |

## 5분 시작법
1. `루프엔지니어링_방법론.md`의 **6요소 해부도** + **3 운영 규율(CONTEXT·PROGRESS·REFLECT)** 을 읽는다.
2. `루프_패턴_라이브러리.md`(또는 `loop-pattern-select`)로 루프 **형태**를 고른다.
3. `루프_카탈로그.md`에서 목적에 맞는 루프 1종을 골라 loop spec YAML을 복사, repo·예산·정지조건만 바꾼다.
4. `루프_설계_체크리스트.md`로 6요소+3규율이 빠짐없는지, STOP이 결정적인지 확인한다.
5. `loop-design` → `loop-run` 스킬로 실행, 도중 `loop-reflect`로 교훈을 적고, 종료 후 `loop-postmortem`으로 개선한다.

## 연결 지점
- 페르소나: `개발팀 페르소나 V9/dot-claude/personas/루프엔지니어팀.md`
- 에이전트: `loop-orchestrator` / `loop-grader` / `loop-budget-guard` / `loop-reflector`(V9)
- 훅: `loop-tick-stop-check.sh` / `loop-budget-cap.sh` / `loop-report-emit.sh` / `loop-no-progress-check.sh`(V9) / `loop-context-compact.sh`(V9)
- 스킬: `loop-design` / `loop-run` / `loop-postmortem` / `loop-reflect`(V9) / `loop-pattern-select`(V9)
- eval: `.claude/evals/loop/*.eval.yaml` (stop-condition·grader-rubric·budget-respect + V9 no-progress-stop·reflection-memory·context-compaction)
- 공유DB: `db/schema/009_loop_runs.sql`(loop_runs) + `010_loop_lessons.sql`(loop_lessons, V9)
