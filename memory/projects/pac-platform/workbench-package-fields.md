---
id: pac-platform/workbench-package-fields
scope: project
project: pac-platform
feature: workbench-package-fields
updated: 2026-08-24
tags: [git-history, simon.ye, feat_workbench_package_2024_12_13]
code_anchors:
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvExportDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvertiserPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/AdvController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/AdvertiserMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/IAdvService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/resources/mapper/AdvertiserMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/controller/AppThirdPartyDataController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/WorkbenchDropDownDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AgencyAccountDataRequestVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/WorkbenchAgencyDropDownVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/mapper/AppThirdPartyDataCacheMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `feat_workbench_package_2024_12_13`，共 14 条 Simon 提交，时间范围为
2024-12-13 至 2024-12-18。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `3e5a718e`（2024-12-13）：change: swagger处理
- `5ce8f0a6`（2024-12-13）：feat: 控制台查询增加包维度
- `71586747`（2024-12-13）：change: 测试swagger
- `e5ec0317`（2024-12-13）：change: 测试swagger
- `1ce774c8`（2024-12-16）：change: 修改返回类型
- `2607f7cc`（2024-12-16）：change: 字段名映射
- `305cb538`（2024-12-16）：change: 修改入参
- `5d0c1eab`（2024-12-16）：change: 修改返回内容
- `84959d37`（2024-12-16）：change: 字段名映射
- `4bb85742`（2024-12-17）：feat: 广告主导出
- `625c7fe4`（2024-12-17）：feat: 分页展示增加字段
- `fc54fc4e`（2024-12-17）：feat: 添加至Swagger
- `3c9bfdf7`（2024-12-18）：change: 筛选广告主平台
- `d482c934`（2024-12-18）：fix: sql修复

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `3e5a718e`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `5ce8f0a6`：涉及 6 个文件；新增证据：`@GetMapping("/appId-by-agencyName")`；`@ApiOperationSupport(order = 3)`；`@ApiOperation(value = "根据账号查找appId")`；`public R<List<String>> getAppIdByAgencyName(@RequestParam(value = "agencyName") String agencyName) {`；`return R.data(this.service.getAppIdByAgencyName(agencyName));`；`@GetMapping("/agencyName-by-appId")`
- `71586747`：涉及 2 个文件；新增证据：`@PostMapping("data/click-install")`；`@PostMapping("data/package/rank")`；`@GetMapping("appId-by-agencyName")`；`@GetMapping("agencyName-by-appId")`；`@Api(tags = "测试Swagger")`；`@RestController`
- `e5ec0317`：涉及 2 个文件；新增证据：`@Api(tags = "工作台看板管理")`；`@Api(tags = "测试/Swagger")`
- `1ce774c8`：涉及 8 个文件；新增证据：`@PostMapping("agency-by-appId")`；`public R<List<WorkbenchAgencyDropDownVO>> getAgencyByAppId(@RequestBody WorkbenchDropDownDTO dto) {`；`return R.data(this.service.getAgencyByAppId(dto));`；`@Data`；`public class WorkbenchAgencyDropDownVO {`；`private Integer agencyId;`
- `2607f7cc`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `305cb538`：涉及 5 个文件；新增证据：`@PostMapping("appId-by-agencyId")`；`public R<List<String>> getAppIdByAgencyId(@RequestBody WorkbenchDropDownDTO dto) {`；`return R.data(this.service.getAppIdByAgencyId(dto));`；`@PostMapping("agencyId-by-appId")`；`public R<List<Integer>> getAgencyIdByAppId(@RequestBody WorkbenchDropDownDTO dto) {`；`return R.data(this.service.getAgencyIdByAppId(dto));`
- `5d0c1eab`：涉及 5 个文件；新增证据：`@GetMapping("appId-by-agencyId")`；`@ApiOperation(value = "根据账号Id查找appId")`；`public R<List<String>> getAppIdByAgencyId(@RequestParam(value = "agencyId") Integer anencyId) {`；`return R.data(this.service.getAppIdByAgencyId(anencyId));`；`@GetMapping("agencyId-by-appId")`；`@ApiOperation(value = "根据appId查找账号Id")`
- `84959d37`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `4bb85742`：涉及 8 个文件；新增证据：`@Data`；`@EqualsAndHashCode(callSuper = true)`；`@ApiModel(value = "广告主导出DTO")`；`public class AdvExportDTO extends AdvPageDTO {`；`private List<String> columnList;`；`@ContentRowHeight(28)`
- `625c7fe4`：涉及 2 个文件；新增证据：`private String bpmsCustomerId;`；`private String bpmsCustomerName;`；`private String bpmsBdName;`；`group_concat(distinct ati.name) as industry,`
- `fc54fc4e`：涉及 1 个文件；新增证据：`@ApiModelProperty("BPMS客户ID")`；`@ApiModelProperty(value = "BPMS客户名称")`；`@ApiModelProperty("BPMSBD名称")`
- `3c9bfdf7`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `d482c934`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 19 个文件；当前仍可在 `master` 定位 16 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvExportDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvertiserPageVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/AdvController.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/AdvertiserMapper.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/IAdvService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/resources/mapper/AdvertiserMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/utils/PostBackUrlFillParamsUtil.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/controller/AppThirdPartyDataController.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/controller/TestSwaggerController.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/WorkbenchDropDownDTO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AgencyAccountDataRequestVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/WorkbenchAgencyDropDownVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/WorkbenchDropDownDTO.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/mapper/AppThirdPartyDataCacheMapper.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAppThirdPartyDataCacheService.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AppThirdPartyDataCacheServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/resources/mapper/AppThirdPartyDataCacheMapper.xml`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/constant/ApiPermissionConstants.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
