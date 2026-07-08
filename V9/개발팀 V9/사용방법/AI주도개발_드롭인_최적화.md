# AI 주도 개발 — 드롭인 & 최적화 가이드 (V9)

> 목적: V9 시스템을 **실제 개발 프로젝트에 올리고(드롭인)**, Claude Code에 **"V9 시스템을 현재 개발에 맞게 최적화"** 라고 요청해 프로젝트에 맞춰 다듬은 뒤, **AI(에이전트)가 루프로 주도하는 개발**을 시작한다.
> 대상: 모든 Git 리포(웹/서버/안드로이드 네이티브/크로스플랫폼 무관).
> 소요: 드롭인 5~15분 + 최적화 대화 10~20분.

---

## 0. 3단계 큰 그림

```
[1] 드롭인        → V9 자산을 리포에 설치 (install-to-project.sh)
[2] 최적화        → Claude Code에게 "현재 개발에 맞게 최적화" 요청 (이 리포 전용으로 다듬기)
[3] 루프 주도 개발 → loop-design → loop-run → grade-revise → report (사람은 게이트만)
```

핵심 사고 전환: **에이전트에게 매번 프롬프트하지 말고, 에이전트를 굴리는 "루프"를 설계하라.** (트랙 F 루프 엔지니어링)

---

## 1. 드롭인 (설치)

```bash
export V9_HOME="/Users/successbank/Library/CloudStorage/Dropbox/claude_cowork/V9/개발팀 V9"
export TARGET_REPO="/path/to/내프로젝트"

bash "$V9_HOME/사용방법/install-to-project.sh" "$TARGET_REPO" standard
```

설치 결과(요지): `CLAUDE.md`, `.claude/{personas,agents,skills,hooks,evals,settings.json}`, `.github/workflows/`, `AGENTS.md`, `.codex/`, `docs/request-templates/T1~T18`.
자세한 설치 옵션(minimal/standard/shared)·검증은 `Claude_Code_적용가이드.md` 참조.

---

## 2. 최적화 — Claude Code에게 시키는 한 문장

대상 리포에서 Claude Code를 켠 뒤 그대로 붙여넣는다:

```
> V9 시스템을 현재 개발에 맞게 최적화해줘.
>  - 이 리포의 스택/빌드/테스트 명령을 감지해 CLAUDE.md(§2 명령, §3 모노레포 지도)를 실제와 일치시켜줘
>  - 이 프로젝트와 무관한 페르소나는 status: standby 로 내려주고, 필요한 팀만 active 로
>  - 사용할 플랫폼 트랙을 골라줘 (안드로이드 네이티브? RN? 웹? 데스크톱?) — 안 쓰는 빌드 hook은 글롭에서 빼줘
>  - 모델 라우팅을 이 리포 규모에 맞게(저난도 haiku / 기본 sonnet / 아키텍처 opus) 설정해줘
>  - 첫 loop spec 1개를 docs/loops/ 에 만들어줘 (가장 자주 할 반복 작업 기준)
>  - 변경은 diff로 먼저 보여주고, 내 승인 후 적용해줘
```

### 2.1 Claude Code가 수행하는 최적화 체크리스트

- [ ] **스택 감지**: `package.json`/`build.gradle(.kts)`/`pyproject.toml` 등에서 build·test·lint·typecheck 명령 추출 → `CLAUDE.md` §2 갱신
- [ ] **모노레포 매핑**: 실제 `apps/`·`packages/`·`services/`(또는 안드로이드 `app/feature/core`)로 §3 교정
- [ ] **페르소나 가지치기**: 무관 팀 `status: standby`, 핵심 팀만 `active` (32팀 전부 켜지 말 것)
- [ ] **플랫폼 트랙 선택**: 안드로이드 네이티브면 `android-native-builder` + `pre-android-build.sh` 활성, RN/웹 hook은 글롭에서 제외
- [ ] **hook 연결**: `settings.json`의 이벤트↔hook을 실제 경로 글롭으로 매핑(`apps/android-native/**` 등)
- [ ] **모델 라우팅**: `docs/model-routing.md`에 리포 규모 반영
- [ ] **첫 루프**: 가장 잦은 반복 작업(예: CI 그린, 테스트 보강)을 6요소 loop spec으로 `docs/loops/`에 생성
- [ ] **안전 점검**: BUDGET/STOP 기본값과 사람 승인 게이트 위치 확정

> 결정적이어야 하는 규칙은 지시문이 아니라 **hook**으로 박아라(환각 방지). 반복 패턴은 **skill**로 패키징해 `CLAUDE.md`를 200줄 이하로 유지.

---

## 3. 루프 주도 개발 (AI 주도)

### 3.1 루프 한 번 설계하기 (loop-design)

`T16_LOOP.md` 템플릿 또는 다음 형태의 loop spec(YAML)을 작성:

```yaml
goal: "열린 PR의 CI 실패를 green 될 때까지 자동 수정"
trigger: on_ci_failure            # 또는 every_15m / on_pr_comment
scope: "내가 연 PR, repo=this only"
action: ["테스트 실행", "lint 수정", "최소 코드 수정", "재실행"]
budget: { max_iterations: 10, max_tokens: 80000, max_cost_usd: 5, max_minutes: 30 }
stop: ["모든 체크 green", "10회 반복", "$5 소진"]
report: { to: "PR 코멘트 + 공유DB loop_runs", format: "요약 + diff 링크" }
human_gate: "PR 머지는 사람 승인"   # 자율 실행해도 머지는 사람
```

### 3.2 루프 실행 (loop-run)

`loop-orchestrator`가 spec을 받아:
1. **TRIGGER** 충족 시 시작 → 필요 시 fan-out으로 병렬 서브에이전트 분배(Dynamic Workflows)
2. 매 tick **ACTION** 수행 → 결과를 `loop-grader`가 루브릭으로 채점
3. 미달이면 "다시 수정"으로 반송(grade-revise / Performance Outcomes)
4. **loop-budget-guard** + `loop-tick-stop-check.sh`가 매 tick **BUDGET/STOP** 결정적 검사
5. 종료 시 `loop-report-emit.sh`가 **REPORT** + `loop_runs` 적재

### 3.3 사람의 역할 = 게이트

자율로 돌되, **머지·릴리스·시크릿·마이그레이션 down**은 사람 승인. 나머지(탐색·수정·테스트·반복)는 에이전트가 주도.

---

## 4. 안드로이드 네이티브를 AI 주도로 만드는 예시

```
> T17_ANDROID_NATIVE 로 작업: 설정 화면을 Compose로 추가.
> 온디바이스 요약은 Gemini Nano 사용, 빌드-그린까지 loop-run 으로 자율 반복해줘.
```

흐름: `android-compose-screen`(스킬) → `android-native-builder`가 `./gradlew :app:assembleDebug lintDebug test` + Maestro 스모크 → 실패 시 loop로 그린까지 반복 → `pre-android-release.sh` 게이트 → 사람 승인 후 Play 트랙 승급(`android-release-play`).

---

## 5. 최소 체크리스트 (드롭인 → 첫 루프)

- [ ] `install-to-project.sh ... standard` 완료, `verify.sh` 통과
- [ ] Claude Code에서 "V9 시스템을 현재 개발에 맞게 최적화" 실행 + diff 승인
- [ ] `CLAUDE.md` §2/§3가 실제 리포와 일치, 200줄 이하
- [ ] 무관 페르소나 standby, 플랫폼 트랙 1개 선택
- [ ] 첫 loop spec 1개 `docs/loops/`에 존재, BUDGET/STOP 명시
- [ ] 사람 승인 게이트(머지/릴리스) 위치 확인
- [ ] 첫 루프 1회 완주 → `loop_runs`에 기록 확인

---

## 6. 자주 막히는 곳

| 증상 | 해결 |
|---|---|
| 루프가 안 멈춤 | `STOP`이 모호. `loop-tick-stop-check.sh`로 결정적 조건화(체크 green/반복수/비용) |
| 비용 급증 | `BUDGET` 상한 + `loop-budget-cap.sh` 활성, fan-out 폭 제한 |
| grader가 다 통과시킴 | grader 모델 분리, 루브릭 구체화, 결정적 hook 병행, `loop-postmortem`로 감사 |
| 안드로이드 빌드 hook 안 돎 | `settings.json` 글롭이 `apps/android-native/**`(실제 경로)인지 확인, `chmod +x .claude/hooks/*.sh` |
| 페르소나 너무 많아 산만 | 최적화 단계에서 무관 팀 `standby`, 핵심 5~8팀만 active |

---

## 7. 다음 단계

1. `루프엔지니어링 V9/루프_카탈로그.md`에서 재사용 루프 6종 가져다 쓰기
2. `Phase별 로드맵/Phase5_루프_안드로이드.md`로 단계 확장
3. Codex 야간 루프(`codex-nightly.yml`)와 결합해 사람 부재 시간 활용
