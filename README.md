# AI Repository

公用 AI 配置仓库。提供**三层配置体系**与自动同步流程，供 `.claude` / `.codex` / `.kiro` 共用。

## 三层配置（优先级从高到低）

```
项目级  >  公司级  >  个人级
(test)   (company/) (personal/)
```

冲突时高优先级覆盖低优先级。

## 目录结构

```
ai-repository/
├── personal/                      # 个人全局规范
│   ├── rules/
│   │   ├── steering/              # 代码风格、语言偏好（.md，可被 @import）
│   │   └── hooks/                 # Hook 规则（.hook，Kiro 格式）
│   ├── mcp/                       # MCP 配置模板
│   ├── skills/                    # 个人 Skills
│   └── tools/
│       └── hook-converter.js      # .hook → CLAUDE.md 转换器
├── company/                       # 公司级规范（优先级高于 personal）
│   ├── rules/
│   │   └── hooks/
│   │       └── sql-guard.template.json
│   └── mcp/
│       ├── settings.json          # 真实凭据（已 gitignore）
│       └── settings.template.json # 脱敏模板
└── sync.sh                        # 三合一同步脚本（pull/push/install/status）
```

## sync.sh 用法

所有操作都通过 `sync.sh`：

```bash
# ① 拉取：从 GitHub 同步最新规范到本机
./sync.sh pull

# ② 推送：本机改动提交并 push 到 GitHub
./sync.sh push "提交说明"

# ③ 查看与 GitHub 的同步状态
./sync.sh status

# ④ 安装：为某项目生成分层 CLAUDE.md（项目 > 公司 > 个人）
./sync.sh install /path/to/project
```

## 工作流

### 维护规范（在 `D:\hub\ai-repository`）

```bash
cd /d/hub/ai-repository

# 编辑规则，例如
# vim personal/rules/steering/code_style.md

./sync.sh push "补充多线程规范"    # 改动自动 push 到 GitHub
```

换机器后拉取：

```bash
cd /d/hub/ai-repository
./sync.sh pull
```

### 新项目接入（在项目目录）

```bash
# 一键生成分层配置
/d/hub/ai-repository/sync.sh install .

# 生成物：
#   ./CLAUDE.md          分层规则入口（项目级规则 + @import 公司/个人规范）
#   ./.mcp.json          MCP 配置（自动 gitignore，含凭据）
#   ./.claude/hooks-rules.md   hook 转换规则
#   ./sql-guard.json     SQL 安全配置
```

### 规范更新后（项目无需操作）

项目 `CLAUDE.md` 通过相对路径 `@../ai-repository/...` 引用规范源文件。
在 `D:\hub\ai-repository` 改动后，**项目重启 Claude Code 即自动读取最新规则**，无需重新 install 或复制。

## 各工具适配

| 工具 | 接入方式 |
|------|---------|
| Claude Code | `sync.sh install .` 生成分层 CLAUDE.md + .mcp.json |
| Kiro | `cp personal/rules/steering/* ~/.kiro/steering/` + `cp personal/rules/hooks/*.hook ~/.kiro/hooks/` |
| Codex | 参考 `personal/mcp/`、`company/mcp/` 模板配置 |

## 优先级实现原理

项目 `CLAUDE.md` 结构（由 install 生成）：

```markdown
## 项目级规则（最高优先级）     ← 项目自有，覆盖下方
(项目特有规则)

## 公司规范                      ← @import ../ai-repository/company/...
## 个人规范                      ← @import ../ai-repository/personal/...
## Hook 规则                     ← @import .claude/hooks-rules.md
```

Claude Code 启动时递归解析 `@import`，把三层规则并入 CLAUDE.md，项目级写在最前并声明覆盖关系。
