---
id: pac-platform/adv-migration
scope: project
project: pac-platform
feature: adv-migration
updated: 2026-08-24
tags: [git-history, simon.ye, advMigration]
code_anchors:
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvExportDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvPageDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvCommonDataVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvertiserPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/AdvertiserMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/resources/mapper/AdvertiserMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `advMigration`，共 27 条 Simon 提交，时间范围为
2025-01-02 至 2025-01-09。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `8772c75a`（2025-01-02）：fix[advMigration]: 展示问题
- `4079c00f`（2025-01-03）：fix[advMigration]: 导出入参
- `59394e0c`（2025-01-03）：fix[advMigration]: 导出枚举
- `85d49438`（2025-01-03）：fix[advMigration]: 更新时间，导出表头、枚举
- `8cc03eb0`（2025-01-03）：fix[advMigration]: 编辑、导出
- `a09c48f1`（2025-01-03）：fix[advMigration]: 导出默认排序
- `ef90783d`（2025-01-03）：fix[advMigration]: 导出、数据权限
- `02e9d10a`（2025-01-06）：fix[advMigration]: 分页调整
- `2c03a3d6`（2025-01-06）：fix[advMigration]: 分页查询
- `4a55a148`（2025-01-06）：feat[advMigration]: 分页查询优化
- `5976add5`（2025-01-06）：fix[advMigration]: 导出字段转换
- `9a3781c2`（2025-01-06）：fix[advMigration]: 分页查询
- `9e2e0d14`（2025-01-06）：fix[advMigration]: 导出
- `a3ab4166`（2025-01-06）：fix[advMigration]: 分页查询
- `c011f806`（2025-01-06）：fix[advMigration]: 分页查询
- `e2930b5c`（2025-01-06）：fix[advMigration]: 分页查询
- `e320faf0`（2025-01-07）：fix[advMigration]: 字段映射
- `fe6ccf14`（2025-01-07）：feat[advMigration]: 详情、分页、导出
- `077a4492`（2025-01-08）：feat[advMigration]: 分页优化
- `09dadf64`（2025-01-08）：change[advMigration]: 详情调整
- `32c106cc`（2025-01-08）：fix[advMigration]: 分页排序
- `a9e6b112`（2025-01-08）：feat[advMigration]: 分页查询
- `29fee080`（2025-01-09）：fix[advMigration]: 分页查询修复
- `482cdfb2`（2025-01-09）：fix[advMigration]: 详情
- `a95a1a96`（2025-01-09）：feat[advMigration]: 分页查询优化
- `ca08b52f`（2025-01-09）：fix[advMigration]: 详情补充提单号
- `f5de708e`（2025-01-09）：fix[advMigration]: 导出枚举调整

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `8772c75a`：涉及 1 个文件；新增证据：`if (StringUtils.isNotEmpty(vo.getCrmCustomerId())) {`
- `4079c00f`：涉及 4 个文件；新增证据：`private List<String> columns;`；`dto.setSize(20000);`；`voList.forEach(vo -> {`
- `59394e0c`：涉及 1 个文件；新增证据：`NOT_SIGNED(0, "未签约"),`；`SIGNER(1, "已签约");`
- `85d49438`：涉及 2 个文件；新增证据：`@ExcelIgnore`；`@ExcelProperty(value = "CRM/BPMS客户名称")`；`@ExcelProperty(value = "CRM/BPMS BD")`；`S2S_H5("中小媒体效果营销-H5","中小媒体效果营销-H5"),`；`S2S_H5_NEW("S2S-H5","中小媒体效果营销-分成_H5"),`；`S2S_R_CPI_CPE("中小媒体再营销-CPI/CPE","中小媒体再营销-CPI/CPE"),`
- `8cc03eb0`：涉及 3 个文件；新增证据：`@ApiModelProperty("开票客户名称")`；`private String invoicingTo;`；`@ApiModelProperty("开票付款公司地址")`；`private String invoicingPayerAddress;`；`@ApiModelProperty("开票说明")`；`private String invoicingInstruction;`
- `a09c48f1`：涉及 2 个文件；新增证据：`dto.setSize(ExcelConstant.MAX_SIZE);`；`dto.setSearchCount(false);`
- `ef90783d`：涉及 2 个文件；新增证据：`if (enums[i].getCode().equals(code)) {`；`return enums[i].getDesc();`；`@Getter`；`@AllArgsConstructor`；`public enum AdvBusinessTypeEnum {`；`S2S_CPI_CPE("S2S-CPI/CPE", "中小媒体效果营销-CPI/CPE"),`
- `02e9d10a`：涉及 2 个文件；新增证据：`@ApiModelProperty("CRM/BPMS客户ID")`；`private String crmOrBpmsCustomerId;`；`@ApiModelProperty(value = "CRM/BPMS客户名称")`；`private String crmOrBpmsCustomerName;`；`@ApiModelProperty("CRM/BPMS BD名称")`；`private String crmOrBpmsBdName;`
- `2c03a3d6`：涉及 4 个文件；新增证据：`Set<Integer> getCustomPageAdvIdList(@Param("page") IPage<AdvertiserPageVO> page, @Param("dto") AdvPageDTO dto);`；`if (CollectionUtil.isEmpty(dto.getAdvIdList())){`；`dto.setAdvIdList(Set.copyOf(customPageAdvIdList));`；`return baseMapper.customPage(page, dto);`；`group_concat(distinct ati.name) as industry,`；`and a.name like concat('%',#{dto.name},'%')`
- `4a55a148`：涉及 4 个文件；新增证据：`@Data`；`public class AdvIndustryVO {`；`private Integer id;`；`private String industry;`；`List<AdvIndustryVO> mapIndustry(@Param("advIdsList") List<Integer> advIdsList, @Param("productTypeList") List<Integer> productTypeList);`；`if (CollUtil.isNotEmpty(voList)) {`
- `5976add5`：涉及 1 个文件；新增证据：`if (dto.getColumns().contains("ioStatus")){`；`dto.getColumns().add("ioStatusDesc");`；`dto.getColumns().remove("ioStatus");`
- `9a3781c2`：涉及 1 个文件；新增证据：`if (CollectionUtil.isEmpty(customPageAdvIdList)) {`；`return Collections.emptyList();`
- `9e2e0d14`：涉及 1 个文件；新增证据：`if (dto.getColumns().contains("advType")) {`；`dto.getColumns().add("advTypeDesc");`；`dto.getColumns().remove("advType");`；`if (dto.getColumns().contains("ioStatus")) {`
- `a3ab4166`：涉及 2 个文件；新增证据：`List<AdvertiserPageVO> getByIds(@Param("page") IPage<AdvertiserPageVO> page ,@Param("advIds") Set<Integer> advIds);`；`return baseMapper.getByIds(pageSort, customPageAdvIdList);`
- `c011f806`：涉及 1 个文件；新增证据：`pageSort.setCurrent(1);`
- `e2930b5c`：涉及 3 个文件；新增证据：`List<AdvertiserPageVO> getByIds(@Param("advIds") Set<Integer> advIds);`；`return baseMapper.getByIds(customPageAdvIdList);`；`group_concat(distinct ati.name) as industry,`
- `e320faf0`：涉及 1 个文件；新增证据：`group_concat(distinct cu.username) as cooperationCm`；`group_concat(distinct cu.username) as cooperationCm`
- `fe6ccf14`：涉及 5 个文件；新增证据：`@Data`；`public class AdvCommonDataVO {`；`private Integer advId;`；`private BigDecimal operationRevenueMonthly;`；`private BigDecimal advertiserRevenue;`；`private String averageConfirmationRate;`
- `077a4492`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `09dadf64`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `32c106cc`：涉及 3 个文件；新增证据：`return baseMapper.customPage(page, dto);`
- `a9e6b112`：涉及 2 个文件；新增证据：`@ApiModelProperty("BD用户ID列表")`；`@ApiModelProperty("BD类型：1 - 归，5 - 协")`；`@ApiModelProperty("CM用户ID列表")`；`@ApiModelProperty("CM类型：1 - 归，5 - 协")`；`group_concat(distinct bub.username) as cooperationBD,`；`group_concat(distinct cuc.username) as cooperationCm`
- `29fee080`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `482cdfb2`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `a95a1a96`：涉及 1 个文件；新增证据：`where a.sync_status in ('active')`
- `ca08b52f`：涉及 1 个文件；新增证据：`group_concat(distinct ati.name) as industry,`
- `f5de708e`：涉及 1 个文件；新增证据：`DIRECT_ADVERTISER(0, "直客"),`；`NETWORK(1, "网盟"),`；`AGENCY(2, "代理");`

## 核心代码设计

本需求历史上共影响 10 个文件；当前仍可在 `master` 定位 9 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvExportDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvPageDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvCommonDataVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvIndustryVO.java`（当前已不存在或已改名）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvertiserPageVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/AdvertiserMapper.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/resources/mapper/AdvertiserMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
