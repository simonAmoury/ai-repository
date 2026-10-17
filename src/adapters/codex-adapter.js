"use strict";

const fs = require("fs");
const path = require("path");
const { AgentAdapter } = require("./agent-adapter");
const { writeText } = require("../core/files");
const { renderInlineRules } = require("../core/inline-rules");
const { updateManagedBlock } = require("../core/managed-block");
const { installProjectSupportFiles } = require("../core/project-support");
const { TOML_START } = require("../core/user-mcp");

const AGENTS_START = "<!-- ai-repository:begin (自动生成，请勿手动编辑此区块) -->";
const AGENTS_END = "<!-- ai-repository:end -->";

class CodexAdapter extends AgentAdapter {
  skillsDirectory() {
    return path.join(this.homeDir, ".agents", "skills");
  }

  userMcpFile() {
    return path.join(this.homeDir, ".codex", "config.toml");
  }

  installSkills() {
    return this.installSkillsAt("Codex");
  }

  syncUserMcp() {
    return this.syncUserMcpAt("Codex", "toml");
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

    const guardFile = installProjectSupportFiles(this.repository, project, []);
    const legacyConfig = path.join(project, ".codex", "config.toml");
    if (fs.existsSync(legacyConfig) && fs.readFileSync(legacyConfig, "utf8").includes(TOML_START)) {
      this.warnLegacyProjectMcp([legacyConfig]);
    }

    this.output.log(`Codex 项目接入完成: ${project}`);
    return { project, agentsFile, guardFile };
  }
}

module.exports = { CodexAdapter };
