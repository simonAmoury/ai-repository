"use strict";

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeText(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function copyIfMissing(source, target) {
  if (!source || fs.existsSync(target)) return false;
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  return true;
}

function findGitExclude(projectDir) {
  try {
    const value = childProcess.execFileSync(
      "git",
      ["-C", projectDir, "rev-parse", "--path-format=absolute", "--git-path", "info/exclude"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
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

module.exports = { addLocalIgnores, copyIfMissing, ensureDir, writeText };
