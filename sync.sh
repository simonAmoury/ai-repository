#!/bin/bash
#
# AI 配置分层同步脚本
#
# 三层配置，优先级：项目级 > 公司级 > 个人级
#
# 用法:
#   ./sync.sh pull                       # ai-repository 从 GitHub 拉取最新
#   ./sync.sh push "提交说明"             # ai-repository 改动提交并 push 到 GitHub
#   ./sync.sh install [project-dir]      # 为项目生成分层 CLAUDE.md（默认当前目录）
#   ./sync.sh status                     # 查看 ai-repository 与 GitHub 的同步状态
#
# 工作目录:
#   - pull/push/status：在 ai-repository 本目录操作（即 D:\hub\ai-repository）
#   - install：在目标项目生成 CLAUDE.md，通过相对路径 @import 引用 ai-repository
#

set -e

# 脚本所在目录 = ai-repository 根目录
AI_REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 颜色
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
step()  { echo -e "${BLUE}[STEP]${NC} $1"; }

usage() {
  cat <<EOF
AI 配置分层同步脚本（优先级：项目 > 公司 > 个人）

用法:
  ./sync.sh pull                       从 GitHub 拉取 ai-repository 最新规范
  ./sync.sh push "提交说明"             提交 ai-repository 改动并 push 到 GitHub
  ./sync.sh install [project-dir]      为项目生成分层 CLAUDE.md（默认当前目录）
  ./sync.sh status                     查看 ai-repository 与 GitHub 同步状态
EOF
}

# ============ pull：从 GitHub 拉取 ============
cmd_pull() {
  step "从 GitHub 拉取最新规范..."
  cd "$AI_REPO_DIR"
  git fetch origin
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse origin/$(git branch --show-current))
  if [ "$LOCAL" = "$REMOTE" ]; then
    info "已是最新（$LOCAL）"
  else
    git pull origin "$(git branch --show-current)"
    info "已更新到最新"
  fi
}

# ============ push：提交并推送 ============
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

# ============ status：同步状态 ============
cmd_status() {
  cd "$AI_REPO_DIR"
  local branch=$(git branch --show-current)
  echo "分支: $branch"
  echo "远程: $(git remote get-url origin)"
  git fetch origin 2>/dev/null
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse origin/$branch 2>/dev/null || echo "unknown")
  AHEAD=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo 0)
  BEHIND=$(git rev-list --count HEAD..origin/$branch 2>/dev/null || echo 0)
  echo "本地: $LOCAL"
  echo "远程: $REMOTE"
  echo "领先远程: $AHEAD 个提交（待 push）"
  echo "落后远程: $BEHIND 个提交（待 pull）"
}

# ============ install：为项目生成分层 CLAUDE.md ============
cmd_install() {
  local project_dir="${1:-.}"
  project_dir="$(cd "$project_dir" && pwd)"
  local claude_dir="$project_dir/.claude"

  step "安装分层配置到: $project_dir"

  # 计算 project_dir 相对 ai-repository 的路径
  local rel
  rel=$(node -e "
    const p = require('path');
    const from = String.raw\`$project_dir\`.replace(/\\\\/g, '/');
    const to = String.raw\`$AI_REPO_DIR\`.replace(/\\\\/g, '/');
    let r = p.relative(from, to).replace(/\\\\/g, '/');
    if (!r.startsWith('.')) r = './' + r;
    process.stdout.write(r);
  ")

  info "ai-repository 相对路径: $rel"
  mkdir -p "$claude_dir"

  # ---- 1. 生成 CLAUDE.md（项目根目录）----
  local claude_md="$project_dir/CLAUDE.md"
  {
    echo "# 项目规则"
    echo ""
    echo "> 本文件由 \`ai-repository/sync.sh install\` 生成。"
    echo "> 分层优先级：**项目级（本节） > 公司规范 > 个人规范**，冲突时以项目级规则为准。"
    echo "> 更新下层规范后无需重新 install，Claude Code 启动时自动通过 \`@import\` 读取最新内容。"
    echo ""
    echo "## 项目级规则（最高优先级）"
    echo ""
    echo "<!-- 在此添加项目特有规则，会覆盖下方导入的规范 -->"
    echo ""
    echo "(暂无项目特有规则)"
    echo ""
    echo "---"
    echo ""

    # 公司 steering
    if ls "$AI_REPO_DIR"/company/rules/steering/*.md >/dev/null 2>&1; then
      echo "## 公司规范"
      echo ""
      for f in "$AI_REPO_DIR"/company/rules/steering/*.md; do
        [ -f "$f" ] || continue
        local name=$(basename "$f")
        echo "### $(basename "$name" .md)"
        echo ""
        echo "@${rel}/company/rules/steering/${name}"
        echo ""
        info "导入公司规范: $name" >&2
      done
    fi

    # 个人 steering
    if ls "$AI_REPO_DIR"/personal/rules/steering/*.md >/dev/null 2>&1; then
      echo "## 个人规范"
      echo ""
      for f in "$AI_REPO_DIR"/personal/rules/steering/*.md; do
        [ -f "$f" ] || continue
        local name=$(basename "$f")
        echo "### $(basename "$name" .md)"
        echo ""
        echo "@${rel}/personal/rules/steering/${name}"
        echo ""
        info "导入个人规范: $name" >&2
      done
    fi

    # hook 规则（转换后生成）
    if [ -f "$claude_dir/hooks-rules.md" ]; then
      echo "## Hook 规则（由 .hook 自动转换）"
      echo ""
      echo "@.claude/hooks-rules.md"
      echo ""
    fi
  } > "$claude_md"
  info "已生成: CLAUDE.md"

  # ---- 2. 转换 hooks → hooks-rules.md ----
  local converter="$AI_REPO_DIR/personal/tools/hook-converter.js"
  local hooks_found=0
  local tmp_hooks=$(mktemp -d)
  # 收集公司 + 个人的 .hook 文件
  for d in company personal; do
    if [ -d "$AI_REPO_DIR/$d/rules/hooks" ]; then
      for f in "$AI_REPO_DIR"/$d/rules/hooks/*.hook; do
        [ -f "$f" ] || continue
        cp "$f" "$tmp_hooks/"
        hooks_found=$((hooks_found + 1))
      done
    fi
  done
  if [ "$hooks_found" -gt 0 ] && [ -f "$converter" ]; then
    node "$converter" "$tmp_hooks" "$claude_dir/hooks-rules.md" >/dev/null
    info "已转换 $hooks_found 个 hook → .claude/hooks-rules.md"
    # 重新生成 CLAUDE.md 以包含 hook import（因为之前 hooks-rules.md 可能刚生成）
    cmd_install_regen_hook_section "$project_dir" "$rel"
  else
    rm -f "$claude_dir/hooks-rules.md"
  fi
  rm -rf "$tmp_hooks"

  # ---- 3. 复制 MCP 配置（公司优先）----
  local mcp_src=""
  if [ -f "$AI_REPO_DIR/company/mcp/settings.json" ]; then
    mcp_src="$AI_REPO_DIR/company/mcp/settings.json"
    info "MCP 配置来源: 公司规范（含真实凭据）"
  elif [ -f "$AI_REPO_DIR/company/mcp/settings.template.json" ]; then
    mcp_src="$AI_REPO_DIR/company/mcp/settings.template.json"
    warn "MCP 配置来源: 公司模板（需填真实凭据）"
  elif [ -f "$AI_REPO_DIR/personal/mcp/settings.template.json" ]; then
    mcp_src="$AI_REPO_DIR/personal/mcp/settings.template.json"
    warn "MCP 配置来源: 个人模板（需填真实凭据）"
  fi
  if [ -n "$mcp_src" ]; then
    cp "$mcp_src" "$project_dir/.mcp.json"
    info "已生成: .mcp.json（项目级 MCP 配置）"
    # .mcp.json 含凭据，确保被 gitignore
    if ! grep -qx '.mcp.json' "$project_dir/.gitignore" 2>/dev/null; then
      printf '\n# MCP 配置（含凭据，勿提交）\n.mcp.json\n' >> "$project_dir/.gitignore"
      info "已将 .mcp.json 加入 .gitignore"
    fi
  fi

  # ---- 4. 复制 sql-guard.json（如不存在）----
  if [ ! -f "$project_dir/sql-guard.json" ]; then
    local guard_src=""
    [ -f "$AI_REPO_DIR/company/rules/hooks/sql-guard.template.json" ] && guard_src="$AI_REPO_DIR/company/rules/hooks/sql-guard.template.json"
    [ -z "$guard_src" ] && [ -f "$AI_REPO_DIR/personal/rules/hooks/sql-guard.template.json" ] && guard_src="$AI_REPO_DIR/personal/rules/hooks/sql-guard.template.json"
    if [ -n "$guard_src" ]; then
      cp "$guard_src" "$project_dir/sql-guard.json"
      info "已生成: sql-guard.json（请按项目修改 allowedDatabases）"
    fi
  else
    info "sql-guard.json 已存在，保留"
  fi

  echo ""
  step "安装完成。生成文件："
  echo "  - $project_dir/CLAUDE.md       （分层规则入口）"
  echo "  - $claude_dir/hooks-rules.md   （hook 转换规则，如有）"
  echo "  - $project_dir/.mcp.json       （MCP 配置，已 gitignore）"
  echo "  - $project_dir/sql-guard.json  （SQL 安全配置，如有）"
  echo ""
  info "更新下层规范：cd $AI_REPO_DIR && ./sync.sh pull"
  info "Claude Code 重启后自动读取最新规则"
}

# 重新写 CLAUDE.md 的 hook 区段（处理 hook 转换与 CLAUDE.md 生成的顺序依赖）
cmd_install_regen_hook_section() {
  local project_dir="$1" rel="$2"
  local claude_md="$project_dir/CLAUDE.md"
  # 如果 CLAUDE.md 还没包含 hook import 行，追加
  if ! grep -q "hooks-rules.md" "$claude_md" 2>/dev/null; then
    {
      echo ""
      echo "## Hook 规则（由 .hook 自动转换）"
      echo ""
      echo "@.claude/hooks-rules.md"
      echo ""
    } >> "$claude_md"
  fi
}

# ============ 主入口 ============
case "${1:-}" in
  pull)    cmd_pull ;;
  push)    cmd_push "${2:-update ai rules}" ;;
  install) cmd_install "${2:-.}" ;;
  status)  cmd_status ;;
  *)       usage; exit 1 ;;
esac
