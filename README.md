# AI Repository

公用 AI 配置**内容**仓库。只存放 **规则文件 + MCP 配置 + Skills**,不含任何自动化脚本,按需手动接入各 AI 工具(Claude Code / Kiro / Codex 等)。

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
│   └── rules/
│       └── hooks/
│           └── sql-guard.template.json
├── personal/                      # 个人级规范
│   ├── mcp/
│   │   └── settings.template.json # 个人 MCP 配置模板（脱敏）
│   ├── rules/
│   │   ├── steering/              # 代码风格、语言偏好（Markdown，通用）
│   │   │   ├── java_code_style.md
│   │   │   └── language.md
│   │   └── hooks/                 # 工具控制规则（JSON，agent 无关）
│   │       ├── mysql-sql-guard.rule.json
│   │       ├── mysql-sql-audit-log.rule.json
│   │       └── sql-guard.template.json
│   └── skills/                    # Claude 专用 Skills
│       ├── deploy-to-vercel/
│       ├── find-skills/
│       └── terminal-title/
└── README.md
```

## 文件格式约定

| 类型 | 格式 | 说明 |
|------|------|------|
| steering 规则 | Markdown | `java_code_style.md`、`language.md`,所有 agent 通用 |
| 工具控制规则 | `.rule.json` | **本仓库自定义** JSON schema(`when`/`then` 意图),agent 无关,各工具自行解读 |
| MCP 配置 | `settings.template.json` | 脱敏模板,真实凭据版本 `settings.json` 已 gitignore |
| Skills | `SKILL.md` + 资源脚本 | Claude Code 专用 |

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

本仓库**不提供自动化同步脚本**,内容即文件本身。接入时直接复制/引用对应文件到各工具的配置位置,例如:

- **Claude Code**:steering 的 `.md` 用 `@import` 引用进 `CLAUDE.md`;`.rule.json` 的 `prompt` 作为规则文本写入;`.mcp.json` 放项目根;skills 放 `~/.claude/skills/` 或项目 `.claude/skills/`
- **Kiro**:`.rule.json` 改扩展名为 `.kiro.hook` 放 `~/.kiro/`;steering 放 `~/.kiro/steering/`
- **Codex**:规则文本写进 `~/.codex/AGENTS.md`;MCP 合并进 `~/.codex/config.toml`

## 安全

真实凭据文件(`**/mcp/settings.json`、`**/sql-guard.json`)已在 `.gitignore` 中,仓库只保留 `*.template.json` 脱敏模板。
