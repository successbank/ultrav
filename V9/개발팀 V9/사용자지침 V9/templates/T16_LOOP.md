TYPE: LOOP
SCOPE: 
PRIORITY: 
TARGET_DATE: 

## 1. 목표 (GOAL)
<무엇을 "스스로 돌려서" 달성할지 한 줄. 결과 상태로 기술 — 예: "결제 모듈 CI가 전부 green이 될 때까지">

## 2. 루프 6요소
- **TRIGGER**: <루프 시작 신호 — 수동 호출 / CI 실패 / 스케줄 / 이슈 라벨>
- **SCOPE**: <허용 변경 범위 — repo·디렉터리·파일 글롭, 건드리면 안 되는 경로>
- **ACTION**: <매 tick에 할 일 — 변경 → 검증 명령(테스트/lint/build) → 관찰 → 수정>
- **BUDGET**: 토큰 상한 <예: 200k> · 반복 상한 <예: 10> · 비용 상한 <예: $5> · 시간 상한 <예: 60min>
- **STOP**: <완료조건 — OR 결합. 예: 모든 CI green / 반복 10회 / $5 / 60분 / 사람 중단> (결정적 판정, hook으로 집행)
- **REPORT**: 수신자 <예: #dev-loop, 담당자> · 형식 <요약+stop_reason+반복수+비용, loop_runs 적재>

## 2-1. 루프 패턴 (V9) — `loop-pattern-select`
- 패턴: <ReAct / Plan-Execute / Evaluator-Optimizer / Reflexion / fan-out / 조합형>

## 2-2. 3 운영 규율 (V9, 권장)
- **CONTEXT**: tick 컨텍스트 예산 <예: 120k> 초과 시 요약·외부화(`loop-context-compact.sh`)
- **PROGRESS**: 무진행 <예: 3>tick 시 STOP(`loop-no-progress-check.sh`)
- **REFLECT**: 실패 교훈을 `loop_lessons`에 적재·주입(`loop-reflector`)

## 3. grade-revise (해당 시)
- 채점자: `loop-grader`
- 루브릭(이진·반증가능): <예: "신규 테스트가 실제 미커버 분기를 커버 + 전부 통과 + 기존 테스트 삭제/약화 없음">
- 통과 계약: `{score, pass, feedback}` — pass=false면 feedback과 함께 ACTION으로 반송

## 4. 사람 승인 게이트
- [ ] 시작 전: loop spec(6요소) 사람 확인 후 실행
- [ ] 중간: <예산 80% 도달 / 위험 변경(스키마·릴리스) 시> 일시정지·승인
- [ ] 종료 후: REPORT 검토, 머지/롤백은 사람이 결정 (자동 머지 여부 명시)

## 5. 안전 한계 (필수)
- env: <dev|staging — 첫 실행은 dev 권장>
- 금지: 테스트 삭제로 green 위조, BUDGET 우회, SCOPE 밖 변경, 프로덕션 직접 변경
- 상한 안전망: 목표 미달이어도 반복·토큰·비용·시간 상한이 종료를 보장

## 6. 요청
- [ ] `loop-pattern-select`로 루프 패턴 선택(V9)
- [ ] `loop-design` 스킬로 6요소 loop spec(YAML) 생성 → 사람 확인
- [ ] `loop-run` 스킬로 실행 (`loop-orchestrator` fan-out, tick마다 `loop-grader` 채점, 실패 시 `loop-reflect`)
- [ ] `loop-tick-stop-check.sh` + `loop-budget-cap.sh` + `loop-no-progress-check.sh`로 STOP/BUDGET/무진행 결정적 집행
- [ ] tick 경계 `loop-context-compact.sh`로 컨텍스트 위생(V9)
- [ ] 종료 시 `loop-report-emit.sh` REPORT 발행 + `loop_runs` 적재
- [ ] `loop-postmortem`으로 거짓완료 여부·개선점·eval 후보 도출

## 7. 수용기준
- [ ] STOP이 결정적(코드 판정)이고 상한이 최소 2종 + 사람 개입 OR로 포함됨
- [ ] 종료 사유(`stop_reason`)와 비용·반복수가 `loop_runs`에 기록됨
- [ ] 거짓완료 없음(완료 판정은 hook/grader가 수행, 실행 LLM이 아님)

> 참고: 방법론·카탈로그·완료조건 심화는 `루프엔지니어링 V9/` 참조. 흐름은 **loop-design → loop-run → loop-postmortem**.
