"use strict";

const fs = require("fs");
const path = require("path");
const { installSkills } = require("../core/skill-installer");
const { applyJsonMcpServers, applyTomlMcpServers } = require("../core/user-mcp");

class AgentAdapter {
  constructor({ repository, homeDir, output = console }) {
    this.repository = repository;
    this.homeDir = homeDir;
    this.output = output;
  }

  installSkillsAt(label, mode = "link") {
    const destination = this.skillsDirectory();
    const result = installSkills(this.repository.skills(), destination, mode);
    this.output.log(`${label} Skills: ${destination}`);
    this.output.log(`  链接 ${result.linked.length} / 复制 ${result.copied.length} / 删除 ${result.removed.length} / 跳过 ${result.skipped.length}`);
    return { destination, ...result };
  }

  // MCP 统一写入用户级配置，所有项目共用，不再生成项目级 MCP 文件。
  syncUserMcpAt(label, format) {
    const file = this.userMcpFile();
    const servers = this.repository.mcp().mcpServers || {};
    const apply = format === "toml" ? applyTomlMcpServers : applyJsonMcpServers;
    const result = apply(file, servers);
    this.output.log(result.changed
      ? `${label} 用户级 MCP 已更新: ${file}（${result.servers.join(", ") || "无"}；需重启 ${label} 生效）`
      : `${label} 用户级 MCP 已是最新: ${file}`);
    if (result.skipped.length) {
      this.output.warn?.(`以下 MCP 已由用户手写配置管理，未覆盖: ${result.skipped.join(", ")}`);
    }
    return result;
  }

  // 旧版本生成的项目级 MCP 会覆盖用户级同名 Server，只提示、不自动删除。
  warnLegacyProjectMcp(files) {
    for (const file of files) {
      this.output.warn?.(`检测到项目级 MCP 配置，会覆盖用户级同名 Server，如不再需要请手动清理: ${file}`);
    }
  }

  userMcpFile() {
    throw new Error("子类必须实现 userMcpFile()");
  }

  syncUserMcp() {
    throw new Error("子类必须实现 syncUserMcp()");
  }

  resolveProjectDir(projectDir) {
    const project = path.resolve(projectDir);
    if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
      throw new Error(`项目目录不存在: ${project}`);
    }
    return project;
  }

  skillsDirectory() {
    throw new Error("子类必须实现 skillsDirectory()");
  }

  installSkills() {
    throw new Error("子类必须实现 installSkills()");
  }

  installProject() {
    throw new Error("子类必须实现 installProject()");
  }
}

module.exports = { AgentAdapter };
