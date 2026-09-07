"use strict";

const fs = require("fs");
const path = require("path");
const { installSkills } = require("../core/skill-installer");

class AgentAdapter {
  constructor({ repository, homeDir, localStateDir = null, output = console }) {
    this.repository = repository;
    this.homeDir = homeDir;
    this.localStateDir = localStateDir;
    this.output = output;
  }

  installSkillsAt(label) {
    const destination = this.skillsDirectory();
    const result = installSkills(this.repository.skills(), destination);
    this.output.log(`${label} Skills: ${destination}`);
    this.output.log(`  链接 ${result.linked.length} / 复制 ${result.copied.length} / 删除 ${result.removed.length} / 跳过 ${result.skipped.length}`);
    return { destination, ...result };
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
