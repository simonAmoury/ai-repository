---
id: pac-platform/media
scope: project
project: pac-platform
feature: media
updated: 2026-08-24
tags: [git-history, simon.ye, media]
code_anchors:
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/constant/MediaContrast.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaInfoExcelDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaInfoExcelImportDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaPageDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaRebateInfoExcelDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaRebateInfoExcelImportDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaAuditLogVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaDetailVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateBasicVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateEncourageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateParam.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `media`，共 14 条 Simon 提交，时间范围为
2025-01-14 至 2025-01-23。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `3af62d01`（2025-01-14）：feat[media]: 实体定义
- `32d025f8`（2025-01-16）：feat[media]: 分页查询
- `aa984780`（2025-01-16）：feat[media]: 详情
- `3d091121`（2025-01-17）：feat[media]: 导入媒体报价单
- `445d3de6`（2025-01-19）：feat[media]: 导入媒体返点
- `79457c1d`（2025-01-19）：change [media]: 分页筛选条件修改
- `91b9dfce`（2025-01-19）：change [media]: 分页筛选条件修改
- `a1bf3115`（2025-01-19）：change [media]: 分页筛选条件修改
- `e8af2a78`（2025-01-19）：fix[media]: 文件空指针
- `417e7c83`（2025-01-20）：feat [media]: 分页优化、导入加校验
- `54e30a51`（2025-01-20）：fix [media]: 分页调整
- `fdb59a4e`（2025-01-20）：feat [media]: 分页调整
- `cde03502`（2025-01-22）：feat [media]: 状态监控、bug修复
- `3d7dadc2`（2025-01-23）：fix [media]: 监控时间处理

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `3af62d01`：涉及 31 个文件；新增证据：`@Data`；`@TableName(value = "media")`；`public class Media {`；`@TableId(value = "id", type = IdType.AUTO)`；`private Integer id;`；`@TableField(value = "num")`
- `32d025f8`：涉及 14 个文件；新增证据：`private List<Integer> affiliateIdList;`；`@Data`；`public class MediaAuditLogVO implements Serializable {`；`private static final long serialVersionUID = -7128246583252964207L;`；`private Integer mediaId;`；`private String remark;`
- `aa984780`：涉及 11 个文件；新增证据：`public interface MediaContrast {`；`@Getter`；`@AllArgsConstructor`；`enum StatusEnum {`；`DRAFT("draft", "草稿"),`；`SANCTION("sanction", "审批中"),`
- `3d091121`：涉及 7 个文件；新增证据：`@Data`；`public class MediaInfoExcelDTO {`；`private Integer mediaId;`；`private Integer affiliateId;`；`private String toName;`；`private String status;`
- `445d3de6`：涉及 7 个文件；新增证据：`@Data`；`public class MediaRebateInfoExcelDTO {`；`private Integer mediaId;`；`private Integer affId;`；`private Date effectiveStartDate;`；`private Date effectiveEndDate;`
- `79457c1d`：涉及 2 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `91b9dfce`：涉及 6 个文件；新增证据：`@ApiModelProperty(value = "渠道名称")`；`private String affiliateName;`；`List<Integer> getAuthAffiliateIdsByNameAndType(@Param("userId") Long userId, @Param("affiliateName") String affiliateName, @Param("toNameList") List<String> toNameList, @Param("toTypeList") List<Integer> toTypeList);`；`List<Integer> getAuthAffiliateIdsByNameAndType(Long userId, String affiliateName, List<String> toNameList, List<Integer> toTypeList);`；`public List<Integer> getAuthAffiliateIdsByNameAndType(Long userId, String affiliateName, List<String> toNameList, List<Integer> toTypeList) {`；`return this.baseMapper.getAuthAffiliateIdsByNameAndType(userId, affiliateName, toNameList, toTypeList);`
- `a1bf3115`：涉及 1 个文件；新增证据：`and af.company like concat('%', #{affiliateName}, '%')`
- `e8af2a78`：涉及 1 个文件；新增证据：`if (StrUtil.isBlank(vo.getFileIds())) {`
- `417e7c83`：涉及 4 个文件；新增证据：`List<Integer>  getMediaAuthAffiliateIdsByNameAndType(Long userId, String affiliateName, List<String> toNameList, List<Integer> toTypeList);`；`public List<Integer> getMediaAuthAffiliateIdsByNameAndType(Long userId, String affiliateName, List<String> toNameList, List<Integer> toTypeList) {`；`collect.forEach((k, v) -> {`；`if (v.size() > 1) {`；`errorList.add(k);`；`AssertX.isTrue(CollectionUtil.isEmpty(errorList), "导入数据存在重复数据，请检查");`
- `54e30a51`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `fdb59a4e`：涉及 5 个文件；新增证据：`private List<MediaAuditLog> remarkList;`；`voList.forEach(vo -> vo.setRemarkList(map.get(vo.getId())));`
- `cde03502`：涉及 11 个文件；新增证据：`private LocalDateTime auditPassTime;`；`private LocalDateTime auditPassTime;`；`private LocalDate effectiveStartDate;`；`private LocalDate effectiveEndDate;`；`private String effectiveStartDate;`；`private String effectiveEndDate;`
- `3d7dadc2`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 51 个文件；当前仍可在 `master` 定位 51 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/constant/MediaContrast.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaInfoExcelDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaInfoExcelImportDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaPageDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaRebateInfoExcelDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaRebateInfoExcelImportDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaAuditLogVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaDetailVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaPageVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateBasicVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateEncourageVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateParam.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/Media.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaAuditLog.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateBasic.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateDetailInfo.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateEncourage.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateMapping.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/controller/MediaController.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/mapper/AffiliateMapper.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/mapper/MediaAuditLogMapper.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/mapper/MediaMapper.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/mapper/MediaRebateBasicMapper.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/mapper/MediaRebateDetailInfoMapper.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/mapper/MediaRebateEncourageMapper.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/mapper/MediaRebateMappingMapper.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/AffiliateService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaAuditLogService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaRebateBasicService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaRebateDetailInfoService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaRebateEncourageService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaRebateMappingService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaAuditLogServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaRebateBasicServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaRebateDetailInfoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaRebateEncourageServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaRebateMappingServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/strategy/media/MediaRebateBasicStrategy.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/strategy/media/MediaRebateEncourageStrategy.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/strategy/media/MediaRebateStrategy.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/task/AffXxlJobHandler.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/AffiliateMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaAuditLogMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaRebateBasicMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaRebateDetailInfoMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaRebateEncourageMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaRebateMappingMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
