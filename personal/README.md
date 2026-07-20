# 个人全局规范

个人级别的 AI 配置，适用于个人开发偏好和习惯。

## 目录结构

```
personal/
├── mcp/          # 个人 MCP 服务器配置模板
├── rules/        # 个人规则
│   ├── hooks/    # Hook 规则（SQL 审计、SQL 安全守卫等）
│   └── steering/ # 代码风格规范
└── skills/       # 个人 Skills
```

## 内容来源

| 来源 | 提取内容 |
|------|---------|
| `~/.claude` | skills/（deploy-to-vercel, find-skills, terminal-title） |
| `~/.kiro` | rules/steering/（代码规范、语言偏好）、rules/hooks/（SQL hooks） |
