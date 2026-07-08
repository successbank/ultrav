#!/usr/bin/env bash
# install-to-project.sh — V9 자산을 대상 프로젝트의 Claude Code에 설치
# 사용: bash install-to-project.sh <TARGET_REPO> [minimal|standard|shared] [--upgrade] [--with-codex]
#
#   minimal   : .claude (agents/skills/hooks/evals/personas) + 요청 템플릿
#   standard  : minimal 과 동일 (과거 모노레포 placeholder 생성은 제거됨)
#   shared    : standard + 사용자 레벨(~/.claude) symlink
#
#   --upgrade    : 기존 .claude/settings.json 을 백업 후 템플릿으로 교체
#                  (미지정 시 기존 settings.json 은 보존, 템플릿은 별도 파일로 배치)
#   --with-codex : dot-codex → .codex, dot-github → .github 복사 (기본은 복사 안 함)
#
# 백업 정책: --upgrade 여부와 무관하게, 덮어쓰기 대상은 항상 사전 백업된다.
set -euo pipefail

TARGET=""
MODE="minimal"
UPGRADE=0
WITH_CODEX=0

for arg in "$@"; do
  case "$arg" in
    --upgrade)    UPGRADE=1 ;;
    --with-codex) WITH_CODEX=1 ;;
    minimal|standard|shared) MODE="$arg" ;;
    -*)
      echo "[err] 알 수 없는 옵션: $arg" >&2
      echo "usage: $0 <TARGET_REPO> [minimal|standard|shared] [--upgrade] [--with-codex]" >&2
      exit 1
      ;;
    *)
      if [ -z "$TARGET" ]; then TARGET="$arg"
      else echo "[err] 인자 초과: $arg" >&2; exit 1; fi
      ;;
  esac
done

if [ -z "$TARGET" ]; then
  echo "usage: $0 <TARGET_REPO> [minimal|standard|shared] [--upgrade] [--with-codex]" >&2
  exit 1
fi
if [ ! -d "$TARGET" ]; then
  echo "[err] TARGET_REPO 디렉터리 없음: $TARGET" >&2
  exit 1
fi
TARGET="$(cd "$TARGET" && pwd)"

# V9 루트는 본 스크립트의 상위의 상위
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
V9_HOME="$(cd "$SCRIPT_DIR/.." && pwd)"
echo "[info] V9_HOME    = $V9_HOME"
echo "[info] TARGET     = $TARGET"
echo "[info] MODE       = $MODE"
echo "[info] upgrade    = $UPGRADE / with-codex = $WITH_CODEX"

# 소스 경로 (dot-claude → 대상 .claude 로 이름 변환하여 복사)
AE="$V9_HOME/개발팀 에이전트 V9"     # dot-claude, dot-codex, dot-github 보유
PE="$V9_HOME/개발팀 페르소나 V9"     # dot-claude/personas 보유
TS="$V9_HOME/도구설정 V9"
US="$V9_HOME/사용자지침 V9"

for req in "$AE/dot-claude" "$PE/dot-claude/personas" "$TS/CLAUDE.md.template" "$TS/settings.json.template"; do
  if [ ! -e "$req" ]; then
    echo "[err] 소스 자산 없음: $req" >&2
    exit 1
  fi
done

STAMP="$(date +%s)"

# ── 백업 헬퍼 (--upgrade 여부와 무관하게 항상 수행) ─────────────────
backup_if_exists() {
  local p="$1"
  if [ -e "$p" ]; then
    cp "$p" "$p.v9backup.$STAMP" && echo "[backup] $p → $p.v9backup.$STAMP"
  fi
}

backup_dir_if_exists() {
  local d="$1"
  if [ -d "$d" ] && [ -n "$(ls -A "$d" 2>/dev/null)" ]; then
    local b="$d.v9backup.$STAMP.tar.gz"
    tar -czf "$b" -C "$(dirname "$d")" "$(basename "$d")" \
      && echo "[backup] $d/ → $b"
  fi
}

mkdir -p "$TARGET/.claude" "$TARGET/docs/request-templates"

# ── 1) CLAUDE.md — 기존 파일은 절대 덮어쓰지 않음 ───────────────────
CLAUDE_MD_KEPT=0
if [ -f "$TARGET/CLAUDE.md" ]; then
  CLAUDE_MD_KEPT=1
  backup_if_exists "$TARGET/.claude/V9_CLAUDE_추가지침.md"
  cp "$TS/CLAUDE.md.template" "$TARGET/.claude/V9_CLAUDE_추가지침.md"
  echo "[ok] 기존 CLAUDE.md 보존 — 템플릿은 .claude/V9_CLAUDE_추가지침.md 로 배치"
else
  cp "$TS/CLAUDE.md.template" "$TARGET/CLAUDE.md"
  echo "[ok] CLAUDE.md 신규 배치"
fi

# ── 2) settings.json ────────────────────────────────────────────────
SETTINGS_KEPT=0
if [ -f "$TARGET/.claude/settings.json" ]; then
  backup_if_exists "$TARGET/.claude/settings.json"
  if [ "$UPGRADE" -eq 1 ]; then
    cp "$TS/settings.json.template" "$TARGET/.claude/settings.json"
    echo "[ok] .claude/settings.json 교체 (--upgrade, 기존본은 백업됨)"
  else
    SETTINGS_KEPT=1
    cp "$TS/settings.json.template" "$TARGET/.claude/settings.json.v9template"
    echo "[ok] 기존 .claude/settings.json 보존 — 템플릿은 settings.json.v9template 로 배치"
    echo "     (교체를 원하면 --upgrade 로 재실행하거나 수동 병합하세요)"
  fi
else
  cp "$TS/settings.json.template" "$TARGET/.claude/settings.json"
  echo "[ok] .claude/settings.json 배치"
fi

# ── 3) dot-claude → .claude : personas / agents / skills / hooks / evals ──
for d in agents skills hooks evals; do
  if [ -d "$AE/dot-claude/$d" ]; then
    backup_dir_if_exists "$TARGET/.claude/$d"
    mkdir -p "$TARGET/.claude/$d"
    cp -R "$AE/dot-claude/$d/." "$TARGET/.claude/$d/"
  fi
done
backup_dir_if_exists "$TARGET/.claude/personas"
mkdir -p "$TARGET/.claude/personas"
cp -R "$PE/dot-claude/personas/." "$TARGET/.claude/personas/"

if ls "$TARGET/.claude/hooks/"*.sh >/dev/null 2>&1; then
  chmod +x "$TARGET/.claude/hooks/"*.sh
fi
echo "[ok] dot-claude → .claude 복사 (personas / agents / skills / hooks / evals) + hooks 실행권한"

# ── 4) 사용자 요청 템플릿 ───────────────────────────────────────────
if [ -d "$US/templates" ]; then
  cp -R "$US/templates/." "$TARGET/docs/request-templates/"
  cp "$US/머리말_규칙.md" "$TARGET/docs/request-templates/" 2>/dev/null || true
  echo "[ok] docs/request-templates (T1~T18) 복사"
fi

# ── 5) --with-codex : dot-codex → .codex, dot-github → .github ─────
if [ "$WITH_CODEX" -eq 1 ]; then
  if [ -d "$AE/dot-codex" ]; then
    backup_dir_if_exists "$TARGET/.codex"
    mkdir -p "$TARGET/.codex"
    cp -R "$AE/dot-codex/." "$TARGET/.codex/"
    echo "[ok] dot-codex → .codex 복사"
  fi
  if [ -d "$AE/dot-github/workflows" ]; then
    backup_dir_if_exists "$TARGET/.github/workflows"
    mkdir -p "$TARGET/.github/workflows"
    cp -R "$AE/dot-github/workflows/." "$TARGET/.github/workflows/"
    echo "[ok] dot-github/workflows → .github/workflows 복사"
  fi
  if [ -f "$TS/AGENTS.md.template" ]; then
    backup_if_exists "$TARGET/AGENTS.md"
    cp "$TS/AGENTS.md.template" "$TARGET/AGENTS.md"
    echo "[ok] AGENTS.md 배치"
  fi
else
  echo "[skip] dot-codex / dot-github 복사 안 함 (--with-codex 지정 시에만 복사)"
fi

# ── 6) shared: 사용자 레벨 symlink ──────────────────────────────────
if [ "$MODE" = "shared" ]; then
  mkdir -p "$HOME/.claude"
  for d in agents skills hooks; do
    if [ ! -e "$HOME/.claude/$d" ]; then
      ln -s "$AE/dot-claude/$d" "$HOME/.claude/$d"
      echo "[ok] symlink ~/.claude/$d → $AE/dot-claude/$d"
    else
      echo "[skip] ~/.claude/$d 이미 존재 — symlink 생략"
    fi
  done
fi

# ── 7) 마무리 안내 ──────────────────────────────────────────────────
cat <<EOF

==============================================
✅ 설치 완료 (mode=$MODE)
==============================================
EOF

if [ "$CLAUDE_MD_KEPT" -eq 1 ]; then
  cat <<EOF
⚠️  기존 CLAUDE.md 는 덮어쓰지 않았습니다.
    V9 지침은 .claude/V9_CLAUDE_추가지침.md 에 있습니다.
    CLAUDE.md 에 아래 참조 한 줄을 직접 추가하세요:

      - V9 추가지침: ./.claude/V9_CLAUDE_추가지침.md 참조

EOF
fi

cat <<EOF
📌 personas 참조 병합 안내:
    .claude/personas/ 에 팀 페르소나가 복사되었습니다.
    CLAUDE.md 에 아래와 같은 참조 섹션이 없다면 추가하세요:

      ## 개발팀 페르소나
      - 팀 정의: ./.claude/personas/ 디렉터리 참조

EOF

if [ "$SETTINGS_KEPT" -eq 1 ]; then
  echo "📌 settings.json 병합 안내: .claude/settings.json.v9template 의 hooks/permissions 를"
  echo "    기존 .claude/settings.json 에 수동 병합하거나 --upgrade 로 교체하세요."
  echo
fi

cat <<EOF
환경변수 (선택 — 공유DB 인프라 V2 사용 시):

  export V9_HOME="$V9_HOME"
  export V7_API="http://localhost:8787"
  export V7_TOKEN="<JWT 또는 dev 토큰>"

검증:
  bash "$V9_HOME/도구설정 V9/verify.sh" "$TARGET"

처음 흐름 체험:
  cd "$TARGET" && claude
  > /agents          (서브에이전트 목록 확인)
  > /skills          (스킬 목록 확인)

다음:
  - 첫 BUGFIX 템플릿(docs/request-templates/T4_BUGFIX.md)으로 흐름 체험
  - 루프 엔지니어링: 루프엔지니어링 V9/README.md (loop-design → loop-run)
EOF
