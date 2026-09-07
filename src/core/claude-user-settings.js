"use strict";

const fs = require("fs");
const { writeText } = require("./files");

// 用户级 settings.json 由本机自行维护（含密钥、hooks、model），
// 这里只覆盖仓库声明的托管键，其余原样保留。
function mergeUserSettings(current, desired) {
  const merged = { ...current };
  for (const [key, value] of Object.entries(desired)) {
    const isPlainObject = (input) => !!input && typeof input === "object" && !Array.isArray(input);
    merged[key] = isPlainObject(value) && isPlainObject(current[key])
      ? { ...current[key], ...value }
      : value;
  }
  return merged;
}

function managedKeys(desired) {
  return Object.entries(desired).flatMap(([key, value]) => (
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.keys(value).map((child) => `${key}.${child}`)
      : [key]
  ));
}

function readSettings(file) {
  if (!fs.existsSync(file)) return {};
  const content = fs.readFileSync(file, "utf8").trim();
  if (!content) return {};
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`用户级 settings.json 无法解析，已中止写入: ${file} (${error.message})`);
  }
}

function applyUserSettings(file, desired) {
  const current = readSettings(file);
  const merged = mergeUserSettings(current, desired);
  const changed = JSON.stringify(merged) !== JSON.stringify(current);
  if (changed) writeText(file, JSON.stringify(merged, null, 2));
  return { file, changed, keys: managedKeys(desired) };
}

module.exports = { applyUserSettings, managedKeys, mergeUserSettings, readSettings };
