#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { RepositoryConfig } = require("../src/core/repository-config");
const { changedSkillFiles, installGitHooks } = require("../src/core/git-hooks");
const { ensureScaffold, status: memoryStatus } = require("../src/core/memory-store");
const { ClaudeAdapter } = require("../src/adapters/claude-adapter");
const { CodexAdapter } = require("../src/adapters/codex-adapter");
const { KiroAdapter } = require("../src/adapters/kiro-adapter");

function usage() {
  console.log(`AI 配置手动接入脚本

用法:
  node scripts/ai-config.js claude skills
  node scripts/ai-config.js claude install [项目目录]
  node scripts/ai-config.js claude mcp-sync <项目目录> [--force]
  node scripts/ai-config.js claude mcp-sync --all [--force]
  node scripts/ai-config.js codex skills
  node scripts/ai-config.js codex install [项目目录]
  node scripts/ai-config.js kiro skills
  node scripts/ai-config.js kiro install [项目目录]
  node scripts/ai-config.js hooks install
  node scripts/ai-config.js memory init
  node scripts/ai-config.js memory status

说明:
  - Claude Skills 安装到用户级 ~/.claude/skills
  - Codex Skills 安装到用户级 ~/.agents/skills
  - Kiro Skills 安装到用户级 ~/.kiro/skills
  - install 只更新脚本托管区，不覆盖项目手写规则和已有安全配置
  - hooks install 为当前 ai-repository 注册 Git Hooks，Skill 变化后自动同步
  - memory init 在 ai-repository/memory 下创建记忆库骨架（幂等，不覆盖已有内容）
  - memory status 打印记忆库根目录与统计，供 Agent 定位记忆库位置
`);
}

function main(argv) {
  const [, , agentName, action = "help", ...args] = argv;
  if (!agentName || ["help", "-h", "--help"].includes(agentName) || ["help", "-h", "--help"].includes(action)) {
    usage();
    return;
  }

  const repositoryRoot = path.resolve(__dirname, "..");
  const repository = new RepositoryConfig(repositoryRoot);
  const homeDir = process.env.AI_CONFIG_HOME || os.homedir();
  const adapters = {
    claude: new ClaudeAdapter({ repository, homeDir }),
    codex: new CodexAdapter({ repository, homeDir }),
    kiro: new KiroAdapter({ repository, homeDir }),
  };

  if (agentName.toLowerCase() === "hooks") {
    if (action === "install") {
      const result = installGitHooks(repositoryRoot);
      console.log(result.alreadyInstalled ? "Git Hooks 已安装，无需重复配置" : "Git Hooks 安装完成: core.hooksPath=.githooks");
      return;
    }
    if (action === "sync-skills") {
      const changed = changedSkillFiles(repositoryRoot, args[0], args[1]);
      if (!changed.length) return;
      console.log(`[ai-repository] 检测到 Skill 更新: ${changed.join(", ")}`);
      let synced = 0;
      if (fs.existsSync(path.join(homeDir, ".claude", "skills"))) {
        adapters.claude.installSkills();
        synced++;
      }
      if (fs.existsSync(path.join(homeDir, ".agents", "skills"))) {
        adapters.codex.installSkills();
        synced++;
      }
      if (fs.existsSync(path.join(homeDir, ".kiro", "skills"))) {
        adapters.kiro.installSkills();
        synced++;
      }
      if (!synced) console.log("[ai-repository] 尚未安装用户级 Skills，跳过自动同步");
      return;
    }
    throw new Error(`不支持的 Hook 操作: ${action}`);
  }

  if (agentName.toLowerCase() === "memory") {
    if (action === "init") {
      const result = ensureScaffold(repositoryRoot);
      console.log(`记忆库根目录: ${result.root}`);
      console.log(result.created.length ? `已创建: ${result.created.join(", ")}` : "记忆库骨架已存在，无需创建");
      return;
    }
    if (action === "status") {
      const result = memoryStatus(repositoryRoot);
      console.log(`记忆库根目录: ${result.root}`);
      if (!result.exists) {
        console.log("记忆库尚未初始化，请先执行: node scripts/ai-config.js memory init");
        return;
      }
      console.log(`全局教训条目: ${result.lessons}`);
      if (!result.projects.length) {
        console.log("项目记忆: 暂无");
      } else {
        console.log("项目记忆:");
        for (const entry of result.projects) {
          console.log(`  - ${entry.project}: ${entry.memories.length ? entry.memories.join(", ") : "（空）"}`);
        }
      }
      return;
    }
    throw new Error(`不支持的 Memory 操作: ${action}`);
  }

  const adapter = adapters[agentName.toLowerCase()];
  if (!adapter) throw new Error(`不支持的 Agent: ${agentName}（仅支持 claude、codex、kiro）`);
  if (action === "skills") adapter.installSkills();
  else if (action === "install") adapter.installProject(args[0] || process.cwd());
  else if (action === "mcp-sync" && agentName.toLowerCase() === "claude") {
    const force = args.includes("--force");
    if (args.includes("--all")) {
      const result = adapter.syncAllMcp({ force });
      if (result.failed.length) throw new Error(`${result.failed.length} 个项目 MCP 同步失败`);
    } else {
      const project = args.find((value) => value !== "--force") || process.cwd();
      adapter.syncMcpProject(project, { force });
    }
  } else throw new Error(`不支持的操作: ${action}`);
}

try {
  main(process.argv);
} catch (error) {
  console.error(`[ERROR] ${error.message}`);
  process.exitCode = 1;
}

module.exports = { main };
