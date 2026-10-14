"use strict";

const fs = require("fs");
const path = require("path");
const { ensureDir, writeTextIfMissing } = require("./files");

const GITIGNORE = [
  "# 记忆库版本控制策略（由 ai-repository 维护）",
  "# - 全局教训 global/ 与本说明纳入版本库，随 git 跨机器同步；",
  "# - 项目级记忆 projects/ 仅保留在本机，不提交（含各项目的踩坑与设计细节）。",
  "/projects/*",
  "!/projects/.gitkeep",
  "",
].join("\n");

const README = [
  "# 记忆库（ai-repository memory）",
  "",
  "跨会话、跨工具（Claude / Codex / Kiro 共用）的长期记忆存放处。由 `memory-sync` 规则约束",
  "何时读写，由 `managing-memory` skill 约束具体格式与流程。",
  "",
  "## 目录结构",
  "",
  "```text",
  "memory/",
  "├── global/",
  "│   └── lessons.md      # 全局级：跨项目通用的工作习惯类错误 / 反复纠错点（纳入版本库）",
  "└── projects/",
  "    └── <项目名>/",
  "        └── <需求-slug>.md   # 业务需求级：核心逻辑、核心设计、该需求特有的坑（仅本机，不提交）",
  "```",
  "",
  "## 版本控制策略",
  "",
  "- `global/`：提交，随 `git pull` 在各机器间同步。",
  "- `projects/`：本机保留，不提交（见 `.gitignore`）。",
  "",
  "## 读写约定（摘要，完整见 managing-memory skill）",
  "",
  "- 开始与某模块/需求相关的开发前：先查是否有相关记忆 → 读 → 按记忆中的 `code_anchors`",
  "  读**当前最新代码**做交叉验证，输出「历史结论 vs 现状差异」，再动手。",
  "- 任务完成时：沉淀核心业务逻辑、核心代码设计、踩坑与反复纠错点。",
  "- 跨项目通用的错误写入 `global/lessons.md`；项目特有的坑写入对应项目记忆。",
  "",
].join("\n");

const LESSONS = [
  "# 全局教训（跨项目通用）",
  "",
  "> 记录**跨项目复用**的工作习惯类错误。每条教训是**一类问题**的抽象，不是一次事故一条；",
  "> 具体事故作为「案例」挂在对应教训下，保留当时场景与正反做法。项目特有的坑写入",
  "> `projects/<项目名>/<需求>.md`，不要放这里。",
  ">",
  "> - 新案例先找能归入的已有教训，追加到其「案例」里，必要时修订「问题本质 / 正确做法」使之覆盖新案例。",
  "> - 只有现有教训都无法覆盖时才新增 `### L-XXX`。",
  "> - 本文件会定期整理（合并、拆分、重排编号），项目记忆**不得引用**这里的编号。",
  "",
  "## 条目格式",
  "",
  "```markdown",
  "### L-编号 抽象标题（一类问题 + 通用解法）",
  "- 分类: 性能 / 数据访问 / 并发 / 流程 / 其他",
  "- 问题本质: 为什么会犯这类错（认知/习惯层面的根因）",
  "- 正确做法: 适用于这一类问题的通用做法",
  "- 案例:",
  "  1. 案例名（YYYY-MM-DD）",
  "     - 场景: 当时在做什么",
  "     - 反例: 具体错在哪",
  "     - 正例: 应该怎么做",
  "```",
  "",
  "## 教训清单",
  "",
].join("\n");

function memoryRoot(repositoryRoot) {
  return path.join(path.resolve(repositoryRoot), "memory");
}

function ensureScaffold(repositoryRoot) {
  const root = memoryRoot(repositoryRoot);
  ensureDir(root);
  const created = [];
  const files = [
    [path.join(root, ".gitignore"), GITIGNORE],
    [path.join(root, "README.md"), README],
    [path.join(root, "global", "lessons.md"), LESSONS],
    [path.join(root, "projects", ".gitkeep"), ""],
  ];
  for (const [file, content] of files) {
    if (writeTextIfMissing(file, content)) created.push(path.relative(root, file) || path.basename(file));
  }
  return { root, created };
}

function listProjectMemories(root) {
  const projectsDir = path.join(root, "projects");
  if (!fs.existsSync(projectsDir)) return [];
  const result = [];
  for (const project of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!project.isDirectory()) continue;
    const dir = path.join(projectsDir, project.name);
    const memories = fs.readdirSync(dir)
      .filter((name) => name.endsWith(".md"))
      .sort();
    result.push({ project: project.name, memories });
  }
  return result;
}

function countLessons(root) {
  const file = path.join(root, "global", "lessons.md");
  if (!fs.existsSync(file)) return 0;
  const matches = fs.readFileSync(file, "utf8").match(/^### L-\d+/gm);
  return matches ? matches.length : 0;
}

function status(repositoryRoot) {
  const root = memoryRoot(repositoryRoot);
  const exists = fs.existsSync(root);
  return {
    root,
    exists,
    lessons: exists ? countLessons(root) : 0,
    projects: exists ? listProjectMemories(root) : [],
  };
}

module.exports = { memoryRoot, ensureScaffold, status, listProjectMemories, countLessons };
