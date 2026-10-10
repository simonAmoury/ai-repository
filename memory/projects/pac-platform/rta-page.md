---
id: pac-platform/rta-page
scope: project
project: pac-platform
feature: rta-page
updated: 2026-08-24
tags: [git-history, simon.ye, rta_page]
code_anchors:
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountBasicPageParam.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountDetailModifyDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountDetailPageDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountEditDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountPageDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/entity/rta/RtaAccount.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/RtaRateCalcDetail.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/RtaRateCalcDetailTotal.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountDetailModifyVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountDetailPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountEditVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `rta_page`，共 21 条 Simon 提交，时间范围为
2025-07-28 至 2025-08-26。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `caec2729`（2025-07-28）：feat[rta_page]: 分页10%
- `f30d206c`（2025-07-29）：feat[rta_page]: 分页
- `a583548f`（2025-08-01）：feat[rta_page]: 编辑20%
- `23b811ca`（2025-08-08）：feat[rta_page]: 编辑
- `1d9dd704`（2025-08-11）：feat[rta_page]: 汇总
- `3be63123`（2025-08-11）：feat[rta_page]: 汇总
- `4e9cb077`（2025-08-11）：bugFix[rta_page]: 明细编辑
- `8ede78cc`（2025-08-11）：bugFix[rta_page]: 明细分页权限控制
- `2bb413e3`（2025-08-21）：bugfix[rta_page]: 权限调整
- `8e6e6ac0`（2025-08-22）：feat[rta_page]: 明细编辑调整
- `aee87661`（2025-08-22）：bugfix[rta_page]: 账户分页
- `e969d890`（2025-08-22）：feat[rta_page]: 明细编辑调整
- `c6ae1c78`（2025-08-25）：feat[rta_page]: 日志处理
- `6526efa9`（2025-08-26）：fix[rta_page]: 空指针处理
- `693f0ee0`（2025-08-26）：fix[rta_page]: 空数组
- `8ff10bc3`（2025-08-26）：fix[rta_page]: 空数组
- `962b3757`（2025-08-26）：fix[rta_page]: 补充渠道名
- `a268980c`（2025-08-26）：fix[rta_page]: 空指针处理
- `c15757fb`（2025-08-26）：change[rta_page]: 删除冗余代码
- `e23a47d2`（2025-08-26）：fix[rta_page]: 筛选问题
- `f8ac4766`（2025-08-26）：fix[rta_page]: 空指针处理

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `caec2729`：涉及 5 个文件；新增证据：`@Data`；`@EqualsAndHashCode(callSuper = true)`；`@ApiModel(value = "RTA账户分页查询DTO")`；`public class RtaAccountPageDTO extends PQuery {`；`private List<Integer> advIds;`；`private List<String> advNames;`
- `f30d206c`：涉及 13 个文件；新增证据：`@Data`；`@EqualsAndHashCode(callSuper = true)`；`@ApiModel(value = "RTA账户分页查询DTO")`；`public class RtaAccountDetailPageDTO extends PQuery {`；`@ApiModelProperty(value = "账户ID")`；`private Integer accountId;`
- `a583548f`：涉及 9 个文件；新增证据：`@NotNull(message = "账户ID不能为空")`；`@Data`；`@ApiModel(value = "rta账号编辑DTO")`；`public class RtaAccountEditDTO {`；`@ApiModelProperty(value = "主键ID")`；`@NotNull(message = "主键ID不能为空")`
- `23b811ca`：涉及 9 个文件；新增证据：`@Data`；`@ApiModel(value = "rta账号明细编辑DTO")`；`public class RtaAccountDetailModifyDTO {`；`@ApiModelProperty(value = "主键ID")`；`@NotNull(message = "明细主键ID不能为空")`；`private Integer id;`
- `1d9dd704`：涉及 3 个文件；新增证据：`int sumQps(@Param("unionList") List<String> unionList, @Param("affIds") List<Integer> affIds);`；`select sum(qps_limit)`
- `3be63123`：涉及 10 个文件；新增证据：`@Data`；`@ApiModel(value = "日志汇总")`；`public class RtaRateCalcDetailTotal {`；`@ApiModelProperty(value = "授权渠道QPS")`；`private Integer affQps;`；`@ApiModelProperty(value = "预算消耗进度")`
- `4e9cb077`：涉及 4 个文件；新增证据：`@ApiModelProperty(value = "渠道请求日期")`；`@JsonFormat(pattern = "yyyy-MM-dd")`；`private Date reqDay;`；`AssertX.isTrue(usedQps + (Objects.isNull(modifyDTO.getQpsLimit()) ? 0 : modifyDTO.getQpsLimit()) <= rtaAccount.getQpsLimit(), "渠道QPS总和不能大于账户QPS限制");`；`total.setReqDay(DateUtil.parse(vo.getStartTime(), "yyyy-MM-dd"));`
- `8ede78cc`：涉及 4 个文件；新增证据：`public interface RtaAccountBasicPageParam {`；`List<Integer> getAffIds();`；`void setAffIds(List<Integer> affIds);`；`List<String> getAffNames();`；`void setAffNames(List<String> affNames);`；`List<Integer> getToIds();`
- `2bb413e3`：涉及 5 个文件；新增证据：`private List<Integer> accountIds;`；`return R.data(service.pageDetail(detailPageDTO));`；`IPage<RtaAccountDetailPageVO> pageDetail(RtaAccountDetailPageDTO detailPageDTO);`；`handleQueryParam(pageDTO);`；`public IPage<RtaAccountDetailPageVO> pageDetail(RtaAccountDetailPageDTO detailPageDTO) {`；`handleDetailQueryParam(detailPageDTO);`
- `8e6e6ac0`：涉及 2 个文件；新增证据：`@NotNull(message = "qps限制不能为空")`；`@NotNull(message = "是否启用不能为空")`；`AssertX.isTrue(modifyDTO.getQpsLimit() >= 0, "QPS配置错误，必须大于等于0：" + modifyDTO.getQpsLimit());`；`AssertX.isTrue(usedQps + (modifyDTO.getEnable() ? modifyDTO.getQpsLimit() : 0) <= rtaAccount.getQpsLimit(), "渠道QPS总和不能大于账户QPS限制");`；`mapping.setQpsLimit(modifyDTO.getQpsLimit());`；`mapping.setEnable(modifyDTO.getEnable() ? 1 : 0);`
- `aee87661`：涉及 1 个文件；新增证据：`mergeId2Coll(affiliateList, affName2AffId);`；`mergeId2Coll(CollStreamXUtil.toList(affToMappingList, AffToMapping::getAffId), affTo2AffId);`；`mergeId2Coll(affiliateList, affName2AffId);`；`mergeId2Coll(CollStreamXUtil.toList(affToMappingList, AffToMapping::getAffId), affTo2AffId);`；`mergeId2Coll(authAdvIds, advCmAuth2AdvId);`；`if (CollUtil.isNotEmpty(pageDTO.getAffIds())) {`
- `e969d890`：涉及 1 个文件；新增证据：`AssertX.isFalse(modifyDTO.getEnable() && modifyDTO.getQpsLimit().equals(0), "qps为0时，不允许启用");`
- `c6ae1c78`：涉及 8 个文件；新增证据：`private Long accountId;`；`@NotBlank(message = "查询日期不能为空")`；`public R<RtaRateCalcDetailTotal> calcTotal(@Validated @RequestBody RtaRateCalcPageQueryVo vo) {`；`@PostMapping("/calcPageV2")`；`@ApiOperation("计算渠道相关数据V2")`；`public R<IPage<RtaRateCalcDetail>> calcPageV2(@RequestBody RtaRateCalcPageQueryVo vo) {`
- `6526efa9`：涉及 1 个文件；新增证据：`detail.setCmName(Objects.nonNull(advInfoDTO) ? advInfoDTO.getCmUsername() : null);`
- `693f0ee0`：涉及 1 个文件；新增证据：`if (CollUtil.isNotEmpty(resPage.getRecords())) {`；`resPage.getRecords().forEach(detail -> {`
- `8ff10bc3`：涉及 1 个文件；新增证据：`if(Objects.isNull(total)){`；`return new RtaRateCalcDetailTotal();`
- `962b3757`：涉及 3 个文件；新增证据：`private String affiliateName;`；`mapping.setUpdater(AuthUtil.getUserId());`；`detail.setAdvName(!isTo ? Objects.nonNull(advInfoDTO) ? advInfoDTO.getAdvName() : null : null);`；`detail.setToName(affiliateBaseInfoMap.getOrDefault(detail.getAffId(), new AffiliateBaseInfoDTO()).getToName());`；`detail.setAffiliateName(isTo || isAdmin ? affiliateBaseInfoMap.getOrDefault(detail.getAffId(), new AffiliateBaseInfoDTO()).getName() : null);`
- `a268980c`：涉及 2 个文件；新增证据：`detail.setAdvId(account.getAdvId());`；`detail.setCmName(advInfoMap.getOrDefault(Math.toIntExact(Objects.nonNull(detail.getAdvId()) ? detail.getAdvId() : -1), new AdvInfoDTO()).getCmUsername());`；`detail.setToName(toNameMap.getOrDefault(Math.toIntExact(Objects.nonNull(mapping.getAffiliateId()) ? mapping.getAffiliateId() : -1L), null));`；`detail.setName(account.getName());`；`detail.setAdvQps(account.getQpsLimit());`；`detail.setAffQps(mapping.getQpsLimit());`
- `c15757fb`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `e23a47d2`：涉及 1 个文件；新增证据：`if (CollUtil.isNotEmpty(vo.getAdvIds()) || CollUtil.isNotEmpty(vo.getAffIds())) {`
- `f8ac4766`：涉及 1 个文件；新增证据：`total.setReqCostRate((Objects.isNull(total.getAffQps()) || total.getAffQps() == 0) ? new BigDecimal(0) : BigDecimal.valueOf(total.getReqAllCount()).divide((BigDecimal.valueOf(total.getAffQps()).multiply(BigDecimal.valueOf(86400))), 4, RoundingMode.HALF_UP));`；`total.setReqSuccessRate((Objects.isNull(total.getReqRedirectAllCount()) || total.getReqRedirectAllCount() == 0) ? new BigDecimal(0) : BigDecimal.valueOf(total.getReqRedirectSuccessCount()).divide(BigDecimal.valueOf(total.getReqRedirectAllCount()), 4, RoundingMode.HALF_UP));`；`detail.setReqCostRate((Objects.isNull(detail.getAffQps()) || detail.getAffQps() == 0) ? new BigDecimal(0) : BigDecimal.valueOf(detail.getReqAllCount()).divide((BigDecimal.valueOf(detail.getAffQps()).multiply(BigDecimal.valueOf(86400))), 4, RoundingMode.HALF_UP));`；`detail.setReqSuccessRate((Objects.isNull(detail.getReqRedirectAllCount()) || detail.getReqRedirectAllCount() == 0) ? new BigDecimal(0) : BigDecimal.valueOf(detail.getReqRedirectSuccessCount()).divide(BigDecimal.valueOf(detail.getReqRedirectAllCount()), 4, RoundingMode.HALF_UP));`

## 核心代码设计

本需求历史上共影响 27 个文件；当前仍可在 `master` 定位 27 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountBasicPageParam.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountDetailModifyDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountDetailPageDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountEditDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/rta/RtaAccountPageDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/entity/rta/RtaAccount.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/RtaRateCalcDetail.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/RtaRateCalcDetailTotal.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountDetailModifyVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountDetailPageVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountEditVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/account/RtaAccountPageVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/rta/query/aff/RtaRateCalcPageQueryVo.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/rta/RtaAccountController.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/rta/RtaLogController.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/rta/RtaAccountMapper.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/rta/RtaAffiliateMappingMapper.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/rta/doris/RtaRateCalcMapper.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/IRtaAccountService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/IRtaAffiliateMappingService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/IRtaRateCalcService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/rta/RtaAccountServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/rta/RtaAffiliateMappingServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/rta/doris/RtaRateCalcServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/resources/mapper/rta/RtaAccountMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/resources/mapper/rta/RtaAccouontAffiliateMappingMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/resources/mapper/rta/doris/RtaRateCalcMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
