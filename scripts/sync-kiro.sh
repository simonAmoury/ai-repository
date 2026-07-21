#!/bin/bash
#
# Kiro 同步脚本
#
# 把 ai-repository 通用规范转换为 Kiro 原生格式，同步到全局 ~/.kiro/：
#   - steering  → ~/.kiro/steering/*.md（直接复制，Markdown 通用）
#   - hooks     → ~/.kiro/hooks/*.kiro.hook（.rule.json 补后缀，Kiro 原生 JSON 结构）
#   - mcp       → ~/.kiro/settings/mcp.json
#
# 用法:
#   ./sync-kiro.sh sync     # 同步公司 + 个人规范到 ~/.kiro/（默认）
#   ./sync-kiro.sh status   # 查看 ~/.kiro/ 当前来自 ai-repository 的哪些文件
#
# 说明:
#   Kiro 没有会话启动 hook，无法像 Claude 一样自动 pull。
#   需要你手动运行本脚本来更新 ~/.kiro/ 下的规范。
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_REPO_DIR="$(dirname "$SCRIPT_DIR")"
KIRO_DIR="$HOME/.kiro"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
step()  { echo -e "${BLUE}[STEP]${NC} $1"; }

usage() {
  cat <<EOF
Kiro 同步脚本（同步到全局 ~/.kiro/，对所有 Kiro 项目生效）

用法:
  ./sync-kiro.sh sync     同步公司 + 个人规范到 ~/.kiro/
  ./sync-kiro.sh status   查看 ~/.kiro/ 当前同步状态

注意: Kiro 无会话启动钩子，无法自动 pull，需手动运行本脚本更新。
EOF
}

# 标记文件头，用于标识"这是 ai-repository 同步生成的"，方便 status 识别/未来清理
MARK="<!-- synced-from: ai-repository -->"
MARK_JSON_KEY="_syncedFromAiRepo"

cmd_sync() {
  step "同步规范到 ~/.kiro/ ..."
  mkdir -p "$KIRO_DIR/steering" "$KIRO_DIR/hooks" "$KIRO_DIR/settings"

  # ---- 1. steering：直接复制（公司优先，同名覆盖）----
  local steering_count=0
  for d in personal company; do
    if [ -d "$AI_REPO_DIR/$d/rules/steering" ]; then
      for f in "$AI_REPO_DIR"/$d/rules/steering/*.md; do
        [ -f "$f" ] || continue
        local name=$(basename "$f")
        cp "$f" "$KIRO_DIR/steering/$name"
        steering_count=$((steering_count + 1))
        info "steering: $name（来源: $d）"
      done
    fi
  done
  info "已同步 $steering_count 个 steering 文件"

  # ---- 2. hooks：.rule.json → .kiro.hook（原生 JSON 结构，直接改扩展名复制）----
  local hook_count=0
  for d in personal company; do
    if [ -d "$AI_REPO_DIR/$d/rules/hooks" ]; then
      for f in "$AI_REPO_DIR"/$d/rules/hooks/*.rule.json; do
        [ -f "$f" ] || continue
        local base=$(basename "$f" .rule.json)
        cp "$f" "$KIRO_DIR/hooks/${base}.kiro.hook"
        hook_count=$((hook_count + 1))
        info "hook: ${base}.kiro.hook（来源: $d）"
      done
    fi
  done
  info "已同步 $hook_count 个 hook 文件"

  # ---- 3. MCP 配置（公司优先）----
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
    if [ -f "$KIRO_DIR/settings/mcp.json" ]; then
      warn "~/.kiro/settings/mcp.json 已存在，跳过（避免覆盖手改内容，如需强制更新请手动删除后重跑）"
    else
      cp "$mcp_src" "$KIRO_DIR/settings/mcp.json"
      info "已生成: ~/.kiro/settings/mcp.json"
    fi
  fi

  echo ""
  step "同步完成："
  echo "  - ~/.kiro/steering/*.md      ($steering_count 个)"
  echo "  - ~/.kiro/hooks/*.kiro.hook  ($hook_count 个)"
  echo "  - ~/.kiro/settings/mcp.json"
  echo ""
  info "提醒: Kiro 无会话启动钩子，规范更新后需重新运行本脚本"
}

cmd_status() {
  echo "=== ~/.kiro/steering/ ==="
  ls "$KIRO_DIR/steering/" 2>/dev/null || echo "(空)"
  echo ""
  echo "=== ~/.kiro/hooks/ ==="
  ls "$KIRO_DIR/hooks/" 2>/dev/null || echo "(空)"
  echo ""
  echo "=== ~/.kiro/settings/mcp.json ==="
  [ -f "$KIRO_DIR/settings/mcp.json" ] && echo "存在" || echo "不存在"
}

case "${1:-sync}" in
  sync)   cmd_sync ;;
  status) cmd_status ;;
  *)      usage; exit 1 ;;
esac
