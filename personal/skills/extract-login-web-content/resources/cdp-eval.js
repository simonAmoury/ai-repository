#!/usr/bin/env node
/**
 * cdp-eval.js — 通用 CDP 执行器（零依赖）
 *
 * 把任意 JS 文件注入「用户已手动登录」的 Edge/Chrome 页面上下文执行并回传结果。
 * 后续所有探测脚本复用本文件，不要每次重写。
 *
 * 用法：
 *   node cdp-eval.js <script.js> [选项]
 *   node cdp-eval.js --expr "location.href" [选项]
 *   node cdp-eval.js --fetch-var window.__html --out page.html [选项]
 *
 * 选项：
 *   --port <n>          调试端口，默认 9222
 *   --ws <url>          直接指定 webSocketDebuggerUrl，跳过自动发现
 *   --target <substr>   多标签页时按 url/title 子串筛选目标，默认取第一个 page
 *   --expr <js>         直接执行一段表达式，替代 <script.js>
 *   --fetch-var <expr>  分块回传一个大字符串变量（绕开 returnByValue 截断）
 *   --chunk <n>         --fetch-var 的分块大小，默认 180000 字符
 *   --out <file>        结果写入文件而非 stdout
 *   --timeout <ms>      单次调用超时，默认 30000
 *   --list-targets      只打印可用目标后退出
 *
 * 注入文件的约定：内容按原样在页面上下文求值，因此**最后一个表达式即返回值**。
 * 需要 await 就自己包一层 async IIFE（本执行器已开启 awaitPromise）：
 *   (async () => { const r = await fetch(location.href); return (await r.text()).length })()
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

// 全局 WebSocket 在 Node 22 起默认可用（Node 21 需 --experimental-websocket）。
// 这里显式检查，避免在旧版本上报一个难懂的 ReferenceError。
if (typeof globalThis.WebSocket !== 'function') {
  console.error(
    `[cdp-eval] 当前 Node ${process.version} 没有内置 WebSocket。\n` +
    `请升级到 Node 22+，或用 node --experimental-websocket 运行（Node 21）。\n` +
    `不要为此安装 ws / puppeteer —— 本方案刻意保持零依赖。`
  );
  process.exit(1);
}

function parseArgs(argv) {
  const opts = {
    port: 9222,
    chunk: 180000,
    timeout: 30000,
    scriptFile: null,
    ws: null,
    target: null,
    expr: null,
    fetchVar: null,
    out: null,
    listTargets: false,
  };
  const flagsWithValue = new Set([
    '--port', '--ws', '--target', '--expr', '--fetch-var', '--chunk', '--out', '--timeout',
  ]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list-targets') { opts.listTargets = true; continue; }
    if (a === '--help' || a === '-h') { opts.help = true; continue; }
    if (flagsWithValue.has(a)) {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${a} 缺少取值`);
      switch (a) {
        case '--port': opts.port = Number(v); break;
        case '--ws': opts.ws = v; break;
        case '--target': opts.target = v; break;
        case '--expr': opts.expr = v; break;
        case '--fetch-var': opts.fetchVar = v; break;
        case '--chunk': opts.chunk = Number(v); break;
        case '--out': opts.out = v; break;
        case '--timeout': opts.timeout = Number(v); break;
      }
      continue;
    }
    if (a.startsWith('--')) throw new Error(`未知选项 ${a}`);
    if (opts.scriptFile === null) opts.scriptFile = a;
    else throw new Error(`多余的位置参数 ${a}（一次只注入一个脚本文件）`);
  }
  if (!Number.isFinite(opts.port) || opts.port <= 0) throw new Error('--port 必须是正整数');
  if (!Number.isFinite(opts.chunk) || opts.chunk <= 0) throw new Error('--chunk 必须是正整数');
  if (!Number.isFinite(opts.timeout) || opts.timeout <= 0) throw new Error('--timeout 必须是正整数');
  return opts;
}

async function discoverTargets(port) {
  const url = `http://127.0.0.1:${port}/json`;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error(
      `连不上 ${url}（${err.message}）。\n` +
      `确认调试浏览器已启动：msedge --remote-debugging-port=${port} ` +
      `--user-data-dir=<独立 profile 目录> --remote-allow-origins=*`
    );
  }
  if (!res.ok) throw new Error(`${url} 返回 HTTP ${res.status}`);
  return res.json();
}

function pickTarget(targets, filter) {
  const pages = targets.filter((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  if (pages.length === 0) throw new Error('没有可用的 page 目标（浏览器里先打开目标页面）');
  if (!filter) return pages[0];
  const needle = filter.toLowerCase();
  const hit = pages.find(
    (t) => (t.url || '').toLowerCase().includes(needle) ||
           (t.title || '').toLowerCase().includes(needle)
  );
  if (!hit) {
    const listed = pages.map((t) => `  - ${t.title} :: ${t.url}`).join('\n');
    throw new Error(`没有 url/title 命中 "${filter}" 的页面。当前可用：\n${listed}`);
  }
  return hit;
}

/** 极简 CDP 客户端：只做 id 配对与超时，不做重连。 */
class CdpClient {
  constructor(wsUrl, timeout) {
    this.wsUrl = wsUrl;
    this.timeout = timeout;
    this.nextId = 1;
    this.pending = new Map();
    this.ws = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;
      const onFail = (e) => reject(new Error(`WebSocket 连接失败: ${e?.message || this.wsUrl}`));
      ws.addEventListener('open', () => {
        ws.removeEventListener('error', onFail);
        resolve();
      }, { once: true });
      ws.addEventListener('error', onFail, { once: true });
      ws.addEventListener('message', (ev) => this._onMessage(ev));
      ws.addEventListener('close', () => {
        for (const { reject: rj, timer } of this.pending.values()) {
          clearTimeout(timer);
          rj(new Error('WebSocket 在收到响应前关闭'));
        }
        this.pending.clear();
      });
    });
  }

  _onMessage(ev) {
    let msg;
    try { msg = JSON.parse(ev.data); } catch { return; }
    if (msg.id === undefined) return; // 事件，本执行器不消费
    const entry = this.pending.get(msg.id);
    if (!entry) return;
    clearTimeout(entry.timer);
    this.pending.delete(msg.id);
    if (msg.error) entry.reject(new Error(`CDP ${msg.error.code}: ${msg.error.message}`));
    else entry.resolve(msg.result);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} 超时（${this.timeout}ms）。大字符串请改用 --fetch-var 分块回传。`));
      }, this.timeout);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  /** 在页面上下文求值，返回真实值；页面抛错则本地抛错。 */
  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
      allowUnsafeEvalBlockedByCSP: true,
    });
    if (result.exceptionDetails) {
      const d = result.exceptionDetails;
      const desc = d.exception?.description || d.text || '页面内未知异常';
      throw new Error(`页面内异常: ${desc}`);
    }
    return result.result?.value;
  }

  close() {
    try { this.ws?.close(); } catch { /* 忽略 */ }
  }
}

/**
 * 分块回传大字符串。
 * CDP 单次 returnByValue 传超大字符串会截断或超时，所以先在页面侧量长度，
 * 再按 chunk 大小 slice，本地拼接。
 */
async function fetchVarChunked(client, varExpr, chunkSize) {
  const total = await client.evaluate(`(() => {
    const v = (${varExpr});
    return typeof v === 'string' ? v.length : -1;
  })()`);
  if (total === -1) throw new Error(`${varExpr} 不是字符串（先在页面里把内容存成字符串变量）`);
  process.stderr.write(`[cdp-eval] ${varExpr} 长度 ${total}，按 ${chunkSize} 分块回传\n`);
  const parts = [];
  for (let start = 0; start < total; start += chunkSize) {
    const end = Math.min(start + chunkSize, total);
    parts.push(await client.evaluate(`(${varExpr}).slice(${start}, ${end})`));
    process.stderr.write(`[cdp-eval]   ${end}/${total}\n`);
  }
  const joined = parts.join('');
  if (joined.length !== total) {
    throw new Error(`拼接后长度 ${joined.length} != 页面侧 ${total}，回传不完整`);
  }
  return joined;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    process.stdout.write(fs.readFileSync(__filename, 'utf8').split('*/')[0] + '*/\n');
    return;
  }

  if (opts.listTargets) {
    const targets = await discoverTargets(opts.port);
    for (const t of targets.filter((x) => x.type === 'page')) {
      process.stdout.write(`${t.title}\n  ${t.url}\n  ${t.webSocketDebuggerUrl}\n\n`);
    }
    return;
  }

  const modes = [opts.scriptFile, opts.expr, opts.fetchVar].filter(Boolean);
  if (modes.length === 0) {
    throw new Error('需要 <script.js> 或 --expr 或 --fetch-var 之一（-h 看用法）');
  }
  if (modes.length > 1) {
    throw new Error('<script.js> / --expr / --fetch-var 三者只能用一个');
  }

  let wsUrl = opts.ws;
  if (!wsUrl) {
    const target = pickTarget(await discoverTargets(opts.port), opts.target);
    wsUrl = target.webSocketDebuggerUrl;
    process.stderr.write(`[cdp-eval] 目标: ${target.title} :: ${target.url}\n`);
  }

  const client = new CdpClient(wsUrl, opts.timeout);
  await client.connect();
  try {
    let output;
    if (opts.fetchVar) {
      output = await fetchVarChunked(client, opts.fetchVar, opts.chunk);
    } else {
      const expression = opts.expr ?? fs.readFileSync(path.resolve(opts.scriptFile), 'utf8');
      const value = await client.evaluate(expression);
      output = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    }
    if (opts.out) {
      fs.writeFileSync(opts.out, output ?? '', 'utf8');
      process.stderr.write(`[cdp-eval] 已写入 ${opts.out}（${(output ?? '').length} 字符）\n`);
    } else {
      process.stdout.write((output ?? 'undefined') + '\n');
    }
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(`[cdp-eval] ${err.message}`);
  process.exit(1);
});
