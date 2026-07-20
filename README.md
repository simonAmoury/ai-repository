# AI Repository

公用 AI 配置仓库，用于在 `.claude`、`.codex`、`.kiro` 之间共享配置。

## 目录结构

```
ai-repository/
├── mcp/                            # MCP 服务器配置
│   └── settings.template.json             # MCP server 配置模板（mysql、codegraph 等）
├── rules/                          # 规则配置
│   ├── steering/                   # 代码风格规则（来源：.kiro/steering）
│   │   ├── code_style.md                  # 代码规范（策略模式、多线程、异常日志等）
│   │   └── language.md                    # 语言偏好
│   └── hooks/                      # Hook 规则
│       ├── mysql-sql-audit-log.hook       # SQL 审计日志（日志写入项目 logs/sql-audit.log）
│       ├── mysql-sql-guard.hook           # SQL 安全守卫（需项目级 sql-guard.json）
│       └── sql-guard.template.json        # sql-guard 配置模板
├── skills/                         # 共用 Skills（完整复制，含脚本）
│   ├── deploy-to-vercel/                  # Vercel 部署
│   ├── find-skills/                       # 技能发现
│   └── terminal-title/                    # 终端标题管理
└── README.md
```

## SQL Guard 机制

`mysql-sql-guard.hook` 要求每个项目必须在项目根目录放置 `sql-guard.json`，否则所有 SQL 操作将被拒绝。

**使用步骤：**

1. 复制 `rules/hooks/sql-guard.template.json` 到项目根目录作为 `sql-guard.json`
2. 根据项目需求修改 `allowedDatabases` 和 `allowedOperations`
3. 复制 `rules/hooks/mysql-sql-guard.hook` 到工具的 hooks 目录

**模板示例：**
```json
{
  "allowedDatabases": ["my_database", "my_test_database"],
  "allowedOperations": ["SELECT", "INSERT", "CREATE"]
}
```

## 内容来源

| 来源 | 提取内容 | 说明 |
|------|---------|------|
| `~/.claude` | skills/ | Skills 完整复制 |
| `~/.kiro` | rules/、mcp/ | 代码规范、SQL hook、MCP 配置模板 |

## 使用方式

### .kiro
```bash
cp rules/steering/* ~/.kiro/steering/
cp rules/hooks/*.hook ~/.kiro/hooks/
cp mcp/settings.template.json ~/.kiro/settings/mcp.json  # 填入真实凭据
```

### .claude
```bash
cp -r skills/* ~/.claude/skills/
```

### .codex
参考 `mcp/` 下的模板配置对应的 `.codex` 环境。

## 后续计划

- [ ] 补充 prompts 提示词模板
- [ ] 补充更多 hooks 规则
- [ ] 补充 workflows 工作流定义
