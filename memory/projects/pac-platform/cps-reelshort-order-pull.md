---
id: pac-platform/cps-reelshort-order-pull
scope: project
project: pac-platform
feature: cps-reelshort-order-pull
updated: 2026-09-20
tags: [pac-biz-adv, pac-foreign, pac-common, ReelShort, RS-Boost, CPS订单, 短剧, 单provider多账号, 推广位归因, promotion_type, offline_tag, PST, 无状态字段, 佣金率换算, cps_account_config, 飞书电子表格, wiki_get_node, SheetRecord, accountDesc, prepareAccount]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/reelshort/ReelShortOrderJobHandler.java
    symbol: provider(REEL_SHORT) / pageStrategy(pullByPageNumber) / prepareAccount(读映射，无可用行则抛异常) / clearAccount / accountDesc(id:accountName) / loadAttributionMap(按 PROMOTION_COLUMNS 展开) / buildAttributionKey(type_原始值，仅 trim) / readAttributionSheet(locate+read) / resolveAttribution(config, record) / hasMore / parseOrders / toCpsOrder(查不到归因则跳过该条) / buildOfflineTag / buildOpenCommissionId(ReelShort_orderId) / parsePstDateTime
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/reelshort/ReelShortOrderClient.java
    symbol: buildRequest（POST /v1/order/list，app_key/app_secret 走 header，PAGE_LIMIT=100 包私有供 handler 判页）/ shiftDate（窗口 start-1/end+1）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/reelshort/vo/ReelShortExtConfigVO.java
    symbol: of(五键必填) / parse(不校验，返回非 null 空实例) / attributionSheetUrl 字段
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/reelshort/vo/ReelShortOrderVO.java
    symbol: order_id / money / order_time(PST) / promotion_type / promotion_value（报文只有这5个字段）
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/SheetRecord.java
    symbol: parse(rows, requiredColumns...)（首行表头、按列名取值、全空行跳过、带 rowNum）/ get / getRowNum
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/AbstractCpsOrderPullJobHandler.java
    symbol: prepareAccount(void，抛异常即账号失败) / clearAccount(最外层 finally，必执行) / accountDesc / safeAccountDesc / runAccount / summarize
  - path: pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/feishu/feign/IFeiShuWikiClient.java
    symbol: locateSheet（/fs/wiki/sheet/locate，wiki URL -> spreadSheetToken + sheetId）
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/service/impl/FeiShuWikiServiceImpl.java
    symbol: objToken(appId, wikiNodeToken) / locateSheet(解析 URL + 缺 sheet 参数时取 index 0 工作表)
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/service/impl/IFeiShuBitableServiceImpl.java
    symbol: getAppToken（本次改为委托 IFeiShuWikiService.objToken，消除重复 get_node）
  - path: .kiro/specs/cps-reelshort-order-pull/online-sop.md
    symbol: 第一节第5项(归因映射表+失败/跳过分层) / 第二节(pac-foreign 先于 pac-biz-adv) / 第四节已知限制13条
  - table: cps_account_config（ReelShort 多行，测试库 id=8/9；ext_config 七键含 attributionSheetUrl）/ cps_order_commission（未改结构）
  - path: D:/access/reelshort/RS-Boost接口文档.md
    symbol: 订单列表 /v1/order/list，promotion_type 四种取值
---

## 核心业务逻辑

ReelShort（短剧 CPS，api-cps.reelshort.com，文档称 RS-Boost）接入既有 CPS 拉单骨架。

- **接口**：`POST /v1/order/list`，`app_key` / `app_secret` **走请求头**（无签名）。业务成败一律
  HTTP 200 + 响应体 `code`（0 成功）。分页按页码，`limit=100` 实测可用。
- **报文只有 5 个字段**：`order_id`、`money`、`order_time`(PST)、`promotion_type`、`promotion_value`。
  不返回状态、币种、国家、佣金、佣金率、点击标识。
- **单 provider `ReelShort`**：两个主账号（connieforcps / melrose.chen）及子账号都是同 provider 多行配置，
  账号维度只由 `ext_config.accountName` 体现（**仅日志标识**，不参与业务）。新增账号只加一行 SQL。
- **归因按「推广位」对齐**（2026-09-20 重新定义，此前是账号级）：订单的 `promotion_type` + `promotion_value`
  去飞书映射表查 `offerId` / `affiliateId`。
  映射表列：`offerId`、`affiliateId`（必需）+ `link_app`、`link_book`、`code`（推广位标识，可选）+
  `accountName`（仅可读性）。
  **关键：三个推广位列的列名与 `promotion_type` 取值完全一致**，所以不需要类型→列名映射，
  直接用 promotion_type 当列名查；加一列 `web_iframe` 就自动支持该类型，无需发版。
  一行 = 一个推广位组合，三种标识共用同一组 offerId/affiliateId，加载时各展开成一个条目。
- **键构造用原始内容**（2026-09-21 用户拍板）：`promotion_type` + `_` + 表格/报文里的推广位标识原文，
  仅 `StrUtil.trim` 去首尾空白，**不截断、不做任何归一化**。曾实现过「取最后一个 `/` 之后的部分」
  以兼容「表里存完整短链、报文只回短码」，用户明确要求改为原样全等匹配：格式不一致时由运营改表格，
  代码侧不兼容。
  格式旁证（2026-09-21，用户从 RS 后台抓包）：某按书/按日汇总报表接口返回
  `promotion_type=link_book`、`promotion_value=https://reelslink.com/cps/FpDO1o`，
  即**完整短链地址、无 query 参数**，与表格登记形态一致 → 原样全等匹配成立。
  ⚠️ 该报文字段为 `date`/`book_title`/`order_cnt`/`total_revenue`/`book_id`，**不是 `/v1/order/list`**
  （后者 5 字段：order_id/money/order_time/promotion_type/promotion_value），只能算同名字段旁证，
  order/list 自身仍未用真实订单核对。不一致则全部订单被跳过。
  同一份抓包还暴露：后台在投的 link_book 有 `FpDO1o`、`ivmUgv`，而映射表只登记了 `OPD9Kf` → 表格漏配。
- **失败与跳过分两层**（2026-09-20 用户确认）：
  - 读表失败 / 缺 offerId·affiliateId 列 / 整表无可用行 → **该账号失败**并触发任务告警
  - 单笔订单查不到推广位（含 web_iframe） → **跳过该条 + WARN**，其余正常落库
- **状态固定**：`open_status`=`COMPLETE`（自造值），`inner_status`=`pending_confirm`，不做状态快照。
- **金额**：`money` 是订单金额，佣金率取 `ext_config.commissionRate`（50，百分数原值），
  佣金 = money × rate / 100（scale 6）。新表已去掉「分佣比例」列，不与 ext_config 冲突。
- **去重键 = `ReelShort_{order_id}`**；同一订单永远一行，后拉覆盖先拉。PB 侧去重按
  `ad_order_number` + country，与 `unique_id` 无关，故 tag 不必塞 order_id。
- **时间**：接口全按 PST。服务器 0 时区，请求起止各外扩一天；`order_time` 按固定 UTC-8 解释后转 UTC 落库。
- `promotion_value` 同时落 `product_id` 与 `origin_order`。`order_country`、`adv_id` 不赋值。
  `app` 固定 `reelshort`。
- ext_config 七键：`host` / `appKey` / `appSecret` / `currency`(USD) / `commissionRate`(50) /
  `accountName` / `attributionSheetUrl`（飞书 **wiki 形式**地址栏 URL）。
  读表用的飞书应用走 Apollo `feishu.bop-notice.appId`（与 Bitable 共用，pac-foreign 与 pac-biz-adv
  同 namespace；无默认值，缺则启动失败）。

## 核心代码设计

- `task/cps/reelshort/`：`ReelShortOrderJobHandler` + `ReelShortOrderClient` 各一个 `@Component`，
  无抽象类与薄子类（曾做过 2 provider + 4 薄子类，后合并成单 provider）。
- **账号级准备用基类钩子，不塞进 pageStrategy**：基类加了 `prepareAccount(config, stat)`（void，
  抛异常即账号失败）与 `clearAccount(config)`（**最外层 finally，必执行**）。
  ⚠️ 曾把读映射塞进 `pageStrategy`（仿 PartnerBoost 的 `pullBySlicedDateRange`），被指出
  「分页策略与基础信息准备混在一起」——那个类比不成立，PB 那个是纯翻页逻辑。
- 映射缓存 `Map<accountId, Map<推广位键, 归因>>`（`ConcurrentHashMap`），账号线程自己写、
  `clearAccount` 清理。⚠️ `ConcurrentHashMap` 不允许 null 值。
- **读表链路**：`IFeiShuWikiClient.locateSheet(wikiUrl)` → `IFeiShuExcelClient.querySheetData`。
  每账号 2 次对 pac-foreign 的调用。
- **`SheetRecord`（pac-common 新增）**：把「首行表头 → 按列名取值」这段通用逻辑从业务类抽出，
  `parse(rows, requiredColumns...)` 负责表头校验、单元格文本化、全空行跳过，并带 `rowNum`
  （1 基含表头，与表格显示一致，便于 WARN 指引运营定位）。业务类只剩组装 VO。
  入参是纯 JDK 类型，与飞书/CPS 无关，故放 pac-common。
- **`accountDesc` 扩展点**（基类）：默认返回主键 id，ReelShort 覆盖成 `id:accountName`；
  `safeAccountDesc` 兜异常回落主键；`CpsAccountPullStatVO.accountDesc` 在 `doExecute` 算一次、
  7 处日志复用。**日志文案未改**（仍 `accountId={}`），其他平台输出完全不变。
- **pac-foreign 新增 wiki 能力**：`IFeiShuWikiService.objToken` + `locateSheet`；顺带把
  `IFeiShuBitableServiceImpl.getAppToken` 改为委托它，消除两份 `get_node`。
  `locateSheet` 只认 `/wiki/` 形式；URL 带 `?sheet=` 用它，否则用
  `IFeishuExcelService.querySheet(sheetIndex=0)` 取首个工作表。
- `ReelShortExtConfigVO`：`of()` 做拉单必填校验（先 `notBlank(json)` 再校验字段），
  `parse()` 不校验且**返回非 null 空实例**，供只取个别字段的场景（日志标识、表格链接）。
  两个 `xxxOf` 方法已合并成 `parse`，顺带修掉「同一段 JSON 解析两遍」。
- `parseOrders` 里配置校验先于数据判空，否则「配置缺字段 + 当前窗口无订单」会被判成账号成功。

## 踩过的坑 / 反复纠错点

- **`IFeiShuExcelClient`（`/fs/excel`）底层其实是飞书，不是钉钉**。实现类
  `DingtalkExcelFeiShuAdapterOriginalController` 标 `@Deprecated`、包在 `sheet.dingtalk`、
  注释写「底层调用钉钉api」，但 `ICloudExcelService` 的两个实现里 `LarkSheetServiceImpl`（飞书）
  标了 `@Primary`、钉钉实现的 `@Primary` 被注释掉，Spring 多候选时 `@Primary` 优先于字段名匹配；
  且 `translateSpreadsheetToken2DingWorkbookId` 开头 `if (1 == 1) return`，token 原样透传。
  我据类名断言它读钉钉，多写了一套 Feign 契约又删掉。判断底层实现要看实际 Spring 绑定（`@Primary`、条件装配）和方法体，不能看类名、包名、注释。
- **`/fs/excel` 的 `querySheet` 只按 sheetName 过滤**，不认 `sheetIndex`；pac-foreign 内部的
  `IFeishuExcelService.querySheet` 支持 sheetIndex。两条链路不同，「取首个工作表」只能走后者。
- **wiki URL 里没有 spreadsheetToken**：`/wiki/{nodeToken}` 是知识库节点 token，表格 token 是
  `obj_token`，必须调 `wiki/v2/spaces/get_node` 换（实测 `obj_type=sheet`）。sheetId 也不在 URL 里
  （除非带 `?sheet=`）。所以「ext_config 存 URL」必然要一次 get_node。
- **飞书权限是两件独立的事**：① 应用 scope（`sheets:spreadsheet:readonly` + `wiki:wiki:readonly`，
  开通后要创建版本并发布、自建应用需管理员审核）；② 把应用加为该**知识库**的可读成员。
  实测处理前分别报 `131006 node permission denied` 与 `1310213 No view permission`。
  ⚠️ 换一张不在已授权知识库里的新表（`/sheets/BR32scL7...`）同样报 `1310213`，需单独分享给应用。
- 🔴 **`/fs/excel/sheet/data/query` 忽略请求体里的 `appId`**（2026-09-21 查明，本需求最大的设计缺陷）：
  `DingtalkExcelFeiShuAdapterOriginalController.querySheetData` 调
  `v2DingtalkExcelFeiShuAdapterController.readValues(spreadSheetToken, range.toString())`，
  **没有把 `dto.getAppId()` 传下去**（`ICloudExcelService.readValues` 签名里也没 appId 参数）；
  底层 `LarkSheetServiceImpl` 在 `@PostConstruct` 用自己的 `@Value("${feishu.excel.app.id}")` 取定 client。
  而 `/fs/wiki/sheet/locate` 走 `FeiShuWikiServiceImpl` → `FeishuExcelServiceImpl`，那条是
  `requireClientByAppId(dto.getAppId())`，**尊重入参**。
  ⇒ ReelShort 读表一个流程用了两个 appId 来源：locate 用 `feishu.bop-notice.appId`，
  读数据用 `feishu.excel.app.id`。`dto.setAppId(feishuAppId)` 对读数据那步是死参数。
  **实测排除的两个误判**：① 不是 token/range 问题——同参数直连飞书 `sheets/v2 values` 能读通；
  ② 不是 `AccessTokenType.App` 问题——a403 的 app_access_token 与 tenant_access_token
  直连读同一张 wiki 内表格都是 `code=0`。请求体传 a403 与 a410 结果都是 403/91403，
  正是「appId 未被传下去」的直接体现。
  处置方案待用户定（补授权 `feishu.excel.app.id` / 新增尊重 appId 的读数据端点 / 统一读同一个 key）。
  ⚠️ 与上面「`/fs/excel` 底层是飞书」是同类问题：上次是「底层调用谁」，这次是「入参有没有被传下去」。
  调用内部接口时，要顺着调用链确认每个入参确实传到了底层，不能看 DTO 有这个字段就认为生效。
- **「BOP通知」测试与生产是两个不同的飞书应用，appId 不同**（2026-09-21 踩到）：
  `cli_a403cb3e6bfa900e`=测试（= `FeiShuAppConstant.AppEnum.BOP_NOTICE` 硬编码值），
  `cli_a410e87d4a94500e`=生产（见 `LarkSheetServiceImpl` 上 `feishu.excel.app.id` 的注释）。
  知识库授权按 appId 逐个生效，只给 a403 放开过。用 a410 调 `/fs/excel/sheet/data/query`
  实测 `httpStatusCode: 403, errorCode: 91403, Forbidden`；同一 spreadSheetToken + sheetId 换成 a403
  读取 `code=0` 并拿到数据，证明 token/range 无问题、差异只在 appId。
  **403 的排查顺序**：① appId 是否用混环境 —— 未配 secret 的 appId 会被
  `FeishuExcelServiceImpl.requireClientByAppId` 先拦成「飞书应用未配置」、到不了飞书，所以能报 403 的
  必然是「有 secret 但没授权知识库」；② `spreadSheetToken` 是否是 locate 换出的 obj_token
  而非 wiki 地址栏的 node_token（两者都是 27 位、肉眼无法区分，拿错也是 403）；③ 才查 scope 与知识库成员。
  ⚠️ 上线前必须核对 Apollo **生产** namespace 的 `feishu.bop-notice.appId` 实际值并给该 appId 授权。
- **表定位与范围实测**（2026-09-21，wiki `QqFawbYrliABcJkuK09cd2f1n4g`
  「41841-Reelshort 子账户管理list」）：obj_token=`ODmAsbFGVh04nxt9CubcwBePnth`、
  唯一工作表 sheet_id=`7c5aef`（index 0, Sheet1, 200 行 × 28 列）。
  表头实际顺序：`accountName, link_app, link_book, code, offerId, affiliateId, 备注`，H 及之后无表头。
  **range 行数超出表实际行数不报错**：`A1:H500` 返回 500 行、尾部补 null，非空行 2 行。
  ⚠️ 表有 28 列但代码只读到 H(8)，新增 `web_iframe` 列必须落在 A–H 内。
  ⚠️ `link_app`/`link_book` 是 url 型富文本（`[{link,text,type:url}]`），本表 link 与 text 相同
  （都是完整短链），经 `LarkSheetServiceImpl.readCellValues` 取 text 后得到完整 URL 字符串 →
  与「原样全等匹配」口径自洽。`code` 列是 JSON number（4697622），`String.valueOf` 得 "4697622" 无小数点。
- **富文本单元格**：映射表的 accountName 列曾是 `mailto:` 超链接。当前链路
  `LarkSheetServiceImpl.readCellValues` 对 url 类型取 **text**（得到邮箱），而 pac-foreign 另一条
  `FeishuExcelServiceImpl.cellToText` 取 **link**（得到 `mailto:` 前缀）。两条链路语义不同，换实现会踩到。
- **数字单元格不会变科学计数法**：`readCellValues` 用 `String.valueOf`，Jackson 整数转 Integer/Long。
- **`offline___{offerId}_{affiliateId}_` 连续三个下划线是对的**：协议
  `offline_{country}_{uniqueId}_{offerId}_{affiliateId}_{affSubId}`，country 与 uniqueId 留空所致。
- **曾误判 unique_id 会撞车**：`unique_id = md5(tag)[0,16)`，但 PB 侧去重按 `ad_order_number` + country，
  与 unique_id 无关（用户澄清）。教训：看到「某字段像唯一键」先确认下游实际拿它做什么。
- **provider 粒度反复过一轮**（2 个 → 1 个）。判断「某维度该不该进 provider」看三条：
  ① provider 值会随 postback 下发（`buildCommonPostbackParams` 里 `put("provider", provider)`），
  需要对外分辨的才进；② 该维度是否已有别的字段能唯一确定；③ 变化频率。
  ⚠️ 我曾把「provider 会下发」当成「联盟侧需要用它区分」的证据，那是推断不是事实。
- **需求在实现过程中改了三轮**：归因从「账号 → offer」改成「推广位 → offer」；映射表换过 3 个链接
  （旧 wiki 表 → `/sheets/` 表（无权限）→ 新 wiki 表）；表头从 3 列变成 7 列。
  每轮都要同步改代码 + SOP + 记忆，**不要在需求未定型时急着补全文档细节**。
- **测试库两行指向两张不同的表**（id=8 → `Dn5ewYf0...`，id=9 → `QqFawbYr...`）。曾以为 id=9 那张是旧表头
  会失败，2026-09-20 实测两张表的表头与数据**完全一致**（均为新结构），两个账号都能正常加载。
  多账号既可共用一张表也可各配一张，代码按各自 URL 分别读取。
  ⚠️ 但两张表的数据行目前都只有 `melrose.chen@tec-do.com` 那一行，connieforcps 若有自己的推广位
  需要另外补行，否则它的订单会因查不到推广位被全部跳过。
- **`sql-guard.json` 只放开 SELECT/INSERT/CREATE/SHOW/DESCRIBE**，改 provider / ext_config 的 UPDATE
  都要人工执行。
- **工作区外资料读不了**：`D:\access\reelshort` 下文件必须先 `Copy-Item` 到工作区再读。
- **该客户至今无订单**：实测 2026-09-03~09-10 `total=0`，字段行为、跨度上限、limit 上限、限流全未实测。
- 本次只验证到 `compileJava` BUILD SUCCESSFUL；飞书侧用 OpenAPI 实测通过（两种 URL 形式、新旧两表、
  get_node + sheets/query + 读值），Java 链路（Feign → pac-foreign → 飞书）与 ReelShort 订单接口的
  Java 调用均未真实跑过。

## 交叉验证提示

1. `cps_account_config` 中 `provider='ReelShort'` 各行的 `attributionSheetUrl` 指向的表是否都是新表头
   （含 `link_app`/`link_book`/`code`）；表里是否有各账号自己的推广位行（不只 melrose.chen 那一行）。
2. 映射表表头是否仍是 `offerId`/`affiliateId`/`link_app`/`link_book`/`code`；行列是否仍在 `A1:H500` 内。
3. **`promotion_value` 的真实格式**是否已用真实订单核对（完整链接 / 短码 / 带 query 参数），
   是否与表格里登记的值逐字符一致（`buildAttributionKey` 按原始内容全等匹配，不做截断兼容）。
   这是最大未验证点。
4. `cpsPbReissueTaskV2` 的 jobParam 是否含 `ReelShort` key —— 最容易漏且无告警。
5. Apollo `feishu.bop-notice.appId` 是否仍存在、对应应用是否仍有该表的读权限与 scope。
6. `open_status`/`inner_status` 是否仍是固定值；平台若开始返回真实状态则整套设计要重做。
7. `PAGE_LIMIT=100` 是否仍与 `hasMore` 判定同源。
8. 是否已实测日期跨度上限；若有上限需在 `pageStrategy` 外再套分片（参考 PartnerBoost）。
9. `order_time` 的 PST 偏移是否仍固定 -8、是否已确认夏令时口径。
10. 基类 `prepareAccount` / `clearAccount` / `accountDesc` 三个扩展点是否还在、是否有其他平台覆盖。
11. `IFeiShuWikiService.objToken` 是否仍被 Bitable 复用（改它会同时影响 pac-bop-admin 的多维表格读取）。
12. `locateSheet` 是否仍只支持 `/wiki/` 形式；若配置换成 `/sheets/` 形式需要扩展。
13. 下发是否仍走 V2；若切回 V1（按 adv_id 过滤），本平台订单一条都发不出去。
