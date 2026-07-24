"use strict";

class AgentAdapter {
  constructor({ repository, homeDir, output = console }) {
    this.repository = repository;
    this.homeDir = homeDir;
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
