---
name: extract-login-web-content
description: 把需登录才能访问的网页内容提取成本地结构化文件时使用。适用于飞书/Notion/语雀/Confluence 等在线文档、后台管理系统页面、SPA 富文本编辑器，以及需要抓取页面接口响应或 WebSocket 帧的场景。当用户要求「把这个文档导出成 md」「读一下这个需要登录的链接」「抓一下这个页面的接口数据」，或目标正文不是 DOM 里现成文本（富文本编辑器、虚拟滚动、块结构表格）时，加载本 skill，套用基于 Chrome DevTools Protocol 的标准流程。
allowed-tools: "Bash(node:*), PowerShell(msedge:*), Read, Write, Glob, Grep, AskUserQuestion"
version: "1.3.0"
---

# 提取需登录页面 / 富文本编辑器正文

用 CDP 驱动一个「用户已手动登录」的 Edge 浏览器实例来取数，不做任何鉴权模拟。Windows 系统使用 Edge 而非 Chrome，避免关闭时影响用户日常使用的 Chrome 浏览器。

## 何时使用

- 目标页面需要登录，且无现成 OpenAPI 可用。
- 目标正文**不是 DOM 里现成的文本**：富文本编辑器（飞书/Notion/语雀）、虚拟滚动长列表、块结构文档。此时直接爬 DOM 一定漏内容，且拿不到表格结构与层级关系。
- 需要抓页面自身发出的接口响应或 WebSocket 帧。

已有稳定开放接口时不要用本方案，直接调接口。

## 三条核心原则

1. **不处理登录，复用已登录会话。** 不模拟登录、不破解鉴权、不搬运 cookie。启动一个独立 profile 的调试浏览器，让用户在里面手动登录一次，后续全部在该上下文内执行。
2. **取数优先级：SSR 内嵌数据 > 接口响应 / WS 帧 > DOM 收割。但每一档都要先验证覆盖度再往下做。** 优先级只说明「先试哪个」，不代表试到就够用 —— SSR 常常只内嵌首屏块，解析出来看着像成功、实际缺一大半（见「探测数据落点」的覆盖度判据）。
3. **先小步探测，再写正式提取器。** 先确认数据落在哪、什么形态、覆盖多少，再动手解析。一次性写大提取器必然返工。

## 标准流程

- [ ] 1. 启动独立 profile 的调试浏览器，**等用户确认登录完成** ⚠️ 阻塞
- [ ] 2. 取 CDP 地址（`--list-targets`）
- [ ] 3. 页面自检：可见性 + 滚动容器
- [ ] 4. 探测数据落点，并判断覆盖度
- [ ] 5. 按路线取数并落盘
- [ ] 6. 解析重建成目标格式
- [ ] 7. 校验完整性
- [ ] 8. 交付前提醒用户调试 profile 等同凭据

### 1. 启动调试浏览器

Windows 系统使用 Edge 浏览器（`msedge.exe`），避免与用户日常使用的 Chrome 冲突。

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:TEMP\edge-debug-profile" `
  --remote-allow-origins=* `
  --window-position=0,0 `
  --window-size=1440,1000 `
  --disable-features=CalculateNativeWinOcclusion `
  --disable-backgrounding-occluded-windows `
  --disable-renderer-backgrounding
```

三组参数缺一不可，少任何一组都会在后面表现成「看起来像别的问题」的故障：

| 参数 | 作用 | 缺了会怎样 |
| --- | --- | --- |
| `--user-data-dir=<独立目录>` + `--remote-debugging-port=<port>` | 独立 profile 的调试实例，不污染日常浏览器 | — |
| `--remote-allow-origins=*` | 放行非浏览器发起的 CDP WebSocket 握手 | 连接被拒，报 `Received network error or non-101 status code`，很容易误判成登录态或端口问题 |
| `--window-position=0,0 --window-size=1440,1000 --disable-features=CalculateNativeWinOcclusion --disable-backgrounding-occluded-windows --disable-renderer-backgrounding` | 保证窗口真实可见、渲染不被节流 | `visibilityState` 为 `hidden`，**虚拟滚动一个块都不渲染**，DOM 里只有零星几个块，滚多少轮都零新增 |

启动后让用户在该窗口手动登录目标站点，等用户确认登录完成再继续。

### 2. 取 CDP 地址

`node <本 skill>/resources/cdp-eval.js --list-targets --port 9222`，确认目标页在列表里（标题正确、URL 正确）。多标签页时后续都用 `--target <标题子串>` 定位，不要手抄 ws 地址。

### 3. 页面自检

两条一行命令，先排掉最贵的两个坑：

```bash
node cdp-eval.js --expr "({vis:document.visibilityState, text:document.body.innerText.length})"
node cdp-eval.js --expr "[...document.querySelectorAll('div')].filter(e=>e.scrollHeight>e.clientHeight+200&&e.clientHeight>300).map(e=>({cls:String(e.className).slice(0,60),sh:e.scrollHeight,ch:e.clientHeight}))"
```

- `vis` 必须是 `visible`。是 `hidden` 就回到第 1 步补参数，不要往下做。
- 第二条列出真正的滚动容器。**文档正文一般不滚 `document`，而是滚某个内层容器**（飞书 docx 是 `.bear-web-x-container`）。记下这个选择器，后面 DOM 路线要用。

### 4. 探测数据落点，并判断覆盖度

依次检查：SSR HTML 内嵌变量（正则搜 `window.XXX =` 拿全局变量名，再搜正文特征词确认命中）、`localStorage`、前端 store、service worker、network 请求列表。

**命中不等于够用，必须量一下覆盖度**，两个判据：

- 拿正文里靠后位置的特征词（末章标题、最后一张表的字段名）去搜，搜不到就是只有首屏。
- 解析出的块类型分布对不上文档形态就是缺数据 —— 例如一篇有几十张参数表的 API 文档只解析出 8 个 `table`、章节标题却齐全，说明 SSR 只带了目录级块加首屏正文，正文块要另找路线。

判断结果决定走哪条路线：SSR 全量 → 第 5 步 SSR 路线；SSR 只有首屏且网络里也找不到块数据 → 走 DOM 路线。

### 5. 取数

**SSR 路线（优先）**：在页面上下文执行 `fetch(location.href, { credentials: 'include' })` 拿带登录态的完整 HTML，先存到 `window.__html`，再分块回传落盘：

```bash
node cdp-eval.js --expr "fetch(location.href,{credentials:'include'}).then(r=>r.text()).then(t=>{window.__html=t;return t.length})"
node cdp-eval.js --fetch-var window.__html --out .cdp/page.html
```

**网络 / WS 路线**：`Network.enable` + `Page.reload`，监听 `Network.responseReceived` 后对目标 URL 调 `Network.getResponseBody` 落盘，同时监听 `Network.webSocketFrameSent` / `webSocketFrameReceived` 抓帧。注意 `cdp-eval.js` 只做 `Runtime.evaluate`、不消费事件，这条路线要另写一个带事件监听的小脚本。

**DOM 路线**：`resources/harvest-dom.js` 已实现「定位滚动容器 → 逐屏滚动 → 收集叶子块 → 重建 Markdown」，跑在页面上下文里，因此直接用 `cdp-eval.js` 注入即可。分三步调用，避开单次 evaluate 超时：

```bash
node cdp-eval.js harvest-dom.js --target 文档标题        # 启动，立即返回 {started:true, scroller, scrollHeight}
node cdp-eval.js --expr "window.__harvest.status"        # 轮询到 done:true（大文档约 1~2 分钟）
node cdp-eval.js --fetch-var window.__harvest.md --out .cdp/dom.md
```

站点适配只改脚本顶部 `CFG`：`typeFromClass`（从块 class 取块类型的正则）、`containerHint`（自检拿到的滚动容器选择器，自动探测不准时填）、`unitTypes`（整体渲染的块类型）。`status.warn` 出现「连续 N 轮无新块」时看下面的坑 3。

### 6. 解析重建

SSR / 接口路线拿到块结构数据后：建 id 到块的字典，从文档根节点按 `children` 递归遍历，按块类型分派渲染（heading / text / bullet / ordered / quote / code / table）。表格按「列 id × 行 id」查单元格映射拼网格。DOM 路线的重建已在 `harvest-dom.js` 内完成，产出即 Markdown。

### 7. 校验完整性

- **多路交叉比对**：DOM 侧与 SSR 侧各出一份，比块数与字符数。差一个量级说明其中一条只拿到局部。
- **统计未访问节点**：递归重建后统计没被访问到的块并抽样打印。注意表格单元格块「未被访问」是正常的（由父表格整体渲染），要按类型区分，别被这类噪声掩盖真正的漏块。
- **抽查尾部**：直接看产物末尾几十行。缺数据最常见的表现是正文在某章之后突然只剩标题、或末尾堆一段没有结构的散装文本。

## 必踩的坑

1. **窗口不可见 → 虚拟列表完全不渲染。** 会话非交互、窗口被开到屏幕外或被遮挡时，`visibilityState=hidden`，渲染被节流，DOM 里只有零星几个块，滚动多少轮都是 0 新增。这是最贵的坑，因为现象长得像「选择器写错了」。解法见第 1 步的反遮挡参数；每次开工先跑第 3 步自检。
2. **CDP 握手被拒。** Node 内置 `WebSocket` 连 DevTools 会因为 Origin 检查被拒，报非 101。启动加 `--remote-allow-origins=*`。
3. **滚动容器通常不是 `document`。** 对 `document` 发滚动，会在四五步内就报「已到底」而正文一点没加载。**先定位真实滚动容器**（第 3 步），在该容器上改 `scrollTop` 通常就有效；只有当容器正确、窗口可见、却仍连续多轮无新块时，才说明前端忽略了合成滚动，此时改用 `Input.dispatchMouseEvent` 发真实 `mouseWheel`（坐标要落在容器内），每步留 500ms。顺序是「先容器、再 scrollTop、最后 wheel」，不要一上来就上 wheel。
4. **大字符串回传会截断或超时。** 先在页面里存到 `window` 变量，再用 `--fetch-var window.__xxx --out <file>` 分块取（已内置分块与总长校验），不要手写 slice 循环。
5. **转义层级必须探测，不要无条件反转义。** 内嵌数据有时是「JS 字符串里的 JSON」（需要把 `\"` 还原成 `"`），有时本身就是单层转义的合法 JSON（不能动）。**判断方法**：把疑似片段打出来看，`JSON.stringify` 后显示为 `\\"` 的才需要反转义，显示为 `\"` 的已经是最终形态。无条件反转义会打平 code 块内部的转义引号，导致这些块 `JSON.parse` 全部失败 —— 而且同一站点的不同文档可能落在不同档，每份文档都要单独探测。
6. **截取 JSON 对象用括号平衡扫描**，不要用正则匹配整个对象（无法处理任意深度嵌套）。扫描时必须跳过字符串内部的引号与 `\` 转义。
7. **同一节点多版本**：按 id 去重，保留 `version` 更大的那份。
8. **DOM 收割要排掉容器块和单元块内部的子块。** 块结构编辑器里，页面根块、表格、callout 都是「包含子块的块」。逐块收集时若不排除，表格单元格里的文本会既进表格又进正文，产物末尾会多出一大段散装重复内容（实测重复量可达总块数的 3/4）。`harvest-dom.js` 已用「含有其它可识别块的元素视为容器」+「单元块内子块跳过」两条规则处理，换站点时确认 `unitTypes` 覆盖了该站点的整体渲染块类型。
9. **产物全部落盘、命名体现阶段。** 探测脚本、原始响应体、中间 JSON 都写到工作目录（如 `.cdp/`），便于复查和二次解析。探测脚本用 `probe` / `check` 前缀，提取器用版本后缀迭代。这类任务正常节奏就是反复试错逼近，不要指望一次成型。

## 安全边界

- 仅用于用户**本人有合法访问权限**的内容，本质是把用户自己能看到的页面导出成本地文件。不用于绕过鉴权、越权访问或抓取他人数据。
- 抓包产物极可能包含 cookie、token、用户信息。不要把这些内容回显到对话里；建议把调试 profile 目录与抓包目录加入 `.gitignore` 或 `.git/info/exclude`；不要外传到第三方服务。
- 交付前提醒用户：调试 profile 内含真实登录态，等同于凭据（一个用过的 profile 常有 1~2GB、数千文件，很容易被误提交）。
