"use strict";

const fs = require("fs");
const path = require("path");
const { AgentAdapter } = require("./agent-adapter");
const { addLocalIgnores, copyIfMissing, ensureDir, writeText } = require("../core/files");
const { generateHookMarkdown } = require("../core/hook-markdown");
const { updateManagedBlock } = require("../core/managed-block");
const {
  hashText,
  jsonEquals,
  McpProjectRegistry,
  renderMcpJson,
} = require("../core/mcp-project-registry");
const { installSkills } = require("../core/skill-installer");

const START = "<!-- ai-repo-imports:start -->";
const END = "<!-- ai-repo-imports:end -->";

function relativeImport(projectDir, repositoryRoot) {
  let relative = path.relative(projectDir, repositoryRoot).split(path.sep).join("/");
  if (!relative) relative = ".";
  if (!relative.startsWith(".")) relative = `./${relative}`;
  return relative;
}

class ClaudeAdapter extends AgentAdapter {
  registry() {
    return new McpProjectRegistry(this.repository.root, this.localStateDir);
  }

  installSkills() {
    const destination = path.join(this.homeDir, ".claude", "skills");
    const result = installSkills(this.repository.skills(), destination);
    this.output.log(`Claude Skills: ${destination}`);
    this.output.log(`  链接 ${result.linked.length} / 复制 ${result.copied.length} / 删除 ${result.removed.length} / 跳过 ${result.skipped.length}`);
    return { destination, ...result };
  }

  installProject(projectDir) {
    const project = path.resolve(projectDir);
    if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
      throw new Error(`项目目录不存在: ${project}`);
    }

    const claudeDir = path.join(project, ".claude");
    ensureDir(claudeDir);

    // 保持原有 Claude 顺序，避免改变已在使用的 CLAUDE.md 行为。
    const hooks = this.repository.hooks(["company", "personal"]);
    const hookMarkdown = generateHookMarkdown(hooks, "scripts/ai-config.js");
    const hooksFile = path.join(claudeDir, "hooks-rules.md");
    if (hookMarkdown) writeText(hooksFile, hookMarkdown);
    else if (fs.existsSync(hooksFile)) fs.rmSync(hooksFile);

    const importRoot = relativeImport(project, this.repository.root);
    const block = [
      "<!-- 由 ai-repository/scripts/ai-config.js 自动维护，请勿手动编辑 start~end 之间的内容 -->",
    ];
    const company = this.repository.layers.company.steering;
    const personal = this.repository.layers.personal.steering;
    if (company.length) {
      block.push("", "## 公司规范", "");
      for (const entry of company) block.push(`@${importRoot}/company/rules/steering/${entry.name}`, "");
    }
    if (personal.length) {
      block.push("## 个人规范", "");
      for (const entry of personal) block.push(`@${importRoot}/personal/rules/steering/${entry.name}`, "");
    }
    if (hookMarkdown) block.push("## Hook 规则（由 .rule.json 自动转换）", "", "@.claude/hooks-rules.md", "");

    const claudeFile = path.join(project, "CLAUDE.md");
    const initial = [
      "# 项目规则",
      "",
      "> 本入口由 `ai-repository/scripts/ai-config.js` 生成。",
      "> 分层优先级：**项目级（本节） > 公司规范 > 个人规范**。",
      "> 更新仓库规范后无需重跑，重启 Claude 即通过 `@import` 读取最新内容。",
      "",
      "## 项目级规则（最高优先级）",
      "",
      "<!-- 在此添加项目特有规则 -->",
      "",
      "（暂无项目特有规则）",
      "",
      "---",
      "",
    ].join("\n");
    const current = fs.existsSync(claudeFile) ? fs.readFileSync(claudeFile, "utf8") : initial;
    writeText(claudeFile, updateManagedBlock(current, START, END, block.join("\n"), "append"));

    const mcpFile = path.join(project, ".mcp.json");
    const desiredMcp = renderMcpJson(this.repository.mcp());
    if (!fs.existsSync(mcpFile)) writeText(mcpFile, desiredMcp);
    const currentMcp = fs.readFileSync(mcpFile, "utf8");
    if (jsonEquals(currentMcp, this.repository.mcp())) {
      this.registry().register(project, hashText(currentMcp));
    } else if (!this.registry().get(project)) {
      this.output.warn?.(`项目已有非受管 .mcp.json，未登记自动同步: ${mcpFile}`);
    }
    const guardFile = path.join(project, "sql-guard.json");
    copyIfMissing(this.repository.sqlGuardTemplate(), guardFile);
    addLocalIgnores(project, [".mcp.json", "sql-guard.json"]);

    this.output.log(`Claude 项目接入完成: ${project}`);
    return { project, claudeFile, hooksFile, mcpFile, guardFile };
  }

  syncMcpProject(projectDir, { force = false } = {}) {
    const project = path.resolve(projectDir);
    if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
      throw new Error(`项目目录不存在: ${project}`);
    }

    const mcpFile = path.join(project, ".mcp.json");
    const desiredValue = this.repository.mcp();
    const desiredContent = renderMcpJson(desiredValue);
    const registry = this.registry();
    const registered = registry.get(project);

    if (fs.existsSync(mcpFile)) {
      const currentContent = fs.readFileSync(mcpFile, "utf8");
      if (registered) {
        const currentHash = hashText(currentContent);
        if (currentHash !== registered.contentHash && !force) {
          throw new Error(`项目 .mcp.json 已被手工修改，拒绝覆盖: ${mcpFile}（如确认覆盖请加 --force）`);
        }
      } else if (!jsonEquals(currentContent, desiredValue) && !force) {
        throw new Error(`项目 .mcp.json 尚未受 ai-repository 管理，拒绝覆盖: ${mcpFile}（如确认覆盖请加 --force）`);
      }
    }

    writeText(mcpFile, desiredContent);
    registry.register(project, hashText(desiredContent));
    addLocalIgnores(project, [".mcp.json"]);
    this.output.log(`Claude MCP 已同步: ${mcpFile}`);
    return { project, mcpFile, contentHash: hashText(desiredContent) };
  }

  syncAllMcp({ force = false } = {}) {
    const projects = this.registry().projects();
    if (!projects.length) {
      this.output.log("尚无已登记的 Claude 项目；请先执行 claude install <项目目录>");
      return { synced: [], failed: [] };
    }

    const result = { synced: [], failed: [] };
    for (const entry of projects) {
      try {
        this.syncMcpProject(entry.path, { force });
        result.synced.push(entry.path);
      } catch (error) {
        result.failed.push({ project: entry.path, message: error.message });
        this.output.warn?.(`[MCP 同步失败] ${entry.path}: ${error.message}`);
      }
    }
    this.output.log(`Claude MCP 批量同步完成: 成功 ${result.synced.length} / 失败 ${result.failed.length}`);
    return result;
  }
}

module.exports = { ClaudeAdapter };
