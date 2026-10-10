---
id: pac-platform/block-blast
scope: project
project: pac-platform
feature: block-blast
updated: 2026-08-24
tags: [git-history, simon.ye, block_blast]
code_anchors:
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/config/BlockBlastConsumeConfig.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/dto/ConsumeData17342DTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/dto/ConsumeData17342Wrapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/dto/selectdb/BlockBlastConsumeDataDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/entity/ConsumeData.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/entity/selectdb/AdsAofTecTrackingDataDf.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/entity/selectdb/BlockBlastConsumeData.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/enums/ConsumeDataDimensionEnum.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/enums/ConsumeDataSourceEnum.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/jobs/BlockBlastConsumeDataLoaderJob.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/jobs/ConsumeDataResponse.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/jobs/custom/BlockBlastCustomDataFactory.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `block_blast`，共 13 条 Simon 提交，时间范围为
2025-12-30 至 2026-01-12。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `a2a7715e`（2025-12-30）：feat[block_blast]: 查询处理
- `19d7ce43`（2025-12-31）：feat[block_blast]: 洗数
- `a3838a44`（2026-01-04）：feat[block_blast]: 造数完善+页面接口
- `d5d1d2ef`（2026-01-05）：feat[block_blast]: 造数完善
- `6de83c88`（2026-01-07）：feat[block_blast]: 修改库为test
- `8d927a07`（2026-01-07）：feat[block_blast]: 洗数调整（向下取整）
- `8f0b2b89`（2026-01-07）：feat[block_blast]: 修改库为test
- `a2c6619d`（2026-01-07）：feat[block_blast]: 洗数调整+查询
- `416538ff`（2026-01-08）：fix[block_blast]: channel赋值,唯一键修正
- `5a1195e3`（2026-01-08）：feat[block_blast]: 数据源逻辑调整
- `fce2108c`（2026-01-09）：feat[block_blast]: 占比调整
- `6a212787`（2026-01-12）：feat[block_blast]: 剔除代码
- `db8a91c9`（2026-01-12）：feat[block_blast]: 剔除代码

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `a2a7715e`：涉及 7 个文件；新增证据：`@TableName(value = "consume_data")`；`private String channel;`；`private String siteId;`；`CHANNEL("channel"),`；`SITE_ID("siteId"),`；`@Mapper`
- `19d7ce43`：涉及 10 个文件；新增证据：`@Data`；`public class BlockBlastConsumeConfig {`；`private List<String> pidList;`；`private Map<String, CtrRange> countryCtrRangeMap;`；`private Map<String, specifiedCtrRule> countrySpecifiedCtrMap;`；`@Data`
- `a3838a44`：涉及 6 个文件；新增证据：`supplyImpression(value, dto);`；`dto.setClick(value.getClicks());`；`dto.setClick(0L);`；`dto.setInstall(0L);`；`dto.setConversion(0);`；`dto.setImpression(fakeImpression(source, dto, clickGap, ctr));`
- `d5d1d2ef`：涉及 1 个文件；新增证据：`if (min >= max) {`；`minList.add(Optional.ofNullable(dto.getImpression()).orElse(0L));`；`maxList.add(countImpression(source.getClicks(), getBlockBlastConsumeConfig().getCtrRange(dto.getCountry()).getMin()));`
- `6de83c88`：涉及 2 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `8d927a07`：涉及 1 个文件；新增证据：`return Objects.nonNull(ctr) && BigDecimal.ZERO.compareTo(ctr) != 0 ? BigDecimal.valueOf(click).divide(ctr, 4, RoundingMode.HALF_DOWN).longValue() : 0L;`
- `8f0b2b89`：涉及 2 个文件；新增证据：`insert into test.block_blast_consume_data (report_time,`
- `a2c6619d`：涉及 13 个文件；新增证据：`@Data`；`public class BlockBlastConsumeDataDTO {`；`private LocalDate date;`；`private Integer timezone;`；`private String appId;`；`private String campaign;`
- `416538ff`：涉及 2 个文件；新增证据：`consumeData.setChannel(source.getChannel());`；`concat(a.country,'_', a.platform, '_',a.channel,'_', a.site_id,'_', a.campaign,'_', a.app_id,'_', a.date) = b.unique_key`
- `5a1195e3`：涉及 5 个文件；新增证据：`@DS("selectDbAdsEnv")`；`@DS("selectDbAdsEnv")`；`insert into block_blast_consume_data (report_time,`
- `fce2108c`：涉及 3 个文件；新增证据：`private List<String> noNeedCountrySpecifiedCtrList;`；`private Integer greaterThanSpecifiedValueCount = 0;`；`private Integer totalCount = 0;`；`if (getBlockBlastConsumeConfig().getNoNeedCountrySpecifiedCtrList().contains(country)) {`；`return randomCtrWithSpecifiedCtr(ctrRange, getBlockBlastConsumeConfig().getCountrySpecifiedCtrMap().get("others"));`；`wrapper.setGreaterThanSpecifiedValueCount(wrapper.getGreaterThanSpecifiedValueCount() + (ctr.compareTo(specifiedCtrRule.getSpecifiedCtr()) > 0 ? 1 : 0));`
- `6a212787`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `db8a91c9`：涉及 3 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 27 个文件；当前仍可在 `master` 定位 26 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/config/BlockBlastConsumeConfig.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/dto/ConsumeData17342DTO.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/dto/ConsumeData17342Wrapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/dto/selectdb/BlockBlastConsumeDataDTO.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/entity/ConsumeData.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/entity/selectdb/AdsAofTecTrackingDataDf.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/entity/selectdb/BlockBlastConsumeData.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/enums/ConsumeDataDimensionEnum.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/enums/ConsumeDataSourceEnum.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/jobs/BlockBlastConsumeDataLoaderJob.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/jobs/ConsumeDataResponse.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/jobs/custom/BlockBlastCustomDataFactory.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/jobs/custom/BlockBlastCustomResponseFactory.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/mapper/ConsumeDataMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/mapper/selectdb/AdsAofTecTrackingDataDfMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/mapper/selectdb/BlockBlastConsumeDataMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/service/AdsAofTecTrackingDataDfService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/service/IBlockBlastConsumeDataService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/service/custom/AdvConsumeDataCustomProcessorFor17342.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/service/impl/AdsAofTecTrackingDataDfServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/service/impl/BlockBlastConsumeDataServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/consumedata/vo/ConsumeDataVOFor17342.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/utils/BeanMapUtil.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/application.yml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/ConsumeDataMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/selectdb/AdsAofTecTrackingDataDfMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/selectdb/BlockBlastConsumeDataMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
