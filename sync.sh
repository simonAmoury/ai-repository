#!/bin/bash
#
# AI 配置同步入口（调度脚本）
#
# ai-repository 存储"通用规范"，各 agent 用自己的转换脚本生成专属格式。
# 分层优先级：项目级 > 公司级 > 个人级
#
# 用法:
#   git 操作（作用于 ai-repository 自身）:
#     ./sync.sh pull                    从 GitHub 拉取最新规范
#     ./sync.sh push "提交说明"          提交并推送到 GitHub
#     ./sync.sh status                  查看与 GitHub 的同步状态
#
#   agent 同步（把通用规范应用到各工具）:
#     ./sync.sh claude install [dir]    生成项目分层 CLAUDE.md（默认当前目录）
#     ./sync.sh claude bootstrap        注册 Claude SessionStart hook
#     ./sync.sh kiro                    同步规范到 ~/.kiro/
#     ./sync.sh codex                   同步规范到 ~/.codex/
#     ./sync.sh all [dir]               依次同步三个 agent
#
#   各 agent 脚本也可独立运行：scripts/sync-{claude,kiro,codex}.sh
#

set -e

AI_REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$AI_REPO_DIR/scripts"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
step()  { echo -e "${BLUE}[STEP]${NC} $1"; }

usage() {
  cat <<EOF
AI 配置同步入口（通用规范 → 各 agent 专属格式）

git 操作（作用于 ai-repository 自身）:
  ./sync.sh pull                    从 GitHub 拉取最新规范
  ./sync.sh push "提交说明"          提交并推送到 GitHub
  ./sync.sh status                  查看与 GitHub 的同步状态

agent 同步（把通用规范应用到各工具）:
  ./sync.sh claude install [dir]    生成项目分层 CLAUDE.md（默认当前目录）
  ./sync.sh claude bootstrap        注册 Claude SessionStart hook（换电脑用）
  ./sync.sh kiro                    同步规范到 ~/.kiro/
  ./sync.sh codex                   同步规范到 ~/.codex/
  ./sync.sh all [dir]               依次同步三个 agent

说明:
  - 只有 Claude 有会话启动 hook 能自动 pull；Kiro/Codex 需手动跑对应命令。
  - 各 agent 脚本也可独立运行：scripts/sync-{claude,kiro,codex}.sh
EOF
}

# ============ git 操作 ============
cmd_pull() {
  step "从 GitHub 拉取最新规范..."
  cd "$AI_REPO_DIR"
  git fetch origin
  local branch=$(git branch --show-current)
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse "origin/$branch")
  if [ "$LOCAL" = "$REMOTE" ]; then
    info "已是最新（$LOCAL）"
  else
    git pull origin "$branch"
    info "已更新到最新"
  fi
}

cmd_push() {
  local msg="${1:-update ai rules}"
  cd "$AI_REPO_DIR"
  step "检查改动..."
  if [ -z "$(git status --porcelain)" ]; then
    info "无改动，无需提交"
    return
  fi
  git status -s
  step "提交并推送..."
  git add -A
  git commit -m "$msg"
  git push origin "$(git branch --show-current)"
  info "已推送到 GitHub"
}

cmd_status() {
  cd "$AI_REPO_DIR"
  local branch=$(git branch --show-current)
  echo "分支: $branch"
  echo "远程: $(git remote get-url origin)"
  git fetch origin 2>/dev/null
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse "origin/$branch" 2>/dev/null || echo "unknown")
  AHEAD=$(git rev-list --count "origin/$branch..HEAD" 2>/dev/null || echo 0)
  BEHIND=$(git rev-list --count "HEAD..origin/$branch" 2>/dev/null || echo 0)
  echo "本地: $LOCAL"
  echo "远程: $REMOTE"
  echo "领先远程: $AHEAD 个提交（待 push）"
  echo "落后远程: $BEHIND 个提交（待 pull）"
}

# ============ 主入口：git 操作本地处理，agent 同步调度到子脚本 ============
case "${1:-}" in
  pull)    cmd_pull ;;
  push)    cmd_push "${2:-update ai rules}" ;;
  status)  cmd_status ;;
  claude)  shift; bash "$SCRIPTS_DIR/sync-claude.sh" "$@" ;;
  kiro)    shift; bash "$SCRIPTS_DIR/sync-kiro.sh" "${1:-sync}" ;;
  codex)   shift; bash "$SCRIPTS_DIR/sync-codex.sh" "${1:-sync}" ;;
  all)
    step "依次同步三个 agent..."
    bash "$SCRIPTS_DIR/sync-claude.sh" install "${2:-.}"
    echo ""
    bash "$SCRIPTS_DIR/sync-kiro.sh" sync
    echo ""
    bash "$SCRIPTS_DIR/sync-codex.sh" sync
    ;;
  *)       usage; exit 1 ;;
esac
