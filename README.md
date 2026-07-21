# AI Repository

公用 AI 配置仓库。**通用规范架构**——存储 agent 无关的规范，各工具用自己的转换脚本生成专属格式。

## 核心理念

```
ai-repository（通用规范，单一事实来源）
   ├─ scripts/sync-claude.sh  → Claude Code 专属格式（CLAUDE.md + .mcp.json）
   ├─ scripts/sync-kiro.sh    → Kiro 专属格式（~/.kiro/steering + hooks）
   └─ scripts/sync-codex.sh   → Codex 专属格式（~/.codex/AGENTS.md + config.toml）
```

三个工具地位对等，未来加 Cursor/Windsurf 只需添加对应转换脚本。

## 三层配置（优先级从高到低）

```
项目级  >  公司级  >  个人级
(test)   (company/) (personal/)
```

冲突时高优先级覆盖低优先级。

## 目录结构

```
ai-repository/
├── personal/                      # 个人全局规范
│   ├── rules/
│   │   ├── steering/              # 代码风格、语言偏好（Markdown，通用）
│   │   └── hooks/
│   │       ├── *.rule.json        # 通用规则（JSON 结构，agent 无关）
│   │       └── sql-guard.template.json
│   ├── mcp/settings.template.json # MCP 配置模板
│   ├── skills/                    # 共用 Skills（Claude 专用）
│   └── tools/hook-converter.js    # .rule.json → CLAUDE.md 转换器
├── company/                       # 公司级规范（优先级高于 personal）
│   ├── rules/hooks/sql-guard.template.json
│   └── mcp/
│       ├── settings.json          # 真实凭据（已 gitignore）
│       └── settings.template.json # 脱敏模板
├── scripts/
│   ├── sync-claude.sh             # 通用规范 → Claude Code（@import 活引用）
│   ├── sync-kiro.sh               # 通用规范 → Kiro（复制到 ~/.kiro/）
│   └── sync-codex.sh              # 通用规范 → Codex（合并到 ~/.codex/）
├── hooks/on-session-start.sh      # SessionStart hook（Claude 专用，自动 pull）
└── sync.sh                        # 入口：git 操作 + 调度三个子脚本
```

## sync.sh 用法

### git 操作（作用于 ai-repository 自身）

```bash
./sync.sh pull                    # 从 GitHub 拉取最新规范
./sync.sh push "提交说明"          # 提交并推送到 GitHub
./sync.sh status                  # 查看与 GitHub 的同步状态
```

### agent 同步（把通用规范应用到各工具）

```bash
./sync.sh claude install [dir]    # 生成项目分层 CLAUDE.md（默认当前目录）
./sync.sh claude bootstrap        # 注册 Claude SessionStart hook（换电脑用）
./sync.sh kiro                    # 同步规范到 ~/.kiro/（全局）
./sync.sh codex                   # 同步规范到 ~/.codex/（全局）
./sync.sh all [dir]               # 依次同步三个 agent
```

三个子脚本也可独立运行：`scripts/sync-{claude,kiro,codex}.sh`

## 工作流

### 维护规范（在 `D:\hub\ai-repository`）

```bash
cd /d/hub/ai-repository

# 编辑通用规则
vim personal/rules/steering/code_style.md
vim personal/rules/hooks/mysql-sql-guard.rule.json

./sync.sh push "补充多线程规范"    # 改动自动 push 到 GitHub
```

换机器后拉取：

```bash
cd /d/hub/ai-repository
./sync.sh pull
```

### 新项目/新电脑接入

#### Claude Code（自动 pull + 活引用）

```bash
# 项目接入
/d/hub/ai-repository/sync.sh claude install .

# 生成物：
#   ./CLAUDE.md          分层规则入口（项目级规则 + @import 公司/个人规范源文件）
#   ./.mcp.json          MCP 配置（自动 gitignore）
#   ./.claude/hooks-rules.md   规则转换结果
#   ./sql-guard.json     SQL 安全配置

# 换电脑：注册全局 SessionStart hook（自动 pull ai-repository）
/d/hub/ai-repository/sync.sh claude bootstrap
```

**关键优势**：项目 `CLAUDE.md` 通过 `@../ai-repository/...` **活引用**源文件。你改了 ai-repository，项目重启 Claude 即读到最新规则，**无需重新 install**。SessionStart hook 每次会话自动 pull。

#### Kiro（手动同步到全局）

```bash
/d/hub/ai-repository/sync.sh kiro

# 同步到 ~/.kiro/（全局，对所有 Kiro 项目生效）：
#   steering/*.md       代码风格、语言偏好
#   hooks/*.kiro.hook   SQL 规则（原生 JSON 结构）
#   settings/mcp.json   MCP 配置
```

**限制**：Kiro 无会话启动 hook，规范更新后需**手动重跑** `sync.sh kiro`。

#### Codex（手动同步到全局）

```bash
/d/hub/ai-repository/sync.sh codex

# 同步到 ~/.codex/（全局）：
#   AGENTS.md           规范文本（用标记包裹，可重复同步不重复）
#   config.toml         MCP 配置（JSON→TOML，安全合并，只增不删）
```

**限制**：同 Kiro，无 hook 机制，需手动重跑。

### 规范更新后

| Agent | 自动 pull？ | 自动应用规范？ | 手动操作 |
|-------|:---:|:---:|---------|
| Claude | ✅ SessionStart hook | ✅ @import 活引用 | 无（自动）|
| Kiro | ❌ | ❌ | `sync.sh kiro` |
| Codex | ❌ | ❌ | `sync.sh codex` |

## 各工具对比

| | Claude Code | Kiro | Codex |
|---|---|---|---|
| **规范位置** | 项目 `CLAUDE.md` | `~/.kiro/`（全局） | `~/.codex/`（全局） |
| **引用方式** | `@import` 活引用源文件 | 静态副本 | 静态合并 |
| **Hook** | ✅ SessionStart 自动 pull | ❌ 只有 preToolUse | ❌ 无 hook |
| **MCP 格式** | JSON（项目 `.mcp.json`） | JSON（`~/.kiro/settings/mcp.json`） | TOML（`~/.codex/config.toml`） |
| **同步频率** | 自动（每次会话启动） | 手动 | 手动 |
| **项目级配置** | ✅ 完整支持 | ⚠️ 全局为主 | ⚠️ 全局为主 |

## 通用规范格式

- **steering 规则**：Markdown（`code_style.md`、`language.md`），所有 agent 通用
- **工具控制规则**：`.rule.json`（JSON 结构，描述 when/then 意图），各 agent 转换为自己能理解的格式：
  - Claude → CLAUDE.md 文本（via `hook-converter.js`）
  - Kiro → `.kiro.hook`（原生 JSON 结构，改扩展名直接复制）
  - Codex → AGENTS.md 文本（via `hook-converter.js`）

示例 `.rule.json` 结构（与 Kiro 原生 hook 一致，但扩展名通用化）：

```json
{
  "enabled": true,
  "name": "MySQL SQL Guard",
  "when": {"type": "preToolUse", "toolTypes": [".*sql.*"]},
  "then": {"type": "askAgent", "prompt": "..."}
}
```

## 换电脑迁移

```bash
# 1. clone
git clone git@github.com:simonAmoury/ai-repository.git /d/hub/ai-repository

# 2. Claude 注册全局 hook（自动 pull + 活引用，一劳永逸）
cd /d/hub/ai-repository && ./sync.sh claude bootstrap

# 3. Kiro/Codex 手动同步（可选，按需）
./sync.sh kiro
./sync.sh codex
```

Claude 换电脑两步恢复全自动化；Kiro/Codex 需首次手动同步，之后更新规范时再手动跑。

## 优势总结

1. **单一事实来源**：规范以通用格式存在，不偏向任何 agent
2. **对称扩展**：加新工具（Cursor/Windsurf）只需添加对应 `sync-xxx.sh`
3. **Claude 全自动**：@import 活引用 + SessionStart hook，改源文件即生效
4. **Kiro/Codex 手动可控**：规范更新不会意外影响当前会话，手动同步时你知道发生了什么
5. **安全合并**：Codex 的 TOML 合并只增不删，不破坏你手改的 config.toml
