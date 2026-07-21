# 个人规范

个人级 AI 配置,适用于个人开发偏好。

## 目录结构

```
personal/
├── mcp/
│   └── settings.template.json   # 个人 MCP 配置模板（脱敏）
├── rules/
│   ├── steering/                # 代码风格、语言偏好（Markdown，通用）
│   └── hooks/                   # 工具控制规则（.rule.json，agent 无关）
└── skills/                      # Claude 专用 Skills
    ├── deploy-to-vercel/
    ├── find-skills/
    └── terminal-title/
```

## 内容来源

| 来源 | 内容 |
|------|------|
| `~/.claude` | skills/(deploy-to-vercel, find-skills, terminal-title) |
| `~/.kiro` | rules/steering/(代码规范、语言偏好)、rules/hooks/(SQL 规则) |
