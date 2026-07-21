#!/bin/bash
#
# Codex 同步脚本
#
# 把 ai-repository 通用规范转换为 Codex 格式，同步到全局：
#   - steering + hooks → ~/.codex/AGENTS.md（合并为文本，用标记包裹，可重复同步不重复）
#   - mcp（JSON）→ ~/.codex/config.toml 的 [mcp_servers.xxx]（安全追加，不覆盖现有内容）
#
# 用法:
#   ./sync-codex.sh sync     # 同步公司 + 个人规范到 ~/.codex/（默认）
#   ./sync-codex.sh status   # 查看 ~/.codex/ 当前同步状态
#
# 说明:
#   Codex 无 hook 机制，无法自动同步，需手动运行本脚本。
#   config.toml 的 MCP 合并只增不删：已存在同名 server 则跳过，不会破坏你手改的内容。
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_REPO_DIR="$(dirname "$SCRIPT_DIR")"
CODEX_DIR="$HOME/.codex"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
step()  { echo -e "${BLUE}[STEP]${NC} $1"; }

usage() {
  cat <<EOF
Codex 同步脚本（同步到全局 ~/.codex/）

用法:
  ./sync-codex.sh sync     同步公司 + 个人规范到 ~/.codex/
  ./sync-codex.sh status   查看 ~/.codex/ 当前同步状态

注意: Codex 无 hook 机制，无法自动同步，需手动运行本脚本更新。
EOF
}

BEGIN_MARK="<!-- ai-repository:begin (自动生成，请勿手动编辑此区块) -->"
END_MARK="<!-- ai-repository:end -->"

cmd_sync() {
  step "同步规范到 ~/.codex/ ..."
  mkdir -p "$CODEX_DIR"

  # ---- 1. 合并 steering + 转换后的 hook 规则 → AGENTS.md ----
  local converter="$AI_REPO_DIR/personal/tools/hook-converter.js"
  local agents_md="$CODEX_DIR/AGENTS.md"
  [ -f "$agents_md" ] || touch "$agents_md"

  local block=$(mktemp)
  {
    echo "$BEGIN_MARK"
    echo ""
    echo "# 通用规范（来自 ai-repository，优先级：公司 > 个人）"
    echo ""

    for d in personal company; do
      if ls "$AI_REPO_DIR"/$d/rules/steering/*.md >/dev/null 2>&1; then
        local label="个人规范"
        [ "$d" = "company" ] && label="公司规范"
        echo "## $label"
        echo ""
        for f in "$AI_REPO_DIR"/$d/rules/steering/*.md; do
          [ -f "$f" ] || continue
          cat "$f"
          echo ""
        done
      fi
    done

    # hook 规则转换（复用 hook-converter.js 的输出）
    local tmp_rules=$(mktemp -d)
    local hooks_found=0
    for d in personal company; do
      if [ -d "$AI_REPO_DIR/$d/rules/hooks" ]; then
        for f in "$AI_REPO_DIR"/$d/rules/hooks/*.rule.json; do
          [ -f "$f" ] || continue
          cp "$f" "$tmp_rules/"
          hooks_found=$((hooks_found + 1))
        done
      fi
    done
    if [ "$hooks_found" -gt 0 ] && [ -f "$converter" ]; then
      node "$converter" "$tmp_rules"
    fi
    rm -rf "$tmp_rules"

    echo ""
    echo "$END_MARK"
  } > "$block"

  # 用标记替换旧区块，或在文件末尾追加（保留标记外的手写内容）
  if grep -qF "$BEGIN_MARK" "$agents_md" 2>/dev/null; then
    node -e '
      const fs = require("fs");
      const [, agentsPath, blockPath, beginMark, endMark] = process.argv;
      const content = fs.readFileSync(agentsPath, "utf-8");
      const block = fs.readFileSync(blockPath, "utf-8");
      const beginIdx = content.indexOf(beginMark);
      const endIdx = content.indexOf(endMark) + endMark.length;
      const updated = content.slice(0, beginIdx) + block.trim() + content.slice(endIdx);
      fs.writeFileSync(agentsPath, updated);
    ' "$agents_md" "$block" "$BEGIN_MARK" "$END_MARK"
    info "已更新 AGENTS.md 中的 ai-repository 区块"
  else
    {
      [ -s "$agents_md" ] && echo ""
      cat "$block"
    } >> "$agents_md"
    info "已追加 ai-repository 区块到 AGENTS.md（原有内容保留）"
  fi
  rm -f "$block"

  # ---- 2. MCP 配置 JSON → TOML，安全合并进 config.toml ----
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
    local config_toml="$CODEX_DIR/config.toml"
    [ -f "$config_toml" ] || touch "$config_toml"
    # 备份
    cp "$config_toml" "$config_toml.bak"

    node -e '
      const fs = require("fs");
      const [, mcpJsonPath, tomlPath] = process.argv;
      const mcp = JSON.parse(fs.readFileSync(mcpJsonPath, "utf-8"));
      let toml = fs.readFileSync(tomlPath, "utf-8");
      const servers = mcp.mcpServers || {};
      let addedCount = 0, skippedCount = 0;

      for (const [name, cfg] of Object.entries(servers)) {
        const header = `[mcp_servers.${name}]`;
        if (toml.includes(header)) {
          console.log(`跳过（已存在）: ${name}`);
          skippedCount++;
          continue;
        }
        const lines = [``, header];
        if (cfg.command) lines.push(`command = ${JSON.stringify(cfg.command)}`);
        if (Array.isArray(cfg.args)) {
          lines.push(`args = [${cfg.args.map(a => JSON.stringify(a)).join(", ")}]`);
        }
        if (cfg.env && Object.keys(cfg.env).length > 0) {
          lines.push(``, `[mcp_servers.${name}.env]`);
          for (const [k, v] of Object.entries(cfg.env)) {
            lines.push(`${k} = ${JSON.stringify(String(v))}`);
          }
        }
        toml += lines.join("\n") + "\n";
        console.log(`新增: ${name}`);
        addedCount++;
      }

      fs.writeFileSync(tomlPath, toml);
      console.log(`完成: 新增 ${addedCount} 个，跳过 ${skippedCount} 个（已存在，不覆盖）`);
    ' "$mcp_src" "$config_toml"
    info "已合并 MCP 配置 → config.toml（备份: config.toml.bak）"
  fi

  echo ""
  step "同步完成："
  echo "  - ~/.codex/AGENTS.md    （ai-repository 区块已更新，标记内自动生成/标记外手写保留）"
  echo "  - ~/.codex/config.toml  （MCP 已合并，仅新增不覆盖，备份见 config.toml.bak）"
  echo ""
  info "提醒: Codex 无 hook 机制，规范更新后需重新运行本脚本"
}

cmd_status() {
  echo "=== ~/.codex/AGENTS.md ==="
  if [ -f "$CODEX_DIR/AGENTS.md" ] && grep -qF "$BEGIN_MARK" "$CODEX_DIR/AGENTS.md" 2>/dev/null; then
    echo "已同步（含 ai-repository 区块）"
  else
    echo "未同步"
  fi
  echo ""
  echo "=== ~/.codex/config.toml 的 mcp_servers ==="
  grep '^\[mcp_servers\.' "$CODEX_DIR/config.toml" 2>/dev/null || echo "(无)"
}

case "${1:-sync}" in
  sync)   cmd_sync ;;
  status) cmd_status ;;
  *)      usage; exit 1 ;;
esac
