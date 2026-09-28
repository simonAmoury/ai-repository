/**
 * harvest-dom.js — DOM 路线：滚动渲染 + 逐块收集 + 重建 Markdown
 *
 * SSR / 接口路线拿不全时用这条（典型：SSR 只内嵌首屏块，正文靠虚拟列表按需渲染）。
 * 整个滚动循环跑在页面上下文里，不需要 Input 域，因此可直接用 cdp-eval.js 注入。
 *
 * 用法（三步，避开单次 evaluate 超时）：
 *   node cdp-eval.js harvest-dom.js --target 文档标题          # 启动，立即返回
 *   node cdp-eval.js --expr "window.__harvest.status"          # 轮询，done=true 为止
 *   node cdp-eval.js --fetch-var window.__harvest.md --out doc.md
 *
 * 前置条件：窗口必须真实可见（visibilityState=visible），否则虚拟列表不渲染，
 * 本脚本会立刻返回错误而不是空转。
 *
 * 站点适配只改 CFG：typeFromClass 是从块元素 class 里取「块类型」的正则。
 */
(() => {
  const CFG = {
    blockSelector: '[data-block-id]',
    typeFromClass: /docx-([a-z0-9]+)-block/, // 飞书 docx；语雀/Notion 按实际 class 改
    unitTypes: ['table', 'callout', 'code'],  // 整体渲染，其内部子块不单独收集
    unitClassPrefix: 'docx-',                 // 配合 unitTypes 拼祖先选择器
    containerHint: null,                      // 指定滚动容器选择器；null = 自动探测
    step: 300, waitMs: 350, maxRounds: 500, idleRounds: 12,
  };

  if (document.visibilityState !== 'visible') {
    return { error: '页面 visibilityState=' + document.visibilityState + '，虚拟列表会被节流不渲染。用反遮挡参数重启浏览器（见 SKILL.md）。' };
  }

  const FENCE = String.fromCharCode(96, 96, 96);
  const clean = (s) => (s || '').replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u2064\ufeff]/g, '').replace(/\u00a0/g, ' ');
  const inline = (el) => clean(el.innerText || '').replace(/\s+/g, ' ').trim();
  const typeOf = (el) => (String(el.className).match(CFG.typeFromClass) || [])[1] || null;

  function findScroller() {
    if (CFG.containerHint) return document.querySelector(CFG.containerHint);
    let best = null, bestGap = 0;
    for (const el of document.querySelectorAll('div,main,section')) {
      const gap = el.scrollHeight - el.clientHeight;
      if (gap > bestGap && el.clientHeight > 200) { best = el; bestGap = gap; }
    }
    return best || document.scrollingElement || document.documentElement;
  }

  function renderTable(el) {
    const lines = [];
    [...el.querySelectorAll('tr')].forEach((tr, ri) => {
      const cells = [...tr.children].map((td) => inline(td).replace(/\|/g, '\\|'));
      lines.push('| ' + cells.join(' | ') + ' |');
      if (ri === 0) lines.push('| ' + cells.map(() => '---').join(' | ') + ' |');
    });
    return '\n' + lines.join('\n') + '\n';
  }

  function renderBlock(el, type) {
    if (/^heading[1-9]$/.test(type)) return '\n' + '#'.repeat(Math.min(6, +type.slice(-1))) + ' ' + inline(el);
    if (type === 'table') return renderTable(el);
    if (type === 'code') {
      const nums = [...el.querySelectorAll('[data-line-num]')].map((l) => clean(l.innerText || '').replace(/\n$/, ''));
      const body = (nums.length ? nums.join('\n') : clean(el.innerText || '')).replace(/\s+$/, '');
      return '\n' + FENCE + '\n' + body + '\n' + FENCE + '\n';
    }
    if (type === 'bullet') return '- ' + inline(el);
    if (type === 'ordered') return inline(el).replace(/^(\d+)\.?\s*/, '$1. ');
    if (type === 'callout' || type === 'quote') return '> ' + inline(el);
    if (type === 'text') return inline(el);
    return '[?' + type + '] ' + inline(el);
  }

  // 插入序即文档序：自上而下滚动，且单轮内 querySelectorAll 本身按文档序返回
  const collected = new Map();
  function collect() {
    let added = 0;
    for (const el of document.querySelectorAll(CFG.blockSelector)) {
      const type = typeOf(el);
      if (!type || type === 'page') continue;
      if (el.getBoundingClientRect().height < 1) continue;
      const isUnit = CFG.unitTypes.includes(type);
      // 整体渲染单元内部的子块由父块一并输出，单独收集会产生大量重复
      if (!isUnit && CFG.unitTypes.some((u) => el.closest('.' + CFG.unitClassPrefix + u + '-block'))) continue;
      // 只留叶子与单元块：含有其它可识别块的元素是容器（页面根块也在此被排除）
      if (!isUnit && [...el.querySelectorAll(CFG.blockSelector)].some((c) => typeOf(c))) continue;
      const id = el.getAttribute('data-block-id');
      const md = renderBlock(el, type);
      if (!md.trim()) continue;
      if (!collected.has(id)) { collected.set(id, md); added++; }
      else if (collected.get(id).length < md.length) collected.set(id, md); // 保留更完整的一版
    }
    return added;
  }

  const sc = findScroller();
  const st = window.__harvest = {
    status: { done: false, round: 0, y: 0, h: sc.scrollHeight, blocks: 0, scroller: String(sc.className).slice(0, 60) },
    md: '',
  };

  (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    sc.scrollTop = 0;
    await sleep(1500);
    let idle = 0;
    for (let i = 0; i < CFG.maxRounds; i++) {
      const added = collect();
      idle = added > 0 ? 0 : idle + 1;
      sc.scrollTop += CFG.step;
      await sleep(CFG.waitMs);
      Object.assign(st.status, { round: i, y: Math.round(sc.scrollTop), h: sc.scrollHeight, blocks: collected.size, added });
      if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 5) break;
      // 滚动位置在动却长时间没有新块：容器判断错了，或合成滚动被前端忽略 → 见 SKILL.md 的 wheel 兜底
      if (idle >= CFG.idleRounds) { st.status.warn = '连续 ' + idle + ' 轮无新块，检查滚动容器是否正确'; break; }
    }
    await sleep(1500);
    collect();
    st.md = [...collected.values()].join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
    Object.assign(st.status, { done: true, blocks: collected.size, chars: st.md.length });
  })();

  return { started: true, scroller: st.status.scroller, scrollHeight: st.status.h };
})()
