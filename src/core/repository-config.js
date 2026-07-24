"use strict";

const fs = require("fs");
const path = require("path");

function listFiles(dir, suffix) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(suffix))
    .sort()
    .map((name) => path.join(dir, name));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadLayer(root, layer) {
  const layerRoot = path.join(root, layer);
  const steering = listFiles(path.join(layerRoot, "rules", "steering"), ".md")
    .map((file) => ({ layer, file, name: path.basename(file), content: fs.readFileSync(file, "utf8") }));
  const hooks = listFiles(path.join(layerRoot, "rules", "hooks"), ".rule.json")
    .map((file) => ({ layer, file, name: path.basename(file), value: readJson(file) }));

  const realMcp = path.join(layerRoot, "mcp", "settings.json");
  const templateMcp = path.join(layerRoot, "mcp", "settings.template.json");
  const mcpFile = fs.existsSync(realMcp) ? realMcp : (fs.existsSync(templateMcp) ? templateMcp : null);

  const skillsDir = path.join(layerRoot, "skills");
  const skills = fs.existsSync(skillsDir)
    ? fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => ({ layer, name: entry.name, dir: path.join(skillsDir, entry.name) }))
    : [];

  return {
    steering,
    hooks,
    mcpFile,
    mcp: mcpFile ? readJson(mcpFile) : { mcpServers: {} },
    skills,
  };
}

class RepositoryConfig {
  constructor(root) {
    this.root = path.resolve(root);
    this.layers = {
      personal: loadLayer(this.root, "personal"),
      company: loadLayer(this.root, "company"),
    };
  }

  steering(order = ["personal", "company"]) {
    return order.flatMap((layer) => this.layers[layer].steering);
  }

  hooks(order = ["personal", "company"]) {
    return order.flatMap((layer) => this.layers[layer].hooks);
  }

  mcp() {
    const personal = this.layers.personal.mcp.mcpServers || {};
    const company = this.layers.company.mcp.mcpServers || {};
    return { mcpServers: { ...personal, ...company } };
  }

  skills() {
    const merged = new Map();
    for (const skill of this.layers.personal.skills) merged.set(skill.name, skill);
    for (const skill of this.layers.company.skills) merged.set(skill.name, skill);
    return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  sqlGuardTemplate() {
    const candidates = [
      path.join(this.root, "company", "rules", "hooks", "sql-guard.template.json"),
      path.join(this.root, "personal", "rules", "hooks", "sql-guard.template.json"),
    ];
    return candidates.find((file) => fs.existsSync(file)) || null;
  }
}

module.exports = { RepositoryConfig };
