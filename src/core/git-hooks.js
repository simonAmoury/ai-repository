"use strict";

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

function git(repositoryRoot, args, options = {}) {
  return childProcess.execFileSync(
    "git",
    ["-C", repositoryRoot, ...args],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...options },
  ).trim();
}

function installGitHooks(repositoryRoot) {
  const hooksDir = path.join(repositoryRoot, ".githooks");
  if (!fs.existsSync(hooksDir)) throw new Error(`Git Hook 目录不存在: ${hooksDir}`);

  let current = "";
  try {
    current = git(repositoryRoot, ["config", "--local", "--get", "core.hooksPath"]);
  } catch (error) {
    if (error.status !== 1) throw error;
  }
  if (current && current !== ".githooks") {
    throw new Error(`当前仓库已配置 core.hooksPath=${current}，为避免覆盖现有 Hook，未自动修改`);
  }
  if (!current) git(repositoryRoot, ["config", "--local", "core.hooksPath", ".githooks"]);
  return { hooksPath: ".githooks", alreadyInstalled: current === ".githooks" };
}

function changedSkillFiles(repositoryRoot, before, after) {
  if (!before || !after || before === "0".repeat(40)) return ["company/skills", "personal/skills"];
  try {
    const output = git(repositoryRoot, [
      "diff",
      "--name-only",
      before,
      after,
      "--",
      "company/skills",
      "personal/skills",
    ]);
    return output ? output.split(/\r?\n/).filter(Boolean) : [];
  } catch {
    // 无法比较（例如浅克隆）时宁可同步一次，Skill 安装本身是幂等的。
    return ["company/skills", "personal/skills"];
  }
}

module.exports = { changedSkillFiles, installGitHooks };
