"use strict";

function key(value) {
  return /^[A-Za-z0-9_-]+$/.test(value) ? value : JSON.stringify(value);
}

function string(value) {
  return JSON.stringify(String(value));
}

function array(values) {
  return `[${values.map(string).join(", ")}]`;
}

function inlineTable(value) {
  return `{ ${Object.entries(value).map(([name, item]) => `${key(name)} = ${string(item)}`).join(", ")} }`;
}

function findExistingServers(content) {
  const names = new Set();
  const pattern = /^\s*\[mcp_servers\.([^\]]+)\]\s*$/gm;
  for (const match of content.matchAll(pattern)) names.add(match[1].replace(/^"|"$/g, ""));
  return names;
}

function renderMcpServers(servers, existingContent = "") {
  const existing = findExistingServers(existingContent);
  const rendered = [];
  const skipped = [];

  for (const name of Object.keys(servers).sort()) {
    if (existing.has(name)) {
      skipped.push(name);
      continue;
    }
    const config = servers[name] || {};
    const lines = [`[mcp_servers.${key(name)}]`];
    if (config.command) lines.push(`command = ${string(config.command)}`);
    if (Array.isArray(config.args) && config.args.length) lines.push(`args = ${array(config.args)}`);
    if (config.url) lines.push(`url = ${string(config.url)}`);
    if (config.env && Object.keys(config.env).length) lines.push(`env = ${inlineTable(config.env)}`);
    rendered.push(lines.join("\n"));
  }

  return { text: rendered.join("\n\n"), skipped };
}

module.exports = { renderMcpServers };
