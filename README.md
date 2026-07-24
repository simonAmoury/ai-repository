# AI Repository

公用 AI 配置**内容**仓库:以 agent 无关格式存放规则 / MCP / Skills(单一事实来源)。Claude Code 提供接入脚本 `scripts/link-claude.sh`,Kiro / Codex 手动接线。

## 分层(优先级从高到低)

```
公司级(company/)  >  个人级(personal/)
```

冲突时高优先级覆盖低优先级。

## 目录结构

```
ai-repository/
├── company/                       # 公司级规范（优先级高于 personal）
│   ├── mcp/
│   │   └── settings.template.json # 公司 MCP 配置模板（脱敏）
│   ├── rules/
│   │   └── hooks/
│   │       └── sql-guard.template.json
│   └── skills/                    # 公司级 Skills（与 personal/skills 一起全局安装，同名公司级优先）
│       └── write-online-sop/      # 上线 SOP 编写规范 + 模板
├── personal/                      # 个人级规范
│   ├── mcp/
│   │   └── settings.template.json # 个人 MCP 配置模板（脱敏）
│   ├── rules/
│   │   ├── steering/              # 代码风格、语言偏好（Markdown，通用）
│   │   │   ├── java_code_style.md
│   │   │   ├── language.md
│   │   │   └── online-sop-sync.md # 外部改动即同步上线 SOP
│   │   └── hooks/                 # 工具控制规则（JSON，agent 无关）
│   │       ├── mysql-sql-guard.rule.json
│   │       ├── mysql-sql-audit-log.rule.json
│   │       └── sql-guard.template.json
│   └── skills/                    # Claude 专用 Skills
│       ├── deploy-to-vercel/
│       ├── find-skills/
│       └── terminal-title/
├── scripts/
│   └── link-claude.sh            # Claude Code 接入脚本(项目规则/MCP + 全局 skills)
└── README.md
```

## 文件格式约定

| 类型 | 格式 | 说明 |
|------|------|------|
| steering 规则 | Markdown | `java_code_style.md`、`language.md`,所有 agent 通用 |
| 工具控制规则 | `.rule.json` | **本仓库自定义** JSON schema(`when`/`then` 意图),agent 无关,各工具自行解读 |
| MCP 配置 | `settings.template.json` | 脱敏模板,真实凭据版本 `settings.json` 已 gitignore |
| Skills | `SKILL.md` + 资源 | Claude Code 专用;`company/skills` 与 `personal/skills` 均全局安装,同名公司级优先 |

`.rule.json` 是**本仓库自定义的 schema**(参考 Kiro 原生 hook 结构,扩展名通用化),并非跨 agent 标准。示例:

```json
{
  "enabled": true,
  "name": "MySQL SQL Guard",
  "when": {"type": "preToolUse", "toolTypes": [".*sql.*"]},
  "then": {"type": "askAgent", "prompt": "..."}
}
```

> 注:`when.type` 的 `preToolUse`/`postToolUse` 仅在 Claude/Kiro 能映射为真正的工具前后置 hook;Codex 无 hook 机制,只会把 `prompt` 当作纯文本规则写入。

## 接入方式

通用规范以 agent 无关格式存放。Claude Code 有现成接入脚本,Kiro / Codex 手动接线。

### 首次使用(新机器)

```bash
git clone git@github.com:simonAmoury/ai-repository.git     # 1. 克隆仓库
# 2. Windows 用户:开启「设置 → 系统 → 开发者选项 → 开发者模式」(skills 软链接需要)
# 3. 填好真实 MCP 凭据(本地,不提交):复制 company/mcp/settings.template.json
#    为 company/mcp/settings.json 并填值(已 gitignore)
bash scripts/link-claude.sh skills                          # 4. 全局装 skills(一次性)
```

### Claude Code(脚本接入)

`scripts/link-claude.sh` 两个子命令:

| 命令 | 作用 | 频率 |
|---|---|---|
| `bash scripts/link-claude.sh skills` | 把 `company/skills` + `personal/skills` 软链接到 `~/.claude/skills/`(全局,所有项目通用;同名公司级优先) | 一次性 |
| `bash scripts/link-claude.sh [项目目录]` | 接入项目:生成 `CLAUDE.md` / `.mcp.json` / `sql-guard.json` | 每个新项目 |

项目接入示例:

```bash
cd /your/project
bash /path/to/ai-repository/scripts/link-claude.sh          # 接入当前目录
# 或指定目录:
bash /path/to/ai-repository/scripts/link-claude.sh /your/project
```

项目内生成物:

| 文件 | 说明 |
|---|---|
| `CLAUDE.md` | 规则入口:项目级规则 + `@import` 公司/个人 steering + hook 规则(脚本只维护标记区,其余自由编辑) |
| `.claude/hooks-rules.md` | `.rule.json` 自动转换结果 |
| `.mcp.json` | MCP 配置(已 gitignore) |
| `sql-guard.json` | SQL 白名单,按项目改 `allowedDatabases`(已 gitignore) |

要点:

- **动态引用**:项目 `CLAUDE.md` 用相对路径 `@../ai-repository/...` 引用仓库源文件;改仓库规范后**重启 Claude 即生效,无需重跑**。
- **Windows 软链接**:`skills` 子命令建原生符号链接,需「开发者模式」;未开启则回退复制(可用但不同步)。
- **MCP 凭据**:`.mcp.json` 优先读仓库里 gitignore 的真实 `company/mcp/settings.json`;缺失则用模板占位符,填好后重跑。
- **幂等**:可重复运行;已存在的 `.mcp.json` / `sql-guard.json` 不覆盖,`CLAUDE.md` 只更新标记区。

### Kiro / Codex(手动)

- **Kiro**:`.rule.json` 改扩展名为 `.kiro.hook` 放 `~/.kiro/`;steering 放 `~/.kiro/steering/`
- **Codex**:规则文本写进 `~/.codex/AGENTS.md`;MCP 合并进 `~/.codex/config.toml`

## 安全

真实凭据文件(`**/mcp/settings.json`、`**/sql-guard.json`)已在 `.gitignore` 中,仓库只保留 `*.template.json` 脱敏模板。
