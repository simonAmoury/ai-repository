"use strict";

class AgentAdapter {
  constructor({ repository, homeDir, localStateDir = null, output = console }) {
    this.repository = repository;
    this.homeDir = homeDir;
    this.localStateDir = localStateDir;
    this.output = output;
  }

  installSkills() {
    throw new Error("子类必须实现 installSkills()");
  }

  installProject() {
    throw new Error("子类必须实现 installProject()");
  }
}

module.exports = { AgentAdapter };
