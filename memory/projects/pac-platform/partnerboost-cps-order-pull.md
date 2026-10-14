---
id: pac-platform/partnerboost-cps-order-pull
scope: project
project: pac-platform
feature: partnerboost-cps-order-pull
updated: 2026-09-14
tags: [pac-biz-adv, PartnerBoost, CPS订单, api.php, 页码翻页, 时间窗口分片, 62天限制, cps_account_config, cps_order_commission, Pending快照, 一账号一provider, token脱敏, CPSPbReissueTaskV2, 骨架复用]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/AbstractPartnerBoostOrderJobHandler.java
    symbol: pageStrategy(pullBySlicedDateRange) / parseResponse / hasMore / parseOrders / toCpsOrder / buildOpenCommissionId(String... 可变参数，orderId_partnerboostId_status) / prepareOrdersForPersist(Approved 补 Pending 快照) / buildPendingSnapshot / resolveCommissionRate / resolveCurrency / resolveOrderCountry / parseEpochSecond / resolveInnerStatus
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/PartnerBoostVictoriaNieOrderJobHandler.java
    symbol: provider = PARTNER_BOOST_VICTORIA_NIE（薄子类，只声明 provider 与 client）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/PartnerBoostMaxnieOrderJobHandler.java
    symbol: provider = PARTNER_BOOST_MAXNIE
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/PartnerBoostJeyuforcpsOrderJobHandler.java
    symbol: provider = PARTNER_BOOST_JEYUFORCPS
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/AbstractPartnerBoostOrderClient.java
    symbol: buildRequest（POST /api.php?mod=medium&op=transaction，token 在 body，limit=500）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/dto/PartnerBoostTransactionQueryDTO.java
    symbol: toRequestBody() + @ToString(exclude = "token")
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/vo/PartnerBoostExtConfigVO.java
    symbol: of(extConfigJson)（host/token 必填，currency 可选兜底）+ @ToString(exclude = "token")
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/vo/PartnerBoostTransactionVO.java
    symbol: CommissionStatus 枚举(Pending→pending_confirm, Approved→confirmed, Rejected→cancel_confirm, Normal 不映射)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/partnerboost/vo/PartnerBoostApiResponse.java
    symbol: status(code/msg) + Payload(total_page/total_trans/total_items/limit/list)，分页字段全按 String 接
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/constant/CpsProviderConstant.java
    symbol: PARTNER_BOOST_VICTORIA_NIE = "PartnerBoost-victoria.nie" / PARTNER_BOOST_MAXNIE = "PartnerBoost-maxnie" / PARTNER_BOOST_JEYUFORCPS = "PartnerBoost-jeyuforcps"
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/adv/CPSPbReissueTaskV2.java
    symbol: isValidCommission(只放行 pending_confirm) / reissueProviderCommission2PB(按 create_time 筛选 + cps:pb:sent 防重) / reissueProviderGroup(未配置 provider 整组跳过)
  - path: .kiro/specs/cps-partnerboost-order-pull/online-sop.md
    symbol: 3.2 账号配置 / 3.3 PB 下发侧 cpsProviderInfoMap / 第六节已知限制
  - table: cps_account_config（PartnerBoost 两条，ext_config = host/token，provider 已带账号名故无需 accountName 备注，无需 DDL 变更）/ cps_order_commission（无需改表；currency NOT NULL varchar(4)，order_country varchar(2)，provider varchar(32)）
  - path: D:/access/partnerboost/partner-api.md
    symbol: 接口总览与 transaction 字段表（文档中译）
  - path: D:/access/partnerboost/api-test-report.md
    symbol: 25 个接口实测报告（空 data、1006/1008、has_more 两种写法等与文档不符处）
---

## 核心业务逻辑

PartnerBoost 作为第三个平台接入既有 CPS 拉单骨架，复用 `AbstractCpsOrderPullJobHandler`，未改骨架与入口。

- **接口**：`POST https://app.partnerboost.com/api.php?mod=medium&op=transaction`，`Content-Type: application/json`，
  **token 放在 JSON body 里**（不是 header），每个推广渠道一个独立 token。
- **一账号一 provider，值按账号名命名**：三个账号 `victoria.nie` / `maxnie` / `jeyuforcps`
  （**均用于跑 CPL**）分别用 `PartnerBoost-victoria.nie`、`PartnerBoost-maxnie`、
  `PartnerBoost-jeyuforcps`。原因是框架按 `provider()` 唯一注册 handler 与 client
  （`CpsOrderDebugController` 也按 `config.getProvider()` 找 client），一个 bean 只能占一个 provider。
  实现上抽 `AbstractPartnerBoostOrderJobHandler` / `AbstractPartnerBoostOrderClient`，每个账号派生一对薄子类
  （`PartnerBoostVictoriaNieOrder*` / `PartnerBoostMaxnieOrder*` / `PartnerBoostJeyuforcpsOrder*`）。
  **新增账号的完整动作**：加一个常量 + 一对薄子类（Handler / Client）+ 一条 `cps_account_config` 记录
  + `cpsPbReissueTaskV2` jobParam 加一个 key，四步缺一不可。
  ⚠️ 命名曾一版是 `PartnerBoost-CPL` / `PartnerBoost-CPS`（按计费模式），2026-09-14 改为按账号名——
  因为两个账号都跑 CPL，计费模式不再是区分维度。provider 值带点号（`victoria.nie`）在 varchar(32)、
  Map key、jobParam JSON key 里均无问题。
- **时间维度 = 交易时间**（`begin_date` / `end_date`），不用审核时间段。已知代价：交易时间在窗口外、
  近期才被审核的老订单拉不到状态更新。
- **拉取范围**：`status` 与 `order_type` 都不传，即全状态、全类型（`paid_placement`、`merchant_bonus`
  这类非订单佣金也会落库）。
- **去重键 = `order_id + "_" + partnerboost_id + "_" + status`**，按状态留痕，同一笔最多
  `_Pending` / `_Approved` / `_Rejected` 三行。拼接只有 `buildOpenCommissionId(String... segments)`
  一处（`String.join(ID_SEPARATOR, segments)`）：`toCpsOrder` 传三段，`buildPendingSnapshot` 传
  「剥掉状态后缀的前缀 + 新状态」两段，共用同一份分隔符格式，与快照剥后缀互为逆操作。
- **状态映射**：`Pending`→`pending_confirm`、`Approved`→`confirmed`、`Rejected`→`cancel_confirm`；
  文档里的 `Normal` **不纳入映射**，遇到按未知状态跳过该条并 warn。
- **平台侧已确认的三条行为（2026-09-14 由需求方确认）**：① `status` 只会是 Pending / Approved /
  Rejected，不会出现 `Normal`；② 状态变更时 `partnerboost_id` 不变；③ 同一订单在接口里只返回一条记录，
  状态变更是在原记录上直接改。据此：与 CJ 同构，**不需要批次内快照去重**（同一页不会出现同一订单的多状态行）；
  去重键稳定；未知状态的兜底保留，用于发现平台将来新增状态。
- **Approved 必须补 Pending 快照**：下游 `CPSPbReissueTaskV2` 只下发 `pending_confirm`，
  首次拉取就命中 `Approved` 时若不补 `_Pending` 快照，这笔佣金一次都发不出去。`Rejected` 不补
  （`cancel_confirm` 本就不下发，只作留痕）。
- **退款/驳回订单不发核减 PB**（需求方 2026-09-14 明确）。完整链路：首拉 Pending → 下发预估佣金 →
  订单转 Rejected → 只落 `cancel_confirm` 留痕、不再有任何回传，**已下发的那笔不撤回**。
  这是预期行为，不是缺口，不要再为此加撤销逻辑。
- **下发走 V2（`CPSPbReissueTaskV2`）**（需求方 2026-09-14 确认线上启用 V2）。V2 按 `provider` 归因，
  不读 `adv_id`，因此本平台不给 `cps_order_commission.adv_id` 赋值是安全的（CJ / Blibli 同样不赋，
  而 Coupang / Shein 是硬编码 advId 的历史差异）。⚠️ **若将来切回 V1（`CPSPbReissueTask`，
  `idWrapper.eq(CpsOrderCommission::getAdvId, ...)`），本平台订单会因 advId 为 null 一条都查不到、
  完全不下发**，切换前必须先回填 advId。
- **字段映射**：`order_amount`←`sale_amount`，`open_commission_amount`/`inner_commission_amount`←`sale_comm`，
  `commission_rate`←`comm_rate`（原样落），`product_id`←`prod_id`，`tag`←`uid`（uid2~uid5 不用），
  `order_time`←`order_time`（Unix 秒→UTC），`currency`←`payment_currency`（缺失才用 ext_config.currency），
  `order_country`←`customer_country`（非二字码不落）。
- ext_config 两键必填：`host` / `token`；`currency` 可选且**建议不配**（见下方币种坑）；`accountName` 纯运维备注。

## 核心代码设计

- 目录 `task/cps/partnerboost/`，与 `blibli/`、`cj/` 平级。
- **时间分片放在 `pageStrategy` 层**：`pullBySlicedDateRange` 外层按 60 天切窗口，内层复用基类
  `pullByPageNumber` 做页码翻页。这样既绕开平台的 62 天限制，又不改基类；`stat` 跨分片累加，统计口径不变。
- `parseResponse` 是唯一响应校验入口，被 `hasMore` 与 `parseOrders` 复用；`status.code != 0` 一律抛
  `ServiceException`。
- `buildOpenCommissionId` 抽成静态方法，`toCpsOrder` 与 `buildPendingSnapshot` 共用（照 CJ 的做法）。
  Blibli 没复用是因为它的同名方法要三个参数、快照处只有拼好的前缀，签名对不上。
- **请求体职责从 `toString()` 挪到 `toRequestBody()`**：token 在 body 里，而 `toString` 还要供日志用。
  `@Data` 生成的 `toString` 本身就带 token，所以必须显式 `@ToString(exclude = "token")` 才能屏蔽。
  这是「优先重写原生方法」规范的例外场景（重写会破坏 toString 的调试用途），Blibli/CJ 无此问题
  （Blibli query 串不含密钥、CJ token 在 header）。
- 分页字段一律按 `String` 接：`total_page` 在空结果时是数字 `0`、有数据时是字符串，类型会漂。

## 踩过的坑 / 反复纠错点

- **transaction 也有 62 天跨度限制，文档完全没写**。实测 102 天窗口返回
  `code=1006 Query time span cannot exceed 62 days`；59 天窗口正常。之前的实测报告只在
  `merchant_commission` 上记了这条，容易误以为只有佣金接口受限。代码按 60 天分片留余量。
- **token 复制时尾部粘上了相邻密码的 `@`**：带 `@` 返回 `code=1000 Publisher does not exist`，
  去掉后 `code=0`。两个 token 实测都是 16 位。另外**无效 token 实测返回 1000 而非文档写的 1001**，
  两者都要当鉴权失败处理。
- **`status` 入参没有服务端校验**：传 `Foo`、`Invalid123` 一律 `code=0`，所以**无法靠接口反推合法枚举**。
  对比 `order_type` 校验很严（传 `Foo` 直接 `code=1003`），文档列的 6 个值全部通过。
  `Normal` 的真实语义至今未验证（两个账号近 360 天无任何订单）。
- **币种有 7 种，不能配固定兜底**：`monetization_api` 全量统计（两账号各 3280/3278 个计划）得
  `USD 2534 / EUR 444 / GBP 162 / CAD 89 / MIX 46 / MXN 3 / CNY 2`，已合作的计划覆盖全部 7 种。
  所以 `ext_config.currency` 配死等于在报文缺 `payment_currency` 时写入错误币种，宁可跳过该条。
  **`MIX` 不是 ISO 4217 币种**，若订单的 `payment_currency` 也可能返回 `MIX`，落库后无法做金额换算，
  待真实数据核。
- **两个账号可推广计划的 `offer_type` 全部是 CPS**，3280 条里没有一条 CPL/CPA/CPC。这也是 provider
  命名从「按计费模式（CPL/CPS）」改成「按账号名」的原因之一：平台侧的 `offer_type` 与我们内部说的
  「这个账号用来跑 CPL」不是一回事，按计费模式命名会误导。
- **漏配 PB 下发侧会静默不下发**：`CPSPbReissueTaskV2` 的 `cpsProviderInfoMap`（XXL-JOB jobParam）
  必须含每个 provider 的 key，未配置的 provider `logErr` 后整组 return。provider 拆成两个后
  **两个 key 都要配**。表现是「拉单正常、库里有数据、联盟侧收不到回传」，且只有 logErr 无告警。
  这一项在最初的 SOP 里被漏掉，是靠回看 CJ 记忆的交叉验证清单才发现的。
- **快照覆盖不会造成重复下发，三重机制挡住了**：① `cps:pb:sent` ZSet 以 `openCommissionId` 防重；
  ② 快照 `setCreateTime(null)`，update 不改写 `create_time`，被覆盖的行不会重新落进按 `create_time`
  筛选的下发窗口；③ `confirmed`/`cancel_confirm` 本就不下发。所以「区分已有 Pending 单独处理」没必要，
  不覆盖反而更糟（库里那行会永久停在中间快照，既不是下发值也不是平台当前值）。
  **残留问题**：金额若在 Approved 时被调整，已下发值与库中值不一致且无留证（`origin_order` 也被覆盖），
  要留证只能另记下发流水表。
- **`cps:pb:sent` 防重只保留一个月**（`zremoveRangeByScore(..., DateUtil.lastMonth().getTime())`）。
  日常跑没问题，但**手工用很早的 `startTime` 补历史数据会重发**一个月前发过的记录。所有 provider 共有。
- **`monetization_api` 传 `limit=2000` 出现过 504**，降到 1000 稳定。transaction 用的 500 暂未遇到问题。
- **review 自查时的判断错误（值得记住的思维错误）**：我曾断言 `parseOrders` 里
  「配置校验先于数据判空」的注释不成立，理由是 client 的 `of()` 一定先抛异常、走不到那里。
  这是错的 —— 那句注释解释的是**这一行为什么放在 `isBlank(responseBody)` 判空之前**（方法自身保证
  「无论有没有数据都先校验配置」），它的价值恰恰在于不依赖调用方行为。我却拿「风险在当前完整链路
  不会发生」去否定「这个位置安排有没有道理」。评审注释或防御代码时，要判断它对本方法自身契约是否成立，
  不能用「当前调用方不会触发」来否定。

## 交叉验证提示

- `cps_account_config` 的三条记录 provider 是否都是带账号名的值。测试库现状（2026-09-14）：
  id=7 `PartnerBoost-jeyuforcps` 已正确；id=5 / id=6 仍是过渡版 `PartnerBoost-CPL` / `-CPS`
  （最初插入是 `PartnerBoost`，UPDATE 由用户执行，未完成）。`token` 是否无尾部多余字符。
- `cpsPbReissueTaskV2` 的 jobParam 是否已含全部三个 provider key —— **这是最容易漏且无告警的一项**，
  且每加一个账号都要补一次。
- 有真实订单后重点核：`status` 的实际取值集合（`Normal` 是否大量出现，看 `fetched` 与 `parsed` 是否相等）、
  `payment_currency` 是否会返回 `MIX`、`comm_rate` 是否带 `%`、`customer_country` 是否二字码、
  `order_time` 时间戳量级（秒 vs 毫秒）。
- 不要重复追问「Pending 已下发后转 Rejected 要不要撤回」：需求方已明确不发核减，见核心业务逻辑对应条目。
- 是否出现 `code=1002`（限流）：当前无退避无重试，一旦触发该账号整体失败、该分片之后的数据丢失。
  请求数 = 分片数 × 每片页数 × 账号数，补数场景会放大。
- `AbstractCpsOrderPullJobHandler#fillOrderTag` 是否仍是 offline/click_id 的统一入口；
  本平台传入的是 `uid`。
