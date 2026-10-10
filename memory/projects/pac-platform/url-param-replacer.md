---
id: pac-platform/url-param-replacer
scope: project
project: pac-platform
feature: url-param-replacer
updated: 2026-08-19
tags:
  - url
  - provider
  - deeplink
  - onelink
  - sharing-link
  - event-id
code_anchors:
  - path: tts_link_handle.html
    symbol: LINK_CONFIGS
  - path: tts_link_handle.html
    symbol: transformUrl
  - path: tts_link_handle.html
    symbol: ensureOneLinkEventIds
  - path: tts_link_handle.html
    symbol: ensureDeepLinkEventIds
  - path: tts_link_handle.html
    symbol: ensureSharingLinkEventIds
  - path: tts_link_handle.html
    symbol: fetchGeneralLinks
  - path: tts_link_handle.html
    symbol: PROVIDER_DIMENSIONS
---

## 核心业务逻辑

浏览器本地工具可调用测试环境的 `/api/pac-adv/tts/debug/generalLink` 获取 OneLink、DeepLink 和原始 SharingLink，再把选中商品的三类链接回填至对应面板。原始链接获取区只让用户填写商品 ID、选择 LinkType（TTS/TOKO）、选择 provider 和填写 Auth；provider 对应的四元组由页面内置快照回填。随后将 OneLink、DeepLink、SharingLink 中所有既有 `event_id` 值替换为字面量 `{transaction_id}`。特定嵌套位置缺失时按链接类型补充：OneLink 与 DeepLink 在 `chain_key` 和嵌套 `params_url` 中补充；SharingLink 在 `chain_key` JSON 尾部和根查询参数尾部补充。

## 核心代码设计

`tts_link_handle.html` 的 `PROVIDER_DIMENSIONS` 记录 2026-08-19 从 `adplatform_test02.tts_creator_auth` 查询的非敏感 provider→四元组快照；`selectGeneralProvider` 只提示当前回填数据，`fetchGeneralLinks` 从该映射取四元组并按既有接口契约发送 JSON 请求体。响应实际路径为 `data.data.sharingLinks`，每一项包含 `oneLink`、`deepLink`、`sharingLink`，且原始 SharingLink 位于 `additionalProperties.originalSharingLink`。Auth 用 `type=password` 输入、仅在请求作用域使用；请求完成后仍保留当前页面的输入值，方便连续查询，但不写入 URL、浏览器存储或工具结果。`LINK_CONFIGS` 为三种链接类型声明独立的编码层级、解码深度和缺失字段补充函数。共享 `transformUrl` 和 `replaceExistingEventIds` 只处理已有字段；每个 `ensure*EventIds` 仅处理该类型的固定嵌套位置。展示层按解码级别把原始与结果并排显示，并安全转义用户输入后高亮 `event_id` 与 `{transaction_id}`。

## 踩过的坑与反复纠错点

- 不能用 `[^&]+` 截取嵌套参数值：`%26` 是编码后的分隔符，会导致后续内容被整段删除。必须按当前编码层级把编码后的 `&` 作为边界。
- 替换普通 URL 参数必须检查参数边界，不能仅搜索 `event_id=`，否则会误改 `note=prefixevent_id=...` 一类普通值。
- 根查询参数追加前要从 `#fragment` 分离；无查询串用 `?`，有查询串用 `&`，否则会形成无效 URL 或把参数写进 fragment。
- `chain_key={}` 是有效空 JSON，补充时不能只增加统计而未修改内容。
- 页面通过 `innerHTML` 渲染解码对比时，必须先 HTML 转义 URL 文本，防止粘贴内容被当作标签执行。
- 页面可能经 HTTPS 打开，接口绝对地址必须使用 HTTPS；若用 HTTP，浏览器会把 HTTPS → HTTP 的 `fetch` 作为 mixed content 拦截，并只暴露 `Failed to fetch`。已验证测试接口的 HTTPS 端点和 CORS 预检可用。
- 当前项目不新增 provider 查询接口；授权表变更后，需重新查询 `adplatform_test02.tts_creator_auth` 的 provider、partner、country、app_id、creator 五列，并同步更新 `PROVIDER_DIMENSIONS` 与下拉选项，不能读取或写入 token、appKey、appSecret。

## 交叉验证提示

下次修改前读取 `tts_link_handle.html` 中 `LINK_CONFIGS`、三个 `ensure*EventIds` 和 `replaceExistingEventIds`。编码层级或缺失字段位置变更时，至少手工核对用户完整样例、缺失字段、错误/空值、fragment、空 `chain_key` 和幂等处理。
