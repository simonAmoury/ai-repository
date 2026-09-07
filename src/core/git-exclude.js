"use strict";

const fs = require("fs");
const path = require("path");
const { ensureDir } = require("./files");
const { git } = require("./git-command");

function findGitExclude(projectDir) {
  try {
    const value = git(
      projectDir,
      ["rev-parse", "--path-format=absolute", "--git-path", "info/exclude"],
      { stdio: ["ignore", "pipe", "ignore"] },
    );
    return value || null;
  } catch {
    return null;
  }
}

function addLocalIgnores(projectDir, patterns) {
  const excludeFile = findGitExclude(projectDir);
  if (!excludeFile) return false;
  ensureDir(path.dirname(excludeFile));
  const existing = fs.existsSync(excludeFile) ? fs.readFileSync(excludeFile, "utf8") : "";
  const known = new Set(existing.split(/\r?\n/));
  const missing = patterns.filter((pattern) => !known.has(pattern));
  if (!missing.length) return true;
  const prefix = existing && !existing.endsWith("\n") ? "\n" : "";
  fs.appendFileSync(
    excludeFile,
    `${prefix}\n# ai-repository 本地生成文件\n${missing.join("\n")}\n`,
    "utf8",
  );
  return true;
}

module.exports = { addLocalIgnores, findGitExclude };
