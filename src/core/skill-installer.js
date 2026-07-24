"use strict";

const fs = require("fs");
const path = require("path");
const { ensureDir } = require("./files");

const MANIFEST = ".ai-repository-skills.json";

function readManifest(destination) {
  const file = path.join(destination, MANIFEST);
  if (!fs.existsSync(file)) return { version: 1, skills: {} };
  try {
    const value = JSON.parse(fs.readFileSync(file, "utf8"));
    return value?.version === 1 && value.skills ? value : { version: 1, skills: {} };
  } catch {
    return { version: 1, skills: {} };
  }
}

function lstat(file) {
  try {
    return fs.lstatSync(file);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function removeManagedTarget(target, expectedMode) {
  const stat = lstat(target);
  if (!stat) return true;
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(target);
    return true;
  }
  if (expectedMode === "copy" && stat.isDirectory()) {
    fs.rmSync(target, { recursive: true, force: true });
    return true;
  }
  return false;
}

function installSkills(skills, destination) {
  ensureDir(destination);
  const previous = readManifest(destination);
  const next = { version: 1, generatedBy: "ai-repository", skills: {} };
  const result = { linked: [], copied: [], removed: [], skipped: [] };
  const currentNames = new Set(skills.map((skill) => skill.name));

  for (const [name, managed] of Object.entries(previous.skills)) {
    if (currentNames.has(name)) continue;
    const target = path.join(destination, name);
    if (removeManagedTarget(target, managed.mode)) result.removed.push(name);
  }

  for (const skill of skills) {
    const target = path.join(destination, skill.name);
    const stat = lstat(target);
    if (stat) {
      const managed = previous.skills[skill.name];
      if (stat.isSymbolicLink()) fs.unlinkSync(target);
      else if (managed?.mode === "copy") {
        fs.rmSync(target, { recursive: true, force: true });
      } else {
        result.skipped.push(skill.name);
        continue;
      }
    }

    try {
      fs.symlinkSync(skill.dir, target, process.platform === "win32" ? "junction" : "dir");
      result.linked.push(skill.name);
      next.skills[skill.name] = { mode: "link", source: path.resolve(skill.dir) };
    } catch {
      fs.cpSync(skill.dir, target, { recursive: true });
      result.copied.push(skill.name);
      next.skills[skill.name] = { mode: "copy", source: path.resolve(skill.dir) };
    }
  }

  fs.writeFileSync(path.join(destination, MANIFEST), `${JSON.stringify(next, null, 2)}\n`, "utf8");

  return result;
}

module.exports = { installSkills, MANIFEST };
