---
id: ai-repository/refactor-without-behavior-change
scope: project
project: ai-repository
feature: refactor-without-behavior-change
updated: 2026-08-25
tags: [refactor, characterization-tests, adapters, cli, behavior-compatibility]
code_anchors:
  - path: src/adapters/agent-adapter.js
    symbol: AgentAdapter
  - path: src/core/cli-runner.js
    symbol: dispatchInvocation
  - path: src/core/inline-rules.js
    symbol: renderInlineRules
  - path: src/core/project-support.js
    symbol: installProjectSupportFiles
  - path: tests/ai-config.test.js
    symbol: RepositoryConfig 保持配置选择、层级覆盖与稳定排序
---

## 核心业务逻辑

本轮只整理内部结构，不改变 CLI 命令、输出文案、生成文件、规则优先级、MCP 覆盖策略及返回结构。Claude 继续使用动态 `@import` 和公司→个人 Hook 顺序；Codex/Kiro 继续以内联方式按个人→公司渲染；三种 MCP 安全策略仍各自独立。

## 核心代码设计

`AgentAdapter` 只收敛 Skills 安装与项目目录校验；SQL Guard 和 Git 本地排除组合下沉到 `project-support.js`，避免基类承担仓库级政策。Codex/Kiro 的规则正文由 `inline-rules.js` 统一渲染。Git 命令执行由 `git-command.js` 共享，`git-exclude.js` 单独负责 `.git/info/exclude`。CLI 入口保留装配和顶层异常处理，具体命令分发移至 `cli-runner.js`。

## 踩过的坑 / 反复纠错点

原有 Codex/Kiro 幂等测试用 `/ai-repository:begin/g` 统计 marker；当 steering 规则正文新增同名说明后会误报为两个 marker。测试必须匹配完整 marker 文本，不能用可能出现在业务正文中的短子串。重构期间曾在迁移 `addLocalIgnores` 后漏掉 Claude MCP 单独同步路径的 import，阶段性全量测试及时发现；抽取公共逻辑后必须搜索所有旧调用点并逐阶段跑测试。

## 交叉验证提示

2026-08-25 已用隔离仓库、独立 `AI_CONFIG_HOME` 和三个临时 Git 项目执行真实 CLI 集成自测：Claude/Codex/Kiro 首次安装、重复安装、手写规则保留、各自 MCP 冲突策略、Skills 安装、Git exclude、Hook 三端 Skill 自动同步均通过；Claude `mcp-sync` 拒绝手改及 `--force` 覆盖也通过。该验证只覆盖本地生成与保护逻辑，不代表外部 MCP Server 网络连通性。

下次改动前重点核对三个 Adapter 的规则层顺序和 MCP 写入点；不要将三个 `installProject` 强行统一。修改 Skill 目录约定时同时核对各 Adapter 的 `skillsDirectory()` 与 `cli-runner.js` 的自动同步遍历。修改生成 marker 时，应更新精确 marker 表征测试，并确认规则正文不会影响计数。
