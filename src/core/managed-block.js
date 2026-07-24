"use strict";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function updateManagedBlock(content, start, end, body, position = "append") {
  const hasStart = content.includes(start);
  const hasEnd = content.includes(end);
  if (hasStart !== hasEnd) {
    throw new Error(`托管区标记不完整: ${start} / ${end}`);
  }

  const wrapped = `${start}\n${body.trim()}\n${end}`;
  if (hasStart) {
    const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, "g");
    return content.replace(pattern, wrapped);
  }

  const current = content.trim();
  if (!current) return `${wrapped}\n`;
  if (position === "prepend") return `${wrapped}\n\n${current}\n`;
  return `${current}\n\n${wrapped}\n`;
}

module.exports = { updateManagedBlock };
