"use strict";

function convertHook(hook) {
  const lines = [];
  const whenType = hook.when?.type || "unknown";
  const toolTypes = hook.when?.toolTypes || [];
  const prompt = hook.then?.prompt || "";
  const toolDesc = toolTypes.map((type) => `\`${type}\``).join(", ");

  lines.push(`### ${hook.name}`, "");
  if (whenType === "preToolUse") {
    lines.push(`**触发时机:** 使用 ${toolDesc} 类型工具之前`, "", "**必须遵守以下规则:**");
  } else if (whenType === "postToolUse") {
    lines.push(`**触发时机:** 使用 ${toolDesc} 类型工具之后`, "", "**必须执行以下操作:**");
  } else {
    lines.push(`**触发时机:** ${whenType} - ${toolDesc}`);
  }

  lines.push("");
  for (const raw of prompt.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (/^(Step \d|步骤\s*\d)/i.test(line)) lines.push(`**${line}**`);
    else if (/^\d+[a-z]\./i.test(line)) lines.push(`  - ${line}`);
    else if (line.startsWith("\"") || line.startsWith("{")) lines.push("  ```", `  ${line}`, "  ```");
    else lines.push(`- ${line}`);
  }
  lines.push("");
  return lines.join("\n");
}

function generateHookMarkdown(entries, generatorName = "scripts/ai-config.js") {
  const hooks = entries.map((entry) => entry.value).filter((hook) => hook?.enabled);
  if (!hooks.length) return null;

  const output = [
    "# Hook 规则（自动生成）",
    "",
    `> 由 \`${generatorName}\` 从 \`.rule.json\` 自动转换，请勿手动编辑。`,
    "",
  ];
  const groups = [
    ["preToolUse", "## 工具使用前规则"],
    ["postToolUse", "## 工具使用后规则"],
  ];

  for (const [type, title] of groups) {
    const selected = hooks.filter((hook) => hook.when?.type === type);
    if (!selected.length) continue;
    output.push(title, "");
    for (const hook of selected) output.push(convertHook(hook));
  }

  const others = hooks.filter((hook) => !groups.some(([type]) => hook.when?.type === type));
  if (others.length) {
    output.push("## 其他规则", "");
    for (const hook of others) output.push(convertHook(hook));
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

module.exports = { generateHookMarkdown };
