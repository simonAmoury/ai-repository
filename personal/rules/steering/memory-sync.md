# 长期记忆读写规则

跨会话、跨工具的长期记忆存放在 ai-repository 的 `memory/` 目录（标准路径
`D:\hub\ai-repository\memory`；不确定时用 `node <ai-repository>/scripts/ai-config.js memory status`
或 `managing-memory` skill 的解析脚本定位）。记忆分两级：

- **全局级** `memory/global/lessons.md`：跨项目通用的工作习惯类错误 / 反复纠错点（提交进版本库）。
- **业务需求级** `memory/projects/<项目名>/<需求-slug>.md`：该需求的核心业务逻辑、核心代码设计、
  该需求特有的踩坑（仅本机保留，不提交）。

## 何时读（开发前先查记忆并交叉验证）

开始与某模块 / 某需求相关的开发前，按顺序执行：

1. 读 `memory/global/lessons.md`，避免重复犯已记录的错。
2. 在 `memory/projects/<当前项目>/` 下查找与本次任务相关的需求记忆；命中则完整阅读。
3. 对记忆中记录的 `code_anchors`（文件路径 + 类/方法 / 表 / 配置项），**读取当前最新代码做交叉验证**，
   明确「历史结论 vs 现状是否已漂移」，再基于差异动手，不要直接把旧记忆当成现状。

## 何时写（任务完成即沉淀）

一个业务需求 / 任务完成时：

- 沉淀到对应的**业务需求级**记忆：核心业务逻辑、核心代码设计、踩过的坑与反复纠错点、
  下次需重点交叉验证的锚点。
- 本次过程中犯的、**跨项目会再犯**的错，追加到 `memory/global/lessons.md`（编号递增）。
- 项目特有的坑只写进项目记忆，不要塞进全局教训。

具体的文件格式、front-matter 字段、交叉验证与去重步骤，加载 `managing-memory` skill 执行，
不要自行发明格式。记忆文件的写入是本地文件操作；`global/` 的提交由我（用户）决定，不要自动 commit。
