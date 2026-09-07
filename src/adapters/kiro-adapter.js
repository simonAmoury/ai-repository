"use strict";

const fs = require("fs");
const path = require("path");
const { AgentAdapter } = require("./agent-adapter");
const { writeText, writeTextIfMissing } = require("../core/files");
const { renderInlineRules } = require("../core/inline-rules");
const { updateManagedBlock } = require("../core/managed-block");
const { renderMcpJson } = require("../core/mcp-project-registry");
const { installProjectSupportFiles } = require("../core/project-support");

const STEERING_START = "<!-- ai-repository:begin (自动生成，请勿手动编辑此区块) -->";
const STEERING_END = "<!-- ai-repository:end -->";

class KiroAdapter extends AgentAdapter {
  skillsDirectory() {
    return path.join(this.homeDir, ".kiro", "skills");
  }

  installSkills() {
    return this.installSkillsAt("Kiro");
  }

  installProject(projectDir) {
    const project = this.resolveProjectDir(projectDir);

    // Kiro steering 的 #[[file:...]] 只能引用工作区内文件，无法指向本仓库，
    // 因此与 Codex 一样内联完整规则；个人在前、公司在后，确保公司规则优先。
    const body = renderInlineRules(this.repository, ["personal", "company"]);

    // Kiro steering 是多文件目录，项目自有规则放在同目录其他 .md 中，本文件只承载 ai-repository 托管区。
    const steeringFile = path.join(project, ".kiro", "steering", "ai-repository.md");
    const currentSteering = fs.existsSync(steeringFile) ? fs.readFileSync(steeringFile, "utf8") : "";
    writeText(steeringFile, updateManagedBlock(currentSteering, STEERING_START, STEERING_END, body, "prepend"));

    const mcpFile = path.join(project, ".kiro", "settings", "mcp.json");
    writeTextIfMissing(mcpFile, renderMcpJson(this.repository.mcp()));

    const guardFile = installProjectSupportFiles(this.repository, project, [mcpFile]);

    this.output.log(`Kiro 项目接入完成: ${project}`);
    return { project, steeringFile, mcpFile, guardFile };
  }
}

module.exports = { KiroAdapter };
