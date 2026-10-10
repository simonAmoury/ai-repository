---
id: pac-platform/tts-th-region-support
scope: project
project: pac-platform
feature: tts-th-region-support
updated: 2026-09-07
tags: [tts, tiktok-shop, th, thb, cps, 金额解析, 币种格式, 字典驱动, v4拉单]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/amount/AmountFormat.java
    symbol: AmountFormat（3 个枚举常量 + of(String)；枚举名即字典配置协议）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/amount/CurrencyAmountHelper.java
    symbol: loadFormatMap() / parse(Map, currency, rawAmount)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/TTSXxlJobHandler.java
    symbol: processOrdersV4（映射加载点）/ buildInnerCommissionAmountV4 / buildOrderAmountV4 / buildOpenCommissionIdV4
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/impl/ThailandTtsChannelServiceImpl.java
    symbol: getCountryCode() 返回 TH；@Value pac.adv.tts.th.appKey/appSecret（无默认值）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/dto/tiktokShop/util/CapOrderCommissionUtils.java
    symbol: buildInnerCommissionAmountV2（老链路，仍硬编码印尼格式 + setScale(0)）
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/CurrencyUtil.java
    symbol: parseIndonesianCurrencyString / parseCurrencyString（老链路，本次未动）
  - table: pac_system.pac_dict（code=cps-currency-amount-format，父项 code=cps-order-config）
  - table: adplatform_test02.tts_creator_auth（TH 行：Appsmoon TH / TH / 7681591702894364437 / suda.yimyam / th-tts-local）
  - table: adplatform_test02.cps_order_commission（order_amount varchar(128)、inner_commission_amount decimal(20,6)）
  - apollo: pac.adv.tts.th.appKey / pac.adv.tts.th.appSecret
---

## 核心业务逻辑

TH（泰国）接入 TTS CPS 拉单，provider = `th-tts-local`。

关键判断：**V2 授权 + V4 拉单这条新链路是数据驱动的，country 只是一个字段，代码里没有任何按地区的分支**。
`TtsChannelFactory` 按 `getCountryCode()` 自动注册、`TtsApiClientFactory` 按 appId 缓存、
`TtsTokenServiceV2` 只校验四元组非空不校验国家取值。所以新增地区**不需要改 Java 代码**，
只需 `tts_creator_auth` 建一条 country 记录 + XXL-Job jobParam 的 `providers` 加一项。

TH 当时唯一的代码缺口是 THB 金额解析。借这个缺口把「币种 → 金额格式」的映射从代码硬编码
改成了系统字典驱动，之后新增币种若复用已有格式即可不发版。

实测的各地区金额字符串形态（符号位置不一致，VND 是后缀）：
`Rp9.890`(IDR) / `RM19.90`(MYR) / `₱39.00`(PHP) / `37.498₫`(VND)。THB 未取到真实报文。

## 核心代码设计

金额解析只有 3 种实际逻辑，5+ 个币种是多对少映射，所以用「枚举承载算法 + 字典承载映射」而非策略 Bean：

- `AmountFormat` 枚举 3 个常量：`COMMA_GROUPING`（逗号千分位/点小数点，MYR·PHP·THB）、
  `DOT_GROUPING_COMMA_DECIMAL`（点千分位/逗号小数点，IDR）、`DOT_GROUPING_NO_DECIMAL`（点千分位/无小数，VND）。
  三者对同一串 `1.234,56` 分别得 `1234.56` / `1.23456` / 不同值——格式选错必然产出量纲错误的金额，
  所以未注册币种一律抛 `ServiceException`，不退化为默认格式。
- 字典 `code=cps-currency-amount-format`，**每币种一行**：`dict_key` 存币种代码、`dict_value` 存枚举名。
  这**违反了本仓库「dict_key 存数据、dict_value 存人类可读名称」的常规约定**（人话写在 `remark`），
  是为规避把整段映射塞进 `dict_key` 时的 varchar(255) 上限，并让单个币种可独立增删。
- **枚举名 = 配置协议**。重命名枚举常量等于改配置，必须同步刷新各环境字典数据。
- 加载点在 `processOrdersV4` 开头，每批（1000 单）一次，向下传 `Map<String,AmountFormat>`。
  不能在 `parse` 内部读字典：V4 是逐 SKU 调 2 次 parse，会变成循环内 Feign/Redis 调用。
  也**不做进程内缓存**——否则改字典 + 清 `DICT_CACHE` 后仍命中旧映射，须重启才生效（同
  `TrackLinkMacroValidator` 的既有结论）。
- 删除了 `CurrencyAmountParser`、`CurrencyAmountParserDispatcher` 及 5 个 `*AmountParser`。
  原 dispatcher 的「同币种重复实现启动即失败」保护改为 `loadFormatMap()` 内的重复检测。
- 老链路（V1/V2/V3 拉单、PB 补发）**一行未动**，仍是硬编码印尼格式，且 V2/V3 佣金 `setScale(0)`
  按 IDR 无小数写死——这是老任务不能直接跑非印尼地区的根因。

失败策略（与改造前一致，宁可失败不要静默算错）：字典读取失败/未配置/格式标识拼错/同币种冲突
→ 抛异常，该维度整批订单不落库（被维度级 catch 兜住，其他 provider 继续，只有日志无告警）；
币种未配置 → 该 SKU 跳过 + error 日志。

## 踩过的坑 / 反复纠错点

- **`pac_dict` 没有 `code+dict_key` 唯一约束**。steering 的「仓库既有事实速查」写着有，实测
  `information_schema.STATISTICS` 只有 `PRIMARY(id)`，无任何唯一索引。而 `DictMapper#getList` 无
  `ORDER BY`，同币种配两行会静默生效随机一行。据此在 `loadFormatMap()` 里补了重复检测。
  **这条 steering 记录是错的，需从 ai-repository 源头修正。**
- `ThailandTtsChannelServiceImpl` 早就存在（不是本次新建），`@Value` 无默认值，Apollo 缺 key 会导致
  `pac-biz-adv` 启动失败。判断「TH 是否已接入」不能只看有没有渠道类。
- **`cps_product_field_mapping_config` 只有 `id-*` 的配置，MY/PH/VN/TH 全都没有**，`cps_standard_product`
  里也没有这些 provider 的数据 → 海外地区只跑 offline 直链拉单，不跑商品标准化链路。
  我一度据此误判「TH 需要补字段映射配置」，实际与已上线地区保持一致即可。
- 判断「某地区是否已在跑」要分链路看：TH 在 `cps_origin_product` 有 458 条（商品拉过），
  但 `cps_order_commission` 一条都没有。两张表的结论不能互推。
- **我用 `Remove-Item -Recurse src/test` 误删了 2 个既有测试文件**（`FeishuDataPushChannelTest`、
  `AdvDateReportServiceImplTest`）。起因是 `file_search "pac-biz-adv/src/test"` 返回「无匹配」，
  我据此判断目录不存在。**`file_search` 的结果不能作为「文件不存在」的依据，要用 `git ls-tree`。**
  已用 `git checkout HEAD --` 原样恢复。
- MySQL 5.7.44 **无 `REGEXP_REPLACE`**，SQL 里剔货币符号只能 REPLACE/SUBSTRING。
- 跨库 JOIN（`adplatform_test02` 与 `pac_system`）**collation 不同**（unicode_ci vs general_ci），
  比较列和 `CONVERT(UNHEX(...))` 的结果都要显式 `COLLATE`，否则报 Illegal mix of collations。
- 多 SKU 订单**不能用 `product_id` 定位到 origin_order 里的 SKU**：实测同一订单 4 个 SKU 的
  `product_id` 完全相同。要用 `open_commission_id` 的中间段（格式 `orderId_skuId_status`）
  取 skuId，再 `JSON_SEARCH(origin_order,'one',skuId,NULL,'$.skus[*].id')` 定位。
- 比对金额要用 `toPlainString()` 而非 `compareTo`：落库取的就是它，`19.90` 与 `19.9` 必须视为不同。

## 交叉验证提示

- 改动前先确认**字典仍是币种格式的唯一来源**、代码里没有被重新加回硬编码兜底映射。
- 核对 `AmountFormat` 枚举常量名是否被改过；改名即改配置协议，要同步查两个环境的
  `pac_dict`（`code=cps-currency-amount-format`）。
- 新增地区时按这个顺序核对：`tts_creator_auth` 有无该 country 行 → Apollo 有无
  `pac.adv.tts.<country>.appKey/appSecret` → 币种是否在字典里 → jobParam 的 `providers` 是否加了。
  **字典必须先于发版配好**，否则 V4 各维度整批不落库且无告警。
- 老链路记忆 `tts-vn-ph-currency.md`、`tts-my-region-support.md` 的 `code_anchors` 指向
  `PhpAmountParser`/`VndAmountParser`/`IdrAmountParser`/`MyrAmountParser`/`CurrencyAmountParser`/
  `CurrencyAmountParserDispatcher`，**这些文件本次已全部删除**，那两份记忆的锚点已失效，
  以本文件为准。

## 本次验证结论（供下次回归参照）

- 新旧等价性：从 git HEAD 恢复原 4 个 parser + dispatcher 与新实现并存，JUnit 9 个用例、
  65 条金额字符串（含库中真实样本与多级千分位/无分隔符/零值边界）全部一致，异常行为一致。
  **唯一已知差异：币种大小写**——旧实现大小写敏感，新实现 `trim`+`toUpperCase` 归一（更宽容）。
- 端到端：`recentDays=3` 跑 4 个 provider 共 40675 行，按 skuId 精确定位复算 `order_amount`
  全量一致、0 条定位失败（id 7375 / my 10900 / ph 11100 / vn 11300）。
  `inner_commission_amount` 的全量复算由用户手动完成。
- **THB 仍未经真实数据验证**：订单表无 TH 记录，格式归到 `COMMA_GROUPING` 是按泰国常规写法
  （`฿1,234.56`）推断。第一条泰区订单落库后应核对 `origin_order` 里的 `price.amount` 字符串。
- 上线 SOP：`.kiro/specs/cps-amount-format-dict/online-sop.md`（含字典录入表格、校验 SQL、冒烟清单）。
