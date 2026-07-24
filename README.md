# AI Repository

公司级与个人级 AI 配置的单一事实来源，通过统一核心转换为 Claude Code 或 Codex 所需格式。

## 分层与优先级

```text
项目级 > 公司级（company/） > 个人级（personal/）
```

- `company/`：公司规则、MCP、Skills，优先级高于个人配置。
- `personal/`：个人规则、MCP、Skills。
- 同名 MCP Server 和 Skill 由公司级覆盖个人级。
- 当前仅适配 Claude Code 与 Codex，不处理 Kiro。

## 目录结构

```text
ai-repository/
├── .githooks/                    # Skill 变化后的用户级自动同步 Hook
├── company/
│   ├── mcp/
│   ├── rules/
│   └── skills/
├── personal/
│   ├── mcp/
│   ├── rules/
│   └── skills/
├── src/
│   ├── core/                 # 统一加载、合并、转换和文件处理
│   └── adapters/             # Claude/Codex 策略适配器
├── scripts/
│   ├── ai-config.js          # 唯一主入口
│   └── link-claude.sh        # 旧 Claude 命令兼容入口
└── tests/
```

## 手动接入

所有操作均为手动执行，不注册会话 Hook，不自动拉取或同步。

```bash
# Claude：用户级安装 Skills
node scripts/ai-config.js claude skills

# Claude：接入项目
node scripts/ai-config.js claude install /path/to/project

# Codex：用户级安装 Skills
node scripts/ai-config.js codex skills

# Codex：接入项目
node scripts/ai-config.js codex install /path/to/project
```

不传项目目录时可显式使用当前目录：

```bash
node /path/to/ai-repository/scripts/ai-config.js codex install .
```

### Windows 使用示例

假设配置仓库位于 `D:\hub\ai-repository`，需要接入的项目位于 `D:\hub\awswaf`，可在 PowerShell 中执行：

```powershell
# 用户级安装 Claude Skills：写入当前用户的 ~/.claude/skills，通常每台机器只需执行一次
node D:\hub\ai-repository\scripts\ai-config.js claude skills

# 用户级安装 Codex Skills：写入当前用户的 ~/.agents/skills，通常每台机器只需执行一次
node D:\hub\ai-repository\scripts\ai-config.js codex skills

# 将 Claude 项目配置接入 D:\hub\awswaf
node D:\hub\ai-repository\scripts\ai-config.js claude install D:\hub\awswaf

# 将 Codex 项目配置接入 D:\hub\awswaf
node D:\hub\ai-repository\scripts\ai-config.js codex install D:\hub\awswaf
```

如果只使用 Codex，只需执行 `codex skills` 和 `codex install` 两条命令。`skills` 是用户级安装，不会写入 `D:\hub\awswaf`；`install` 才会在目标项目中生成或更新 Agent 配置。

## Skill 更新自动同步

首次完成用户级 Skill 安装后，在 `ai-repository` 根目录执行一次：

```powershell
node scripts\ai-config.js hooks install
```

该命令为当前仓库设置 `core.hooksPath=.githooks`。注册后，以下 Git 操作如果修改了 `company/skills/` 或 `personal/skills/`，会自动刷新用户级 Skills：

- `git pull` / `git merge`；
- 切换分支；
- 本地提交 Skill 变更。

同步规则：

- 已安装 `~/.claude/skills` 时同步 Claude；
- 已安装 `~/.agents/skills` 时同步 Codex；
- 未使用过的 Agent 不会被自动安装；
- 软链接 Skill 会重建链接；复制回退的 Skill 通过受管清单安全更新；
- 仅普通代码或文档变化时不会触发 Skill 同步；
- 自动同步失败只输出警告，不会阻断 Git 操作。

如果仓库已经配置了其他 `core.hooksPath`，安装命令会停止并提示冲突，不会覆盖已有 Hook。

## Claude 策略

### Skills

Claude Skills 安装到用户级 `~/.claude/skills/`：

- 优先创建指向本仓库 Skill 目录的链接；
- 链接失败时回退为复制；
- 已存在且不是链接的同名目录会保留，不覆盖。

Skills 不使用 `@import`，也不安装到项目 `.claude/skills/`。

### 项目生成物

| 文件 | 作用 |
|---|---|
| `CLAUDE.md` | 项目规则入口；托管区通过 `@import` 动态引用本仓库 steering |
| `.claude/hooks-rules.md` | `.rule.json` 转换后的文本规则 |
| `.mcp.json` | 项目 MCP 配置，已存在时不覆盖 |
| `sql-guard.json` | SQL 白名单模板，已存在时不覆盖 |

原有命令继续可用：

```bash
bash scripts/link-claude.sh skills
bash scripts/link-claude.sh /path/to/project
```

## Codex 策略

### Skills

Codex Skills 安装到用户级 `~/.agents/skills/`，链接及覆盖策略与 Claude 一致。

### 项目生成物

| 文件 | 作用 |
|---|---|
| `AGENTS.md` | 写入完整公司/个人规则；只更新 ai-repository 托管区 |
| `.codex/config.toml` | 项目级 MCP 配置；只更新 MCP 托管区 |
| `sql-guard.json` | SQL 白名单模板，已存在时不覆盖 |

Codex 不支持本仓库使用的 Claude `@import` 接线方式，因此规则源变更后需要重新执行一次 `codex install`。Skill 使用目录链接时无需重装。

如果 `.codex/config.toml` 已有项目手写的同名 MCP Server，脚本会保留手写配置并跳过该 Server。

## MCP 与凭据

- 每层优先读取被 Git 忽略的 `mcp/settings.json`，缺失时读取 `settings.template.json`。
- 先加载个人 MCP，再以公司同名 Server 覆盖。
- Claude 输出 `.mcp.json`；Codex 输出 `.codex/config.toml`。
- MCP 配置和 `sql-guard.json` 会加入目标项目的 `.git/info/exclude`，不会修改项目 `.gitignore`。
- 不要把真实凭据提交到仓库。

## 测试

```bash
node --test tests/ai-config.test.js
```

测试覆盖 Claude 兼容生成物、两种用户级 Skill 目录、Codex 生成物、幂等更新、手写规则保留和 MCP 冲突保护。
