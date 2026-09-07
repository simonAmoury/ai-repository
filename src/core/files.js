"use strict";

const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeText(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function writeTextIfMissing(file, content) {
  if (fs.existsSync(file)) return false;
  writeText(file, content);
  return true;
}

function copyIfMissing(source, target) {
  if (!source || fs.existsSync(target)) return false;
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  return true;
}

module.exports = { copyIfMissing, ensureDir, writeText, writeTextIfMissing };
