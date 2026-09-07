#!/usr/bin/env node
"use strict";

const os = require("os");
const path = require("path");
const { dispatchInvocation, parseInvocation } = require("../src/core/cli-runner");
const { RepositoryConfig } = require("../src/core/repository-config");
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
  const { agentName, action, args } = parseInvocation(argv);
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

  dispatchInvocation({ agentName, action, args, adapters, repositoryRoot });
}

try {
  main(process.argv);
} catch (error) {
  console.error(`[ERROR] ${error.message}`);
  process.exitCode = 1;
}

module.exports = { main };
