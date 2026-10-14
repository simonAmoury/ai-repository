---
id: pac-platform/cps-order-pull-framework
scope: project
project: pac-platform
feature: cps-order-pull-framework
updated: 2026-08-24
tags: [pac-biz-adv, CPS订单, 骨架, 抽象基类, 模板方法, 策略模式, XXL-JOB, cps_account_config, cps_order_commission, Blibli, CJ, offline, 签名同源, UTC, 状态快照, 专用线程池, NOT_NULL约束]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/CpsOrderPullJobHandler.java
    symbol: cpsOrderPullTask(@XxlJob 唯一入口) / parseJobParam / resolveExecutableProviders / resolveDateRange / validateDateRange
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/AbstractCpsOrderPullJobHandler.java
    symbol: doExecute(accounts, providerParam) / toAccountParam / validateAccountConfig / pullByPageNumber / pullByPageToken / nextPageToken / fetchAndPersist / prepareOrdersForPersist / persistOrders / fillOrderTag / awaitAll(join) / summarize / withXxlJobContext
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/config/CpsOrderPullThreadPoolConfig.java
    symbol: CPS_ORDER_PULL_EXECUTOR / cpsOrderPullThreadPoolTaskExecutor(core4/max8/queue100/CallerRunsPolicy)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/CpsPageStrategy.java
    symbol: pull(config, param, stat)（函数式接口，子类返回基类翻页驱动方法引用）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/client/AbstractCpsHttpClient.java
    symbol: fetchPage / buildRequest(abstract) / request / executeHttp
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/client/CpsHttpRequestDTO.java
    symbol: host / path / method / queryParams / queryString(原样使用不二次编码) / headers / body
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliCpsOrderJobHandler.java
    symbol: provider / pageStrategy / client / hasMore / parseOrders / parseResponse / toCpsOrder(tags 首项传 fillOrderTag) / buildOpenCommissionId / prepareOrdersForPersist / shouldCreateProcessedSnapshot / buildProcessedSnapshot / resolveInnerStatus
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliCpsOrderClient.java
    symbol: buildRequest（UTC 时间戳、limit=500、签名入 header）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliSignUtil.java
    symbol: SIGNATURE_HEADER / buildRawData(CRLF 分隔) / sign
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/vo/BlibliExtConfigVO.java
    symbol: of(extConfigJson)（host/secretKey/currency/orderCountry 四键必填，统一校验入口）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/vo/BlibliOrderItemVO.java
    symbol: CommissionStatus 枚举(PROCESSED/COMPLETE/NOT_VALID -> inner_status) / of
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/vo/BlibliApiResponse.java
    symbol: code / status / data / paging.totalPage(@JSONField total_page)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/dto/BlibliOrderQueryDTO.java
    symbol: toString()（反射拼 query，签名与请求同源）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/jobParam/cps/CpsOrderPullJobParamDTO.java
    symbol: providers / startDate / endDate / recentDays（仅四字段，无账号 id、无 extParams）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/jobParam/cps/CpsProviderEffectiveParamDTO.java
    symbol: provider / startDate / endDate
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/vo/CpsParsedOrdersVO.java
    symbol: fetched(接口返回条数) / orders(解析成功) / empty()
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/vo/CpsPreparedOrdersVO.java
    symbol: orders / snapshotCount（子类显式返回，基类不按差值推断）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/vo/CpsAccountPullStatVO.java
    symbol: fetched / parsed / snapshotCount / inserted / updated / skipped / fail
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/util/CpsProviderMapUtil.java
    symbol: build(items, providerFn, desc)（provider 重复即启动失败）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/ICpsAccountConfigService.java
    symbol: listByProviders(集合为空返回全表)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/ICpsOrderCommissionService.java
    symbol: listByAdvId(既有未动) / listByOpenCommissionIds / upsertBatch
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/cps/CpsOrderDebugController.java
    symbol: fetchPage（POST /cps/debug/fetch-page，无限流无数据权限）
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/EpochMilliUtil.java
    symbol: parseStart / parseEnd / toLocalDateTime / format（显式传 ZoneOffset，用 DatePattern 常量）
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/adv/CPSPbReissueTaskV2.java
    symbol: reissueProviderCommission2PB(按 provider + create_time + inner_status=pending_confirm 扫描) / addCustomFieldsToQueryParams(读 origin_order，受 customFieldMapping 开关控制)
  - table: cps_account_config（测试库已建，id=1 缺 currency/orderCountry 不可用需删，id=2 可用）/ cps_order_commission（未改结构；order_amount、commission_rate、open_commission_amount、inner_commission_amount 均 NOT NULL 且无默认值）
  - path: .kiro/specs/cps-order-pull-framework/requirements.md
    symbol: 决策表 A~Z / 需求 1~13 / Q1~Q7（权威细节，无 design.md、tasks.md）
  - path: .kiro/specs/cps-order-pull-framework/上线SOP.md
    symbol: 建表 / 插账号配置 / cpsOrderPullTask 注册 / 停用一期 blibliOrderItemTask / IP 白名单 / 已知限制 12 条
---

## 核心业务逻辑

多平台 CPS 订单拉取骨架 + Blibli 作为首个接入方，已完整落地（非骨架空实现）。

- **账号不由 jobParam 指定**（2026-08-18 重构，推翻早期 `accounts[].id` 方案）：jobParam 只给 `providers`，该 provider 在 `cps_account_config` 中的**全部行**都执行。执行器由账号记录的 `provider` 决定，一次执行可覆盖多个 provider。
- jobParam 仅四字段 `providers` / `startDate` / `endDate` / `recentDays`。jobParam **为空合法**＝全部 provider + 最近 3 天；补数＝`providers` 指定单个 provider + 指定日期单独触发一次。
- `recentDays` 口径沿用仓库既有 Coupang/TTS/Shein：`今天 - N ~ 今天`，默认 3，起止日期未给全时才生效。全部 provider 共用一个时间窗口，无 provider 级/账号级覆盖。
- 去重键 = `openCommissionId` 单字段，与 `cps_order_commission` 唯一索引一致；表结构与索引不动，`advId` 不处理。
- Blibli 去重键格式 `orderId_orderItemId_commissionStatus`，因此同订单状态变化会产生不同行。
- 状态映射：`PROCESSED`→`pending_confirm`、`COMPLETE`→`confirmed`、`NOT_VALID`→`cancel_confirm`；未知状态抛 `ServiceException`、单条跳过记 WARN。
- **仅 `COMPLETE` 补 `PROCESSED` 快照**（2026-08-18 调整）：`NOT_VALID` 不补，否则会给已核减订单造出 `pending_confirm` 记录、被 PB 下发一笔不该发的佣金。
- 时间口径统一 **UTC**（早期是 GMT+8，已切换）：请求 `startOrderDate`/`endOrderDate` 与落库 `order_time` 都按 UTC。
- 失败判定：**任一账号失败即 `XxlJobHelper.handleFail`**（早期是全部失败才算失败），避免部分失败告警漏报。
- 并发：单 provider 内账号并发跑**专用线程池**，多个 provider 之间顺序执行；不做 `Semaphore` 限流，并发上限＝池容量。

## 核心代码设计

三层：统一入口 `CpsOrderPullJobHandler` → 基类 `AbstractCpsOrderPullJobHandler` → 平台子类 + 取数客户端。

- **入口**（唯一 `@XxlJob("cpsOrderPullTask")`）负责：解析 jobParam → `listByProviders` 查账号（providers 空则全表）→ 按 provider 分组 → 校验 → 归一化时间窗口 → 顺序分发。账号表**只查一次**，平台实现不再自查。单 provider 异常被捕获，其余继续，最后聚合 `handleFail`。
- **基类抽象扩展点 5 个**：`provider()`、`pageStrategy()`、`client()`、`hasMore()`、`parseOrders()`；`buildRequest` 在 `AbstractCpsHttpClient`（客户端侧），`nextPageToken` 默认抛异常仅游标翻页需覆盖。子类**不带 XXL-JOB 入口**。
- `doExecute(accounts, providerParam)`：逐账号建 stat → `validateAccountConfig`（provider 一致性 + ext_config 是合法 JSON，承载需求 1.8）→ `toAccountParam` 派生账号级参数 → 提交专用池 → `awaitAll` → `summarize`。
- **翻页**：`CpsPageStrategy` 函数式接口，子类返回基类方法引用（Blibli 用 `pullByPageNumber`）；`pullByPageToken` 已就绪但无平台使用；共用 `MAX_LOOP_COUNT = 2000` 兜底。
- **`parseOrders` 返回 `CpsParsedOrdersVO`**（`fetched` 接口返回条数 + `orders` 解析成功），基类分别累计「接口返回 / 解析成功」，差值即解析阶段跳过数。
- **`fillOrderTag` 是子类显式调用的通用映射**：子类只负责提取原始 tag（CJ 为 `shopperId`、Blibli 为 `tags` 首项）和记录订单上下文；基类统一处理普通 `click_id` 与 `offline_` 协议，非法 offline 返回 false 供子类跳过。
- **`prepareOrdersForPersist` 返回 `CpsPreparedOrdersVO`**（`orders` + `snapshotCount`），快照数由子类显式给出。
- `awaitAll` 用 **`CompletableFuture.join()` 而非 `get()`**：join 不响应中断、会等到任务结束、返回前 JDK 自行恢复中断标志（已实测：300ms 中断，join 仍在 2008ms 返回，`isInterrupted()`=true）。用 `get()` 会中断即返回、提前汇总漏统计。
- `persistOrders`：`LinkedHashMap` 批内去重（留最后一条）→ 覆盖 `provider` → `listByOpenCommissionIds`(1000 分片) → 分插入/更新（更新前 `setId`）→ `upsertBatch`(`@Transactional`)。
- `CpsHttpRequestDTO.queryString` 非空时 `request` 原样拼 URL、**不经 UrlBuilder 不二次编码**（Blibli 验签命门）；为空走 `UrlBuilder.build()` 一次输出（该分支目前无平台使用、未验证）。
- Blibli：`BlibliExtConfigVO.of` 是四键校验的唯一入口，client 与 handler 共用；`parseResponse` 集中解析 + 校验业务 `code == HttpStatus.OK`，`hasMore` 里 `catch (ServiceException) { throw }` 保证业务错误不被降级成「无下一页」；`buildOpenCommissionId` 收敛去重键格式、分隔符常量 `ID_SEPARATOR`。
- **专用线程池** `CpsOrderPullThreadPoolConfig`（core 4 / max 8 / queue 100 / `CallerRunsPolicy` / `ContextCopyTaskDecorator` / keepAlive 300s）。拒绝策略选 CallerRuns 而非 AbortPolicy：基类必须等全部账号结束才汇总，丢任务会导致统计与落库不完整。bean 名走常量 `CPS_ORDER_PULL_EXECUTOR`。
- 日期格式化统一用 Hutool `DatePattern.NORM_DATE_FORMATTER` / `NORM_DATETIME_FORMATTER`，不再自建 `ofPattern`。

## 踩过的坑 / 反复纠错点

- **`cps_order_commission` 有四列是 `NOT NULL` 且无默认值**：`order_amount`、`commission_rate`、`open_commission_amount`、`inner_commission_amount`。库 `sql_mode` 实测含 `STRICT_TRANS_TABLES,STRICT_ALL_TABLES,TRADITIONAL`，映射留 `null` 会让**整批 insert 失败**、`upsertBatch` 事务回滚 → 该账号当前页数据全丢。MyBatis-Plus 默认 `insertStrategy=NOT_NULL`（项目无全局覆盖），null 字段不进 INSERT 语句，报错形式是 `Field 'xxx' doesn't have a default value`。四个字段现均缺失落 `0`。
- **`commission_rate = 0` 是异常信号**：既有 31.6 万行历史数据里该字段没有任何 `0` 值，出现 `0` 说明报文 `commission` 对象缺失，要排查而不是当真实 0% 费率。兜底依据是 NOT NULL 约束，**不是** PB 下发——`CPSPbReissueTaskV2` 已不下发 `ad_commission_rate`（只有 V1 还发），`open_commission_amount` 仍经 `ad_estimated_commission` 下发。
- **账号不能再挑之后，坏配置行必须清理**：provider 命中就全跑，测试库 `id=1`（缺 currency/orderCountry）每次都会失败，叠加「任一账号失败即 handleFail」会让整个任务告警。`sql-guard.json` 拦 DELETE，需人工在客户端删。
- **配置校验必须前置到数据判空之前**：早期 `parseOrders` 先判 `data` 空就 return，导致「配置缺 currency/orderCountry + 当前窗口无订单」时账号被判成功、配置错误被静默吞掉。现在 ext_config 四键校验放在 `data` 判空之前，配置错误无论有没有数据都会失败。
- **决策写「由线程池容量决定」却没写用哪个池**，实现就按项目规范注了共享 `threadPoolTaskExecutor`，与 TTS 拉单、账单事务后回调抢线程。后改为专用池。决策里涉及资源（线程池、队列、表）时必须写到具体实例名。
- **`awaitAll` 早期用 `get()` + 恢复中断标志**，看似合规实则缺陷：中断即返回、子线程还在跑就进汇总。而且我第一版修复用 `while + get()` 重试，绕了远路——`join()` 本身就是不可中断等待，最终改用 `CompletableFuture.join()`。
- **`hasMore` 与 `parseOrders` 各自 `parseResponse` 一次**，单页 500 条时每页两次完整反序列化。属基类「用 responseBody 字符串在扩展点间传递」的设计取舍，未优化。
- **快照的 `origin_order` 仍是终态报文**：快照 `open_status=PROCESSED` 但 `origin_order` 内 `commissionStatus` 还是 `COMPLETE`（符合需求「其余字段保持 API 返回值」）。影响面有限：`CPSPbReissueTaskV2.addCustomFieldsToQueryParams` 只在 `customFieldMapping` 非空时读 `origin_order`，且只取配置点名的字段。将来若为 Blibli 配了映射且映射到状态类字段，才会出现矛盾。
- **`resolveExecutableProviders` 曾写得过度复杂**：if/else 双分支 + 三次 `new ArrayList` + `removeAll`。简化为先无条件 `retainAll(handlerMap.keySet())`、再按点名收窄，用 `CollUtil.subtractToList` 替手工差集。保留的唯一行为差异：点名的 provider 跑不了就失败，未点名（全量）时无实现只 WARN 跳过（避免配置表一条未接入记录阻塞所有平台）。
- **`super.` 前缀冗余扩散**：照抄既有 `listByAdvId` 的 `super.lambdaQuery()` 写法，复制出 3 处冗余。本类未重写这些继承方法，`super.` 无意义，已去掉本次新增的 4 处；既有 `listByAdvId` 那行不动。
- **Blibli 待签串分隔符是 CRLF (`\r\n`)** 不是 LF；签名 query 必须与实际请求 query 逐字符一致，靠 `queryString` 字段实现同源。早期签名用 DTO 拼接、请求走 UrlBuilder 自动编码，两边不一致导致验签失败；反射拼 query 的 DTO 也不能加非接口参数字段。
- **`BlibliOrderQueryDTO` 字段会被反射拼进 query**，不能加非接口参数字段；`BeanUtil.beanToMap` 第三参 `isToUnderlineCase` 必须 false。
- **`tag` 取 `tags` 首元素而非 `clickId`**（实测 32 位 id + 13 位毫秒戳共 45 位，与 Coupang click_id 口径一致）；该原始值传给 `fillOrderTag` 后按 click/offline 协议落库。`commission_rate` 是百分数原值（`rate=2` 即 2%，不除 100）。
- **本需求结论被反复推翻，改文档要五处同步**（术语表 / 决策表 / 需求正文 / 非目标 / Q 结论），漏一处即自相矛盾。已推翻过：country 列、去重键、验收方式、advId、分页设计、签名归属、jobParam 账号选择、快照范围、失败判定、线程池。
- 一期 Blibli 代码（`BlibliController`/`BlibliJobHandler`/`BlibliAffiliateClient` 等）已删除，`blibliOrderItemTask` 需在调度中心停用；`pac.adv.blibli.secretKey` 已无代码引用。

## 状态与未验证项

- 已编译通过（`:pac-biz:pac-biz-adv:compileJava`），静态诊断只剩 Hutool 方法引用的 null-safety 警告。**无单元测试**（根 `build.gradle` 全局 `test.enabled=false`，用户要求跳过）。
- **签名与连通性已实测**：调试端点真实调用返回 `code=200`、8 条数据、`total_page=1`。
- **落库链路仍未实测**：`parseOrders → 去重 → upsert` 没真跑过，`cps_order_commission` 中还没有 Blibli 数据。首次运行重点看：接口返回 vs 解析成功条数、快照是否只对 COMPLETE 生成、是否撞唯一索引。
- 截至 2026-08-18 代码已提交并 push 到 `origin/feature/blibli_affiliate_api`（含 `super改this`、`默认值调整，取消退款快照，去除pb下发ad_commission_rate` 等 commit）。
- 未做：调试端点限流与数据权限、`CpsOrderDebugFetchDTO.pageToken`（对 Blibli 无效）、`CpsAccountPullStatVO` 改名。review 报告在 `docs/code-review-blibli-affiliate-api.md`。

## 交叉验证提示

动手前重点回读核对：
1. jobParam 是否仍是四字段（`providers`/`startDate`/`endDate`/`recentDays`），有无重新引入账号 id 或 `extParams`。
2. 基类抽象方法是否仍是 5 个、`doExecute` 签名是否仍是 `(accounts, providerParam)`。
3. `awaitAll` 是否仍用 `join()`；`summarize` 是否仍「任一失败即 handleFail」。
4. `shouldCreateProcessedSnapshot` 是否仍只认 `COMPLETE`。
5. 四个 NOT NULL 金额/费率字段的兜底是否还在；`cps_order_commission` 的列约束与 `sql_mode` 是否变化。
6. `cps_account_config` 测试库/线上是否已建表、`id=1` 坏行是否已删、`ext_config` 四键是否齐全。
7. 专用线程池 bean 是否仍存在、容量是否被调整（它就是账号并发上限）。
8. `CpsHttpRequestDTO.queryString` 分支是否仍原样使用不二次编码（Blibli 验签命门）。
9. `EpochMilliUtil` 是否仍显式传 `ZoneOffset`、Blibli 是否仍全链路 UTC。
10. `CPSPbReissueTaskV2` 的扫描条件（`provider` + `create_time` + `inner_status`）与 `customFieldMapping` 是否变化，影响快照策略是否仍成立。
