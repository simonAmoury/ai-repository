---
id: pac-platform/coupang-order-reports-v2
scope: project
project: pac-platform
feature: coupang-order-reports-v2
updated: 2026-08-11
tags: [pac-biz-adv, Coupang, CPS订单, XXL-JOB, 多地区, coupang_account_config, cps_order_commission, HuTool-HTTP, 新旧等价性]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/CoupangOrderReportJobHandler.java
    symbol: coupangOrderReportV2Task / processOneRegion / handleOnePage / fillDateRange / withXxlJobContext
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/common/client/CoupangApiClient.java
    symbol: orderApi / buildOrderUrl / requestOrderPage / generateSignature
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/parser/ICoupangOrderParser.java
    symbol: country / parse
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/parser/CoupangKrOrderParser.java
    symbol: doParse / fillOfflineFields / defaultIfEmpty
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/parser/CoupangTwOrderParser.java
    symbol: parse（占位，返回 null）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/CpsOrderCommissionServiceImpl.java
    symbol: batchUpsert / listByAdvId
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/common/constant/CoupangConst.java
    symbol: ORDER_REPORTS_PATH / PAGE_SIZE / MAX_PAGE_COUNT / CLICK_ID_SUBPARAM_LENGTH / OFFLINE_SUBPARAM_PREFIX
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/config/CoupangOrderThreadPoolConfig.java
    symbol: coupangOrderExecutor（Bean 名 coupangOrderExecutor，core/max=2）
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/entity/CoupangAccountConfig.java
    symbol: provider / country / advId / apiDomain / accessKey / secretKey / currency / status
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/CoupangJobHandler.java
    symbol: coupangOrderReportsTask / buildCpsOrderCommission / saveOrUpdateOrders（V1 旧实现，对齐基准）
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/FutureUtil.java
    symbol: awaitAll
  - table: coupang_account_config / cps_order_commission
  - apollo: 无（账号与密钥全部来自 coupang_account_config 表）
---

## 核心业务逻辑

Coupang 订单拉回 V2：把旧的「单账号 KR 硬编码 + Apollo 默认密钥」任务，重构为「配置表驱动、多地区并发、按地区分派解析器」的新任务，且**与旧任务完全独立并存**，落到同一张 `cps_order_commission`。

- 新任务 XXL-JOB：`coupangOrderReportV2Task`；旧任务：`coupangOrderReportsTask`（保持不动）。
- 新 API 路径带 `/v1/`：`/v2/providers/affiliate_open_api/apis/openapi/v1/reports/orders`；旧路径不带 `/v1/`。两者在 2026-08-10 KR 单日返回的原始订单集合逐字符一致。
- 账号来源：`coupang_account_config`（provider/country/advId/apiDomain/accessKey/secretKey/currency/status）。**跑哪些地区靠表里 `status=1` 决定**，jobParam 的 `regions` 只是按地区传参、不是过滤器（Map 中缺省的地区仍会用默认参数执行）。
- jobParam 形态：`{"provider":"Coupang","regions":{"KR":{"startDate":"20260810","endDate":"20260810"}}}`；地区级字段 `startDate/endDate/recentDays/subId`。
- 日期范围规则：`startDate`、`endDate` 缺任一个就整体按 `recentDays`（默认 3）取「今天-N ~ 今天」，**不做单边补齐**（单边补齐会导致区间倒挂或超出 Coupang 30 天限制）。
- 落库粒度：**按页回调、按页 upsert**（单页一个事务），与旧实现的边拉边存一致；地区之间用专用线程池并发。
- 去重键 `open_commission_id = orderId_productId_tag`；`tag` 分支判定顺序固定为 offline → click_id（subParam 长度 45）→ fixed（`subId_subParam`）。
- 字段处理**以 V1 旧实现为准**：`productId/orderId` 缺失归一空串；`subId/subParam` 空值用 `unknown`；三个金额列存接口返回原文字符串（`order_amount`/`commission_rate`/`open_commission_amount` 为 String，`inner_commission_amount` 为 BigDecimal）；`open_status="-"`、`inner_status="pending_confirm"`；`order_time` 取 `date` 当天 00:00:00。

## 核心代码设计

- **`CoupangApiClient.orderApi(config, param, Consumer<List<String>> pageConsumer)`**：按页回调而非全量返回，避免跨页重复键落入同一批撞唯一索引、且内存只与单页相关。分页正常退出靠「单页 < PAGE_SIZE(1000)」，`MAX_PAGE_COUNT=500` 仅兜底防接口忽略 page 时死循环。
- **HTTP 与签名**：统一用 HuTool（`HttpUtil.createRequest`/`Method.GET`/`Header.AUTHORIZATION`/`HttpResponse`/`UrlBuilder`）。`buildOrderUrl` 用 `UrlBuilder` 链式构造，**签名的 path/query 与实际请求 URL 取自同一个 UrlBuilder 对象**（`getPathStr()`/`getQueryStr()`），逐字符一致才不会 401；query 顺序即 `addQuery` 调用顺序，不可随意调整；不手工做 URL 编码。
- **两层 VO**：`CoupangApiResponseVO` 只承载通用信封（`rCode`/`rMessage`/`data`，`@JsonProperty` 显式标注避免 Jackson 对 `rCode` 命名推导异常，`succeed()` 在状态码缺失时判失败），`data` 保持 `JsonNode` 不在客户端定型；各地区解析器再把单条订单转成本地区 VO（KR 为 `CoupangKrOrderVO`，金额字段用 String）。
- **解析器分派**：`ICoupangOrderParser#country()` + Handler `@PostConstruct` 建 `parserMap`（`CollStreamUtil.toMap`），新增地区只加实现类。入参是单条原始 JSON 字符串，不绑定序列化实现，`origin_order` 直接取该入参。
- **`parse` 返回 null 表示跳过**（必填字段缺失 / 该地区未实现），计入 skipped 不落库；KR 解析器整个映射过程包在 try-catch 内（date 格式错、commission 非数字都会抛），避免单条脏数据让整个地区不落库。
- **`batchUpsert` 返回 `CpsOrderUpsertResult(inserted, updated)`**：内部先按 `open_commission_id` 用 `LinkedHashMap` 去重（重复保留最后一条），复用同一次 `listByAdvId` 查询同时做分组与计数，调用方不再为统计重复查库；分片 `BATCH_SIZE=2000`；`@Transactional(rollbackFor = Exception.class)`。
- **并发**：`CoupangOrderThreadPoolConfig` 提供独立 Bean `coupangOrderExecutor`（与全局 `applicationTaskExecutor` 隔离，core/max=2，按 KR/TW 两地区设定，新增地区需上调），字段注入 + `@Qualifier`（无 lombok.config 复制注解）；`FutureUtil.awaitAll` 只负责等待、自身不抛，单任务异常各自兜底；`processOneRegion` 整体 try-catch，异常**绝不逃出 CompletableFuture**（逃出会让 join 抛 CompletionException、汇总不执行）。
- **XXL-JOB 上下文**：`withXxlJobContext` 把主线程 `XxlJobContext` 传到子线程，否则 `XxlJobHelper.log` 在子线程全部丢失；`finally` 置空避免污染复用线程。
- **jobParam 解析失败直接抛 `ServiceException`**，不静默走默认值（否则运营写错 JSON 会拉错日期区间）。

## 已验证结论（2026-08-10 KR 真实数据）

两轮验证，都用真实 `startDate=endDate=20260810`，未构造数据补齐：

1. **对象级等价**（未落库）：V1 旧路径与 V2 新路径各返回 1 页 373 条，原始订单集合 SHA-256 相同；V1 `buildCpsOrderCommission` 与 V2 `CoupangKrOrderParser.parse` 逐字段差异 0，`originOrder` 逐字符相等。报告：`.kiro/specs/coupang-order-reports-v2/v1-v2-kr-20260810-链路核对.md`。
2. **落库级等价**（`adplatform_test02`，用户本地起服务手动跑 XXL-JOB）：三份快照表各 373 条、`open_commission_id` 无重复、集合完全一致，业务字段逐字段差异 0（含 `origin_order`）；差异只在 DB 生命周期字段。
   - `cps_order_commission_v1_20260810`：V1 首次落库（id 2727584~2727956）。
   - `cps_order_commission_v2_20260810`：V1 数据在库时跑 V2，只 `update_time` 变（id/create_time 不变 → 证明 upsert 走的是更新分支）。
   - `cps_order_commission_v2_fresh_20260810`：清表后重跑 V2，全量 insert（id 2727957~2728329，id/create_time/update_time 均不同）。

覆盖情况：真实数据全部命中 `click_id`（373/373），**`offline` 与 `fixed` 分支未被真实数据覆盖**；显式 null 0 条、缺失字段 0 条、`gmv=0.0` 9 条、非零极小金额 0 条。

## 踩过的坑 / 反复纠错点

- **新路径必须带 `/v1/`**，照抄旧实现路径会拉到旧接口；两个 endpoint 当前返回一致，但不能因此混用。
- **签名串与请求串必须同源**：先前手工拼 query + 手工编码时极易与实际请求不一致 → 401。改为同一个 `UrlBuilder` 出 path/query/URL 后解决。
- **`tag` 判定顺序不可调换**：offline 串若恰好 45 位，先判长度会误落 `click_id`。
- **offline subParam 必须 `split("_", -1)`**：保留尾部空串，否则 affSubId 为空时字段整体错位；`offerId`/`affiliateId` 缺失要跳过该条（返回 null）。
- **`unknown` 归一化不能省**：`subId/subParam` 为空时若留 null，`String.join` 会拼出 `"null"` 字面量，与旧任务产出的去重键不一致 → 旧新任务并存期会互相覆盖或产生重复行。
- **同批重复 `open_commission_id` 必须先去重**，否则两条都判新增、撞唯一索引导致整批回滚。
- **金额字段坚持 String 承接原文**：过 BigDecimal 往返会改变字符串形态，与旧任务写入值不一致。
- **已知理论差异（未消除）**：用 VO 承接后无法区分「字段缺失」与「JSON 显式 null」，`subId/subParam` 都会归一为 `unknown`，而旧实现对显式 null 可能得到字符串 `"null"`。2026-08-10 真实数据显式 null 为 0 条，未触发。
- **无批次号**：V1/V2 都没有执行批次标识，验证只能靠「执行前后按 `adv_id+provider+order_country+order_time` 建 `CREATE TABLE ... AS SELECT` 快照」来固定基线。
- **`sql-guard.json` 只放开 SELECT/INSERT/CREATE/SHOW/DESCRIBE**，UPDATE/DROP 被 MCP 拦；快照表因此只能建、不能删，清理需人工。允许库：`pac_foreign_test02`、`pac_system`、`adplatform_test02`。
- **`SHOW TABLES FROM adplatform_test02 LIKE ...` 的返回列名显示为 `Tables_in_pac_foreign_test02`**（MCP 连接的默认库是 pac_foreign_test02），列名会误导，判存在与否只看有没有数据行。
- **测试代码不作为交付物**：10.1/10.2/15.1 三个测试任务经用户明确跳过，本次生成的测试文件已全部删除；曾误删仓库既有的 `pac-common/.../utils/Test.java`，已用 `git show HEAD:<path>` 原样恢复（教训见全局 L-006）。
- 根 `build.gradle` 全局 `test.enabled=false`；验证时临时改的构建开关已恢复。
- **子代理不可用**：`spec-task-execution` 只在 Spec 会话可用，非 Spec 会话下编排任务会卡在 `in_progress`（本次 10.1 即处于该状态）。

## TW 对接（下次新会话的起点）

现状：`CoupangTwOrderParser` 是占位实现，`parse` 只打 WARN 返回 null（不抛异常，避免无意义告警）。测试库 `coupang_account_config` 中 TW 配置 `status=0`（停用），KR `status=1`。TW 账号 advId=38475。

**实测记录：TW 账号最近一年该接口均返回 `rCode=0` 且 `data` 为空数组——接口连通但无数据。**

补齐 TW 前必须先确认（不要凭 KR 结构推断）：
1. TW 响应 schema 与 KR 的实际差异；文档 schema 无 `orderId` 这一结论**未经真实数据验证**。
2. 去重键规则：唯一索引只含 `open_commission_id`，TW 的键必须全局唯一且不与 KR 的 `orderId_productId_tag` 冲突。候选：`date_productId_subId_subParam`。
3. TW 的 `currency`、`advId` 从配置表取，不要硬编码。
4. 新增 TW 后 `coupangOrderExecutor` 的 core/max=2 是否仍够用。

落地方式：新增 `CoupangTwOrderVO` + 补齐 `CoupangTwOrderParser`，Handler/Client/batchUpsert 都不需要改（分派与落库已地区无关）；把配置表 TW 行改为 `status=1` 才会真正执行。

## 交叉验证提示

动手前重点回读核对：
1. `coupang_account_config` 在测试库/线上的实际行：`country`、`status`、`adv_id`、`api_domain`、`currency` 当前值（密钥只校验长度，不回读明文）。
2. `CoupangConst` 的 `ORDER_REPORTS_PATH`、`PAGE_SIZE`、`MAX_PAGE_COUNT`、`CLICK_ID_SUBPARAM_LENGTH` 是否漂移。
3. `CoupangKrOrderParser` 的字段归一逻辑（空串 / `unknown` / tag 顺序）是否被后续改动，以及旧 `CoupangJobHandler.buildCpsOrderCommission` 是否仍存在（等价性基准）。
4. `batchUpsert` 是否仍返回 `CpsOrderUpsertResult` 且仍在内部去重。
5. 三张快照表（`cps_order_commission_v1_20260810` / `_v2_20260810` / `_v2_fresh_20260810`）是否还在 `adplatform_test02`，它们是本次落库等价性的唯一证据，需人工决定何时清理。
6. spec 剩余未完成任务：16（XXL-JOB 平台侧注册，外部操作）、17（上线 SOP 已创建但复选框未勾）、18（真实链路验证）；10.1/10.2/15.1 为用户明确跳过的测试任务。
7. 状态：截至 2026-08-11 代码**未提交、未推送**；线上未配置 `coupang_account_config`、线上未注册 V2 任务。权威细节见 `.kiro/specs/coupang-order-reports-v2/` 下 `design.md`、`tasks.md`、`上线SOP.md`、`v1-v2-kr-20260810-链路核对.md`。
