"use strict";

const fs = require("fs");
const util = require("util");
const { writeText } = require("./files");
const { updateManagedBlock } = require("./managed-block");
const { renderMcpServers } = require("./mcp-toml");

const TOML_START = "# ai-repository:mcp:begin";
const TOML_END = "# ai-repository:mcp:end";

function readJsonObject(file) {
  if (!fs.existsSync(file)) return {};
  const content = fs.readFileSync(file, "utf8").trim();
  if (!content) return {};
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`用户级 MCP 配置无法解析，已中止写入: ${file} (${error.message})`);
  }
}

// 用户级 JSON 文件（如 ~/.claude.json）还承载 Agent 自身状态，
// 这里只按名称覆盖仓库声明的 Server，其余键和本机自加的 Server 原样保留。
function applyJsonMcpServers(file, servers) {
  const current = readJsonObject(file);
  const currentServers = current.mcpServers && typeof current.mcpServers === "object" ? current.mcpServers : {};
  const merged = { ...current, mcpServers: { ...currentServers, ...servers } };
  const changed = !util.isDeepStrictEqual(merged, current);
  if (changed) writeText(file, JSON.stringify(merged, null, 2));
  return { file, changed, servers: Object.keys(servers).sort(), skipped: [] };
}

// TOML 无法安全做键级合并，因此用托管区整体替换；托管区外手写的同名 Server 优先保留。
function applyTomlMcpServers(file, servers) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const unmanaged = current.replace(new RegExp(`${TOML_START}[\\s\\S]*?${TOML_END}`, "g"), "");
  const rendered = renderMcpServers(servers, unmanaged);
  const next = updateManagedBlock(current, TOML_START, TOML_END, rendered.text || "# 无需生成的 MCP Server", "append");
  const changed = next !== current;
  if (changed) writeText(file, next);
  const written = Object.keys(servers).filter((name) => !rendered.skipped.includes(name)).sort();
  return { file, changed, servers: written, skipped: rendered.skipped };
}

module.exports = { applyJsonMcpServers, applyTomlMcpServers, TOML_END, TOML_START };
