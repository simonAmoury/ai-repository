# 记忆库（ai-repository memory）

跨会话、跨工具（Claude / Codex / Kiro 共用）的长期记忆存放处。由 `memory-sync` 规则约束
何时读写，由 `managing-memory` skill 约束具体格式与流程。

## 目录结构

```text
memory/
├── global/
│   └── lessons.md      # 全局级：跨项目通用的工作习惯类错误 / 反复纠错点（纳入版本库）
└── projects/
    └── <项目名>/
        └── <需求-slug>.md   # 业务需求级：核心逻辑、核心设计、该需求特有的坑（仅本机，不提交）
```

## 版本控制策略

- `global/`：提交，随 `git pull` 在各机器间同步。
- `projects/`：本机保留，不提交（见 `.gitignore`）。

## 读写约定（摘要，完整见 managing-memory skill）

- 开始与某模块/需求相关的开发前：先查是否有相关记忆 → 读 → 按记忆中的 `code_anchors`
  读**当前最新代码**做交叉验证，输出「历史结论 vs 现状差异」，再动手。
- 任务完成时：沉淀核心业务逻辑、核心代码设计、踩坑与反复纠错点。
- 跨项目通用的错误写入 `global/lessons.md`；项目特有的坑写入对应项目记忆。
