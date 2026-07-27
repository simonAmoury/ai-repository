"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const util = require("util");
const { writeText } = require("./files");

const REGISTRY_DIR = ".ai-repository-local";
const REGISTRY_FILE = "mcp-projects.json";

function hashText(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function renderMcpJson(config) {
  return `${JSON.stringify(config, null, 2)}\n`;
}

function jsonEquals(content, value) {
  try {
    return util.isDeepStrictEqual(JSON.parse(content), value);
  } catch {
    return false;
  }
}

function projectKey(project) {
  const resolved = path.resolve(project);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

class McpProjectRegistry {
  constructor(repositoryRoot, localStateDir = null) {
    this.file = path.join(localStateDir || path.join(repositoryRoot, REGISTRY_DIR), REGISTRY_FILE);
    this.value = this.read();
  }

  read() {
    if (!fs.existsSync(this.file)) return { version: 1, projects: {} };
    try {
      const value = JSON.parse(fs.readFileSync(this.file, "utf8"));
      return value?.version === 1 && value.projects ? value : { version: 1, projects: {} };
    } catch (error) {
      throw new Error(`MCP 项目登记表无法解析: ${this.file} (${error.message})`);
    }
  }

  get(project) {
    return this.value.projects[projectKey(project)] || null;
  }

  register(project, contentHash) {
    const resolved = path.resolve(project);
    this.value.projects[projectKey(resolved)] = {
      path: resolved,
      contentHash,
      updatedAt: new Date().toISOString(),
    };
    this.save();
  }

  projects() {
    return Object.values(this.value.projects).sort((a, b) => a.path.localeCompare(b.path));
  }

  save() {
    writeText(this.file, JSON.stringify(this.value, null, 2));
  }
}

module.exports = {
  hashText,
  jsonEquals,
  McpProjectRegistry,
  REGISTRY_DIR,
  renderMcpJson,
};
