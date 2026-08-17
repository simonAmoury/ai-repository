# 配置变更流程规则

## 唯一事实来源是 ai-repository，改配置必须从源头改

用户要求「加一条规则 / 改配置 / 补规范」时，固定按以下顺序执行，不要图快直接改生成物：

1. **先落到 ai-repository 源仓库**（标准位置 `D:\hub\ai-repository`）：
   - 个人规则 → `personal/rules/steering/<主题>.md`
   - 公司规则 → `company/rules/steering/<主题>.md`
   - 跨项目反复犯错的教训 → `memory/global/lessons.md`（按 `L-XXX` 递增追加）
   - 需求级记忆 → `memory/projects/<项目名>/<需求-slug>.md`
2. **再走同步脚本**同步到当前项目：
   ```powershell
   node D:\hub\ai-repository\scripts\ai-config.js kiro install <当前项目绝对路径>
   ```
   （对应 Agent 换成 `claude` / `codex`；规则源变更后 Kiro 与 Codex 都必须重跑一次 install 才生效。）
3. **最后校验**生成物托管区确实包含新内容，再向用户汇报。

## 禁止事项

- **不要直接编辑生成物**：项目 `.kiro/steering/ai-repository.md` 的 `ai-repository:begin/end` 托管区、`AGENTS.md` 托管区、`.claude/hooks-rules.md` 都是脚本生成的，手改会在下次 install 时被覆盖。
- **不要直接编辑用户级 Kiro steering**（`~/.kiro/steering/` 下由 ai-repository 派生的文件）来「图快」，那样源仓库拿不到这次变更，换项目/换机器即丢失。
- 项目自有、不属于 ai-repository 管辖的规则，才允许直接写在项目 `.kiro/steering/` 的**其他** `.md` 文件里。

## 新增规则的粒度

- 一个主题一个文件，文件名用短横线小写（如 `windows-shell-safety.md`、`change-scope-boundary.md`），便于单独增删与检索。
- 写入前先扫已有规则文件，语义重复的合并进原文件而不是新建一份平行规则。
- 规则要写「依据什么判断」和「具体怎么做」，涉及实测结论时附上证据（命令与实际输出），避免以后又被当成偶发问题重新排查。
