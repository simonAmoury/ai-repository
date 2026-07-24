#!/usr/bin/env bash
#
# link-claude.sh — 把 ai-repository 通用配置接入到 Claude Code
#
# 两个子命令:
#
#   bash link-claude.sh [项目目录]     接入「项目」(默认)。引入规则/MCP/sql-guard。
#                                     skills 不在此处理(见下)。
#   bash link-claude.sh skills        一次性安装「全局 skills」到 ~/.claude/skills/,
#                                     对所有项目生效。装一次即可。
#
# 为什么 skills 单独走全局:
#   deploy-to-vercel / find-skills / terminal-title 等是通用能力,放 ~/.claude/skills/
#   装一次,所有项目共享;无需每个项目重复链接或复制。
#   同时扫描 company/skills 与 personal/skills;同名时公司级优先(先装占位,personal 跳过)。
#
# 接入策略(项目接入,混合方案,兼顾"动态"与 Windows 兼容):
#   - steering 规则 + 转换后的 hook 规则 → 写进 CLAUDE.md 的 @import(相对路径,动态;
#     改仓库即生效,重启 Claude 读取最新内容,无需任何系统权限)
#   - MCP / sql-guard                → 落地生成到项目根(需真实凭据,不能纯链接)
#
# 幂等:可重复运行。已存在的 .mcp.json / sql-guard.json 不会被覆盖;CLAUDE.md 只更新
#       标记区(start~end)之间的内容,标记区外由你自由编辑。
#

set -euo pipefail

# Windows(Git Bash/MSYS)下让 ln -s 创建原生符号链接(需已开启「开发者模式」);
# 创建失败时由各 ln 之后的 cp 回退兜底。非 Windows 环境此变量无副作用。
export MSYS=winsymlinks:nativestrict

# ---- 自定位仓库(脚本位于 <repo>/scripts/ 下,换电脑/换路径自适应)----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# 颜色输出
G='\033[0;32m'; Y='\033[1;33m'; B='\033[0;34m'; R='\033[0;31m'; N='\033[0m'
info() { printf "${G}[INFO]${N} %s\n" "$1"; }
warn() { printf "${Y}[WARN]${N} %s\n" "$1"; }
step() { printf "${B}[STEP]${N} %s\n" "$1"; }

usage() {
  cat <<EOF
link-claude.sh — 把 ai-repository 接入 Claude Code

用法:
  bash link-claude.sh [项目目录]     接入项目(规则 @import + MCP + sql-guard)。默认当前目录
  bash link-claude.sh skills        一次性:把仓库 skills 软链接到全局 ~/.claude/skills/
  bash link-claude.sh -h|--help     显示本帮助

说明:
  - skills 是通用能力,放全局装一次即可(`skills` 子命令),不随项目重复链接。
  - 项目接入只处理规则/MCP/sql-guard;改仓库规则后重启 Claude 即生效(@import 动态引用)。
EOF
}

# ============================================================
# 前置检查(两个子命令共用)
# ============================================================
precheck() {
  if [ ! -d "$AI_REPO_DIR/personal" ]; then
    printf "${R}[ERROR]${N} 未找到仓库结构 (personal/),脚本位置异常\n" >&2
    exit 1
  fi
  if ! command -v node >/dev/null 2>&1; then
    printf "${R}[ERROR]${N} 需要 node(用于路径计算与规则转换)\n" >&2
    exit 1
  fi
}

# ============================================================
# 子命令: skills —— 一次性全局安装到 ~/.claude/skills/
# ============================================================
cmd_skills() {
  precheck
  local dest="$HOME/.claude/skills"
  mkdir -p "$dest"
  step "全局 skills 安装 → $dest"
  step "仓库: $AI_REPO_DIR"

  local linked=0 copied=0 skipped=0
  declare -A installed_this_run=()                     # 记录本次已装 skill 名,用于公司级优先
  shopt -s nullglob
  # company/skills 先装(公司级优先),personal/skills 后装。同名时后者跳过,保住先装的公司级——
  # 符合仓库分层约定「company > personal」。
  for d in "$AI_REPO_DIR"/company/skills/*/ "$AI_REPO_DIR"/personal/skills/*/; do
    d="${d%/}"
    [ -d "$d" ] || continue
    local name target
    name="$(basename "$d")"
    target="$dest/$name"
    if [ -n "${installed_this_run[$name]:-}" ]; then
      warn "$name 已由更高优先级层安装,跳过(公司级优先)"
      skipped=$((skipped+1)); continue
    fi
    if [ -L "$target" ]; then
      rm -f "$target"                                  # 上次遗留的软链接,重建
    elif [ -e "$target" ]; then
      warn "$name 已存在且非软链接,跳过(保留你的内容)"
      skipped=$((skipped+1)); continue
    fi
    # 全局用绝对路径软链接(机器级配置,仓库位置固定;移动仓库后重跑本命令即可)
    if ln -s "$d" "$target" 2>/dev/null && [ -L "$target" ]; then
      info "  链接 $name"; linked=$((linked+1))
    else
      rm -rf "$target" 2>/dev/null || true
      cp -r "$d" "$target"
      warn "  复制 $name(ln -s 未生效;Windows 请开启「开发者模式」后重跑改为真软链接)"
      copied=$((copied+1))
    fi
    installed_this_run[$name]=1
  done
  shopt -u nullglob

  echo ""
  info "全局 skills: 链接 $linked / 复制 $copied / 跳过 $skipped"
  info "重启 Claude Code 后,所有项目均可使用这些 skill。"
  [ "$copied" -gt 0 ] && warn "有 $copied 个 skill 是复制,仓库侧改动不会自动同步;开启 Windows 开发者模式后重跑可改为软链接。"
}

# ============================================================
# 子命令: project —— 接入项目(规则 + MCP + sql-guard,不含 skills)
# ============================================================
cmd_project() {
  precheck
  local project_dir="${1:-$PWD}"
  project_dir="$(cd "$project_dir" && pwd)"

  step "项目: $project_dir"
  step "仓库: $AI_REPO_DIR"

  mkdir -p "$project_dir/.claude"

  # ------------------------------------------------------------
  # 1) 生成 CLAUDE.md(管理 @import)+ .claude/hooks-rules.md(.rule.json 转换)
  # ------------------------------------------------------------
  step "生成 CLAUDE.md 与 hooks-rules.md..."

  local NODE_GEN="$(mktemp)"
  trap 'rm -f "$NODE_GEN"' EXIT
  cat > "$NODE_GEN" <<'NODE_EOF'
"use strict";
const fs = require("fs");
const path = require("path");

const repo = process.argv[2];
const proj = process.argv[3];

// proj -> repo 的相对路径(正斜杠),用于 @import,跟随移动不断
let rel = path.relative(proj, repo).split(path.sep).join("/");
if (rel === "") rel = ".";
if (rel.charAt(0) !== ".") rel = "./" + rel;

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort();
}
function listRules(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".rule.json")).sort()
    .map(f => path.join(dir, f));
}

const companySteering = listMd(path.join(repo, "company/rules/steering"));
const personalSteering = listMd(path.join(repo, "personal/rules/steering"));
const ruleFiles = []
  .concat(listRules(path.join(repo, "company/rules/hooks")))
  .concat(listRules(path.join(repo, "personal/rules/hooks")));

// ---- .rule.json -> markdown(复刻原 hook-converter.js 的转换规则)----
function convertHook(hook) {
  const lines = [];
  const whenType = (hook.when && hook.when.type) || "unknown";
  const toolTypes = (hook.when && hook.when.toolTypes) || [];
  const prompt = (hook.then && hook.then.prompt) || "";
  const toolDesc = toolTypes.map(t => "`" + t + "`").join(", ");
  lines.push("### " + hook.name, "");
  if (whenType === "preToolUse") {
    lines.push("**触发时机:** 使用 " + toolDesc + " 类型工具之前", "", "**必须遵守以下规则:**");
  } else if (whenType === "postToolUse") {
    lines.push("**触发时机:** 使用 " + toolDesc + " 类型工具之后", "", "**必须执行以下操作:**");
  } else {
    lines.push("**触发时机:** " + whenType + " - " + toolDesc, "");
  }
  lines.push("");
  for (const raw of prompt.split("\n")) {
    const t = raw.trim();
    if (!t) continue;
    if (/^(Step \d|步骤\s*\d)/i.test(t)) { lines.push("**" + t + "**"); continue; }
    if (/^\d+[a-z]\./i.test(t)) { lines.push("  - " + t); continue; }
    if (t.charAt(0) === '"' || t.charAt(0) === "{") { lines.push("  ```", "  " + t, "  ```"); continue; }
    lines.push("- " + t);
  }
  lines.push("");
  return lines.join("\n");
}

function generateHooksMd(files) {
  const hooks = [];
  for (const f of files) {
    try {
      const h = JSON.parse(fs.readFileSync(f, "utf8"));
      if (h && h.enabled) hooks.push(h);
    } catch (e) {
      console.error("  [解析失败] " + f);
    }
  }
  if (hooks.length === 0) return null;
  const out = [
    "# Hook 规则（自动生成）", "",
    "> 由 `link-claude.sh` 从 `.rule.json` 自动转换，请勿手动编辑；",
    "> 修改源 `.rule.json` 后重跑 `link-claude.sh` 即可。", ""
  ];
  const pre = hooks.filter(h => h.when && h.when.type === "preToolUse");
  const post = hooks.filter(h => h.when && h.when.type === "postToolUse");
  const other = hooks.filter(h => !(h.when && (h.when.type === "preToolUse" || h.when.type === "postToolUse")));
  if (pre.length)   { out.push("## 工具使用前规则", ""); pre.forEach(h => out.push(convertHook(h))); }
  if (post.length)  { out.push("## 工具使用后规则", ""); post.forEach(h => out.push(convertHook(h))); }
  if (other.length) { out.push("## 其他规则", ""); other.forEach(h => out.push(convertHook(h))); }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

const claudeDir = path.join(proj, ".claude");
fs.mkdirSync(claudeDir, { recursive: true });
const hooksFile = path.join(claudeDir, "hooks-rules.md");
const hooksMd = generateHooksMd(ruleFiles);
if (hooksMd) {
  fs.writeFileSync(hooksFile, hooksMd + "\n", "utf8");
} else if (fs.existsSync(hooksFile)) {
  fs.rmSync(hooksFile);
}

// ---- 组装 managed block(只此区由脚本维护)----
const block = [];
block.push("<!-- 由 ai-repository/scripts/link-claude.sh 自动维护，请勿手动编辑 start~end 之间的内容 -->");
if (companySteering.length) {
  block.push("", "## 公司规范", "");
  companySteering.forEach(f => { block.push("@" + rel + "/company/rules/steering/" + f, ""); });
}
if (personalSteering.length) {
  block.push("## 个人规范", "");
  personalSteering.forEach(f => { block.push("@" + rel + "/personal/rules/steering/" + f, ""); });
}
if (hooksMd) {
  block.push("## Hook 规则（由 .rule.json 自动转换）", "");
  block.push("@.claude/hooks-rules.md", "");
}
const START = "<!-- ai-repo-imports:start -->";
const END = "<!-- ai-repo-imports:end -->";
const wrapped = START + "\n" + block.join("\n") + "\n" + END;

const claudeMd = path.join(proj, "CLAUDE.md");
let content;
if (fs.existsSync(claudeMd)) {
  const orig = fs.readFileSync(claudeMd, "utf8");
  if (orig.indexOf(START) >= 0 && orig.indexOf(END) >= 0) {
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(esc(START) + "[\\s\\S]*?" + esc(END), "g");
    content = orig.replace(re, wrapped);
  } else {
    content = orig.replace(/\s+$/, "") + "\n\n" + wrapped + "\n";
  }
} else {
  content = [
    "# 项目规则", "",
    "> 本入口由 `ai-repository/scripts/link-claude.sh` 生成。",
    "> 分层优先级:**项目级(本节) > 公司规范 > 个人规范**,冲突以项目级为准。",
    "> 更新仓库规范后无需重跑,重启 Claude 即通过 `@import` 读取最新内容。", "",
    "## 项目级规则(最高优先级)", "",
    "<!-- 在此添加项目特有规则,会覆盖下方导入的通用规范 -->", "",
    "(暂无项目特有规则)", "",
    "---", "",
    wrapped, ""
  ].join("\n");
}
fs.writeFileSync(claudeMd, content, "utf8");

const nSteer = companySteering.length + personalSteering.length;
console.log("  CLAUDE.md: " + nSteer + " 条 steering @import" + (hooksMd ? " + hooks-rules.md" : " (无 hook 规则)"));
NODE_EOF

  node "$NODE_GEN" "$AI_REPO_DIR" "$project_dir"
  rm -f "$NODE_GEN"
  trap - EXIT

  # ------------------------------------------------------------
  # 2) MCP:落地生成 .mcp.json(优先真实 settings.json)
  # ------------------------------------------------------------
  step "生成 .mcp.json..."
  local mcp_dest="$project_dir/.mcp.json"
  if [ -e "$mcp_dest" ]; then
    info ".mcp.json 已存在,保留(不覆盖)"
  else
    local mcp_src=""
    if [ -f "$AI_REPO_DIR/company/mcp/settings.json" ]; then
      mcp_src="$AI_REPO_DIR/company/mcp/settings.json"
      info "MCP 来源: company/mcp/settings.json(真实凭据)"
    elif [ -f "$AI_REPO_DIR/company/mcp/settings.template.json" ]; then
      mcp_src="$AI_REPO_DIR/company/mcp/settings.template.json"
      warn "MCP 来源: company 模板(占位符)。建议先在仓库 company/mcp/settings.json 填好真实凭据再重跑"
    elif [ -f "$AI_REPO_DIR/personal/mcp/settings.template.json" ]; then
      mcp_src="$AI_REPO_DIR/personal/mcp/settings.template.json"
      warn "MCP 来源: personal 模板(占位符,需填真实凭据)"
    fi
    if [ -n "$mcp_src" ]; then
      cp "$mcp_src" "$mcp_dest"
    fi
  fi

  # .mcp.json 加入项目 .gitignore(含凭据)
  local gi="$project_dir/.gitignore"
  touch "$gi"
  grep -qxF '.mcp.json' "$gi" || printf '\n# MCP 配置（含凭据，勿提交）\n.mcp.json\n' >> "$gi"

  # ------------------------------------------------------------
  # 3) sql-guard.json:落地生成(SQL guard 规则依赖它)
  # ------------------------------------------------------------
  step "生成 sql-guard.json..."
  local sg_dest="$project_dir/sql-guard.json"
  if [ -e "$sg_dest" ]; then
    info "sql-guard.json 已存在,保留"
  else
    local sg_src=""
    if [ -f "$AI_REPO_DIR/company/rules/hooks/sql-guard.template.json" ]; then
      sg_src="$AI_REPO_DIR/company/rules/hooks/sql-guard.template.json"
    elif [ -f "$AI_REPO_DIR/personal/rules/hooks/sql-guard.template.json" ]; then
      sg_src="$AI_REPO_DIR/personal/rules/hooks/sql-guard.template.json"
    fi
    if [ -n "$sg_src" ]; then
      cp "$sg_src" "$sg_dest"
      info "已生成 sql-guard.json(请按项目修改 allowedDatabases)"
    fi
  fi
  grep -qxF 'sql-guard.json' "$gi" || printf '\n# SQL 白名单（可能含真实库名）\nsql-guard.json\n' >> "$gi"

  # ------------------------------------------------------------
  # 完成
  # ------------------------------------------------------------
  echo ""
  step "完成。项目已接入 ai-repository。生成/更新:"
  echo "  - $project_dir/CLAUDE.md             规则入口(项目级 + @import 公司/个人规范 + hook 规则)"
  echo "  - $project_dir/.claude/hooks-rules.md    .rule.json 转换结果"
  echo "  - $project_dir/.mcp.json             MCP(已 gitignore)"
  echo "  - $project_dir/sql-guard.json        SQL 白名单(已 gitignore)"
  echo ""
  info "重启 Claude Code 即读取最新规则;改仓库规范无需重跑(@import 自动生效)。"
  info "skills 请用「全局安装」: bash link-claude.sh skills(一次装,所有项目通用)"
}

# ============================================================
# 入口
# ============================================================
case "${1:-}" in
  skills)            shift || true; cmd_skills "$@" ;;
  -h|--help|help)    usage ;;
  *)                 cmd_project "${1:-}" ;;
esac
