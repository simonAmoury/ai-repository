---
id: pac-platform/blibli-offline-tag-separator-fix
scope: project
project: pac-platform
feature: blibli-offline-tag-separator-fix
updated: 2026-09-02
tags: [pac-biz-adv, pac-biz-job, Blibli, offline归因, tag分隔符, ext_params, CPS订单, PB补发, 定向补发, Redis防重, 历史数据修数, MySQL, PAD_SPACE, SUBSTRING_INDEX]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliCpsOrderJobHandler.java
    symbol: restoreOfflineSeparator / toCpsOrder（已删除内联 offline 解析，改调基类 fillOrderTag）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/dto/tiktokShop/util/CapOrderCommissionUtils.java
    symbol: parseOfflineSubparam / OFFLINE_SUBPARAM_SEGMENT_COUNT(=5) / isOfflineTrace / normalizeOfflineTag
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/AbstractCpsOrderPullJobHandler.java
    symbol: fillOrderTag（CJ 与 Blibli 共用的唯一归因实现）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/TTSXxlJobHandler.java
    symbol: 两处 parseOfflineSubparam 调用，ext_params 语义随本次变更
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/CoupangJobHandler.java
    symbol: 私有 parseOfflineSubparam（未纳入本次改动，ext_params 仍只取第 5 段，规则已分叉）
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/adv/CPSPbReissueTaskV2.java
    symbol: executeJob 分流 / reissueByIds / reissueProviderGroup / filterUnsent / isValidCommission / doReissue
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/param/CPSPbReissueTaskV2Param.java
    symbol: commissionIds / skipSentFilter
  - path: .kiro/specs/blibli-offline-tag-separator-fix/上线SOP.md
    symbol: 11 节（人工操作、影响面、验证状态、待确认事项）
  - path: .kiro/specs/blibli-offline-tag-separator-fix/blibli_offline_tag_fix.sql
    symbol: 方案 A（一次性，推荐）/ 方案 B（两步）/ 预览与事后核对
  - table: cps_order_commission（tag/tag_type/offer_id/affiliate_id/ext_params；offer_id 与 affiliate_id 为 varchar(64)，tag 与 ext_params 为 varchar(512)，update_time 带 on update CURRENT_TIMESTAMP）
  - apollo: 无（本次不新增不修改）
---

## 核心业务逻辑

Blibli 回传的 `tags` 首项会把分隔符 `_` **全部**替换为空格，导致 `offline_` 前缀失配，订单被误判为普通
click ID：落库 `tag_type=click_id`，`offer_id` / `affiliate_id` / `ext_params` 全空，PB 无法按 offline 协议下发。

- 真实回传样例：`offline   176879803 16901 m Bli ID zx p cpc0826 351933d2`。
  **`offline` 后是 3 个空格**（已与需求方确认），即原串 `country`、`uniqueId` 两段均为空串；
  第 3 段 `176879803` 落 `offer_id`，第 4 段 `16901` 落 `affiliate_id`，第 5 段及之后落 `ext_params`。
- 修复方向由用户明确指定两点：① Blibli 收敛到公用归因实现；② 还原被替换的分隔符。
- 顺带确定的规则变更：`ext_params` 从「仅第 5 段」改为「第 5 段及之后全部内容」，允许 `affSubId` 自身含 `_`。
  **这是全平台变更**（`parseOfflineSubparam` 被 CJ、Blibli、TTS 共用），TTS 新数据的 `ext_params` 会变长。
- 另外为 `CPSPbReissueTaskV2` 增加按 `cps_order_commission.id` 定向补发能力，可跳过 Redis 防重强制重发。
  用户确认下游 postback **具备幂等**，且 `isReissue` 填 `false`（不带 `create_time`）。

## 核心代码设计

- **空格还原放 Blibli 子类**（`restoreOfflineSeparator`），不放公用工具：这是 Blibli 平台行为，
  放 `CapOrderCommissionUtils` 会连带影响 CJ 的 `shopperId`。仅当 tag 以 `offline `（offline + 空格，
  大小写不敏感）开头时才把全部空格替换为 `_`，其余原样返回，45 位 click ID 与 CJ SID 不受影响。
- **归因解析收敛为一处**：删掉 `BlibliCpsOrderJobHandler` 内联的 15 行 offline 解析，改调基类
  `fillOrderTag(order, restoreOfflineSeparator(tag))`；返回 false 时保留原有 WARN 并跳过整条，
  **日志打原始 tag** 便于与平台回传值对照。
- **`ext_params` 语义变更的实现只有一行**：`content.split("_", -1)` → `split("_", OFFLINE_SUBPARAM_SEGMENT_COUNT)`（值 5）。
  jshell 实测：前 4 段仍按 `_` 精确切分且保留空串，第 5 段保留剩余全部；段数不足时数组长度不足，
  原有 `parseData.length > 4 ? ... : ""` 兜底继续有效。
- **PB 定向补发的三条设计取舍**：
  1. `provider` 取自记录自身，`CPSProviderInfo` 仍按 provider 从 `cpsProviderInfoMap` 查；查不到整组跳过并 ERROR，
     不用默认配置（否则静默漏发 `customFieldMapping` 与 `create_time`）。
  2. 定向分支**不执行** `zremoveRangeByScore`（那是扫描模式的收尾清理，定向跑它属额外副作用）。
  3. **复用 `doReissue` 不改回写逻辑**：下发成功仍 `zAdd` 回写 `cps:pb:sent`。理由是 idList 可能混有从未
     下发过的记录，不回写会让常规扫描再发一次；而重复下发能力由 `skipSentFilter` 控制，不依赖 Redis 无记录。
- `isValidCommission` 在定向分支保留，因此只放行 `inner_status=pending_confirm`。

## 踩过的坑 / 反复纠错点

- **修数 SQL 的段数阈值先写成 `>= 4`，是错的，应为 `>= 3`**。代码 `parseOfflineSubparam` 对
  `offline   176879803 16901`（affSubId 完全缺失、只有 4 段）判定为**合法**并落库（affSubId 取空串），
  `>= 4` 会把这类合法记录漏修。阈值也不能再降：`>= 2` 时 `offline   176879803`（缺 affiliateId）会因
  `SUBSTRING_INDEX` 段数不足静默返回最后一段，实测 `affiliate_id` 被算成与 `offer_id` 相同的值，
  且末尾两个 `<> ''` 校验都通得过 → 写入错值。**阈值必须按代码的合法性判定反推，不能凭 SQL 直觉设。**
- **`LOWER(LEFT(tag,8)) = 'offline '` 会误命中**。库 collation `utf8mb4_general_ci` 是 PAD SPACE 语义，
  实测 `SELECT 'offline' = 'offline '` 返回 `1`，tag 恰为 `offline`（7 字符）时被命中。改用
  `tag LIKE 'offline %'`（LIKE 不做尾部空格填充，实测该串返回 0），且 LIKE 在此 collation 下不区分大小写，
  与代码 `equalsIgnoreCase` 语义一致。
- **「`SET` 里 tag 必须放最后」被我当成正确性前提写进文档，实测其实无关**。三个字段都从第 9 位起取段，
  `REPLACE` 幂等，前 8 位 `offline ` → `offline_` 等长且不参与取段；实测「用原 tag」与「用已还原 tag」
  算出的 content 完全相同。教训：**未实测的保守假设不要写成硬性约束**，会让使用者以为存在不存在的风险。
- **修数只改 `tag` + `tag_type` 是不够的**。这批记录当初走 click_id 分支，offline 三字段从未写入；
  `CPSPbReissueTaskV2.isValidCommission` 对 offline 要求 `affiliateId`/`offerId`/`tag` 均非空，
  只改两个字段会让记录变成「offline 但字段为空」被静默跳过，等于修了一半。**修数必须覆盖下游校验依赖的全部字段。**
- **单测无法直接注入 jobParam**：`AbstractXxlJob` 的 `jobParam` 是私有 `ThreadLocal`，字节码显示它在
  `execute()` 中才 `putfield` 赋值，构造后为 null，`getJobParam()` 返回 null 直接 NPE。
  需反射取 `AbstractXxlJob.class.getDeclaredField("jobParam")` 注入自建 ThreadLocal。
- **`PacRedis.zAdd` 第三参是 `double` 不是 `long`**，Mockito 用 `anyLong()` 匹配不上（报
  Argument(s) are different，实际值显示为 `1.7882...E12`）；`zremoveRangeByScore` 同理，要用 `anyDouble()`。
- **纯单测里 `LambdaQueryWrapper.select(SFunction...)` 会抛异常**（缺 MyBatis-Plus 实体 lambda 缓存），
  表现为该分支被外层 try-catch 吞掉、`service.list` 零交互。需在 `@BeforeAll` 调
  `TableInfoHelper.initTableInfo(new MapperBuilderAssistant(new MybatisConfiguration(), ""), Entity.class)`。
  注意 `wrapper.in(...)` 不受影响，只有 `select(...)` 会挂，容易误判成业务逻辑问题。
- **`commission_rate = 0` 不再是异常信号**：前置 SOP 写「0 说明报文 commission 对象缺失」，
  本次真实数据出现反例——25 条 `rate=0` 全是 `NOT_VALID`，`origin_order` 里 commission 对象存在且平台
  真实返回 `{"amount":0,"maximumAmount":0,"rate":0}`。且 `NOT_VALID` 并非一律归零（有 3 条 rate 非 0）。
- **XXL-JOB jobParam 有 512 字符硬上限**：官方 2.3.0 DDL 中 `xxl_job_info.executor_param` 与
  `xxl_job_log.executor_param` 均为 `varchar(512)`。手动「执行一次」不落 `xxl_job_info`，但调度日志仍写同长度列。
  按本次 jobParam 结构固定部分约 112 字符，只能放约 50 个 7 位 id。超长表现为 JSON 解析失败、任务报错，
  因此**不需要在代码里再加数量校验**（用户判断）。

## 交叉验证提示

动手前重点回读核对：

1. `BlibliCpsOrderJobHandler` 是否仍调基类 `fillOrderTag`、`restoreOfflineSeparator` 的触发前缀是否仍是 `offline `；
   有没有人把空格还原逻辑挪进公用工具（会连带影响 CJ）。
2. `CapOrderCommissionUtils.parseOfflineSubparam` 的 `split` limit 是否仍是 5；
   `OFFLINE_SUBPARAM_SEGMENT_COUNT` 常量是否被改动。改它会同时影响 CJ、Blibli、TTS 三条链路。
3. `CoupangJobHandler` 的私有 `parseOfflineSubparam` 是否已统一（**当前仍分叉，待确认项**）。
4. `CPSPbReissueTaskV2` 的定向分支是否仍保留：provider 未配置整组跳过、不执行 `zremoveRangeByScore`、
   复用 `doReissue` 回写 Redis、`isValidCommission` 只放行 `pending_confirm`。
5. 修数 SQL 的四个条件是否被人「简化」掉：`LIKE 'offline %'`（非等号比较）、下划线计数 `>= 3`、
   末尾两个 `<> ''`、`ext_params` 用 `CHAR_LENGTH`。每一个删掉都会静默出错，理由见 SQL 文件头注释。
6. `cps_order_commission` 的列约束是否变化：`offer_id`/`affiliate_id` 仍为 `varchar(64)`（异常长段会让整条
   UPDATE 报错回滚）、`tag`/`ext_params` 仍为 `varchar(512)`、`sql_mode` 是否仍为 TRADITIONAL 严格模式。
7. 前置需求的 SOP（`.kiro/specs/cps-order-pull-framework/上线SOP.md`）第 6 节 5.1 条
   `commission_rate=0` 的结论是否已按本次反例修订。

## 遗留与待确认

- Coupang V1 的私有 `parseOfflineSubparam` 是否与公用工具统一（`ext_params` 规则当前分叉）。
- 前置 SOP 的 `commission_rate=0` 排障结论是否按本次反例改写。
- 定向补发是否需要支持下发 `cancel_confirm`（当前被 `isValidCommission` 挡下）。
- `pac-biz-job` 的临时单测文件与 `build.gradle` 末尾的 `TEMP-VERIFY` 测试开关：会话结束时仍在，
  7 个用例中 4 通过、3 失败的根因已修（反射注入、`anyDouble`、`TableInfoHelper`）但未重跑。
  下次接手先决定「跑绿保留」还是「清理」，不要让临时开关随代码提交。
- 落库链路已实测（30 条 offline 逐字段回算零差异、133 条 COMPLETE 快照全配对、0 条漏判），
  但 **PB 定向补发未在真实环境跑过**，首次使用先 `mockReissue=true`。
