---
id: pac-platform/cj-cps-order-pull
scope: project
project: pac-platform
feature: cj-cps-order-pull
updated: 2026-08-24
tags: [pac-biz-adv, CJ, CommissionJunction, CPS订单, GraphQL, 游标翻页, cps_account_config, cps_order_commission, 冲正单, shopperId, SID, offline, click_id, UTC, 骨架复用]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/cj/CjCpsOrderJobHandler.java
    symbol: provider / pageStrategy(pullByPageToken) / client / parseResponse / hasMore / nextPageToken(游标未前进保护) / parseOrders / toCpsOrder(shopperId 传入 fillOrderTag) / resolveProductId / resolveInnerStatus / parseInstant
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/AbstractCpsOrderPullJobHandler.java
    symbol: fillOrderTag（统一 click_id/offline 映射，子类自行提供原始 tag）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliCpsOrderJobHandler.java
    symbol: toCpsOrder(tags 首项传入 fillOrderTag)
  - path: pac-biz/pac-biz-adv/src/test/java/com/tecdo/pac/biz/adv/task/cps/cj/CjCpsOrderJobHandlerTest.java
    symbol: shouldMapOfflineShopperId / shouldKeepClickIdShopperId / shouldSkipMalformedOfflineShopperId
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/cj/CjCpsOrderClient.java
    symbol: buildRequest（POST、Bearer 鉴权、body 为裸 query 串、走 UrlBuilder 分支）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/cj/dto/CjCommissionQueryDTO.java
    symbol: RECORD_FIELDS(静态字段清单) / toString()（拼 GraphQL query，sinceEventDate/beforeEventDate）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/cj/vo/CjExtConfigVO.java
    symbol: of(extConfigJson)（host/accessToken/publisherCid/currency 四键必填）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/cj/vo/CjCommissionVO.java
    symbol: ActionStatus 枚举(new→pending_confirm, extended/locked/closed→confirmed) / Item
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/cj/vo/CjApiResponse.java
    symbol: data.publisherCommissions(count/limit/maxCommissionId/payloadComplete/records) / errors
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/constant/CpsProviderConstant.java
    symbol: COMMISSION_JUNCTION = "CommissionJunction"
  - path: .kiro/specs/cps-order-pull-framework/上线SOP.md
    symbol: 第 2.1 节(CJ 账号配置) / 第 3.2 节(CJ 已知状态、SID offline 映射与限制)
  - table: cps_account_config（CJ 配置需含 host/accessToken/publisherCid/currency 四键）/ cps_order_commission（无需改表；核对状态快照与 offline 字段）
  - path: D:/access/Commission Junction/cj-docs-md/05-Commission-Detail-API.md
    symbol: 官方文档中译（用量限制/枚举/冲正处理）
  - path: D:/access/Commission Junction/demo/output/records_20260820_104038.json
    symbol: 唯一一份实测报文（1 条 Agoda APAC 记录，字段映射的依据）
---

## 核心业务逻辑

CJ（Commission Junction）作为第二个平台接入既有 CPS 拉单骨架，复用 `AbstractCpsOrderPullJobHandler`，
未改动骨架与入口 —— 新 handler 靠 Spring 注入自动注册进 `handlerMap`。

- **接口**：Commission Detail API，GraphQL，`POST https://commissions.api.cj.com/query`，Bearer PAT 鉴权。
  推广方用 `publisherCommissions` 查询，这是把 SID 换回自己点击 ID 的唯一通路。
- **去重键 = `commissionId + "_" + actionStatus`**，保留 CJ 的每个状态记录。原始 `new` 映射为 `pending_confirm`；`extended`、`locked`、`closed` 映射为 `confirmed`，并额外补一条 `commissionId_new` 快照供 PB 按 `pending_confirm` 下发。`original=false` 的冲正记录映射为 `cancel_confirm`，不生成或覆盖 `new` 快照。
- **时间维度 = `eventDate`**（用户决策，非 postingDate），与落库 `order_time` 口径一致。
- **inner_status 映射**：`new`→`pending_confirm`，`extended`/`locked`/`closed`→`confirmed`；`original=false`（冲正单）→`cancel_confirm`（在 actionStatus 映射之前判断）。`validationStatus` 不作为 PB 下发门槛。未知 actionStatus 抛 `ServiceException`，单条跳过记 WARN。
- **判「这笔钱定了」看 actionStatus 不看 validationStatus**：文档明确 locked 后不可冲正或延期，是硬性终点；
  而 `validationStatus: ACCEPTED` 只是「可锁定」，仍有变数。
- **翻页是游标式**：`payloadComplete=false` 时取 `maxCommissionId` 传给下次的 `sinceCommissionId`，
  用基类的 `pullByPageToken`。
- **金额取 USD 字段**：`order_amount`←`saleAmountUsd`，`open_commission_amount`/`inner_commission_amount`
  ←`pubCommissionAmountUsd`；CJ 以字符串返回（DecimalNumber），原样接收再转 BigDecimal，不经 double。
- **归因 tag 统一由 `AbstractCpsOrderPullJobHandler#fillOrderTag` 映射**：CJ 传入 `shopperId`（SID），Blibli 传入 `tags` 首项。普通值原样落为 `tag_type=click_id`；以 `offline_` 开头（前缀大小写不敏感）的值复用 `CapOrderCommissionUtils` 解析 `offline_country_uniqueId_offerId_affiliateId_affSubId`，落为 `tag_type=offline`，并写入 `offerId`、`affiliateId`、`extParams`。解析后 `offerId` 或 `affiliateId` 缺失时子类记录平台订单上下文并跳过，不降级为 click ID；offline 前缀规范为小写，其余内容保留。CJ 的 `order_country` 始终取报文 `country`，不使用 SID 内 country，也不从 ext_config 取。
- ext_config 四键：`host` / `accessToken` / `publisherCid` / `currency`（固定 USD，与取 USD 字段对应）。

## 核心代码设计

- 目录 `task/cps/cj/`，与 `task/cps/blibli/` 平级，结构对齐：Handler + Client + dto/ + vo/。
- `fillOrderTag` 放在 CPS 抽象基类，但只作为子类显式调用的受保护工具：基类不读取平台原始字段，CJ/Blibli 分别负责取 `shopperId`/`tags` 首项及记录非法格式日志。
- `CjCommissionQueryDTO.toString()` 拼 GraphQL query（对齐 Blibli 用 `toString()` 拼 query string 的既有风格，
  符合「优先重写原生方法」规范）。字段清单放静态 `RECORD_FIELDS`，与 `CjCommissionVO` 字段一一对应。
- `parseResponse` 是唯一的响应校验入口，被 `hasMore` / `nextPageToken` / `parseOrders` 三处复用。
- `CjCpsOrderJobHandlerTest` 通过 `parseOrders` 验证继承的 `fillOrderTag`：覆盖合法 offline、普通 click ID、非法 offline 三条 shopperId 分支，不发起真实 CJ 请求。
- **GraphQL 业务错误也走 HTTP 200**：令牌无效、字段名写错都表现为 `errors` 非空 + `data` 为空，
  只看 HTTP 状态码会当成功。因此 `parseResponse` 先查 `errors` 再取 `data`。
- `nextPageToken` 加了**游标未前进保护**：游标与上一页相同即返回 null 结束该账号，
  否则会原地打转直到撞上基类 `MAX_LOOP_COUNT`（2000 次），每次都是真实 HTTP 请求。
- `hasMore` 用 `BooleanUtil.isFalse(payloadComplete)`：缺失时按已取完处理，不冒重复拉同一页的风险。
- 配置校验（`CjExtConfigVO.of`）前置在数据判空之前 —— 沿用 Blibli 踩过的坑，
  否则「配置缺字段 + 当前窗口无订单」会被判成功、配置错误被静默吞掉。

## 踩过的坑 / 反复纠错点

- **`publisherCid` 传错是静默失败**：必须是公司 CID（实测 `7985075`，publisherName `TEC-AD LIMITED`），
  不是 `websiteId`（PID，实测 `101820899`）。**传错不报错，只返回 `count: 0`**，
  极易误判成「账号没有交易」。令牌与 CID 不对应时同样只返回 0 条。
- **`9999-12-31T08:00:00Z` 是 lockingDate 的哨兵值**，表示「锁定时间未定」，不能参与日期计算；当前 query 未请求 lockingDate，`eventDate` 的 `parseInstant` 不做该特判。
- **`commission_rate` 恒为 `0`**：CJ 不返回佣金率（佣金结构在 `situationDetails`，口径不唯一且官方点名解析慢，未请求）。
  落 0 仅为满足 NOT NULL。⚠️ **这与 Blibli 的排障结论冲突** —— SOP 里「commission_rate=0 是异常信号」
  只适用于 Blibli，CJ 一律是 0 属正常，排障别按异常查。
- **`ISO_INSTANT` 不能用来格式化区间终点**：实测 `LocalTime.MAX` 经 `ISO_INSTANT` 输出
  `2026-08-20T23:59:59.999999999Z`（纳秒）。改用 `DatePattern.UTC_PATTERN`
  （实测值 `yyyy-MM-dd'T'HH:mm:ss'Z'`，正是 CJ 要求的格式）+ `LocalTime.MAX.withNano(0)`。
- **`StrUtil.format` 拼 GraphQL 安全**：实测只替换严格相邻的 `{}`，GraphQL 的 `{ ` `} ` 不受影响，
  不需要转义。已实测拼装结果与 demo 脚本产出的 query 一致。
- **请求体是裸 query 串，不是 `{"query": "..."}` 包装**：官方 curl 示例即如此，demo 脚本默认也是裸串
  （`--json-body` 是失败时的回退开关）。实测通过的那次用的是裸串。
- **`AbstractCpsHttpClient` 的 `UrlBuilder` 分支此前从未被平台用过**（Blibli 走 `queryString` 分支）。
  CJ 是 POST 无 query、正好走这条，已单独实测确认 `UrlBuilder.ofHttp(host).addPath("/query")`
  输出 `https://commissions.api.cj.com/query`，无多余斜杠或编码。
- **`reviewedStatus` 实测返回字符串 `"0"`，官方无枚举表**，语义不明，不落库不参与判断（原文留在 `origin_order`）。
- **eventDate 维度的已知漏数**：冲正单的 `eventDate` 沿用原单时间，按最近 N 天窗口回扫**捞不到旧订单的新冲正单**，
  需按原单历史区间重跑。这是选 eventDate 的代价（选 postingDate 则无此问题但 order_time 口径不一致）。
- **`extended`、`locked`、`closed` 的原始正佣金记录都会补 `new` 快照**，因此首次拉到终态记录也会形成 `pending_confirm` 候选；`original=false` 的退款/冲正不补，避免 PB 下发冲正记录。
- **CJ 时间窗口上限 31 天**，比 Blibli 的 45 天更严；两平台共用一个 jobParam 窗口，
  跨度按 31 天卡，否则 CJ 侧返错、该账号失败并让整个任务告警（任一账号失败即 handleFail）。
- **凭证入库与真实调用被权限拦下**：把 live token 写进共享库 `cps_account_config` 或放到命令行，
  被 auto mode classifier 判为 Credential Leakage / Modify Shared Resources 而拒绝，属正确拦截，
  不应绕过 —— 这两步交由用户执行。因此**本实现从未真实调用过 CJ 接口**，
  字段映射依据的是 demo 那份实测报文 + 官方文档。

## 下次需交叉验证的锚点

- `cps_account_config` 是否已插入 `provider='CommissionJunction'` 的行、四键是否齐全、`publisherCid` 是否为公司 CID。
- `cps_order_commission` 中是否已有 `provider='CommissionJunction'` 的数据；若有，重点核对：
  冲正单是否为负数、普通 click ID 是否保留 SID 原始大小写、offline 是否写入 offerId/affiliateId/extParams、`order_country` 是否逐条不同、`order_time` 是否为 UTC。
- `AbstractCpsOrderPullJobHandler#fillOrderTag` 是否仍复用 `CapOrderCommissionUtils.isOfflineTrace`、`parseOfflineSubparam`、`normalizeOfflineTag`；CJ/Blibli 是否只负责提供原始 tag 并保留各自的非法格式日志，不要复制解析逻辑或把 CJ 的 websiteId/advertiserId/aid/actionTrackerId 误作 offline 字段。
- `CPSPbReissueTaskV2` 的 jobParam 是否已加 `CommissionJunction` 的 `CPSProviderInfo`（本次未改 PB 侧）。
- 是否出现 429（本实现无页间 sleep、无退避），若有需加限流。
