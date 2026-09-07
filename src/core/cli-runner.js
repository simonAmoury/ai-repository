"use strict";

const fs = require("fs");
const { changedSkillFiles, installGitHooks } = require("./git-hooks");
const { ensureScaffold, status: memoryStatus } = require("./memory-store");

function parseInvocation(argv) {
  const [, , agentName, action = "help", ...args] = argv;
  return { agentName, action, args };
}

function dispatchHooks({ action, args, adapters, repositoryRoot, output }) {
  if (action === "install") {
    const result = installGitHooks(repositoryRoot);
    output.log(result.alreadyInstalled ? "Git Hooks 已安装，无需重复配置" : "Git Hooks 安装完成: core.hooksPath=.githooks");
    return;
  }
  if (action === "sync-skills") {
    const changed = changedSkillFiles(repositoryRoot, args[0], args[1]);
    if (!changed.length) return;
    output.log(`[ai-repository] 检测到 Skill 更新: ${changed.join(", ")}`);
    const installedAdapters = Object.values(adapters)
      .filter((adapter) => fs.existsSync(adapter.skillsDirectory()));
    for (const adapter of installedAdapters) adapter.installSkills();
    if (!installedAdapters.length) output.log("[ai-repository] 尚未安装用户级 Skills，跳过自动同步");
    return;
  }
  throw new Error(`不支持的 Hook 操作: ${action}`);
}

function dispatchMemory({ action, repositoryRoot, output }) {
  if (action === "init") {
    const result = ensureScaffold(repositoryRoot);
    output.log(`记忆库根目录: ${result.root}`);
    output.log(result.created.length ? `已创建: ${result.created.join(", ")}` : "记忆库骨架已存在，无需创建");
    return;
  }
  if (action === "status") {
    const result = memoryStatus(repositoryRoot);
    output.log(`记忆库根目录: ${result.root}`);
    if (!result.exists) {
      output.log("记忆库尚未初始化，请先执行: node scripts/ai-config.js memory init");
      return;
    }
    output.log(`全局教训条目: ${result.lessons}`);
    if (!result.projects.length) {
      output.log("项目记忆: 暂无");
    } else {
      output.log("项目记忆:");
      for (const entry of result.projects) {
        output.log(`  - ${entry.project}: ${entry.memories.length ? entry.memories.join(", ") : "（空）"}`);
      }
    }
    return;
  }
  throw new Error(`不支持的 Memory 操作: ${action}`);
}

function dispatchAgent({ agentName, normalizedAgent, action, args, adapters }) {
  const adapter = adapters[normalizedAgent];
  if (!adapter) throw new Error(`不支持的 Agent: ${agentName}（仅支持 claude、codex、kiro）`);
  if (action === "skills") adapter.installSkills();
  else if (action === "install") adapter.installProject(args[0] || process.cwd());
  else if (action === "mcp-sync" && normalizedAgent === "claude") {
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

function dispatchInvocation({ agentName, action, args, adapters, repositoryRoot, output = console }) {
  const normalizedAgent = agentName.toLowerCase();
  if (normalizedAgent === "hooks") {
    dispatchHooks({ action, args, adapters, repositoryRoot, output });
    return;
  }
  if (normalizedAgent === "memory") {
    dispatchMemory({ action, repositoryRoot, output });
    return;
  }
  dispatchAgent({ agentName, normalizedAgent, action, args, adapters });
}

module.exports = { dispatchInvocation, parseInvocation };
