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
└── skills/                      # Agent Skills（Claude/Codex 共用）
    ├── deploy-to-vercel/
    ├── find-skills/
    └── terminal-title/
```

## 接入目标

| Agent | 目标位置 |
|------|------|
| Claude | Skills → `~/.claude/skills`；规则 → 项目 `CLAUDE.md` |
| Codex | Skills → `~/.agents/skills`；规则 → 项目 `AGENTS.md` |
