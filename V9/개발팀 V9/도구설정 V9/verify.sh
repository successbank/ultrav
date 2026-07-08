#!/usr/bin/env bash
# verify.sh — V9 설치 실검증 (구조/문법 기반, 고정 카운트 없음)
# 사용: bash verify.sh [TARGET_REPO]   (기본: 현재 디렉터리)
set -uo pipefail

TARGET="${1:-$(pwd)}"
if [ ! -d "$TARGET" ]; then
  echo "[err] TARGET 디렉터리 없음: $TARGET" >&2
  exit 1
fi
TARGET="$(cd "$TARGET" && pwd)"
SETTINGS="$TARGET/.claude/settings.json"

VALID_EVENTS='PreToolUse|PostToolUse|UserPromptSubmit|Notification|Stop|SubagentStop|SessionStart|SessionEnd|PreCompact'
VALID_MODELS='haiku|sonnet|opus|inherit'

# ── 결과 수집 ───────────────────────────────────────────────────────
names=(); results=(); details=()
add() { # $1=PASS|FAIL|SKIP $2=검사항목 $3=상세
  results+=("$1"); names+=("$2"); details+=("$3")
}

HAS_JQ=0
command -v jq >/dev/null 2>&1 && HAS_JQ=1

# frontmatter 본문 추출 (1행이 --- 로 시작해야 유효, 없으면 빈 출력)
fm_block() {
  awk 'NR==1 { if ($0 !~ /^---[[:space:]]*$/) exit; next }
       /^---[[:space:]]*$/ { exit }
       { print }' "$1"
}

echo "[check] TARGET=$TARGET"
echo

# ── 1. CLAUDE.md / V9 추가지침 ──────────────────────────────────────
if [ -f "$TARGET/CLAUDE.md" ]; then
  if [ -f "$TARGET/.claude/V9_CLAUDE_추가지침.md" ] \
     && ! grep -q "V9_CLAUDE_추가지침" "$TARGET/CLAUDE.md" 2>/dev/null; then
    add FAIL "CLAUDE.md" "V9_CLAUDE_추가지침.md 존재하나 CLAUDE.md에 참조 한 줄 누락"
  else
    add PASS "CLAUDE.md" "존재"
  fi
else
  add FAIL "CLAUDE.md" "없음 — install-to-project.sh 실행 필요"
fi

# ── 2. settings.json JSON 유효성 ────────────────────────────────────
JSON_OK=0
if [ ! -f "$SETTINGS" ]; then
  add FAIL "settings.json 존재" "$SETTINGS 없음"
else
  add PASS "settings.json 존재" ".claude/settings.json"
  if [ "$HAS_JQ" -eq 1 ]; then
    if jq -e . "$SETTINGS" >/dev/null 2>&1; then JSON_OK=1; fi
  elif command -v python3 >/dev/null 2>&1; then
    if python3 -c "import json,sys;json.load(open(sys.argv[1]))" "$SETTINGS" 2>/dev/null; then JSON_OK=1; fi
  else
    add SKIP "settings.json 문법" "jq/python3 없음 — 검사 불가"
    JSON_OK=-1
  fi
  if [ "$JSON_OK" -eq 1 ]; then add PASS "settings.json 문법" "JSON valid"
  elif [ "$JSON_OK" -eq 0 ]; then add FAIL "settings.json 문법" "JSON 파싱 실패"; fi
fi

# ── 3. hooks 이벤트명 유효성 (jq) ───────────────────────────────────
if [ -f "$SETTINGS" ] && [ "$JSON_OK" -eq 1 ] && [ "$HAS_JQ" -eq 1 ]; then
  bad_events="$(jq -r '(.hooks // {}) | keys[]' "$SETTINGS" 2>/dev/null \
                | grep -Ev "^(${VALID_EVENTS})\$" || true)"
  n_events="$(jq -r '(.hooks // {}) | keys | length' "$SETTINGS" 2>/dev/null)"
  if [ -n "$bad_events" ]; then
    add FAIL "hooks 이벤트명" "무효 이벤트: $(echo "$bad_events" | tr '\n' ' ')(유효: ${VALID_EVENTS//|/, })"
  else
    add PASS "hooks 이벤트명" "이벤트 ${n_events}개 모두 유효 집합에 속함"
  fi

  # ── 4. hooks 구조 (matcher/hooks[].type/command) ──────────────────
  if jq -e '
      def okentry:
        (type=="object")
        and ((has("matcher")|not) or (.matcher|type=="string"))
        and (has("hooks") and (.hooks|type=="array"))
        and ([ .hooks[] | (type=="object")
                          and (.type=="command")
                          and ((.command|type)=="string")
                          and ((has("timeout")|not) or (.timeout|type=="number")) ] | all);
      (.hooks // {})
      | ([ .[] | type=="array" ] | all)
        and ([ .[][]? | okentry ] | all)
    ' "$SETTINGS" >/dev/null 2>&1; then
    add PASS "hooks 구조" 'matcher(문자열)·hooks[].type="command"·command(문자열) 규격 준수'
  else
    add FAIL "hooks 구조" '이벤트 배열 / matcher 문자열 / hooks[].{type:"command",command:string} 규격 위반'
  fi
elif [ -f "$SETTINGS" ] && [ "$HAS_JQ" -ne 1 ]; then
  add SKIP "hooks 이벤트명" "jq 없음 — 검사 불가"
  add SKIP "hooks 구조" "jq 없음 — 검사 불가"
fi

# ── 5. agents/*.md frontmatter ──────────────────────────────────────
agents_dir="$TARGET/.claude/agents"
if [ -d "$agents_dir" ]; then
  total=0; bad=""
  while IFS= read -r -d '' f; do
    total=$((total+1))
    fm="$(fm_block "$f")"
    ok=1
    [ -n "$fm" ] || ok=0
    printf '%s\n' "$fm" | grep -Eq '^name:[[:space:]]*[^[:space:]]'        || ok=0
    printf '%s\n' "$fm" | grep -Eq '^description:[[:space:]]*[^[:space:]]' || ok=0
    model="$(printf '%s\n' "$fm" | sed -n 's/^model:[[:space:]]*//p' | head -1 | tr -d '[:space:]')"
    if [ -n "$model" ]; then
      echo "$model" | grep -Eq "^(${VALID_MODELS})\$" || ok=0
    fi
    [ "$ok" -eq 1 ] || bad="$bad $(basename "$f")"
  done < <(find "$agents_dir" -maxdepth 1 -name '*.md' -print0 2>/dev/null)
  if [ "$total" -eq 0 ]; then
    add FAIL "agents frontmatter" ".claude/agents/*.md 없음"
  elif [ -n "$bad" ]; then
    add FAIL "agents frontmatter" "규격 위반:${bad} (name+description 필수, model은 ${VALID_MODELS//|/, } 만 유효)"
  else
    add PASS "agents frontmatter" "${total}개 모두 name+description 존재, model 값 유효"
  fi
else
  add FAIL "agents frontmatter" ".claude/agents/ 디렉터리 없음"
fi

# ── 6. skills/*/SKILL.md frontmatter ────────────────────────────────
skills_dir="$TARGET/.claude/skills"
if [ -d "$skills_dir" ]; then
  total=0; bad=""
  while IFS= read -r -d '' f; do
    total=$((total+1))
    fm="$(fm_block "$f")"
    ok=1
    [ -n "$fm" ] || ok=0
    printf '%s\n' "$fm" | grep -Eq '^name:[[:space:]]*[^[:space:]]'        || ok=0
    printf '%s\n' "$fm" | grep -Eq '^description:[[:space:]]*[^[:space:]]' || ok=0
    [ "$ok" -eq 1 ] || bad="$bad $(basename "$(dirname "$f")")"
  done < <(find "$skills_dir" -mindepth 2 -maxdepth 2 -name 'SKILL.md' -print0 2>/dev/null)
  if [ "$total" -eq 0 ]; then
    add FAIL "skills frontmatter" ".claude/skills/*/SKILL.md 없음"
  elif [ -n "$bad" ]; then
    add FAIL "skills frontmatter" "규격 위반:${bad} (name+description 필수)"
  else
    add PASS "skills frontmatter" "${total}개 SKILL.md 모두 name+description 존재"
  fi
else
  add FAIL "skills frontmatter" ".claude/skills/ 디렉터리 없음"
fi

# ── 7. hooks/*.sh 문법 (bash -n) + 실행권한 ─────────────────────────
hooks_dir="$TARGET/.claude/hooks"
if [ -d "$hooks_dir" ]; then
  total=0; syn_bad=""; exec_bad=""
  for h in "$hooks_dir"/*.sh; do
    [ -e "$h" ] || continue
    total=$((total+1))
    bash -n "$h" 2>/dev/null || syn_bad="$syn_bad $(basename "$h")"
    [ -x "$h" ] || exec_bad="$exec_bad $(basename "$h")"
  done
  if [ "$total" -eq 0 ]; then
    add SKIP "hooks 스크립트" ".claude/hooks/*.sh 없음"
  else
    if [ -n "$syn_bad" ]; then add FAIL "hooks 문법(bash -n)" "문법 오류:${syn_bad}"
    else add PASS "hooks 문법(bash -n)" "${total}개 모두 문법 통과"; fi
    if [ -n "$exec_bad" ]; then add FAIL "hooks 실행권한" "권한 없음:${exec_bad} — chmod +x .claude/hooks/*.sh"
    else add PASS "hooks 실행권한" "${total}개 모두 실행 가능"; fi
  fi
else
  add SKIP "hooks 스크립트" ".claude/hooks/ 디렉터리 없음"
fi

# ── 8. personas ─────────────────────────────────────────────────────
if [ -d "$TARGET/.claude/personas" ] && ls "$TARGET/.claude/personas"/*.md >/dev/null 2>&1; then
  n=$(ls "$TARGET/.claude/personas"/*.md 2>/dev/null | wc -l | tr -d ' ')
  add PASS "personas" "팀 페르소나 ${n}개 파일 존재"
else
  add FAIL "personas" ".claude/personas/*.md 없음"
fi

# ── 결과 표 출력 ────────────────────────────────────────────────────
pass=0; fail=0; skip=0
echo "──────────────────────────────────────────────────────────────"
printf " %-6s │ %-24s │ %s\n" "결과" "검사항목" "상세"
echo "──────────────────────────────────────────────────────────────"
for i in "${!names[@]}"; do
  r="${results[$i]}"
  case "$r" in
    PASS) mark="✅ PASS"; pass=$((pass+1)) ;;
    FAIL) mark="❌ FAIL"; fail=$((fail+1)) ;;
    *)    mark="⏭  SKIP"; skip=$((skip+1)) ;;
  esac
  printf " %-6s │ %-24s │ %s\n" "$mark" "${names[$i]}" "${details[$i]}"
done
echo "──────────────────────────────────────────────────────────────"
echo " PASS=$pass  FAIL=$fail  SKIP=$skip"

if [ "$fail" -eq 0 ]; then
  echo " 🎉 V9 설치 정상"
  exit 0
fi
echo " ❗ FAIL 항목 수정 후 재실행하세요"
exit 1
