# AI Repository

公用 AI 配置仓库，用于在 `.claude`、`.codex`、`.kiro` 之间共享配置。

## 目录结构

```
ai-repository/
├── personal/                   # 个人全局规范
│   ├── mcp/                           # MCP 服务器配置模板
│   │   └── settings.template.json
│   ├── rules/                         # 规则配置
│   │   ├── hooks/                     # Hook 规则
│   │   │   ├── mysql-sql-audit-log.hook
│   │   │   ├── mysql-sql-guard.hook
│   │   │   └── sql-guard.template.json
│   │   └── steering/                  # 代码风格规则
│   │       ├── code_style.md
│   │       └── language.md
│   └── skills/                        # 共用 Skills
│       ├── deploy-to-vercel/
│       ├── find-skills/
│       └── terminal-title/
├── company/                    # 公司规范（待补充）
│   ├── mcp/
│   ├── rules/
│   └── skills/
└── README.md
```

## 规范优先级

```
公司规范 (company/) > 个人规范 (personal/)
```

当两者存在冲突时，公司规范优先。个人规范用于补充公司规范未覆盖的偏好。

## 使用方式

### .kiro
```bash
# 个人规范
cp personal/rules/steering/* ~/.kiro/steering/
cp personal/rules/hooks/*.hook ~/.kiro/hooks/
cp personal/mcp/settings.template.json ~/.kiro/settings/mcp.json  # 填入真实凭据

# 公司规范（如有）
cp company/rules/steering/* ~/.kiro/steering/
cp company/rules/hooks/*.hook ~/.kiro/hooks/
```

### .claude
```bash
cp -r personal/skills/* ~/.claude/skills/
# 公司规范（如有）
cp -r company/skills/* ~/.claude/skills/
```

### .codex
参考 `personal/mcp/` 和 `company/mcp/` 下的模板配置。

## 后续计划

- [ ] 补充公司规范（company/）
- [ ] 补充 prompts 提示词模板
- [ ] 补充更多 hooks 规则
