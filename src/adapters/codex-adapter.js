"use strict";

const fs = require("fs");
const path = require("path");
const { AgentAdapter } = require("./agent-adapter");
const { ensureDir, writeText } = require("../core/files");
const { renderInlineRules } = require("../core/inline-rules");
const { updateManagedBlock } = require("../core/managed-block");
const { renderMcpServers } = require("../core/mcp-toml");
const { installProjectSupportFiles } = require("../core/project-support");

const AGENTS_START = "<!-- ai-repository:begin (自动生成，请勿手动编辑此区块) -->";
const AGENTS_END = "<!-- ai-repository:end -->";
const MCP_START = "# ai-repository:mcp:begin";
const MCP_END = "# ai-repository:mcp:end";

class CodexAdapter extends AgentAdapter {
  skillsDirectory() {
    return path.join(this.homeDir, ".agents", "skills");
  }

  installSkills() {
    return this.installSkillsAt("Codex");
  }

  installProject(projectDir) {
    const project = this.resolveProjectDir(projectDir);

    // Codex 将完整规则写入 AGENTS.md；个人在前、公司在后，确保公司规则优先。
    const body = renderInlineRules(this.repository, ["personal", "company"]);

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
    writeText(agentsFile, updateManagedBlock(currentAgents, AGENTS_START, AGENTS_END, body, "prepend"));

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

    const guardFile = installProjectSupportFiles(this.repository, project, [configFile]);

    if (rendered.skipped.length) {
      this.output.warn?.(`以下 MCP 已由项目手写配置管理，未覆盖: ${rendered.skipped.join(", ")}`);
    }
    this.output.log(`Codex 项目接入完成: ${project}`);
    return { project, agentsFile, configFile, guardFile, skippedMcp: rendered.skipped };
  }
}

module.exports = { CodexAdapter };
