---
id: ai-repository/mcp-user-level-only
scope: project
project: ai-repository
feature: mcp-user-level-only
updated: 2026-10-16
tags: [mcp, user-level, adapters, cli, claude, codex, kiro]
code_anchors:
  - path: src/core/user-mcp.js
    symbol: applyJsonMcpServers
  - path: src/core/user-mcp.js
    symbol: applyTomlMcpServers
  - path: src/adapters/agent-adapter.js
    symbol: syncUserMcpAt
  - path: src/core/cli-runner.js
    symbol: dispatchAgent
---

## 核心业务逻辑

MCP 统一为用户级，所有项目共用；`install` 不再生成任何项目级 MCP 文件。新增 `claude|codex|kiro mcp` 命令写入用户级配置：Claude `~/.claude.json` 根级 `mcpServers`，Codex `~/.codex/config.toml` 托管区，Kiro `~/.kiro/settings/mcp.json`。原 `claude mcp-sync`、`McpProjectRegistry`（`.ai-repository-local/mcp-projects.json`）与 `localStateDir` 参数已删除；`.gitignore` 中的 `.ai-repository-local/` 规则保留，防止残留文件误提交。

## 核心代码设计

`user-mcp.js` 提供两种写法：JSON（Claude/Kiro）按 Server 名称浅合并，只覆盖仓库声明的同名 Server，保留本机自加 Server 与其他顶级键；TOML（Codex）无法安全键级合并，沿用 `# ai-repository:mcp:begin/end` 托管区整体替换，托管区外手写的同名 Server 优先保留并跳过。两者都在内容不变时不写文件，JSON 损坏时中止且不覆盖。`AgentAdapter.syncUserMcpAt(label, format)` 统一输出，各子类只实现 `userMcpFile()` 与 `syncUserMcp()`。

`mcp` 刻意不并入 `skills` 命令：Git Hook 自动同步会调用 `installSkills()`，若顺带改写 `~/.claude.json` 这类 Agent 运行时状态文件，风险过大。

## 踩过的坑 / 反复纠错点

`~/.claude.json` 同时承载 Claude 的项目状态、OAuth 等运行时数据，绝不能整文件覆盖，只能合并 `mcpServers`。Claude 的作用域优先级是 local > project > user，旧项目 `.mcp.json` 中的同名 Server 会盖过用户级；Codex/Kiro 同理。因此 `install` 检测到旧项目级 MCP（Claude `.mcp.json`、Codex 含托管区标记的 `.codex/config.toml`、Kiro `.kiro/settings/mcp.json`）时只警告、不自动删除，删除需用户确认。

JSON 合并不会移除仓库已删除的 Server，需手动清理，以免误删本机自加的 Server。

## 交叉验证提示

2026-10-16 `node --test tests/ai-config.test.js` 20/20 通过；已用隔离 `AI_CONFIG_HOME` 实跑三端 `mcp` 写入与 `install` 不生成 MCP、遗留文件警告。真实用户目录尚未执行 `mcp`，pac-platform 的旧项目级 MCP 文件仍在。验证不涉及 MCP Server 连通性。
