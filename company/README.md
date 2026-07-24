# 公司规范

公司级 AI 配置,优先级高于 `personal/`。

## 目录结构

```
company/
├── mcp/
│   └── settings.template.json   # 公司 MCP 配置模板（脱敏）
├── rules/
│   └── hooks/
│       └── sql-guard.template.json
└── skills/                      # 公司级 Skills（全局安装，同名优先于 personal）
    └── write-online-sop/        # 上线 SOP 编写规范 + 模板
```

## 使用原则

- 公司规范优先级高于个人规范
- 由团队负责人维护
- 个人可在 `personal/` 叠加个人偏好
- 真实凭据版本 `settings.json` 已 gitignore,仓库只存脱敏模板
