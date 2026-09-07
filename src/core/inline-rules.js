"use strict";

const { generateHookMarkdown } = require("./hook-markdown");

function renderInlineRules(repository, order) {
  const body = ["# 通用规范（来自 ai-repository，优先级：公司 > 个人）", ""];
  for (const layer of order) {
    const title = layer === "company" ? "公司规范" : "个人规范";
    const steering = repository.steering([layer]);
    if (!steering.length) continue;
    body.push(`## ${title}`, "");
    for (const entry of steering) body.push(entry.content.trim(), "");
  }
  const hookMarkdown = generateHookMarkdown(repository.hooks(order));
  if (hookMarkdown) body.push(hookMarkdown, "");
  return body.join("\n");
}

module.exports = { renderInlineRules };
