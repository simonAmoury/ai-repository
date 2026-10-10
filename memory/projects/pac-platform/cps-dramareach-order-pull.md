---
id: pac-platform/cps-dramareach-order-pull
scope: project
project: pac-platform
feature: cps-dramareach-order-pull
updated: 2026-10-09
tags: [pac-biz-adv, pac-common, DramaReach, StardustTV, CPS订单, 短剧, RSA签名, PKCS1, BouncyCastle, Hutool-SecureUtil, 单provider多账号, accountName, 汇率, currency_exchange, received_money, commission_rate, offline_tag, fillOrderTag, pending_confirm, EpochMilliUtil, 秒级时间戳, 分页上限, 31天窗口, MyBatis别名冲突, @Alias]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dramareach/DramaReachChargeOrderJobHandler.java
    symbol: provider(DRAMA_REACH) / pageStrategy(pullByPageNumber) / accountDesc(id:accountName) / prepareAccount(刷新 volatile usdRateMap，空表则账号失败) / hasMore(本页有数据即继续) / parseOrders / extractRecords / toCpsOrder(去重键 DramaReach_{appId}_{platformOrderId}_{payTime}; org_custom_params 原样交 fillOrderTag) / fillAmount(price×汇率→USD; 佣金=received_money; rate=佣金/金额×100) / toAmount
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dramareach/DramaReachChargeOrderClient.java
    symbol: buildRequest(继承 AbstractCpsHttpClient，PAGE_SIZE=500) / validateTimeWindow(MAX_NATURAL_DAYS=31，含起止当天)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dramareach/DramaReachOpenApiClient.java
    symbol: chargeOrder(...) / signedPost(补 timestamp 回拨10s + nonce16位；请求体只序列化一次，签名与发送共用)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dramareach/DramaReachSignUtil.java
    symbol: sign(Hutool SecureUtil.sign(SHA256withRSA, key, null)，按私钥缓存 Sign)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dramareach/vo/DramaReachExtConfigVO.java
    symbol: of(accountName/appId/rsaPrivateKey/host 四键必填) / parse / @ToString(exclude=rsaPrivateKey)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dramareach/vo/DramaReachApiResponse.java
    symbol: isSuccess(SUCCESS_CODE=0) / describeError / traceId(@JSONField trace_id)
  - path: pac-biz/pac-biz-adv/src/main/resources/mapper/CurrencyExchangeMapper.xml
    symbol: listLatest(GROUP BY currency + MAX(create_time) 回表，不筛 result_currency)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/CurrencyExchangeServiceImpl.java
    symbol: mapLatestUsdRate
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/entity/CurrencyExchange.java
    symbol: CurrencyExchange(@Alias("AdvCurrencyExchange")，与 pac-biz-job 的 job.domain.entity.adplform.CurrencyExchange 同名)
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/EpochMilliUtil.java
    symbol: parseStartMilli/parseEndMilli/toLocalDateTimeFromMilli/formatMilli(原方法改名) + parseStartSecond/parseEndSecond/toLocalDateTimeFromSecond(新增，floorDiv)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/AbstractCpsOrderPullJobHandler.java
    symbol: fillOrderTag(非 offline 非空 → click_id 放行；空 → 放行不设 tag；offline 缺字段 → false)
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/adv/CPSPbReissueTaskV2.java
    symbol: COMMISSION_ORDER_TYPE=pending_confirm / isValidCommission
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/constant/CpsProviderConstant.java
    symbol: DRAMA_REACH="DramaReach"
  - table: cps_account_config（provider=DramaReach 两行，测试库 id=14 max.nie / id=15 naia.wang）/ cps_order_commission / currency_exchange（adplatform，result_currency 仅 USD，币种代码全大写）
  - path: .kiro/specs/cps-dramareach-order-pull/
    symbol: requirements.md / design.md / online-sop.md / cps_account_config.sql
  - path: D:/access/dramareach/
    symbol: API文档整理.md / 对接评估-DramaReach.md / 实测记录.md
---

## 核心业务逻辑

DramaReach（StardustTV 短剧，`https://cps-api.dramareach.com`）接入既有 CPS 拉单框架，只接充值订单
`POST /openApi/chargeOrder`。**退款不接**：平台退款是独立接口，退款记录无 `pay_time`，挂不回具体续订期。

- **单 provider `DramaReach` 多账号**：同一广告主两个账号 `max.nie`、`naia.wang`，请求与处理完全一致，
  只有凭证不同，`cps_account_config` 各一行。曾叫 `DramaReach-ChargeOrder`，后改名；已插旧名的环境要人工 UPDATE。
- **ext_config 四键**：`accountName`（仅日志标识 `id:accountName`）/ `appId`（放 `X-App-Id`，也进去重键）/
  `rsaPrivateKey` / `host`。`currency` 键已废弃（旧行残留不影响）。
- **私钥格式（用户反复调整后的终态）**：存平台下发 PKCS#1 私钥**去掉 PEM 头尾与换行**的 Base64，
  原样交给 Hutool，不手工 decode、不做格式转换、不额外校验。换密钥直接替换，无需发版。
- **鉴权**：请求头 `X-App-Id`/`X-Sign`/`X-Timestamp`/`X-Nonce`；请求体带 `timestamp`（秒）与 `nonce`
  （6~32 位，防重放，不是追踪用）。`X-Sign` = SHA256withRSA(请求体原始字节) 的 Base64。
  平台只接受 `[now-300s, now+5s]`，timestamp 主动回拨 10 秒。追踪用响应里的 `trace_id`。
- **时间**：按 UTC 切天（用户确认）。`start_time`=起始日 00:00:00，`end_time`=结束日 23:59:59，
  `order_time`=`pay_time` 按 UTC 换算。
- **窗口**：代码限制最多 31 个自然日（含起止当天），不自动分片。
- **分页**：页码递增，`page_size=500`，本页无数据即停。
- **去重键**：`DramaReach_{appId}_{platform_order_id}_{pay_time}`。续订沿用首订的 platform_order_id，
  必须带 pay_time；带 appId 防跨账号覆盖。
- **归因（有意为之，2026-10-09 用户确认）**：建链时 `custom_params` 写完整 offline tag
  `offline___{offerId}_{affiliateId}_xxx`，订单 `org_custom_params` 原样回传，**原样交给基类 `fillOrderTag`**，
  不拼装、不 trim、不额外拦截：offline 齐全 → `offline`；offline 缺 offer/affiliate → 跳过 WARN；
  非 offline 非空（如样例 `test2`）→ 按 `click_id` 落库**并会被 PB 下发**；空 → 落库无 tag、不下发。
- **状态**：`open_status=COMPLETE`，`inner_status=pending_confirm`（PB 下发只扫 pending_confirm）。
- **金额（用户口径）**：`currency` 统一 `USD`；`order_amount` = `price` × `currency_exchange` 该币种最新 USD 汇率
  （2 位）；佣金 = `received_money`（**已确认是我方佣金**）；`commission_rate` = 佣金 / order_amount × 100，
  百分数不带 `%`（与 Blibli `1.3` 同口径），**后台自算，非客户实际比例**。price 非数值或币种无汇率 → 跳过；
  received_money 缺失 → 佣金与比例按 0。订单币种 trim + 转大写后查 HashMap（DB 币种全大写）。

## 核心代码设计

- `dramareach/` 分三层：`DramaReachOpenApiClient`（平台协议层：路径、公共字段、签名，只造请求不发 HTTP，
  新接口在此加方法）→ `DramaReachChargeOrderClient`（CPS 适配：provider、ext_config、日期→秒、窗口校验、页大小，
  HTTP 由 `AbstractCpsHttpClient` 发）→ `DramaReachChargeOrderJobHandler`（解析、归因、金额、落库）。
  曾有 `AbstractDramaReachClient` 基类（为退款预留），删退款后合并掉；客户端曾改名 `DramaReachClient` 又改回。
- 签名：Hutool `SecureUtil.sign(SignAlgorithm.SHA256withRSA, key, null)`，按私钥内容缓存 `Sign`
  （Hutool Sign 签名时内部加锁，javap 确认，可跨线程共用）。PKCS#1 能解析靠 Hutool 自动注册的 BouncyCastle：
  `bcprov-jdk15on:1.68` 经 `pac-starter-log → pac-starter-loadbalance → spring-cloud-starter-loadbalancer →
  spring-security-rsa` **传递引入**，本模块未显式声明。
- 汇率：`ICurrencyExchangeService.mapLatestUsdRate`（adv 侧新建，pac-biz-job 同名实现跨服务不可复用），
  XML `listLatest` 子查询取每币种最新一条，测试库 1.7 万行 → 171 行。Handler 持有一个 `volatile` 共用 Map
  （汇率与账号无关），`prepareAccount` 每账号开跑整体替换。主数据源即 adplatform，无需 `@DS`。
  实体 `CurrencyExchange` 在 adv-api，加了 MyBatis `@Alias("AdvCurrencyExchange")`（`org.apache.ibatis.type.Alias`）：
  pac-biz-job 依赖 adv-api 且自带同名实体，不加则 job 启动报 `TypeException: The alias 'CurrencyExchange' is already mapped`
  （MyBatis 按简单类名注册别名）。先例：trade-api 的 `LogMfRedirect` 用 `@Alias("TradeLogMfRedirect")`。
- `EpochMilliUtil`（pac-common）：原四个方法改名带 `Milli`（调用方 Blibli/ReelShort/PartnerBoost 同步改），
  新增秒级三个方法；PartnerBoost 的「秒×1000」改用 `toLocalDateTimeFromSecond`。
- `ServiceException` 没有 `(String, Throwable)` 构造器：签名异常先 `log.error(..., e)` 再抛只带消息的异常。

## 踩过的坑 / 反复纠错点

- **断言「项目没有 BouncyCastle」不查依赖树**：据此手搓 PKCS#1→PKCS#8 的 DER 包装改了好几轮，
  用户问「有没有现成工具」才查 `dependencies`，发现 bcprov 1.68 早已传递引入。见 global L-029。
- **inner_status 照搬 NetShort 的 `PAID→CONFIRMED`**：NetShort 能下发靠额外的 `UNPAID→pending_confirm` 快照，
  照搬时漏看；`CPSPbReissueTaskV2` 写死只扫 pending_confirm，CONFIRMED 永远不下发。见 global L-030。
- 本需求沉淀的其他全局教训：L-031（删退款后遗留抽象基类）、L-032（私钥格式指令歧义来回四轮）、
  L-033（commission_rate 用取整后金额算）、L-034（重命名工具不改调用方）、L-035（init 脚本 0 字节）、
  L-036（测试期望值手算错）、L-037（自加金额回落/多格式兼容），以及 L-013 / L-022 / L-027 的后续补充。
- **fillAmount 早期版本是我自造的「received_money 优先、回落 price 原币」**，无需求依据，被用户追问来源后整段重写。
- **按文档宣称的「窗口多放行 1 天」缺陷**：真实接口实测平台放行到 90 天（93 天起才报 100004，msg 仍写 31 天）；
  代码仍按文档口径限 31 个自然日，没依赖宽松行为。
- **分页上限实测**：`page` ∈ [1,100]、`page_size` ∈ [1,10000]，与文档一致（不是写反）；越界返回
  `code=1 "wrong number range setting"`，不在文档错误码表。`page_size=500` 单窗口上限 5 万条。
- **新增 `parseEndSecond` 用 `TimeUnit.toSeconds` 截断**，1970 年前负数多 1 秒，对照测试发现后改 `Math.floorDiv`。
- **用户曾称 `CaseInsensitiveMap.get` 取不到**：实测它 get 时也转小写，`get("JPY")` 能取到；按用户要求改成
  HashMap + 查询转大写，等价但依赖「DB 全大写」（已核 171/171）。
- **私钥格式来回四轮**：PKCS#8 离线转换 → 原文 PEM 代码兼容多格式 → 只认 PKCS#1 Base64 手工包装 → Hutool 直接传字符串。
- **Gradle init 脚本经 fs_write 写到 .local 下偶发 0 字节**（`printDrCp` task not found），改用
  `Set-Content -Encoding ascii` 写才稳定。
- **两个账号近 13 个月无订单**（真实接口回溯 `total=0`），`received_money` / `org_custom_params` 真实形态未验证。
- `sql-guard` 不放行 UPDATE；`.kiro/` 在 `.git/info/exclude`，SQL 里的明文私钥不会进 git。

## 交叉验证提示

1. `toCpsOrder` 是否仍原样调 `fillOrderTag`（无额外 offline 拦截）；其 WARN 文案「缺失或不是合法 offline tag」
   与实际触发条件（仅 offline 缺字段）不符，是否已修正。
2. `cps_account_config` 中 DramaReach 行 provider 是否为 `DramaReach`；线上是否按终版 SQL 执行。
3. `cpsPbReissueTaskV2` jobParam 是否含 `"DramaReach": {}` —— 不加只入库不下发、无告警。
4. 线上 `currency_exchange` 是否持续更新（测试库 JPY 停在 2022-07-05，CNY=0.8 明显异常）。
5. BouncyCastle 是否仍在 pac-biz-adv 运行时 classpath（传递依赖，上游变动会让签名运行时失败）。
6. 第一批真实订单：`org_custom_params` 是否原样回传、`received_money` 是否存在、定稿后是否变动（任务只回溯 3 天）。
7. `commission_rate` 用取整后的 order_amount 计算，小额订单失真（实测 JPY 10 → 71.43 vs 67.85），是否需调整。
8. `EpochMilliUtil` 方法名已改，其他分支合并时是否仍有旧名调用。
