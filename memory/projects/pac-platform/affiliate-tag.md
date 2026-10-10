---
id: pac-platform/affiliate-tag
scope: project
project: pac-platform
feature: affiliate-tag
updated: 2026-08-24
tags: [git-history, simon.ye, affiliateTag]
code_anchors:
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/constant/AffiliateTagInfoConstant.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/entity/AffiliateExpandInfo.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/AffiliateAddVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/AffiliateVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/AffiliateAttributeService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateAttributeServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateExpandInfoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/resources/mapper/AffiliateExpandInfoMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `affiliateTag`，共 8 条 Simon 提交，时间范围为
2025-02-27 至 2025-03-04。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `d75ce9e4`（2025-02-27）：feat [affiliateTag]: 新增、更新
- `33543369`（2025-02-28）：fix [affiliateTag]: 详情
- `26e9e571`（2025-03-03）：fix [affiliateTag]: 置空渠道标识
- `39d25ce0`（2025-03-03）：fix [affiliateTag]: 置空渠道标识
- `9759712f`（2025-03-03）：fix [affiliateTag]: 置空渠道标识
- `f22eef21`（2025-03-03）：fix [affiliateTag]: 置空渠道标识
- `124d5c16`（2025-03-04）：fix [affiliateTag]: 方案调整
- `c51f0fb7`（2025-03-04）：fix [affiliateTag]: 方案调整

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `d75ce9e4`：涉及 6 个文件；新增证据：`@ApiModelProperty(value = "内部渠道类型")`；`private String innerChannelType;`；`private String innerChannelType;`；`void addOrUpdateCommon(Integer affiliateId, Map<String, String> map);`；`@Override`；`public void addOrUpdateCommon(Integer affiliateId, Map<String, String> map) {`
- `33543369`：涉及 2 个文件；新增证据：`supplyAffiliateAttribute(affiliateAttribute,affiliateId);`；`private void supplyAffiliateAttribute(AffiliateVO.AffiliateAttribute affiliateAttribute,Integer affiliateId) {`；`attributeMap.forEach((k,v)->{`；`switch (k){`；`affiliateAttribute.setInnerChannelType(v);`；`affiliateAttributeService.addOrUpdateCommon(affiliateId, Map.of(AffiliateTagInfoConstant.INNER_CHANNEL_TYPE_FIELD_KEY, StrUtil.isNotBlank(addVO.getInnerChannelType()) ? addVO.getInnerChannelType() : "None"));`
- `26e9e571`：涉及 1 个文件；新增证据：`affiliateAttributeService.addOrUpdateCommon(affiliateId, Map.of(AffiliateTagInfoConstant.INNER_CHANNEL_TYPE_FIELD_KEY, addVO.getInnerChannelType()));`
- `39d25ce0`：涉及 1 个文件；新增证据：`if (Objects.nonNull(affiliateAttribute) && StrUtil.isBlank(v)) {`；`removeList.add(affiliateAttribute);`；`if (CollectionUtil.isNotEmpty(removeList)) {`；`this.removeBatchByIds(removeList);`
- `9759712f`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `f22eef21`：涉及 2 个文件；新增证据：`if (Objects.nonNull(affiliateAttribute) && "null".equals(v)) {`；`affiliateAttributeService.addOrUpdateCommon(affiliateId, Map.of(AffiliateTagInfoConstant.INNER_CHANNEL_TYPE_FIELD_KEY, StrUtil.isNotBlank(addVO.getInnerChannelType())?addVO.getInnerChannelType():"null"));`
- `124d5c16`：涉及 6 个文件；新增证据：`@TableField(value = "inner_channel_type")`；`@ApiModelProperty(value = "内部渠道类型")`；`private String innerChannelType;`；`@ApiModelProperty(value = "内部渠道类型")`；`private String innerChannelType;`；`@ApiModelProperty(value = "内部渠道类型")`
- `c51f0fb7`：涉及 2 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 9 个文件；当前仍可在 `master` 定位 9 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/constant/AffiliateTagInfoConstant.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/entity/AffiliateExpandInfo.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/AffiliateAddVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/AffiliateVO.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/AffiliateAttributeService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateAttributeServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateExpandInfoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/AffiliateExpandInfoMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
