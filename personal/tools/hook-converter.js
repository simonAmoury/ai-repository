#!/usr/bin/env node
/**
 * 通用 Rule → Claude Code CLAUDE.md 转换器
 *
 * 用法:
 *   node hook-converter.js <rules-dir> [output-file]
 *
 * 示例:
 *   node hook-converter.js ../rules/hooks ./CLAUDE.md
 *   node hook-converter.js ../rules/hooks              # 输出到 stdout
 *
 * 功能:
 *   - 读取指定目录下的所有 .rule.json 文件（通用格式）
 *   - 转换为 Claude Code 的 CLAUDE.md 规则格式
 *   - 输出到指定文件或 stdout
 */

const fs = require('fs');
const path = require('path');

const hooksDir = process.argv[2];
const outputFile = process.argv[3];

if (!hooksDir) {
  console.error('用法: node hook-converter.js <rules-dir> [output-file]');
  console.error('示例: node hook-converter.js ../rules/hooks ./CLAUDE.md');
  process.exit(1);
}

const resolvedDir = path.resolve(hooksDir);
if (!fs.existsSync(resolvedDir)) {
  console.error(`目录不存在: ${resolvedDir}`);
  process.exit(1);
}

// 读取所有 .rule.json 文件
const hookFiles = fs.readdirSync(resolvedDir)
  .filter(f => f.endsWith('.rule.json'))
  .map(f => path.join(resolvedDir, f));

if (hookFiles.length === 0) {
  console.error(`未找到 .rule.json 文件: ${resolvedDir}`);
  process.exit(1);
}

// 解析 hook 文件
function parseHook(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`解析失败: ${filePath} - ${e.message}`);
    return null;
  }
}

// 转换单个 hook 为 CLAUDE.md 规则
function convertHook(hook) {
  if (!hook || !hook.enabled) return null;

  const lines = [];
  const whenType = hook.when?.type || 'unknown';
  const toolTypes = hook.when?.toolTypes || [];
  const prompt = hook.then?.prompt || '';

  // 标题
  const toolDesc = toolTypes.map(t => `\`${t}\``).join(', ');
  lines.push(`### ${hook.name}`);
  lines.push('');

  if (whenType === 'preToolUse') {
    lines.push(`**触发时机:** 使用 ${toolDesc} 类型工具之前`);
    lines.push('');
    lines.push('**必须遵守以下规则:**');
  } else if (whenType === 'postToolUse') {
    lines.push(`**触发时机:** 使用 ${toolDesc} 类型工具之后`);
    lines.push('');
    lines.push('**必须执行以下操作:**');
  } else {
    lines.push(`**触发时机:** ${whenType} - ${toolDesc}`);
    lines.push('');
  }

  lines.push('');

  // 将 prompt 转为结构化规则
  const promptLines = prompt.split('\n').filter(l => l.trim());
  for (const line of promptLines) {
    const trimmed = line.trim();

    // Step/步骤 标记 → 加粗标题
    if (/^(Step \d|步骤\s*\d)/i.test(trimmed)) {
      lines.push(`**${trimmed}**`);
      continue;
    }

    // 编号规则 (1a. 2b. 等) → 缩进列表
    if (/^\d+[a-z]\./i.test(trimmed)) {
      lines.push(`  - ${trimmed}`);
      continue;
    }

    // 引用块或示例 → 代码块
    if (trimmed.startsWith('"') || trimmed.startsWith('{')) {
      lines.push(`  \`\`\``);
      lines.push(`  ${trimmed}`);
      lines.push(`  \`\`\``);
      continue;
    }

    // 普通行 → 列表项
    if (trimmed) {
      lines.push(`- ${trimmed}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

// 生成 CLAUDE.md 内容
function generateClaudeMd(hooks) {
  const sections = [];

  sections.push('# Hook 规则（自动生成）');
  sections.push('');
  sections.push('> 以下规则由 `hook-converter.js` 从 Kiro hook 文件自动转换生成');
  sections.push('> 请勿手动编辑，修改源 .hook 文件后重新运行转换器');
  sections.push('');

  const preHooks = hooks.filter(h => h.when?.type === 'preToolUse');
  const postHooks = hooks.filter(h => h.when?.type === 'postToolUse');
  const otherHooks = hooks.filter(h => h.when?.type !== 'preToolUse' && h.when?.type !== 'postToolUse');

  if (preHooks.length > 0) {
    sections.push('## 工具使用前规则');
    sections.push('');
    for (const hook of preHooks) {
      const converted = convertHook(hook);
      if (converted) sections.push(converted);
    }
  }

  if (postHooks.length > 0) {
    sections.push('## 工具使用后规则');
    sections.push('');
    for (const hook of postHooks) {
      const converted = convertHook(hook);
      if (converted) sections.push(converted);
    }
  }

  if (otherHooks.length > 0) {
    sections.push('## 其他规则');
    sections.push('');
    for (const hook of otherHooks) {
      const converted = convertHook(hook);
      if (converted) sections.push(converted);
    }
  }

  return sections.join('\n');
}

// 主流程
const hooks = hookFiles
  .map(parseHook)
  .filter(Boolean);

if (hooks.length === 0) {
  console.error('没有可用的 hook 配置');
  process.exit(1);
}

const output = generateClaudeMd(hooks);

if (outputFile) {
  const resolvedOutput = path.resolve(outputFile);
  const dir = path.dirname(resolvedOutput);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(resolvedOutput, output, 'utf-8');
  console.log(`已生成: ${resolvedOutput}`);
  console.log(`转换了 ${hooks.length} 个 hook 文件`);
} else {
  console.log(output);
}
