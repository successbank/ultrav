# V9 — Claude Code · Codex 최적화 지침서

> 본문 = `V9_업그레이드_제안서.md`, 부속 = `V9_크로스플랫폼_개발제안서.md`, `루프엔지니어링 V9/`
> 본 문서는 두 도구(Claude Code, OpenAI Codex)를 **동시에** 운영할 때의 설정·역할 분담·연계 규칙.
> V9 추가: **§15 루프 엔지니어링**, **§16 안드로이드 네이티브**, **§17 Claude Code 2026 네이티브 기능**.
> 작성일: 2026-06-27 (V7 2026-05-31 기준 확장)

---

## 0. 한 줄 결론

**Claude Code = 로컬 IDE/터미널 메인 + V9 페르소나·MCP 허브** (정밀·대화·게이트)
**Codex = 클라우드 병렬 작업자** (대량 분기·격리 컨테이너 작업·CI 백그라운드)
두 도구는 **같은 리포 + 같은 규칙 파일 두 개**(`CLAUDE.md` ↔ `AGENTS.md`)를 참조하며, 공유DB·eval 게이트로 결과가 합류한다.

---

## 1. 역할 분담 (언제 무엇을)

| 상황 | 도구 | 이유 |
|---|---|---|
| 대화형 설계·페어 프로그래밍 | Claude Code | 컨텍스트·페르소나·MCP 풍부 |
| PR 1개 단위의 정밀 변경 | Claude Code | hooks·subagents로 게이트 |
| 5+ 병렬 변경(테스트 추가 일괄·문서 일괄) | Codex(클라우드) | 컨테이너 격리, 멀티 분기 |
| 외부 PR 자동 리뷰 | 둘 다(이중 검토) | 환각 교차검증 |
| 야간 리팩토링·코드 청소 | Codex 스케줄 | 인간 부재 시간 활용 |
| 디자인 시안→코드 | Claude Code(MCP 디자인) | Figma/이미지 MCP 안정 |
| Wearable/XR 네이티브 빌드 | Claude Code 로컬 | 디바이스·서명·실기 필요 |
| 보안·시크릿 다루는 작업 | Claude Code 로컬만 | Codex 컨테이너 시크릿 주입 최소화 |

원칙: **창의·정밀=Claude Code, 양·반복=Codex**.

---

## 2. 리포 루트 파일 구조 (양 도구 공통)

```
/
├── CLAUDE.md           ← Claude Code 진입점 (≤200 줄)
├── AGENTS.md           ← Codex 진입점 (≤200 줄)
├── .claude/
│   ├── rules/*.md      ← 경로 globs 별 룰
│   ├── agents/*.md     ← 서브에이전트 (V9 페르소나 매핑)
│   ├── skills/*/       ← 반복 패턴 자동화
│   ├── hooks/*.sh      ← 결정적 게이트(pre/post)
│   ├── evals/*.yaml    ← 골든 케이스 (Claude Code 네이티브 기능 아님 — **별도 러너 필요**, §2.1)
│   └── settings.json   ← hooks·permissions 등록 (MCP는 여기 아님 — 루트 `.mcp.json`)
├── .codex/
│   ├── config.toml     ← Codex CLI 설정
│   ├── skills/*/       ← Codex 스킬 (Claude와 미러)
│   └── agents/*.md     ← Codex 서브에이전트
├── .github/workflows/
│   ├── personas-eval.yml
│   ├── codex-nightly.yml
│   └── pr-review-dual.yml
└── docs/
    ├── persona-map.md  ← V9 페르소나 ↔ subagent 매핑표
    └── request-templates/  ← 사용자 지침 템플릿(별도 문서)
```

`CLAUDE.md` 와 `AGENTS.md` 는 **핵심 9개 항목**(아래 §3.1)을 똑같이 담는다. 도구별 특이사항만 분기.

### 2.1 settings.json 등록 절차와 실제 이벤트명 (Claude Code 실규격)

훅은 `.claude/settings.json`의 `hooks` 키에 아래 구조로 등록한다. **이 규격 밖의 키/이벤트명은 조용히 무시된다.**

```json
{
  "hooks": {
    "<이벤트>": [
      { "matcher": "<도구명 정규식>",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/스크립트.sh", "timeout": 60 }] }
    ]
  }
}
```

- **유효 이벤트 9종**: `PreToolUse` · `PostToolUse` · `UserPromptSubmit` · `Notification` · `Stop` · `SubagentStop` · `SessionStart` · `SessionEnd` · `PreCompact`
  (`preCommit`, `prePR`, `onTaskStart`, `onError`, `onTaskComplete`, `onLoopTick` 같은 이벤트는 **존재하지 않는다** — §4.1 매핑 참조)
- `matcher`는 도구명 매칭: `"Edit|MultiEdit|Write"`, `"Bash"` 등. `UserPromptSubmit`/`SessionStart` 등에는 matcher 생략 가능
- 훅 스크립트 규약: **stdin으로 JSON 수신**(`tool_name`, `tool_input.file_path`/`tool_input.command` 등), **exit 2 + stderr = 차단**(사유가 Claude에게 전달), exit 0 = 통과, exit 1 = non-blocking 경고
- MCP 서버는 settings.json이 아니라 **프로젝트 루트 `.mcp.json`** 에 등록 (§7.3)
- `evals/*.yaml`은 Claude Code가 직접 실행하지 않는다 — **별도 러너**(스크립트/CI, 예: `scripts/eval-runner.js`)를 구축해야 하며, 게이트로 쓰려면 PreToolUse(Bash) 훅이나 GitHub Actions에서 러너를 호출한다

---

## 3. CLAUDE.md / AGENTS.md 작성 규칙

### 3.1 두 파일 모두 포함해야 할 9개 섹션
1. **프로젝트 1문장 요약** (무엇·누구를 위해)
2. **공식 명령** (build/test/lint/typecheck/dev) — 복사붙이기 가능한 한 줄씩
3. **모노레포 경로 지도** (`apps/`, `packages/`, `services/`)
4. **테스트 정책** — 단위/계약/통합/E2E 어디에 추가
5. **커밋·PR 규칙** (Conventional Commits, 본문 형식, 리뷰어)
6. **금지 목록** (절대 하지 말 것: `--no-verify`, secrets 커밋, `any` 도입, 마이그레이션 다운 등)
7. **위임 지침** — "X 종류 작업은 subagent Y", "복잡한 탐색은 코드 검색 subagent 먼저"
8. **품질 게이트** — PR 머지 전 통과해야 할 명령 (eval, lint, typecheck, test)
9. **컨텍스트 위치** — 공유DB MCP 도구 호출 예 (검색→인용→삽입)

### 3.2 길이 규칙
- 두 파일 모두 **200줄 미만**. 넘으면 `.claude/rules/*.md` + `glob` 메타로 분리(예: `apps/mobile/**` 만 로드)
- 같은 문장 두 곳에 두지 말 것: 공통은 `docs/persona-map.md` 같은 단일 출처로 링크

### 3.3 분기 (CLAUDE.md ↔ AGENTS.md 차이)
- CLAUDE.md만: MCP 서버 목록·페르소나 호출 예
- AGENTS.md만: Codex 컨테이너 환경 변수·캐시 디렉터리·setup 스크립트 위치
- 둘 다: §3.1의 1-9

---

## 4. Hooks (결정적 게이트 — Claude Code 강력 활용)

> "100% 발생해야 하는 것은 지시문이 아니라 hook" — 환각 차단.

### 4.1 권장 Hook 목록 (V9 기존 + 신규) — 등록 이벤트는 실규격(§2.1) 기준
| Hook | 등록 이벤트 (실규격) | 동작 |
|---|---|---|
| `pre-development-search.sh` | `SessionStart` (matcher 없음) | 공유DB 유사 사례 검색 → 컨텍스트 주입 (인프라 미구축 시 fail-open) |
| `pre-edit-pii-scan.sh` | `PreToolUse` + matcher `Edit\|MultiEdit\|Write` | 시크릿·PII 정규식 검출 시 exit 2 차단 |
| `post-edit-format.sh` | `PostToolUse` + matcher `Edit\|MultiEdit\|Write` | prettier/eslint/swiftformat 자동 |
| `pre-commit-typecheck.sh` | `PreToolUse` + matcher `Bash` (`tool_input.command`에서 `git commit` 감지 시 게이트) | tsc + 영향받은 패키지 typecheck |
| `pre-pr-eval-gate.sh` | `PreToolUse` + matcher `Bash` (`gh pr create` 감지 시 게이트) | 골든 케이스 회귀 비교 (**별도 eval 러너 필요**) |
| `post-error-to-db.sh` | `PostToolUse` (도구 실패 응답 감지) | 공유DB `errors` 적재 |
| `post-task-to-db.sh` | `Stop` (응답 종료 시) | 공유DB `tasks` 결과 기록 |
| `pre-cross-platform-build.sh` | `PreToolUse` + matcher `Bash` (빌드 명령 감지) | 영향 plat 매트릭스 산정 |

> `preCommit`/`prePR` 같은 전용 이벤트는 없다. 커밋·PR 게이트는 **PreToolUse(Bash) 훅이 명령 문자열을 검사**해 exit 2로 차단하거나, git 자체의 pre-commit 훅·CI로 이관해 강제한다.

**settings.json 등록 예** (전체 규격은 §2.1):
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|MultiEdit|Write",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/pre-edit-pii-scan.sh" }] },
      { "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/pre-commit-typecheck.sh" }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|MultiEdit|Write",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-edit-format.sh" }] }
    ],
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/pre-development-search.sh" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-task-to-db.sh" }] }
    ]
  }
}
```

### 4.2 작성 원칙
- 훅은 stdin으로 JSON(`{session_id, cwd, hook_event_name, tool_name, tool_input}`)을 받는다 — `jq`로 파싱
- **차단은 exit 2 + stderr에 사유** (Claude에게 전달되어 자동 해소 시도). exit 0 = 통과, exit 1 = non-blocking 경고
- 파싱 실패·외부 인프라(공유DB 등) 부재 시 **fail-open(exit 0)** 원칙
- 60초 이상 걸리면 background로 분리하고 결과는 DB 폴링

---

## 5. Subagents (서브에이전트 ↔ V9 페르소나 매핑)

각 V9 페르소나를 **그대로 subagent로 등록**. 페르소나 정의 MD를 `.claude/agents/*.md` + `.codex/agents/*.md` 두 곳에 동기화.

### 5.1 권장 매핑
| V9 페르소나 | Claude Code subagent | Codex subagent | 주 도구 |
|---|---|---|---|
| 비판평가팀 | `critic-reviewer` | `critic-reviewer` | Read+Grep+Eval |
| QA팀 | `test-architect` | `test-architect` | Read+Test runner |
| 시뮬레이션팀 | `sim-runner`(C2 결정화) | 동일 | Sandbox 실행 |
| SRE팀 | `incident-responder` | `incident-responder` | Logs MCP |
| Trust&Safety | `safety-checker` | `safety-checker` | LLM 보조 분류 |
| DataOps | `embedding-indexer` | 동일 | DB MCP |
| Mobile Platform | `mobile-builder` | `mobile-builder` | EAS/Xcode CLI |
| iOS Native팀 | `ios-native-builder` | 시뮬레이터 빌드까지 | xcodebuild/SPM |
| Android Native팀 | `android-native-builder` | 빌드·lint·테스트 | ./gradlew |
| Desktop Platform | `desktop-builder` | 제한적(서명은 로컬) | Tauri CLI |
| Wearable팀 | `wearable-builder` | 로컬만 | Xcode/AS |
| XR/Spatial팀 | `xr-builder` | 로컬만 | Unity/Xcode |

### 5.2 호출 패턴 (Lead 에이전트가 위임)
- **탐색**: 항상 `code-explorer` 또는 `db-knowledge-searcher` 먼저 → 컨텍스트 압축 후 본 작업 에이전트 호출
- **검증**: 메인이 코드 작성 → `critic-reviewer` + `test-architect` 병렬 호출 → 둘 다 통과 시 PR
- **회귀**: PR 직전 `eval-runner`(L2) 호출 강제

### 5.3 도구 권한 최소화
- subagent마다 허용 도구 명시(`tools: [Read, Grep, Bash(npm test)]`)
- 위험 도구(`Bash(rm)`, `Bash(curl)`)는 `desktop-builder`·`incident-responder`만

---

## 6. Skills (재사용 작업 패키지)

CLAUDE.md/AGENTS.md를 비대화시키지 말고 반복 패턴은 Skill로.

### 6.1 V9 권장 Skill (양 도구 공통)
| Skill | 용도 |
|---|---|
| `prd-from-template` | 사용자 PRD 템플릿 → 작업 분해 |
| `bugfix-rca` | 오류 보고 → RCA 5-Why → 수정 PR + eval 추가 |
| `design-to-code-rn` | 디자인 스펙 → RN 컴포넌트 |
| `design-to-code-tauri` | 데스크톱 변형 |
| `migration-write` | DB 마이그레이션 안전 패턴 (위→아래 호환 강제) |
| `release-checklist` | 5+2 플랫폼 릴리스 점검 |
| `incident-postmortem` | 인시던트→템플릿 보고서→DB 적재 |
| `pr-description-from-diff` | diff → 본문 자동 작성 |
| `eval-golden-from-issue` | 재현 가능 이슈 → golden case 후보 |

### 6.2 작성 규칙
- `SKILL.md` 1장 + 보조 스크립트
- "언제 트리거되는지"를 description에 구체적으로
- Codex/Claude Code 양쪽에서 동일 동작 보장 (테스트는 양쪽 모두 통과)

---

## 7. MCP 서버 연결 (단일 진실원)

### 7.1 공통 MCP (필수)
- **공유DB MCP** (Knowledge/Tasks/Errors/Decisions — 11+ 도구)
- **GitHub MCP** (PR·이슈 읽기·쓰기)
- **Filesystem MCP** (필요 시, 양 도구 본인 도구로 충분하면 생략)

### 7.2 선택 MCP
- Figma MCP (디자인→코드)
- Sentry MCP (에러 컨텍스트)
- PostgreSQL MCP (직접 쿼리, 제한적)
- Linear/Jira MCP (티켓)
- Slack MCP (논의 검색)

### 7.3 등록
- Claude Code: **프로젝트 루트 `.mcp.json`** 의 `mcpServers` (settings.json 안의 `mcpServers`는 인식되지 않음)
- Codex: `~/.codex/config.toml` `[mcp_servers.*]`
- **토큰은 1Password CLI / `op run`** 으로 주입 (리포에 secrets 금지)

---

## 8. 모델 라우팅 (V9 본문 A2 적용)

### 8.1 두 도구 통합 라우팅
| 작업 | 모델 | 비고 |
|---|---|---|
| 단순 자동완성·포매팅 | Haiku-4-5 / GPT-5-mini | 빠르고 저렴 |
| 일반 코드 작성·리뷰 | Sonnet-4-6 / GPT-5 | 기본값 |
| 아키텍처·대규모 리팩토링·복잡한 디버깅 | Opus-4-6 / GPT-5 Pro | 비용 인지 |
| 대규모 탐색(많은 파일) | Sonnet long-context / GPT-5 large | 컨텍스트 우선 |

각 페르소나 `.md` 상단에 `default_model:` 명시. Lead 에이전트가 작업 분류 후 escalate.

### 8.2 비용 캡
- `.claude/settings.json` 에 `usage_warning_threshold`
- Codex `config.toml` `max_tokens_per_run`
- 일 한도 초과 시 FinOps 페르소나에 자동 알림 → 슬랙

---

## 9. 보안·샌드박싱

### 9.1 Claude Code (로컬)
- 권한: `Bash` 화이트리스트 (`npm`, `git`, `pnpm`, `eas`, `tauri`)
- `--dangerously-skip-permissions` 금지 (PR 자동화 외 절대)
- 파일 보호 글롭: `**/.env*`, `**/secrets/**`, `**/keys/**`

### 9.2 Codex (클라우드 컨테이너)
- 시크릿: 최소 권한 토큰만 컨테이너에 주입, expire 1h
- 네트워크: 허용 도메인 화이트리스트
- 인터넷 접근이 필요 없는 작업은 차단 모드로
- 컨테이너 산출물은 git diff로만 출력, 외부 전송 hook 차단

### 9.3 공통
- 모든 작업 종료 시 `post-task-to-db.sh` 가 누가·언제·무엇을 했는지 공유DB 감사로그(B2)에 기록
- PII/시크릿 스캔 hook은 **양 도구 모두** 강제 (Codex 컨테이너에도 동일 hook 복제)

---

## 10. Git·PR 워크플로우 (이중 검토)

### 10.1 단일 PR 흐름 (정밀)
1. 사용자 요청 → 템플릿(다음 문서 참조)으로 작성
2. Claude Code Lead → `code-explorer`로 영향 분석
3. 작업 페르소나가 변경
4. `critic-reviewer` + `test-architect` 병렬 호출
5. `pre-pr-eval-gate` 통과 → PR 생성
6. CI에서 Codex `pr-second-opinion` 자동 코멘트
7. 사람 1명 최종 승인 → 머지

### 10.2 병렬 분기 흐름 (양·반복)
- Codex 웹/CLI에 동시에 5-10개 분기 작업 위임
- 각 분기는 독립 PR, 같은 게이트 통과 필수
- 머지 충돌은 `merge-orchestrator` subagent가 분기별 우선순위로 합류

### 10.3 야간 자동화
- `codex-nightly.yml`: 의존성 업데이트, 테스트 보강, 문서 동기화
- 결과는 draft PR로만, 사람 검토 후 ready

---

## 11. 관찰성·메트릭 (V9 본문 A4 통합)

수집할 지표
- 도구별 호출 수·토큰·비용·실패율 (Claude Code vs Codex)
- subagent별 평균 호출 시간 / 실패 사유 Top 10
- eval 회귀 추세
- "재작업률" — 같은 파일을 24h 내 재수정한 비율 (높으면 지시 모호성 신호)

대시보드 카드 1개 = 1 의사결정 가능해야 함 (Grafana 패널 디자인 룰).

---

## 12. 12개 안티패턴 (피해야 할 것)

1. CLAUDE.md/AGENTS.md에 모든 룰 욱여넣기 → 200줄 초과 시 무시됨
2. "절대 ~ 하지마"를 지시문으로만 두기 → hook으로 강제
3. subagent에 모든 도구 허용
4. Codex와 Claude Code가 서로 다른 룰을 보게 둠
5. 시크릿을 컨테이너 환경변수로 평문 주입
6. eval 없이 페르소나 프롬프트만 계속 수정
7. 모델을 항상 Opus/GPT-5 Pro로 (FinOps 폭발)
8. Lead 에이전트가 직접 다 처리 (subagent 위임 안 함)
9. 병렬 분기인데 산출 위치·형식을 미정의 → 충돌
10. 한 PR에 10+ 기능 묶음
11. "테스트는 나중에" — TDD로 실패 테스트 먼저 커밋
12. 페르소나·subagent 동의어 두 곳에 정의 (drift 발생)

---

## 13. 최소 시작 체크리스트 (1일 안에 셋업)

- [ ] `CLAUDE.md`·`AGENTS.md` §3.1 9섹션 채움
- [ ] `.claude/rules/` 분리, glob 메타 부여
- [ ] V9 페르소나 5개 우선 subagent 등록 (critic / test / safety / mobile / sre)
- [ ] hooks 4개 활성화 (search / pii / format / eval-gate)
- [ ] 공유DB MCP 두 도구에 연결
- [ ] 모델 라우팅 정책 표를 `docs/model-routing.md` 에 박제
- [ ] `codex-nightly.yml`·`pr-review-dual.yml` GitHub Action 추가
- [ ] 첫 골든 케이스 1개 추가하고 양 도구로 통과 확인

---

## 14. 사용자 지침 템플릿과의 관계

본 문서는 **도구 측 설정**. 다음 문서 `V9_사용자지침_요청템플릿.md` 는 **사용자가 작성하는 요청 형식**.
양쪽 모두 같은 필드명·우선순위를 사용 → 도구가 템플릿을 안정적으로 파싱.

---

## 15. 루프 엔지니어링 (V9 신규 — 트랙 F)

> 2026년 AI 코딩의 기본기는 one-shot 프롬프팅이 아니라 **피드백 루프 설계**다. 상세: `루프엔지니어링 V9/`.

### 15.1 루프 6요소
`TRIGGER`(언제) → `SCOPE`(범위) → `ACTION`(행동) → `BUDGET`(예산 상한) → `STOP`(정지 조건) → `REPORT`(보고).
요청은 `T16_LOOP.md` 템플릿으로 작성 → `loop-design` 스킬이 loop spec(YAML) 산출 → `loop-run`이 실행.

### 15.2 에이전트·hook·skill 매핑
| 요소 | 담당 | 결정성 |
|---|---|---|
| 설계·fan-out | `loop-orchestrator` (opus) | LLM |
| 품질 채점·재작업 반송 | `loop-grader` (sonnet, Performance Outcomes) | LLM+루브릭 |
| 상한 집행 | `loop-budget-guard` (haiku) + `loop-budget-cap.sh` | 결정적 hook |
| 정지 판정 | `loop-tick-stop-check.sh` | 결정적 hook |
| 보고·적재 | `loop-report-emit.sh` → `loop_runs` | 결정적 hook |

### 15.3 안전 원칙
- **BUDGET/STOP은 반드시 결정적 hook으로** (지시문만으로 두지 말 것 — 무한루프·비용 폭발 차단).
- **머지·릴리스·시크릿·마이그레이션 down은 자율 금지** → 사람 승인 게이트.
- 루프 종료마다 `loop-postmortem`로 감사 + eval 후보 추출.

---

### 15.4 루프 2.0 — 3 운영 규율·패턴·하네스 (V9 신규)
6요소(구조)에 더해, 길게 도는 루프의 안정성을 위한 **3 운영 규율**과 패턴/하네스를 추가한다(상세: `루프엔지니어링 V9/`).

| 추가 | 담당 | 결정성 |
|---|---|---|
| 컨텍스트 위생(CONTEXT) | `loop-context-compact.sh` | 결정적 hook (exit 2=압축 요청) |
| 무진행 감지(PROGRESS) | `loop-no-progress-check.sh` | 결정적 hook (exit 1=정지) |
| 리플렉션 기억(REFLECT) | `loop-reflector`(sonnet) + `010_loop_lessons` | LLM+DB |
| 패턴 선택 | `loop-pattern-select` 스킬 | LLM |
| 하네스 배치 | `하네스_엔지니어링_가이드.md`(5계층) | 문서 |

- `onLoopTick` 권장 순서: **context-compact → no-progress → stop-check → budget-cap**.
- `loop_lessons`는 당분간 **제안용**(자동 행동 반영 금지) — `outcome_delta`로 효과 검증 후 신뢰(비평 #13).
- 자율 단계는 **control-before-autonomy 사다리**로 한 칸씩(인터랙티브 → grade-revise → 백그라운드 자율 → 다중에이전트).

---

## 16. 안드로이드 네이티브 (V9 신규 — 트랙 G, RN 병행)

> 기존 RN(Mobile Platform팀)은 유지. Kotlin/Compose 네이티브는 전담 트랙으로 추가. 상세: `크로스플랫폼 V9/안드로이드_네이티브_가이드.md`.

### 16.1 역할 분담
| 작업 | 도구 | 비고 |
|---|---|---|
| Compose 화면·Kotlin 로직 | Claude Code 로컬 + `android-native-builder` | `./gradlew` 빌드·lint·test |
| 빌드-그린까지 자율 반복 | `android-native-builder` + `loop-run` | 실패→수정 루프 |
| 서명·실기기·Play 업로드 | **Claude Code 로컬만** | Codex 컨테이너 금지 |
| 대량 모듈 보일러플레이트 | Codex 병렬 | 서명 불필요분만 |

### 16.2 게이트·온디바이스
- 모든 안드로이드 PR: `pre-android-build.sh`(ktlint/detekt/lintDebug) + `./gradlew test` + Maestro.
- 릴리스: `pre-android-release.sh`(AAB·서명·targetSDK·권한 최소화·개인정보처리방침).
- 온디바이스 AI: `OnDevice_AI팀` + `android-appfunctions-mcp`(앱을 온디바이스 MCP 서버화) + Gemini Nano. 민감정보는 단말 밖으로 보내지 않음.

---

## 17. Claude Code 2026 네이티브 기능 활용

| 기능 | 의미 | V9 활용 |
|---|---|---|
| **Dynamic Workflows** | 리드가 한 세션에서 수십~수백 병렬 서브에이전트로 fan-out (오케스트레이션은 컨텍스트 아닌 스크립트 변수) | `loop-orchestrator`의 fan-out 루프 |
| **Performance Outcomes** | 별도 grader가 결과를 루브릭으로 채점, 미달 시 재작업 반송 | `loop-grader` = grade-revise 루프 |
| **Completion conditions** | 조건 충족까지 여러 턴 자율(경과시간·턴·토큰 추적) | 루프 `STOP` 조건 |
| **Hooks** | 이벤트 기반 결정적 스크립트(환각 불가) | BUDGET/STOP/포맷/PII/빌드 게이트 |
| **Skills** | 점진적 공개로 필요할 때만 로드 | loop/android 스킬로 `CLAUDE.md` 경량 유지 |
| **Background forks** | 백그라운드 실행 후 결과 메시지 수신 | 야간 자율 루프 + `codex-nightly.yml` |

원칙은 그대로: **결정적인 것은 hook, 반복은 skill, 위임은 subagent, 자율은 BUDGET/STOP 안에서.**
