---
id: pac-platform/mix-group-management
scope: project
project: pac-platform
feature: mix-group-management
updated: 2026-08-24
tags: [git-history, simon.ye, mixGroup]
code_anchors:
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagPageDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagV2DTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixEchoVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixOfferCheckVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixSourceTagPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MixSourceTagConfigController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixConfigOfferGroupInfo.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixOfferGroupSourceTagMapping.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/MixConfigOfferGroupInfoMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/MixOfferGroupSourceTagMappingMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/MixSourceTagConfigMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `mixGroup`，共 18 条 Simon 提交，时间范围为
2025-04-28 至 2025-05-07。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `f5043598`（2025-04-28）：feat[mixGroup]: 混量组合90%
- `024858fe`（2025-04-29）：feat[mixGroup]: 校验调整
- `6d8fb887`（2025-04-29）：feat[mixGroup]: 混量组合100%
- `72428ee0`（2025-04-29）：feat[mixGroup]: 修改字段名
- `b0c1c2fc`（2025-04-29）：feat[mixGroup]: 校验增加
- `bc3f3cf8`（2025-04-29）：feat[mixGroup]: 混量组合90%
- `08ac1d75`（2025-04-30）：fix[mixGroup]: bug修复
- `11953f9a`（2025-04-30）：fix[mixGroup]: bug修复
- `13b635ce`（2025-04-30）：fix[mixGroup]: bug修复
- `245ed224`（2025-04-30）：fix[mixGroup]: bug修复
- `49814fef`（2025-04-30）：fix[mixGroup]: bug修复
- `66b2a98e`（2025-04-30）：fix[mixGroup]: bug修复
- `98a32484`（2025-04-30）：fix[mixGroup]: 刷新子渠道记录人信息
- `b7324b47`（2025-04-30）：feat[mixGroup]: 补充定时任务
- `d0ebd5be`（2025-04-30）：fix[mixGroup]: bug修复
- `e39977c5`（2025-04-30）：fix[mixGroup]: bug修复
- `f4e007cd`（2025-04-30）：fix[mixGroup]: bug修复
- `65e66e52`（2025-05-07）：fix[mixGroup]: 导出表头调整

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `f5043598`：涉及 17 个文件；新增证据：`@ApiModelProperty(value = "offer组名称搜索")`；`private String offerGroupName;`；`@Data`；`@Builder`；`@NoArgsConstructor`；`@AllArgsConstructor`
- `024858fe`：涉及 6 个文件；新增证据：`@Data`；`@ApiModel("混量offer校验结果")`；`private List<OfferInfo> offerInfoList;`；`private String errorMsg;`；`@Data`；`public static class OfferInfo {`
- `6d8fb887`：涉及 4 个文件；新增证据：`private String randomSeed;`；`private String randomSeed;`；`@Builder`；`config.setFixedFunction(StringUtils.isNotBlank(dto.getSourceValue()) ? dto.getSourceValue() : generateFixedFunction(dto.getBatchSize()));`；`config.setRandomSeed(StrUtil.isNotBlank(dto.getRandomSeed()) ? dto.getRandomSeed() : generateMixRandomSeed());`；`dto.setRandomSeed(generateMixRandomSeed());`
- `72428ee0`：涉及 2 个文件；新增证据：`private Boolean supportGroup;`；`result.setSupportGroup(checkIsSameAdv(offerIds));`
- `b0c1c2fc`：涉及 2 个文件；新增证据：`@ApiModelProperty(value = "是否可以进行offer打包，ture为可以，false为不行")`；`private Boolean isOfferGroup;`；`result.setIsOfferGroup(checkIsSameAdv(offerIds));`；`private Boolean checkIsSameAdv(List<Integer> offerIds) {`；`return advIdSet.size() <= 1;`
- `bc3f3cf8`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `08ac1d75`：涉及 2 个文件；新增证据：`voList.forEach(vo -> {`；`if (vo.getPeriodCount() == 0 && StringUtils.isNotEmpty(vo.getFixedFunction())) {`；`vo.setSiteIds(extractFixedValue(vo.getFixedFunction()));`；`page.setRecords(voList);`；`and groupInfo.name like concat('%', #{vo.offerGroupName}, '%')`
- `11953f9a`：涉及 3 个文件；新增证据：`service.refreshSiteIdV2(offerId, false);`；`void refreshSiteIdV2(Integer offerId, Boolean isSystem);`；`public void refreshSiteIdV2(Integer offerId,Boolean isSystem) {`；`offerIds.forEach(k -> refreshSiteId(k, sourceValue, isSystem));`；`offerIdList.forEach(k -> refreshSiteIdV2(k, true));`
- `13b635ce`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `245ed224`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `49814fef`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `66b2a98e`：涉及 1 个文件；新增证据：`list.addAll(mappingList.stream().map(MixOfferGroupSourceTagMapping::getSourceTagId).collect(Collectors.toSet()));`；`dto.setIdList(list);`
- `98a32484`：涉及 4 个文件；新增证据：`service.refreshSiteId(offerId, null, false);`；`void refreshSiteId(Integer offerId, String soruceValue,Boolean isSystem);`；`sourceTagConfigService.refreshSiteId(Integer.valueOf(offerId), sourceValue, true);`；`offerIds.forEach(k -> refreshSiteId(k, sourceValue, false));`；`public void refreshSiteId(Integer offerId, String sourceValue,Boolean isSystem) {`；`saveConfigLog(config, isSystem);`
- `b7324b47`：涉及 3 个文件；新增证据：`void refreshSourceTagConfig(List<Integer> offerIdList);`；`@Override`；`public void refreshSourceTagConfig(List<Integer> offerIdList) {`；`offerIdList.forEach(this::refreshSiteIdV2);`；`@XxlJob("refreshSourceTagConfig")`；`public void refreshSourceTagConfig() {`
- `d0ebd5be`：涉及 2 个文件；新增证据：`if (CollectionUtil.isNotEmpty(sourceTagIdList)) {`
- `e39977c5`：涉及 1 个文件；新增证据：`if (CollectionUtil.isEmpty(sourceTagIds)){`
- `f4e007cd`：涉及 1 个文件；新增证据：`if (CollectionUtil.isNotEmpty(dto.getIdList())) {`；`voList.forEach(vo -> {`；`if (vo.getPeriodCount() == 0 && StringUtils.isNotEmpty(vo.getFixedFunction())) {`；`vo.setSiteIds(extractFixedValue(vo.getFixedFunction()));`；`vo.setOfferGroupName(groupInfoMap.get(vo.getId()));`；`page.setRecords(voList);`
- `65e66e52`：涉及 1 个文件；新增证据：`@ExcelProperty("offer组名称")`

## 核心代码设计

本需求历史上共影响 23 个文件；当前仍可在 `master` 定位 23 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagPageDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagV2DTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixEchoVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixOfferCheckVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixSourceTagPageVO.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MixSourceTagConfigController.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixConfigOfferGroupInfo.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixOfferGroupSourceTagMapping.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/MixConfigOfferGroupInfoMapper.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/MixOfferGroupSourceTagMappingMapper.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/MixSourceTagConfigMapper.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/IMixSourceTagConfigService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/MixConfigOfferGroupInfoService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/MixOfferGroupSourceTagMappingService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixConfigOfferGroupInfoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixMultipleOfferConfigServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixOfferGroupSourceTagMappingServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixSourceTagConfigServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/task/XxlJobHandler.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/resources/mapper/MixConfigOfferGroupInfoMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/resources/mapper/MixOfferGroupSourceTagMappingMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/resources/mapper/MixSourceTagConfigMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
