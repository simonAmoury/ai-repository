"use strict";

const childProcess = require("child_process");

function git(repositoryRoot, args, options = {}) {
  return childProcess.execFileSync(
    "git",
    ["-C", repositoryRoot, ...args],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...options },
  ).trim();
}

module.exports = { git };
