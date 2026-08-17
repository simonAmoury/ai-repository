---
name: managing-memory
description: 读写跨会话长期记忆时使用。当需要在开始一个开发任务前查历史经验、把已完成任务的核心逻辑/设计/踩坑沉淀下来、或记录跨项目通用的反复犯错点时，加载本 skill，套用统一的记忆库位置、文件格式与「先查记忆→与最新代码交叉验证→再动手」的流程。适用于 Claude / Codex / Kiro，记忆库统一存放在 ai-repository/memory。
version: "1.0.0"
---

# 长期记忆管理

统一「跨会话长期记忆」的存放位置、文件格式与读写流程，配合 `memory-sync` 规则使用。
规则管「何时必须读写」，本 skill 管「具体怎么做」。

## 一、记忆库位置

记忆库在 ai-repository 仓库根下的 `memory/` 目录。定位方式（任选其一）：

1. 标准路径：`D:\hub\ai-repository\memory`（团队约定的 ai-repository 克隆位置）。
2. 运行解析脚本（跨机器稳健，推荐不确定时使用）：

   ```bash
   node <本 skill 目录>/resources/resolve-memory-root.js
   ```

   脚本从自身位置向上查找 ai-repository 根并打印 `memory` 绝对路径。
3. 若知道 ai-repository 位置：`node <ai-repository>/scripts/ai-config.js memory status`，
   会打印记忆库根目录、全局教训条目数、各项目记忆清单。

若 `memory/` 尚不存在，先执行 `node <ai-repository>/scripts/ai-config.js memory init` 初始化骨架。

## 二、目录与版本控制

```text
memory/
├── global/lessons.md              # 全局级：跨项目通用错误（提交进 git）
└── projects/<项目名>/<需求-slug>.md   # 业务需求级：仅本机保留，不提交
```

- 全局教训随 git 跨机器同步；项目记忆仅本机（已在 `memory/.gitignore` 忽略 `projects/`）。
- `<项目名>` 用仓库目录名（如 `pac-platform`）；`<需求-slug>` 用短横线小写（如 `offline-approve-link-macro-whitelist`）。

## 三、业务需求级记忆格式

每个需求一个 `.md`，YAML front-matter 供机器筛选，正文供人阅读。模板见
`resources/project-memory.template.md`。字段约定：

- `id`：`<项目名>/<需求-slug>`
- `scope`：固定 `project`
- `project` / `feature`：项目名 / 需求 slug
- `updated`：最后更新日期 `YYYY-MM-DD`
- `tags`：主题关键词，便于检索
- `code_anchors`：**下次交叉验证的锚点**，逐条写 `path`+`symbol`、或 `table`、或 `apollo` 等；
  这是「记忆」与「最新代码」对齐的关键，务必写准确的文件路径与符号名。

正文四段固定：核心业务逻辑 / 核心代码设计 / 踩过的坑与反复纠错点 / 交叉验证提示。

## 四、读记忆 + 交叉验证流程

1. 读 `global/lessons.md`。
2. `list` 出 `projects/<当前项目>/` 下的 `.md`，按文件名与 front-matter `tags` 判断相关性，
   命中则完整阅读。
3. 对命中记忆的每个 `code_anchors`，读取**当前仓库最新代码**：
   - 锚点仍存在且语义一致 → 采纳历史结论。
   - 锚点已改动 / 消失 → 记录「历史 vs 现状」差异，以最新代码为准，动手前先消化差异。
4. 不要凭记忆断言现状；凡写入结论的类/方法/表/配置，都要在最新代码里确认存在。

## 五、写记忆流程

任务完成时：

1. 确定归属：跨项目会再犯的错 → `global/lessons.md`；本需求的逻辑/设计/特有坑 → 项目记忆。
2. 项目记忆：已存在同 slug 文件则**增量更新**（更新 `updated`、补充新坑、修正漂移的锚点），
   不要新建重复文件；不存在则用模板新建。
3. 全局教训：用 `resources/global-lesson.template.md` 的条目格式追加，编号 `L-XXX` 递增、不复用。
4. 去重：写入前先扫已有条目/章节，语义重复的合并而非堆叠。
5. 只做本地文件写入，`global/` 的提交交给用户，不要自动 `git commit`。

## 六、注意

- 记忆是「经验」不是「事实快照」：正文可保留历史判断，但每次使用前都以最新代码为准做校验。
- 不要把密钥、凭据、大段代码原文塞进记忆；记锚点（路径+符号）和结论，用到时去读代码。
