#!/usr/bin/env node
"use strict";

// 从本脚本真实位置向上查找 ai-repository 根（同时含 memory/ 与 scripts/ai-config.js），
// 打印其中的 memory 绝对路径。兼容 skill 以软链方式安装到 ~/.<tool>/skills 的情形。

const fs = require("fs");
const path = require("path");

function resolveMemoryRoot() {
  let dir = fs.realpathSync(__dirname);
  for (;;) {
    const hasMemory = fs.existsSync(path.join(dir, "memory"));
    const hasScript = fs.existsSync(path.join(dir, "scripts", "ai-config.js"));
    if (hasMemory && hasScript) return path.join(dir, "memory");
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const root = resolveMemoryRoot();
if (!root) {
  process.stderr.write("未找到 ai-repository/memory，请确认 ai-repository 位置或运行 memory init\n");
  process.exit(1);
}
process.stdout.write(`${root}\n`);
