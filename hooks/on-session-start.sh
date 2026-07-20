#!/usr/bin/env bash
# ai-repository SessionStart hook
#
# 作用:
#   1. 静默拉取 ai-repository 最新规范（git pull --ff-only）
#   2. 检测到未推送的规范改动 → 提示用户 push
#   3. 检测到未接入分层配置的项目 → 提示用户 install
#
# 输出规范（重要）:
#   SessionStart 的纯 stdout 会被 Claude 当作 context 读入，污染每次会话。
#   因此本脚本默认静默（无输出），仅在有需要提示时输出一行 JSON systemMessage
#   （transient 提示，显示给用户但不进入 Claude context）。
#
# 退出码:
#   永远 exit 0（SessionStart 无法阻断会话，且同步失败不应影响会话启动）

set +e

AI_REPO="/d/hub/ai-repository"
PROJECT_DIR="${PWD:-$(pwd)}"

# ai-repository 不存在则静默退出
[ -d "$AI_REPO/.git" ] || exit 0

cd "$AI_REPO" || exit 0

msgs=()

# fetch 检测落后/领先
git fetch --quiet origin 2>/dev/null
BRANCH=$(git branch --show-current 2>/dev/null)
[ -n "$BRANCH" ] || exit 0

BEHIND=$(git rev-list --count "HEAD..origin/$BRANCH" 2>/dev/null || echo 0)
AHEAD=$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null || echo 0)
DIRTY=$(git status --porcelain 2>/dev/null | head -1)

# 落后于远程则静默 pull
if [ "$BEHIND" -gt 0 ]; then
  BEFORE=$(git rev-parse --short HEAD 2>/dev/null)
  git pull --quiet --ff-only origin "$BRANCH" 2>/dev/null
  AFTER=$(git rev-parse --short HEAD 2>/dev/null)
  msgs+=("[ai-repo] 规范已更新 $BEFORE → $AFTER（$BEHIND 个提交）")
fi

# 未推送改动提示（本地领先 或 工作区有改动）
if [ "$AHEAD" -gt 0 ] || [ -n "$DIRTY" ]; then
  msgs+=("[ai-repo] 检测到未推送的规范改动，建议: $AI_REPO/sync.sh push \"说明\"")
fi

# 未接入项目提示（项目与 ai-repository 平级 且 无 CLAUDE.md）
if [ "$PROJECT_DIR" != "$AI_REPO" ]; then
  PARENT=$(dirname "$PROJECT_DIR")
  if [ -d "$PARENT/ai-repository" ] && [ ! -f "$PROJECT_DIR/CLAUDE.md" ]; then
    msgs+=("[ai-repo] 当前项目未接入分层配置，建议: $AI_REPO/sync.sh install \"$PROJECT_DIR\"")
  fi
fi

# 仅在有提示时输出一行 JSON systemMessage
if [ "${#msgs[@]}" -gt 0 ]; then
  combined=$(printf ' | %s' "${msgs[@]}")
  combined="${combined:3}"
  escaped=$(printf '%s' "$combined" | sed 's/\\/\\\\/g; s/"/\\"/g')
  printf '{"systemMessage":"%s"}\n' "$escaped"
fi

exit 0
