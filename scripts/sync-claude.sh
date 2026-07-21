#!/bin/bash
#
# Claude Code 同步脚本
#
# 从 ai-repository 通用规范生成 Claude Code 专属配置:
#   - 项目级 CLAUDE.md（@import 引用 ai-repository 源文件，改源即生效）
#   - 项目级 .mcp.json
#   - 项目级 sql-guard.json
#   - 用户级 SessionStart hook（bootstrap，换电脑用）
#
# 用法:
#   ./sync-claude.sh install [project-dir]   # 为项目生成分层 CLAUDE.md（默认当前目录）
#   ./sync-claude.sh bootstrap                # 注册 SessionStart hook 到 ~/.claude/settings.json
#

set -e

# 脚本在 ai-repository/scripts/ 下，上一级即 ai-repository 根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_REPO_DIR="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
step()  { echo -e "${BLUE}[STEP]${NC} $1"; }

usage() {
  cat <<EOF
Claude Code 同步脚本

用法:
  ./sync-claude.sh install [project-dir]   为项目生成分层 CLAUDE.md（默认当前目录）
  ./sync-claude.sh bootstrap                注册 SessionStart hook 到 ~/.claude/settings.json
EOF
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
    echo "> 本文件由 \`ai-repository/scripts/sync-claude.sh install\` 生成。"
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

    if [ -f "$claude_dir/hooks-rules.md" ]; then
      echo "## Hook 规则（由通用规则自动转换）"
      echo ""
      echo "@.claude/hooks-rules.md"
      echo ""
    fi
  } > "$claude_md"
  info "已生成: CLAUDE.md"

  # ---- 2. 转换通用规则 → hooks-rules.md ----
  local converter="$AI_REPO_DIR/personal/tools/hook-converter.js"
  local hooks_found=0
  local tmp_rules=$(mktemp -d)
  for d in company personal; do
    if [ -d "$AI_REPO_DIR/$d/rules/hooks" ]; then
      for f in "$AI_REPO_DIR"/$d/rules/hooks/*.rule.json; do
        [ -f "$f" ] || continue
        cp "$f" "$tmp_rules/"
        hooks_found=$((hooks_found + 1))
      done
    fi
  done
  if [ "$hooks_found" -gt 0 ] && [ -f "$converter" ]; then
    node "$converter" "$tmp_rules" "$claude_dir/hooks-rules.md" >/dev/null
    info "已转换 $hooks_found 个规则 → .claude/hooks-rules.md"
    if ! grep -q "hooks-rules.md" "$claude_md" 2>/dev/null; then
      {
        echo ""
        echo "## Hook 规则（由通用规则自动转换）"
        echo ""
        echo "@.claude/hooks-rules.md"
        echo ""
      } >> "$claude_md"
    fi
  else
    rm -f "$claude_dir/hooks-rules.md"
  fi
  rm -rf "$tmp_rules"

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
  echo "  - $claude_dir/hooks-rules.md   （规则转换结果，如有）"
  echo "  - $project_dir/.mcp.json       （MCP 配置，已 gitignore）"
  echo "  - $project_dir/sql-guard.json  （SQL 安全配置，如有）"
  echo ""
  info "更新下层规范：cd $AI_REPO_DIR && ./sync.sh pull"
  info "Claude Code 重启后自动读取最新规则"
}

# ============ bootstrap：注册全局 hook（换电脑用）============
cmd_bootstrap() {
  local settings="$HOME/.claude/settings.json"
  mkdir -p "$(dirname "$settings")"
  step "注册 SessionStart hook 到用户级 settings.json..."
  node -e '
    const fs = require("fs");
    const settingsPath = process.argv[1];
    const hookScript = process.argv[2];
    let cfg = {};
    if (fs.existsSync(settingsPath)) {
      try { cfg = JSON.parse(fs.readFileSync(settingsPath, "utf-8")); } catch(e) { cfg = {}; }
    }
    cfg.hooks = cfg.hooks || {};
    cfg.hooks.SessionStart = cfg.hooks.SessionStart || [];
    let removed = 0;
    cfg.hooks.SessionStart = cfg.hooks.SessionStart.filter(g => {
      const before = (g.hooks || []).length;
      g.hooks = (g.hooks || []).filter(h =>
        !(h.args || []).some(a => typeof a === "string" && a.includes("on-session-start.sh"))
      );
      removed += before - g.hooks.length;
      return (g.hooks || []).length > 0;
    });
    cfg.hooks.SessionStart.push({
      matcher: "startup|resume",
      hooks: [{ type: "command", command: "bash", args: [hookScript], timeout: 30 }]
    });
    fs.writeFileSync(settingsPath, JSON.stringify(cfg, null, 2) + "\n");
    console.log(removed > 0
      ? "已更新 SessionStart hook（替换 " + removed + " 条旧配置）→ " + settingsPath
      : "已注入 SessionStart hook → " + settingsPath);
  ' "$settings" "$AI_REPO_DIR/hooks/on-session-start.sh"
  info "完成。新会话启动时将自动 pull ai-repository。"
  info "验证: 在 Claude Code 运行 /hooks"
}

case "${1:-}" in
  install)   cmd_install "${2:-.}" ;;
  bootstrap) cmd_bootstrap ;;
  *)         usage; exit 1 ;;
esac
