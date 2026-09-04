# AI Repository

公司级与个人级 AI 配置的单一事实来源，通过统一核心转换为 Claude Code、Codex 或 Kiro 所需格式。

## 分层与优先级

```text
项目级 > 公司级（company/） > 个人级（personal/）
```

- `company/`：公司规则、MCP、Skills，优先级高于个人配置。
- `personal/`：个人规则、MCP、Skills。
- 同名 MCP Server 和 Skill 由公司级覆盖个人级。
- 当前适配 Claude Code、Codex 与 Kiro。

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
│   └── adapters/             # Claude/Codex/Kiro 策略适配器
├── scripts/
│   └── ai-config.js          # 唯一入口
└── tests/
```

## 新机器首次配置

Git 不会随仓库自动启用已提交的 `.githooks`。因此，每次在新机器首次克隆 `ai-repository` 后，需要完成一次用户级 Skill 安装和 Hook 注册：

```powershell
git clone git@github.com:simonAmoury/ai-repository.git D:\hub\ai-repository
cd D:\hub\ai-repository

# 创建本机公司级 MCP 真实配置，并填写主机、用户名、密码等真实值
Copy-Item company\mcp\settings.template.json company\mcp\settings.json
# 编辑 company\mcp\settings.json 后，再执行任何项目 install

# 按实际使用的 Agent 安装用户级 Skills 和 settings；不使用的 Agent 可以跳过
node scripts\ai-config.js claude skills
node scripts\ai-config.js codex skills
node scripts\ai-config.js kiro skills

# 为当前 ai-repository 启用 Skill 自动同步 Hook
node scripts\ai-config.js hooks install

# 初始化跨会话长期记忆库骨架（幂等，不覆盖已有内容）
node scripts\ai-config.js memory init
```

`hooks install` 会把 `core.hooksPath=.githooks` 写入当前仓库的本地 `.git/config`。该配置不会提交到远端，所以每台新机器、每份新克隆都需要执行一次；同一份仓库无需重复执行。

## 手动接入

Claude/Codex 项目接入均为手动执行，不注册 Agent 会话 Hook，也不会自动拉取仓库。用户级 Skill 的 Git 变更自动同步见后文。

```bash
# Claude：用户级安装 Skills 和 settings
node scripts/ai-config.js claude skills

# Claude：接入项目
node scripts/ai-config.js claude install /path/to/project

# Codex：用户级安装 Skills
node scripts/ai-config.js codex skills

# Codex：接入项目
node scripts/ai-config.js codex install /path/to/project

# Kiro：用户级安装 Skills
node scripts/ai-config.js kiro skills

# Kiro：接入项目
node scripts/ai-config.js kiro install /path/to/project
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

# 用户级安装 Kiro Skills：写入当前用户的 ~/.kiro/skills，通常每台机器只需执行一次
node D:\hub\ai-repository\scripts\ai-config.js kiro skills

# 将 Kiro 项目配置接入 D:\hub\awswaf
node D:\hub\ai-repository\scripts\ai-config.js kiro install D:\hub\awswaf
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
- 已安装 `~/.kiro/skills` 时同步 Kiro；
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

## Kiro 策略

### Skills

Kiro Skills 安装到用户级 `~/.kiro/skills/`，链接及覆盖策略与 Claude 一致。

### 项目生成物

| 文件 | 作用 |
|---|---|
| `.kiro/steering/ai-repository.md` | 写入完整公司/个人规则与 Hook 规则；只更新 ai-repository 托管区 |
| `.kiro/settings/mcp.json` | 项目 MCP 配置，已存在时不覆盖 |
| `sql-guard.json` | SQL 白名单模板，已存在时不覆盖 |

Kiro steering 的 `#[[file:...]]` 只能引用工作区内文件，无法指向本仓库，因此与 Codex 一样内联完整规则，规则源变更后需要重新执行一次 `kiro install`。Skill 使用目录链接时无需重装。

`.kiro/steering/` 是多文件目录，项目自有规则放在同目录其他 `.md` 中即可，脚本只维护 `ai-repository.md` 的托管区。

项目 `.kiro/settings/mcp.json` 已存在时不覆盖；需要用当前源配置重新生成时，删除该文件后重跑 `kiro install`。

## MCP 与凭据

- 新机器首次使用时，先复制公司级模板：

  ```powershell
  Copy-Item company\mcp\settings.template.json company\mcp\settings.json
  ```

- 打开 `company/mcp/settings.json`，将 `<your-host>`、`<your-user>`、`<your-password>` 等占位符替换为本机真实配置，然后再执行 Claude/Codex 的项目 `install`。
- `company/mcp/settings.json` 已被 Git 忽略，只保存在本机；远端只保留脱敏的 `settings.template.json`。
- 每层优先读取被 Git 忽略的 `mcp/settings.json`，缺失时读取 `settings.template.json`。
- 先加载个人 MCP，再以公司同名 Server 覆盖。
- Claude 输出 `.mcp.json`；Codex 输出 `.codex/config.toml`；Kiro 输出 `.kiro/settings/mcp.json`。
- MCP 配置和 `sql-guard.json` 会加入目标项目的 `.git/info/exclude`，不会修改项目 `.gitignore`。
- 不要把真实凭据提交到仓库。

### Claude 用户级 settings 托管

`node scripts/ai-config.js claude skills` 除了安装 Skills，还会合并 `~/.claude/settings.json`，托管以下配置项：

- **托管键（可进版本库）**：`env.ENABLE_TOOL_SEARCH`、`env.ANTHROPIC_BASE_URL`（去密钥化的 base URL）
- **本机保留键（不覆盖）**：`env.ANTHROPIC_AUTH_TOKEN`、`hooks`、`model`、`env` 中其他自定义键

合并规则：

- 公司级配置覆盖个人级（`company/claude/user-settings.json` > `personal/claude/user-settings.json`）。
- 现有 `~/.claude/settings.json` 中的托管键会被仓库值覆盖；本机保留键原样保留。
- 文件不存在时新建；格式损坏时中止并报错，不覆盖原文件。
- 当前仓库已托管 `ENABLE_TOOL_SEARCH: "true"`（在非第一方 `ANTHROPIC_BASE_URL` 环境下强制开启 tool search，需代理支持 `tool_reference`）。

### Claude MCP 同步

执行 `claude install` 时，脚本会登记由 `ai-repository` 生成、或与当前源配置一致的项目 `.mcp.json`。登记表保存在本机的 `.ai-repository-local/mcp-projects.json`，已被 Git 忽略且不保存 MCP 凭据。

更新 `company/mcp/settings.json` 后，可以同步单个项目：

```powershell
node scripts\ai-config.js claude mcp-sync D:\hub\pac-platform
```

也可以同步所有已登记项目：

```powershell
node scripts\ai-config.js claude mcp-sync --all
```

安全规则：

- 同步前校验上次生成内容的 SHA-256 摘要；
- 如果项目 `.mcp.json` 被手工修改，默认拒绝覆盖；
- 未受管且与当前源配置不同的 `.mcp.json` 默认拒绝覆盖；
- 确认以公司/个人合并配置覆盖项目文件时，可显式增加 `--force`；
- `--all` 只处理执行过 `claude install` 并已成功登记的项目。

```powershell
node scripts\ai-config.js claude mcp-sync D:\hub\pac-platform --force
node scripts\ai-config.js claude mcp-sync --all --force
```

## 长期记忆

跨会话、跨工具（Claude / Codex / Kiro 共用）的长期记忆存放在仓库根的 `memory/` 目录，与规则、Skill 一样是单一事实来源，但由 Agent 直接按绝对路径读写，不经适配器分发。

```text
memory/
├── global/lessons.md              # 全局级：跨项目通用错误 / 反复纠错点（纳入版本库）
└── projects/<项目名>/<需求>.md      # 业务需求级：核心逻辑/设计/该需求特有的坑（仅本机，不提交）
```

- 版本控制：`global/` 提交并随 `git pull` 跨机器同步；`projects/` 由 `memory/.gitignore` 忽略，仅本机保留。
- 命令：`memory init` 幂等创建骨架，`memory status` 打印记忆库根目录与统计（供 Agent 定位）。
- 行为约定：由个人规则 `memory-sync.md`（何时读写）与 `managing-memory` Skill（格式与流程）共同约束。开发前先查记忆并与最新代码交叉验证，任务完成即沉淀。

## 测试

```bash
node --test tests/ai-config.test.js
```

测试覆盖 Claude 兼容生成物、三种用户级 Skill 目录、Codex 与 Kiro 生成物、幂等更新、手写规则保留和 MCP 冲突保护。
