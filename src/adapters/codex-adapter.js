"use strict";

const fs = require("fs");
const path = require("path");
const { AgentAdapter } = require("./agent-adapter");
const { addLocalIgnores, copyIfMissing, ensureDir, writeText } = require("../core/files");
const { generateHookMarkdown } = require("../core/hook-markdown");
const { updateManagedBlock } = require("../core/managed-block");
const { renderMcpServers } = require("../core/mcp-toml");
const { installSkills } = require("../core/skill-installer");

const AGENTS_START = "<!-- ai-repository:begin (自动生成，请勿手动编辑此区块) -->";
const AGENTS_END = "<!-- ai-repository:end -->";
const MCP_START = "# ai-repository:mcp:begin";
const MCP_END = "# ai-repository:mcp:end";

class CodexAdapter extends AgentAdapter {
  installSkills() {
    const destination = path.join(this.homeDir, ".agents", "skills");
    const result = installSkills(this.repository.skills(), destination);
    this.output.log(`Codex Skills: ${destination}`);
    this.output.log(`  链接 ${result.linked.length} / 复制 ${result.copied.length} / 删除 ${result.removed.length} / 跳过 ${result.skipped.length}`);
    return { destination, ...result };
  }

  installProject(projectDir) {
    const project = path.resolve(projectDir);
    if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
      throw new Error(`项目目录不存在: ${project}`);
    }

    // Codex 将完整规则写入 AGENTS.md；个人在前、公司在后，确保公司规则优先。
    const body = ["# 通用规范（来自 ai-repository，优先级：公司 > 个人）", ""];
    for (const layer of ["personal", "company"]) {
      const title = layer === "company" ? "公司规范" : "个人规范";
      const steering = this.repository.layers[layer].steering;
      if (!steering.length) continue;
      body.push(`## ${title}`, "");
      for (const entry of steering) body.push(entry.content.trim(), "");
    }
    const hookMarkdown = generateHookMarkdown(this.repository.hooks(["personal", "company"]));
    if (hookMarkdown) body.push(hookMarkdown, "");

    const agentsFile = path.join(project, "AGENTS.md");
    const projectTemplate = [
      "# 项目级规范",
      "",
      "<!-- 在此添加项目特有规则；项目规则优先于上方通用规范。 -->",
      "",
      "（暂无项目特有规则）",
      "",
    ].join("\n");
    const currentAgents = fs.existsSync(agentsFile) ? fs.readFileSync(agentsFile, "utf8") : projectTemplate;
    writeText(agentsFile, updateManagedBlock(currentAgents, AGENTS_START, AGENTS_END, body.join("\n"), "prepend"));

    const codexDir = path.join(project, ".codex");
    ensureDir(codexDir);
    const configFile = path.join(codexDir, "config.toml");
    const currentConfig = fs.existsSync(configFile) ? fs.readFileSync(configFile, "utf8") : "";
    const unmanagedConfig = currentConfig.replace(
      new RegExp(`${MCP_START}[\\s\\S]*?${MCP_END}`, "g"),
      "",
    );
    const rendered = renderMcpServers(this.repository.mcp().mcpServers, unmanagedConfig);
    writeText(configFile, updateManagedBlock(currentConfig, MCP_START, MCP_END, rendered.text || "# 无需生成的 MCP Server", "append"));

    const guardFile = path.join(project, "sql-guard.json");
    copyIfMissing(this.repository.sqlGuardTemplate(), guardFile);
    addLocalIgnores(project, [".codex/config.toml", "sql-guard.json"]);

    if (rendered.skipped.length) {
      this.output.warn?.(`以下 MCP 已由项目手写配置管理，未覆盖: ${rendered.skipped.join(", ")}`);
    }
    this.output.log(`Codex 项目接入完成: ${project}`);
    return { project, agentsFile, configFile, guardFile, skippedMcp: rendered.skipped };
  }
}

module.exports = { CodexAdapter };
