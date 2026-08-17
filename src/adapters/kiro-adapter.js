"use strict";

const fs = require("fs");
const path = require("path");
const { AgentAdapter } = require("./agent-adapter");
const { addLocalIgnores, copyIfMissing, writeText } = require("../core/files");
const { generateHookMarkdown } = require("../core/hook-markdown");
const { updateManagedBlock } = require("../core/managed-block");
const { renderMcpJson } = require("../core/mcp-project-registry");
const { installSkills } = require("../core/skill-installer");

const STEERING_START = "<!-- ai-repository:begin (自动生成，请勿手动编辑此区块) -->";
const STEERING_END = "<!-- ai-repository:end -->";

class KiroAdapter extends AgentAdapter {
  installSkills() {
    const destination = path.join(this.homeDir, ".kiro", "skills");
    const result = installSkills(this.repository.skills(), destination);
    this.output.log(`Kiro Skills: ${destination}`);
    this.output.log(`  链接 ${result.linked.length} / 复制 ${result.copied.length} / 删除 ${result.removed.length} / 跳过 ${result.skipped.length}`);
    return { destination, ...result };
  }

  installProject(projectDir) {
    const project = path.resolve(projectDir);
    if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
      throw new Error(`项目目录不存在: ${project}`);
    }

    // Kiro steering 的 #[[file:...]] 只能引用工作区内文件，无法指向本仓库，
    // 因此与 Codex 一样内联完整规则；个人在前、公司在后，确保公司规则优先。
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

    // Kiro steering 是多文件目录，项目自有规则放在同目录其他 .md 中，本文件只承载 ai-repository 托管区。
    const steeringFile = path.join(project, ".kiro", "steering", "ai-repository.md");
    const currentSteering = fs.existsSync(steeringFile) ? fs.readFileSync(steeringFile, "utf8") : "";
    writeText(steeringFile, updateManagedBlock(currentSteering, STEERING_START, STEERING_END, body.join("\n"), "prepend"));

    const mcpFile = path.join(project, ".kiro", "settings", "mcp.json");
    if (!fs.existsSync(mcpFile)) writeText(mcpFile, renderMcpJson(this.repository.mcp()));

    const guardFile = path.join(project, "sql-guard.json");
    copyIfMissing(this.repository.sqlGuardTemplate(), guardFile);
    addLocalIgnores(project, [".kiro/settings/mcp.json", "sql-guard.json"]);

    this.output.log(`Kiro 项目接入完成: ${project}`);
    return { project, steeringFile, mcpFile, guardFile };
  }
}

module.exports = { KiroAdapter };
