#!/bin/bash
#
# AI 配置同步脚本
#
# 用法:
#   ./sync.sh                    # 使用默认路径（当前项目根目录）
#   ./sync.sh /path/to/project   # 指定项目路径
#
# 前置条件:
#   项目根目录下有 .ai-repo/ 目录（即 ai-repository 的 submodule）
#
# 同步逻辑:
#   1. 读取项目根目录的 .ai-rules.json（可选，无则使用默认配置）
#   2. 合并 steering 规则 → CLAUDE.md（公司 > 个人）
#   3. 转换 hooks → CLAUDE.md（通过 hook-converter.js）
#   4. 复制 MCP 配置 → .claude/mcp.json（公司 > 个人）
#   5. 复制 skills → ~/.claude/skills/（全局级，可选）

set -e

# ========== 配置 ==========

PROJECT_DIR="${1:-.}"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"
AI_REPO_DIR="$PROJECT_DIR/.ai-repo"
CLAUDE_DIR="$PROJECT_DIR/.claude"
RULES_FILE="$PROJECT_DIR/.ai-rules.json"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ========== 检查 ==========

if [ ! -d "$AI_REPO_DIR" ]; then
  log_error "未找到 .ai-repo/ 目录，请先添加 submodule:"
  echo "  git submodule add git@github.com:simonAmoury/ai-repository.git .ai-repo"
  exit 1
fi

# 确保 .claude 目录存在
mkdir -p "$CLAUDE_DIR"

# ========== 读取项目配置 ==========

USE_COMPANY=true
USE_PERSONAL=true
OVERRIDES=""

if [ -f "$RULES_FILE" ]; then
  log_info "读取项目配置: $RULES_FILE"
  # 用 node 解析 JSON（比 jq 更通用）
  USE_COMPANY=$(node -e "const c=require('$RULES_FILE'); console.log(c.useCompany !== false)" 2>/dev/null || echo "true")
  USE_PERSONAL=$(node -e "const c=require('$RULES_FILE'); console.log(c.usePersonal !== false)" 2>/dev/null || echo "true")
else
  log_info "未找到 .ai-rules.json，使用默认配置（公司 + 个人规范全部启用）"
fi

# ========== 同步 MCP 配置 ==========

sync_mcp() {
  local target="$CLAUDE_DIR/mcp.json"
  local source=""

  if [ "$USE_COMPANY" = "true" ] && [ -f "$AI_REPO_DIR/company/mcp/settings.json" ]; then
    source="$AI_REPO_DIR/company/mcp/settings.json"
    log_info "MCP 配置来源: 公司规范"
  elif [ "$USE_COMPANY" = "true" ] && [ -f "$AI_REPO_DIR/company/mcp/settings.template.json" ]; then
    source="$AI_REPO_DIR/company/mcp/settings.template.json"
    log_warn "MCP 配置来源: 公司模板（请填入真实凭据）"
  elif [ "$USE_PERSONAL" = "true" ] && [ -f "$AI_REPO_DIR/personal/mcp/settings.template.json" ]; then
    source="$AI_REPO_DIR/personal/mcp/settings.template.json"
    log_info "MCP 配置来源: 个人模板（请填入真实凭据）"
  fi

  if [ -n "$source" ]; then
    cp "$source" "$target"
    log_info "已同步 MCP 配置 → .claude/mcp.json"
  else
    log_warn "未找到可用的 MCP 配置"
  fi
}

# ========== 同步 Steering 规则 ==========

sync_steering() {
  local output="$CLAUDE_DIR/CLAUDE.md"
  local temp_file=$(mktemp)

  echo "# 项目规则（自动生成）" > "$temp_file"
  echo "" >> "$temp_file"
  echo "> 由 ai-repository sync.sh 自动生成，请勿手动编辑" >> "$temp_file"
  echo "> 重新同步: \`cd .ai-repo && ./sync.sh ..\`" >> "$temp_file"
  echo "" >> "$temp_file"

  # 先加公司规范（优先级高）
  if [ "$USE_COMPANY" = "true" ] && [ -d "$AI_REPO_DIR/company/rules/steering" ]; then
    for f in "$AI_REPO_DIR"/company/rules/steering/*.md; do
      [ -f "$f" ] || continue
      echo "--- 公司规范: $(basename "$f" .md) ---" >> "$temp_file"
      cat "$f" >> "$temp_file"
      echo "" >> "$temp_file"
      log_info "已加载公司规范: $(basename "$f")"
    done
  fi

  # 再加个人规范
  if [ "$USE_PERSONAL" = "true" ] && [ -d "$AI_REPO_DIR/personal/rules/steering" ]; then
    for f in "$AI_REPO_DIR"/personal/rules/steering/*.md; do
      [ -f "$f" ] || continue
      echo "--- 个人规范: $(basename "$f" .md) ---" >> "$temp_file"
      cat "$f" >> "$temp_file"
      echo "" >> "$temp_file"
      log_info "已加载个人规范: $(basename "$f")"
    done
  fi

  # 项目级覆盖
  if [ -f "$PROJECT_DIR/.ai-overrides.md" ]; then
    echo "--- 项目覆盖 ---" >> "$temp_file"
    cat "$PROJECT_DIR/.ai-overrides.md" >> "$temp_file"
    echo "" >> "$temp_file"
    log_info "已加载项目覆盖: .ai-overrides.md"
  fi

  mv "$temp_file" "$output"
  log_info "已生成 CLAUDE.md"
}

# ========== 转换 Hooks ==========

sync_hooks() {
  local converter="$AI_REPO_DIR/personal/tools/hook-converter.js"
  local hooks_dir=""
  local temp_hooks=$(mktemp)

  # 收集 hooks（公司 + 个人）
  if [ "$USE_COMPANY" = "true" ] && [ -d "$AI_REPO_DIR/company/rules/hooks" ]; then
    hooks_dir="$AI_REPO_DIR/company/rules/hooks"
  elif [ "$USE_PERSONAL" = "true" ] && [ -d "$AI_REPO_DIR/personal/rules/hooks" ]; then
    hooks_dir="$AI_REPO_DIR/personal/rules/hooks"
  fi

  if [ -z "$hooks_dir" ]; then
    log_warn "未找到 hooks 目录"
    return
  fi

  # 统计 .hook 文件数量
  hook_count=$(find "$hooks_dir" -name "*.hook" -type f | wc -l)
  if [ "$hook_count" -eq 0 ]; then
    log_info "无 .hook 文件需要转换"
    return
  fi

  # 运行转换器
  if [ -f "$converter" ]; then
    node "$converter" "$hooks_dir" "$CLAUDE_DIR/HOOKS.md"
    log_info "已转换 $hook_count 个 hook → .claude/HOOKS.md"

    # 追加到 CLAUDE.md
    if [ -f "$CLAUDE_DIR/HOOKS.md" ]; then
      echo "" >> "$CLAUDE_DIR/CLAUDE.md"
      cat "$CLAUDE_DIR/HOOKS.md" >> "$CLAUDE_DIR/CLAUDE.md"
      rm "$CLAUDE_DIR/HOOKS.md"
      log_info "已合并 hook 规则到 CLAUDE.md"
    fi
  else
    log_warn "未找到 hook-converter.js，跳过 hooks 转换"
  fi
}

# ========== 复制 SQL Guard 配置 ==========

sync_sql_guard() {
  local target="$PROJECT_DIR/sql-guard.json"
  local source=""

  if [ -f "$target" ]; then
    log_info "sql-guard.json 已存在，跳过"
    return
  fi

  if [ "$USE_COMPANY" = "true" ] && [ -f "$AI_REPO_DIR/company/rules/hooks/sql-guard.template.json" ]; then
    source="$AI_REPO_DIR/company/rules/hooks/sql-guard.template.json"
  elif [ "$USE_PERSONAL" = "true" ] && [ -f "$AI_REPO_DIR/personal/rules/hooks/sql-guard.template.json" ]; then
    source="$AI_REPO_DIR/personal/rules/hooks/sql-guard.template.json"
  fi

  if [ -n "$source" ]; then
    cp "$source" "$target"
    log_info "已复制 sql-guard.template.json → sql-guard.json（请根据项目修改）"
  fi
}

# ========== 执行 ==========

log_info "开始同步 AI 配置..."
log_info "项目路径: $PROJECT_DIR"
log_info "规范来源: 公司=$USE_COMPANY, 个人=$USE_PERSONAL"
echo ""

sync_mcp
sync_steering
sync_hooks
sync_sql_guard

echo ""
log_info "同步完成！"
log_info "生成的文件:"
echo "  - $CLAUDE_DIR/CLAUDE.md   (steering 规则 + hook 规则)"
echo "  - $CLAUDE_DIR/mcp.json    (MCP 服务器配置)"
echo "  - $PROJECT_DIR/sql-guard.json (SQL 安全配置，如有)"
