# Claude Code에 V9 적용하기 — 단계별 가이드

> 대상: V9 폴더(`/Users/.../V9/개발팀 V9`)를 실제 개발 프로젝트의 Claude Code에 설치·연결한다.
> 소요: 표준 옵션 약 15분. 최소 옵션 5분.

---

## 0. 사전 준비 (1분)

```bash
# 1) Claude Code 설치 확인
claude --version

# 2) 환경 변수 준비 (예시)
export V9_HOME="/Users/successbank/Library/CloudStorage/Dropbox/claude_cowork/V9/개발팀 V9"
export TARGET_REPO="/Users/successbank/code/내프로젝트"   # 적용할 프로젝트 루트
export V7_API="http://localhost:8787"     # 공유DB 인프라 V2 식별자 — 그대로 유지
export V7_TOKEN="dev-token-$(uuidgen)"
```

V9 폴더 위치는 `INDEX.md`가 있는 폴더입니다. 적용 대상 프로젝트는 어떤 리포든 됩니다 (Git 리포 권장).

---

## 1. 설치 옵션 3가지 (어떤 게 맞는지 먼저 선택)

| 옵션 | 누구에게 | 장점 | 단점 |
|---|---|---|---|
| **A. 최소 (한 프로젝트)** | 우선 한 곳에서 써보고 싶을 때 | 5분, 격리, 안전 | 다중 프로젝트면 중복 |
| **B. 표준 (모노레포 통합)** | 메인 프로젝트로 정착시킬 때 | hook·eval 자동 가동, CI 통합 | 초기 15분 |
| **C. 공유 (다중 프로젝트)** | 회사 여러 리포에 동시 적용 | 단일 진실원, 업데이트 1회 | symlink/플러그인 관리 필요 |

→ 처음이라면 **A. 최소부터** 권장.

> 신규 V9: 루프 엔지니어링 + 안드로이드 네이티브 트랙은 `AI주도개발_드롭인_최적화.md` 참조.

---

## 2. 옵션 A — 최소 설치 (5분)

### 2.1 자동 설치 스크립트
```bash
cd "$V9_HOME/도구설정 V9"
bash install-to-project.sh "$TARGET_REPO" minimal
```

### 2.2 수동으로 했을 때 만들어지는 결과

> V9 소스 폴더는 숨김 폴더 방지를 위해 `dot-claude/`·`dot-codex/`·`dot-github/`로 개명되어 보관된다. **설치 시 각각 `.claude/`·`.codex/`·`.github/`로 변환**되어 복사된다.

```
$TARGET_REPO/
├── CLAUDE.md                 ← 진입점 (≤200줄)
├── .mcp.json                 ← MCP 서버 등록 (프로젝트 루트, §5)
├── .claude/                  ← 소스는 dot-claude/ (설치 시 .claude/로 변환)
│   ├── settings.json         ← hooks·권한 (MCP는 여기 아님)
│   ├── personas/             ← 확장 16팀 (핵심 10팀 정본은 Ultra 프로젝트 .claude/personas/)
│   ├── agents/               ← 서브에이전트 18 (.md)
│   ├── skills/               ← 스킬 28 (SKILL.md)
│   ├── hooks/                ← 셸 스크립트 19 (실행 권한 부여됨)
│   └── evals/                ← 골든 케이스 20개 (loop 포함) — 별도 러너 필요(§6)
└── docs/request-templates/   ← T1~T18 사용자 요청 템플릿
```

### 2.3 적용 후 첫 검증
```bash
cd "$TARGET_REPO"
claude               # Claude Code 진입
> /agents            # 서브에이전트 18개 나오면 성공
> /mcp               # MCP 서버 연결 상태 (.mcp.json 등록분 — 공유DB 미구축 시 생략)
```

**스킬 검증**: Claude Code에 `/skills` 같은 목록 명령은 없다. 스킬은 다음 두 방식으로 동작한다:
1. **자동 트리거** — 각 `SKILL.md` frontmatter의 `description`에 맞는 요청이 오면 Claude가 스스로 로드 (예: 버그 보고 → `bugfix-rca` 자동 발동)
2. **개별 호출** — 스킬 이름을 슬래시 커맨드처럼 직접 입력 (예: `/bugfix-rca`, `/prd-from-template`)

파일 수 확인은 셸에서:
```bash
ls .claude/skills/*/SKILL.md | wc -l   # 28이면 성공
```

---

## 3. 옵션 B — 표준 설치 (모노레포 통합, 15분)

### 3.1 V9 폴더 복사 + 추가 조립
```bash
cd "$V9_HOME/도구설정 V9"
bash install-to-project.sh "$TARGET_REPO" standard
```

이 옵션은 위 결과에 더해:
- `.github/workflows/` 4개 (eval / nightly / dual / cross-platform) 복사
- `AGENTS.md` Codex용 진입점 복사
- `apps/`·`packages/`·`services/` placeholder 디렉터리 생성 (`크로스플랫폼 V9/모노레포_구조.md` 기준)
- `package.json` scripts 섹션에 `eval`, `typecheck`, `lint` 등 추가 제안 출력

### 3.2 ~ 3.4 공유DB·eval-runner — 외부 인프라 옵션 (미구축 시 비활성)

> ⚠️ 아래 3.2~3.4와 §6의 eval 항목은 **공유DB 인프라 V2 + 별도 eval 러너가 구축된 경우에만** 해당한다. 미구축 상태에서는 건너뛴다 — 관련 훅은 fail-open(exit 0)으로 조용히 통과하며, Claude Code 자체 기능(에이전트·스킬·훅)은 공유DB 없이 정상 동작한다.

#### 3.2 (옵션) 공유DB 서버 띄우기
```bash
cd "$V9_HOME/공유DB 인프라 V2/db"
# .env 작성
echo "OPENAI_API_KEY=sk-..." > .env
docker compose up -d
# 스키마 적용 (V1 마이그레이션 후 V2 적용)
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/002_pgvector.sql
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/003_devices.sql
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/004_sync_oplog.sql
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/005_audit_log.sql
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/006_env_namespace.sql
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/007_usage_tracking.sql
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/008_rbac.sql
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/009_loop_runs.sql   # 루프 실행 기록(loop_runs)
psql postgres://v7:v7secret@localhost:5432/v7 -f schema/010_loop_lessons.sql # 루프 교훈(loop_lessons, V9)
```
> 공유DB 인프라 V2의 DB 사용자/이름(`v7`)은 인프라 식별자라 그대로 둡니다 (폴더 V9 전환과 무관).

#### 3.3 (옵션) MCP 서버 빌드·기동 (요지)
```bash
cd "$V9_HOME/공유DB 인프라 V2/mcp-server"
pnpm install && pnpm build && pnpm start &
```

#### 3.4 (옵션) 환경 변수를 영구화
```bash
echo "export V7_API=http://localhost:8787"      >> ~/.zshrc
echo "export V7_TOKEN=<...>"                    >> ~/.zshrc
echo "export OPENAI_API_KEY=<...>"              >> ~/.zshrc
source ~/.zshrc
```

---

## 4. 옵션 C — 공유 설치 (여러 프로젝트 동시, 30분)

### 4.1 V9을 Claude Code "사용자 설정" 위치에 정착
```bash
mkdir -p ~/.claude
# 소스 폴더명은 dot-claude (설치·링크 시점에 .claude 위치로 연결)
ln -s "$V9_HOME/개발팀 에이전트 V9/dot-claude/agents"  ~/.claude/agents
ln -s "$V9_HOME/개발팀 에이전트 V9/dot-claude/skills"  ~/.claude/skills
ln -s "$V9_HOME/개발팀 에이전트 V9/dot-claude/hooks"   ~/.claude/hooks
```

이 방식은 모든 프로젝트에서 V9 페르소나·스킬을 공유합니다. **프로젝트별로는 `CLAUDE.md`와 `settings.json`만 두면 됩니다.**

### 4.2 (선택) Claude Code 플러그인으로 패키징
`.claude/marketplace.json`을 만들어 사내 git URL을 등록하면 `/plugin install v9` 한 줄로 설치 가능. 자세한 방법은 [docs.claude.com](https://docs.claude.com)에서 plugin 섹션 참조.

---

## 5. CLAUDE.md / settings.json 핵심 채움 (옵션 공통)

설치 스크립트가 자동으로 채우지만, 수동 확인이 필요한 부분:

### CLAUDE.md (≤200줄 권장)
- §1 프로젝트 한 줄 — **본인 프로젝트로 교체**
- §3 모노레포 지도 — 실제 폴더와 일치하는지 확인
- §9 컨텍스트 위치 — V9 MCP 도구명 그대로

### .claude/settings.json (실규격)

> ⚠️ Claude Code는 이 규격 밖의 키/이벤트를 **조용히 무시**한다. `mcpServers`(settings.json 내), `fileProtect`, `preCommit`/`prePR`/`onTaskStart`/`onError`/`onTaskComplete` 이벤트는 **존재하지 않는다.**

```json
{
  "permissions": {
    "allow": ["Bash(pnpm:*)", "Bash(git:*)"],
    "deny": [
      "Bash(rm -rf:*)", "Bash(sudo:*)",
      "Read(./.env*)", "Edit(./.env*)",
      "Read(./secrets/**)", "Edit(./secrets/**)",
      "Read(./keys/**)", "Edit(./keys/**)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|MultiEdit|Write",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/pre-edit-pii-scan.sh" }] },
      { "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/pre-commit-typecheck.sh" }] },
      { "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/pre-pr-eval-gate.sh" }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|MultiEdit|Write",
        "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-edit-format.sh" }] },
      { "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-error-to-db.sh" }] }
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

**구버전 예시 → 실규격 매핑**
| 구버전 (무효) | 실규격 |
|---|---|
| `preToolUse:Edit` | `PreToolUse` + matcher `Edit\|MultiEdit\|Write` |
| `postToolUse:Edit` | `PostToolUse` + matcher `Edit\|MultiEdit\|Write` |
| `preCommit` | `PreToolUse` + matcher `Bash` — 스크립트가 stdin JSON의 `tool_input.command`에서 `git commit` 감지 시 게이트 (또는 git pre-commit 훅/CI로 이관) |
| `prePR` | `PreToolUse` + matcher `Bash` — `gh pr create` 감지 시 게이트 |
| `onTaskStart` | `SessionStart` |
| `onError` | `PostToolUse` — 도구 실패 응답 감지 |
| `onTaskComplete` | `Stop` |
| `permissions.fileProtect` | `permissions.deny`에 `Read(...)`·`Edit(...)` 글롭 |

**훅 스크립트 규약**: stdin으로 JSON 수신(`{session_id, cwd, hook_event_name, tool_name, tool_input}`) → `jq`로 파싱. **차단 = exit 2 + stderr에 사유** (Claude에게 전달), 통과 = exit 0, exit 1 = non-blocking 경고. 공유DB 등 외부 인프라 부재·파싱 실패 시 fail-open(exit 0).

### .mcp.json (프로젝트 루트 — MCP 등록은 여기)

MCP 서버는 settings.json이 아니라 **프로젝트 루트의 `.mcp.json`** 에 등록한다:

```json
{
  "mcpServers": {
    "sharedb": {
      "command": "node",
      "args": ["./node_modules/.bin/v7-sharedb-mcp"],
      "env": { "V7_API": "${V7_API}", "V7_TOKEN": "${V7_TOKEN}" }
    }
  }
}
```
> `sharedb`는 외부 인프라 옵션(§3.2~3.4)이다. 공유DB 미구축 시 이 항목을 넣지 않는다.

훅 파일 실행 권한 확인:
```bash
chmod +x .claude/hooks/*.sh
```

---

## 6. 설치 후 검증 (필수)

```bash
cd "$TARGET_REPO"
bash "$V9_HOME/도구설정 V9/verify.sh"
```

검증 항목 (스크립트가 자동 출력):
- [ ] CLAUDE.md 존재 + 200줄 이하
- [ ] .claude/agents/*.md 18개 이상
- [ ] .claude/skills/*/SKILL.md 28개 이상
- [ ] .claude/hooks/*.sh 모두 실행 권한 (19종)
- [ ] .claude/settings.json JSON 문법 OK + hooks 이벤트명이 실규격(§5) 9종 이내
- [ ] .claude/evals/ 20개 (loop 카테고리 포함)
- [ ] `claude /agents` 출력에 hybrid-searcher / critic-reviewer / loop-orchestrator 등장

**외부 인프라 옵션 (미구축 시 비활성 — 건너뜀):**
- [ ] sharedb MCP 서버 ping 응답 (`curl $V7_API/health`) — 공유DB 구축 시에만
- [ ] eval 한 번 통과: `node scripts/eval-runner.js --self-test` — evals는 Claude Code 네이티브 기능이 아니며 **별도 러너 구축 시에만**

---

## 7. 첫 사용 (Hello, V9)

### 7.1 BUGFIX 한 건으로 흐름 체험
```bash
cd "$TARGET_REPO"
claude
```

Claude Code 안에서:
```
> 다음 템플릿으로 작업해줘:

(docs/request-templates/T4_BUGFIX.md 내용 복사 후 빈칸 채우기)
```

기대 동작 순서 (실규격 이벤트 기준):
1. `SessionStart` 훅(`pre-development-search.sh`) 실행 — 공유DB 구축 시 유사 사례 주입, 미구축 시 fail-open으로 조용히 통과
2. `code-explorer` 서브에이전트로 영향 분석
3. `critic-reviewer` + `test-architect` 병렬 호출
4. 수정안 → `PreToolUse`(Bash) 게이트가 `git commit` 감지 시 typecheck, `gh pr create` 감지 시 eval 게이트(별도 러너 구축 시) 실행 — 실패하면 exit 2로 차단하고 사유를 Claude에게 반환
5. 통과 시 PR 생성, `Stop` 훅(`post-task-to-db.sh`)이 결과를 기록 (공유DB 구축 시)

### 7.2 페르소나 호출 예
```
> @SRE팀 페르소나로 대응해줘: <인시던트 설명>
> @비판평가팀 시각으로 이 설계를 반박해줘
```

---

## 8. Codex 같이 쓰기 (선택)

> ⚠️ **Ultra는 Claude Code 전용 — 본 절은 참고 보관.** 현행 Ultra 워크플로우에서 Codex는 사용하지 않는다.

대상 프로젝트에 Codex도 같이 적용하려면:

```bash
cp "$V9_HOME/도구설정 V9/AGENTS.md.template" "$TARGET_REPO/AGENTS.md"
mkdir -p "$TARGET_REPO/.codex"
cp "$V9_HOME/도구설정 V9/config.toml.template" "$TARGET_REPO/.codex/config.toml"
# 같은 hooks·skills 폴더를 Codex도 사용
ln -s "$TARGET_REPO/.claude/hooks"  "$TARGET_REPO/.codex/hooks"
ln -s "$TARGET_REPO/.claude/skills" "$TARGET_REPO/.codex/skills"
```

Codex CLI에서:
```bash
codex
> AGENTS.md 봤지? 첫 작업으로 docs/request-templates/T13_TEST.md 따라 ...
```

---

## 9. 트러블슈팅

| 증상 | 원인·해결 |
|---|---|
| `/agents` 결과 없음 | `.claude/agents` 경로 잘못. 프로젝트 루트 기준 확인 |
| hook 실행 안 됨 | `chmod +x .claude/hooks/*.sh` |
| MCP `sharedb` 연결 실패 | (외부 인프라 옵션) 프로젝트 루트 `.mcp.json`에 등록됐는지, Docker Compose 떠 있는지, `$V7_TOKEN` 환경변수, 포트 8787 |
| 한글 폴더명 `cd` 실패 | 따옴표 사용 또는 영문 alias 폴더 만들기 |
| 훅이 비밀번호 차단 (false positive) | `pre-edit-pii-scan.sh` 의 정규식 화이트리스트 추가 |
| eval 게이트 항상 실패 | (별도 러너 필요) `node scripts/eval-runner.js --self-test`로 baseline 생성부터. 러너 미구축이면 훅에서 fail-open |
| Claude Code가 hook을 인식 못함 | settings.json의 `hooks` 구조·이벤트명이 실규격(§5의 9종: PreToolUse/PostToolUse/UserPromptSubmit/Notification/Stop/SubagentStop/SessionStart/SessionEnd/PreCompact)인지 확인 — 규격 밖 이벤트는 조용히 무시됨. `~/.claude/settings.json`이 덮어쓰고 있을 수 있음 |

---

## 10. 업그레이드·동기화 흐름

V9 폴더 자체를 업데이트했을 때 대상 프로젝트로 반영:

```bash
# 옵션 A/B는 다시 install 스크립트 실행 (변경분만 갱신)
bash "$V9_HOME/도구설정 V9/install-to-project.sh" "$TARGET_REPO" standard --upgrade

# 옵션 C는 symlink라 자동 반영
```

업데이트가 페르소나 정의를 바꿨다면 eval 회귀 비교를 한 번 더 (별도 러너 구축 시):
```bash
node scripts/eval-runner.js --against-baseline --threshold=0.95
```

---

## 11. 운영 권고 (V9 적용 후 1주차)

1. **하루 1 BUGFIX 템플릿**으로 흐름 체화
2. **첫 골든 케이스 1건**을 evals에 직접 추가 (C1 자동 승격 가르치기)
3. **FinOps usage** 일 1회 확인 (`/usage` 또는 grafana)
4. **CLAUDE.md 200줄 룰** 지키기 — 늘어나면 `.claude/rules/<glob>.md` 분리
5. **새 페르소나 추가 전** 비판평가팀에 1차 검토 위임

---

## 12. 다음 단계 추천 (적용 완료 후)

1. Phase 1 (A1·A2·B3) 우선 가동 → `Phase별 로드맵/Phase1_핵심인프라.md`
2. 회사 다른 프로젝트로 옵션 C 확장
3. Codex 야간 잡(`codex-nightly.yml`) 활성화 → 의존성·문서·테스트 자동 보강
4. 루프 엔지니어링 가동: `루프엔지니어링 V9/README.md` (loop-design → loop-run)
5. (안드로이드 트랙) `크로스플랫폼 V9/안드로이드_네이티브_가이드.md` + Phase 5 로드맵
