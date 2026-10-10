---
id: pac-platform/offline-approve-link-macro-whitelist
scope: project
project: pac-platform
feature: offline-approve-link-macro-whitelist
updated: 2026-08-06
tags: [pac-biz-trade, pac-foreign, 授权链接, 宏参校验, 系统字典, AF自动授权, TrmApprove]
code_anchors:
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/GetAttributionLinksStrategy.java
    symbol: execute / checkClickLink
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/helper/tracklink/TrackLinkMacroValidator.java
    symbol: loadMacroPattern / hasInvalidMacroValue / extractMacroValues
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveServiceImpl.java
    symbol: checkTrackingLink / batchCheckTrackingLink / doCheckTrackingLink / queryOfferBaseInfoMap / needOfferPackageCheck
  - table: pac_dict
  - apollo: 无（配置载体是系统字典 code=trm-approve-macro-value-regex，正则存 dict_key）
---

## 核心业务逻辑

线下 offer 批单授权链接放开渠道方宏参占位符，两项**相互独立**的改动：

1. **复核流程（AF 自动授权策略链）删除链接字符格式校验**：`GetAttributionLinksStrategy`（`@Order(9)`）抓取到点击链后不再做整链字符校验，`CODE_40025` 从此不再被抛出，AF 自动授权不再因宏参字符中断。方法体 `checkClickLink` 保留 + `@Deprecated`，类本身照常生效（`@Component`/`@Order(9)`/`getOperateEnum()=CODE_40052` 不变）。
2. **链接校验接口新增宏参值正则校验**：`POST /trm/apply/track-link/check`（单条）与 `/track-link/batch-check`（批量）只对链接 query 中每个参数**首个 `=` 右侧的原始文本**做整段正则匹配。参数名、域名、path 不校验。正则唯一来源是系统字典约定 code 下唯一数据行的 `dict_key`，代码不留兜底正则。

关键规则边界：
- 校验范围只到宏参值；不区分点击链/展示链、不区分线上/线下 offer；统一提示文案「链接中宏参格式有误，请注意！可到Appsflyer核验」，多值不合规只追加一次。
- 空宏参值（`key=`）判合规；纯空格宏参值属非空值，交正则判（初始正则放行半角空格）。
- 配置缺失/读取失败/Fallback 返 null/正则语法错误 → 一律 ERROR + 抛 `ServiceException`，**绝不降级放行**（决策 E/F/G）。
- `trackLink` 为 null/空/空白 → `success=false, msg=TrackLink不能为空`，不读字典。
- 最终正则（结构化 A 方案，已入测试库 `pac_dict.dict_key`）：
  ```
  [<>【】]*[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%{}|]*[<>【】]*
  ```
  语义：`< > 【 】` 只在宏参值首/尾段（不要求成对、允许单边不闭合）；`|` 任意位置；`$ [ ] ( ) { } _` 原字符集照旧；不含空格、不含全角 `（）`、不含反斜杠。`{<offer_id>}`、`{【offer_id】}`（符号在花括号里）明确拒绝。
  > 注：session-handoff / retrospective 早期给的字面量含空格与全角 `（）`（字符级白名单版），最终版按新图收紧为上面这条「结构化」正则。以库里实际 `dict_key` 为准，改前务必回读核对。

## 核心代码设计

- **唯一新增类** `helper/tracklink/TrackLinkMacroValidator`（`@Component`）：内含字典 code 常量 `MACRO_REGEX_DICT_CODE="trm-approve-macro-value-regex"`、文案常量 `INVALID_MACRO_MSG`、三个方法：`loadMacroPattern()`（循环外调，加载+编译正则，5 类异常均抛 `ServiceException`）、`hasInvalidMacroValue(link, pattern)`（循环内逐条判定）、`extractMacroValues(link)`（private，提取宏参值）。参照同模块 `helper/cpl/CplConfigValidator`。
- **不新增** DTO/VO/常量类，不往 `DictEnum`（pac-biz-system-api，只收系统级字典）加项，不改 `handlerTrackLink`、`TrmCheckTrackLinkVO`、Controller、Service 接口签名。
- **`TrmApproveServiceImpl` 改造**：注入 `TrackLinkMacroValidator`；新增 3 个 private 方法——`doCheckTrackingLink`（纯校验，正则与 Offer 信息由调用方预取传入，方法内无 SQL/Feign）、`needOfferPackageCheck`（域名前缀判定，单条/批量共用）、`queryOfferBaseInfoMap`（循环外批量取 Offer，用 `queryDataIfSuccess()`）。`checkTrackingLink`/`batchCheckTrackingLink` 改为「循环外取正则+Offer，循环内纯计算」，消除 N+1。
- **既有五项校验（HTTP前缀/af_prt/包名/pid）顺序与文案完全不变**，宏参提示追加在最后（Property 9 锁死等价性）。
- 正则**不做进程内缓存**：`DictCache.getList` 已走 Redis 缓存；进程内缓存 `Pattern` 会导致清 `DICT_CACHE` 后仍命中旧值必须重启，违反需求。
- 提取器语义 = 「首个 `=` 右侧完整原始文本」，与 `handlerTrackLink` 的无 limit `split("=")` 取 `[1]` 在 `a=b=c` 上必然分叉，故**另写不复用**。

## 踩过的坑 / 反复纠错点

- **正则存 `dict_key` 不是 `dict_value`**：跟随库内约定（列注释「dict_key 字典值 / dict_value 字典名称」，参照 `offer_auto_pause_filter`、`aff_bdc_config_dept_ids`）。`dict_value` 只存人类可读名称，代码不读。
- **`DictCache.getList(code)` 的 SQL 无 `ORDER BY` 且 `code` 不唯一**（唯一约束在 `code+dict_key`，库中 `hour-cap`/`daily-data-import` 已有同 code 多行）。代码取 `get(0)`、不校验多行，唯一性完全靠上线 SOP 人工核对行数=1；误插第二行 → 生效正则不确定且无报错。父项 `parent_id=0` 不进 `getList` 结果。
- **`hasInvalidMacroValue` 过滤空值必须用 `StrUtil.isNotEmpty`，不能用 `isNotBlank`**：否则纯空格宏参值被当空串短路，绕过正则。
- **字典读取异常与 `PatternSyntaxException` 必须分开 `catch`**：合并后正则语法错误会被记成「字典读取失败」，排查方向错位。异常对象作为 `log.error` 最后一个参数保留堆栈。
- **`queryOfferBaseInfoMap` 不补 `null`→`emptyMap` 降级**：需求明确禁止降级；同模块 `CplConfigValidator` 有该兜底但不照搬。`R` 成功但 data 为 null 时后续 `.get()` 抛 NPE，与改造前一致。
- **上线顺序**：先配字典 + 清 `DICT_CACHE`，再发 `pac-biz-trade`；颠倒会使校验接口直接抛异常而非放行。前端字典页 submit/remove/batch-update 会自动清 `DICT_CACHE`，直接改库才需手工清。
- **测试全绿≠功能可用**：开发期 35 用例全 mock 掉 `DictCache`，没验证真实读取链路；靠 MCP 逐字符核对入库值 + 打真实接口才验证到位（见全局 L-001）。最终交付**不含测试代码**。
- `sql-guard.json` 只放开 SELECT/INSERT/CREATE，UPDATE 被 MCP 拦，改库配置走前端或 INSERT。
- `:pac-biz-trade:test` 全量任务含 11 个依赖真实 AF/Redis/Cassandra/Selenium 的既有集成测试，本地必失败，不能当验收门槛；`mockito-inline` 未在该模块声明。

## 交叉验证提示

改动前重点核对：
1. **库里 `pac_dict` code=`trm-approve-macro-value-regex` 的 `dict_key` 实际正则值**——本记忆正文给了两版（早期字符白名单 / 最终结构化），务必以库里当前值为准，逐字符回读，别信记忆。线上库配了没、清缓存了没也要现场确认。
2. `TrackLinkMacroValidator` 与 `TrmApproveServiceImpl` 的三个 private 方法是否还在、签名是否漂移；`checkTrackingLink`/`batchCheckTrackingLink` 是否被后续改动重新引入循环内 Feign/SQL。
3. `GetAttributionLinksStrategy.execute` 是否仍未调用 `checkClickLink`；`CODE_40025` 是否被别处重新引用。
4. `handlerTrackLink`、`TrmCheckTrackLinkVO` 是否被后续需求改动（本次刻意未动）。
5. 状态：截至 2026-08-06 代码在分支 `feature/offline_approve_link_macro_whitelist`，**未提交、未推送**；线上字典未配、线上未复验。同目录 `retrospective.md` / `online-sop.md` 为完整权威细节。
