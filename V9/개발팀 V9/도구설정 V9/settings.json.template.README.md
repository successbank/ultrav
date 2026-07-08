# settings.json.template 설명서

> JSON 파일은 주석을 지원하지 않으므로, 템플릿의 각 항목 설명을 이 문서에 정리합니다.
> 이 템플릿은 Claude Code **실규격**(settings.json 공식 스키마)만 사용합니다.
> 사용법: 내용을 프로젝트의 `.claude/settings.json`으로 복사한 뒤 프로젝트에 맞게 조정하세요.

---

## 1. permissions — 권한 제어

### permissions.allow (허용 목록)

| 항목 | 설명 |
|------|------|
| `Bash(pnpm:*)`, `Bash(npm:*)` | 패키지 매니저 명령 허용 |
| `Bash(git:*)` | git 명령 허용 |
| `Bash(docker:*)`, `Bash(docker-compose:*)` | Docker 기반 개발 환경 명령 허용 (Ultra 프로젝트는 Docker 전용 개발) |
| `Read`, `Edit`, `Write` | 파일 읽기/수정/생성 허용 (deny 규칙이 우선 적용됨) |

### permissions.deny (차단 목록 — allow보다 우선)

| 항목 | 의도 |
|------|------|
| `Read(./.env*)`, `Edit(./.env*)`, `Write(./.env*)` | **.env 보호**: 환경변수 파일(DB 비밀번호, 시크릿 키) 읽기/수정/덮어쓰기 전면 차단 |
| `Read(./secrets/**)`, `Edit(./secrets/**)`, `Write(./secrets/**)` | 시크릿 디렉토리 보호 |
| `Read(./keys/**)`, `Edit(./keys/**)`, `Write(./keys/**)` | 키 파일 디렉토리 보호 |
| `Bash(sudo:*)` | 루트 권한 명령 차단 |
| `Bash(rm -rf:*)` | 재귀 강제 삭제 차단 |

> 구버전 템플릿의 `fileProtect` 키는 **실제로 존재하지 않는 규격**이므로,
> 동일한 의도를 `deny`의 `Read(...)/Edit(...)/Write(...)` 규칙으로 번역했습니다.

## 2. hooks — 이벤트 훅

실규격 구조: `{"hooks": {"<이벤트>": [{"matcher": "<도구명 정규식>", "hooks": [{"type": "command", "command": "...", "timeout": 초}]}]}}`

유효 이벤트는 `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Notification`, `Stop`, `SubagentStop`, `SessionStart`, `SessionEnd`, `PreCompact` 뿐입니다.
구버전의 `preCommit`, `prePR`, `onTaskStart`, `onError`, `onTaskComplete`, `onLoopTick`, `onLoopEnd` 등은 존재하지 않는 이벤트라서 조용히 무시되므로 전부 제거했습니다.

| 이벤트 | matcher | 스크립트 | 의도 |
|--------|---------|----------|------|
| `PreToolUse` | `Edit\|MultiEdit\|Write` | `pii-secret-scan.sh` | **PII/시크릿 스캔**: 파일 수정·생성 직전에 개인정보/시크릿 포함 여부 검사. 차단 시 exit 2 + stderr 사유 |
| `PreToolUse` | `Bash` | `pre-commit-typecheck.sh` | **커밋 게이트**: Bash 명령 실행 전 훅 스크립트가 stdin JSON의 `tool_input.command`를 확인, `git commit`류 명령일 때만 타입체크 수행 (그 외 명령은 exit 0으로 즉시 통과) |
| `PostToolUse` | `Edit\|MultiEdit\|Write` | `post-edit-format.sh` | **자동 포맷**: 파일 수정·생성 직후 포맷터(Prettier 등) 적용 |

훅 스크립트 규약:
- stdin으로 JSON 수신: `{session_id, cwd, hook_event_name, tool_name, tool_input: {...}}`
  - Edit: `tool_input.file_path`, `tool_input.new_string` / Write: `tool_input.file_path`, `tool_input.content` / Bash: `tool_input.command`
- 차단: `exit 2` + stderr에 사유 (Claude에게 전달됨) / 통과: `exit 0` / `exit 1`은 non-blocking 경고
- 경로는 `$CLAUDE_PROJECT_DIR/.claude/hooks/...` 형식 사용 (프로젝트 루트 기준 절대 경로 보장)
- 파싱 실패나 도구(jq, tsc 등) 부재 시에는 fail-open(`exit 0`) 원칙

훅 스크립트 위치: `$CLAUDE_PROJECT_DIR/.claude/hooks/` 디렉토리에 실행 권한(`chmod +x`)과 함께 배치하세요.

## 3. MCP 서버 등록 (settings.json에 넣지 마세요)

구버전 템플릿에 있던 `mcpServers` 키는 settings.json 규격이 아닙니다.
**MCP 서버는 프로젝트 루트의 `.mcp.json`에 별도 등록**해야 합니다.

```jsonc
// 프로젝트 루트 /.mcp.json (settings.json 아님!)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

## 4. 제거된 항목과 이유

| 구버전 키 | 처리 |
|-----------|------|
| `mcpServers` | settings.json 규격 아님 → 프로젝트 루트 `.mcp.json`으로 이동 (3번 참조) |
| `permissions.fileProtect` | 존재하지 않는 키 → `permissions.deny`의 Read/Edit/Write 규칙으로 번역 |
| `preToolUse:Edit` 등 콜론 문법 훅 | 실규격 아님 → `PreToolUse` + `matcher` 구조로 번역 |
| `preCommit`, `prePR` | 존재하지 않는 이벤트 → 커밋 게이트는 `PreToolUse`(Bash) 훅 내부에서 커밋 명령 감지로 구현 |
| `onTaskStart/onError/onTaskComplete/onLoopTick/onLoopEnd` | 존재하지 않는 이벤트 → 제거 |
| `model.router`, `usage` | 존재하지 않는 키(모델 라우터/사용량 상한) → 제거. 모델 변경은 `/config` 또는 `model` 문자열 설정 사용 |
| `extends`, `$schema` 상속 | 존재하지 않는 규격 → 각 위치에 내용을 인라인으로 작성 |
