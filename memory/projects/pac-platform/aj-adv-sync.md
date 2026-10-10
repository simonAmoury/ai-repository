---
id: pac-platform/aj-adv-sync
scope: project
project: pac-platform
feature: aj-adv-sync
updated: 2026-08-24
tags: [git-history, simon.ye, aj_adv_sync]
code_anchors:
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferQueryByAdvAndCompanyDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferQueryByAdvCompanyPackageNameDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/feign/IOfferAttributeClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/feign/IOfferClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferByAdvAndCompanyVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferByAdvCompanyPackageNameVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/billing/BaseBillingDetailService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/billing/EnhancedOfferSyncService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/order/AdvOpportunityOrderBillingServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/feign/OfferAttributeClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/feign/OfferClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/mapper/OfferMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `aj_adv_sync`，共 12 条 Simon 提交，时间范围为
2026-05-19 至 2026-06-02。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `47de5bfc`（2026-05-19）：feat[aj_adv_sync]: 同步逻辑70%
- `610ce95a`（2026-05-20）：feat[aj_adv_sync]: 同步逻辑
- `a675ace9`（2026-05-20）：feat[aj_adv_sync]: 同步逻辑DTO
- `a9560080`（2026-05-20）：feat[aj_adv_sync]: 同步逻辑
- `61407133`（2026-05-29）：feat[aj_adv_sync]: 异步方法调整
- `a22a8842`（2026-05-29）：feat[aj_adv_sync]: 同步中间表逻辑调整+回查offer逻辑调整
- `b80138ab`（2026-05-29）：feat[aj_adv_sync]: 清除import
- `309137ec`（2026-06-01）：fix[aj_adv_sync]: 报价单编辑同步方法触发时机改动
- `f13e9263`（2026-06-01）：fix[aj_adv_sync]: 修复全量同步没有关联offer，给定默认值，避免重复
- `4221826e`（2026-06-02）：fix[aj_adv_sync]: 唯一键补充accountName
- `749a364e`（2026-06-02）：fix[aj_adv_sync]: 提取魔法值
- `a895337f`（2026-06-02）：fix[aj_adv_sync]: 注释修改

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `47de5bfc`：涉及 13 个文件；新增证据：`@PostMapping("/upsert")`；`R<Boolean> upsertOfferAttr(@RequestBody OfferAttribute attr);`；`@PostMapping("/delete-by-offer-and-key")`；`R<Boolean> deleteOfferAttrByOfferIdAndKey(@RequestBody OfferAttribute attr);`；`@Override`；`public R<Boolean> upsertOfferAttr(OfferAttribute attr) {`
- `610ce95a`：涉及 1 个文件；新增证据：`for (Map.Entry<String, AdjustAppAdvertiserMapping> entry : newDataMap.entrySet()) {`；`for (Map.Entry<String, AdjustAppAdvertiserMapping> entry : oldDataMap.entrySet()) {`；`if (newDataMap.containsKey(entry.getKey())) {`
- `a675ace9`：涉及 3 个文件；新增证据：`@Data`；`@ApiModel("按 advId+company+thirdPlatformId+packageName 批量查询 Offer 请求")`；`public class OfferQueryByAdvCompanyPackageNameDTO implements Serializable {`；`private static final long serialVersionUID = 1L;`；`@ApiModelProperty("查询条件列表（一条对应一组四元组，全部 AND 严格相等）")`；`private List<Item> items;`
- `a9560080`：涉及 6 个文件；新增证据：`@PostMapping("/batch-upsert")`；`R<String> batchUpsertOfferAttr(@RequestBody List<OfferAttribute> attrs);`；`@PostMapping("/batch-delete-by-offer-and-key")`；`R<String> batchDeleteOfferAttrByOfferIdAndKey(@RequestBody List<OfferAttribute> attrs);`；`public R<String> batchUpsertOfferAttr(List<OfferAttribute> attrs) {`；`return R.failure(this.getClass().getName());`
- `61407133`：涉及 2 个文件；新增证据：`private final IAdjustAppInfoClient adjustAppInfoClient;`；`syncAdjustAfterBillingUpdate(orderId, billingId);`；`private void syncAdjustAfterBillingUpdate(String orderId, Long billingId) {`；`threadPoolTaskExecutor.submit(() -> {`；`log.info("开始同步Adjust数据, orderId={}, billingId={}", orderId, billingId);`；`if (order == null) {`
- `a22a8842`：涉及 11 个文件；新增证据：`@Data`；`@ApiModel("按 advId 列表 + company 查询 Offer 请求")`；`public class OfferQueryByAdvAndCompanyDTO implements Serializable {`；`private static final long serialVersionUID = 1L;`；`@ApiModelProperty("BOP广告主ID列表（可为空）")`；`private List<Long> advIds;`
- `b80138ab`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `309137ec`：涉及 2 个文件；新增证据：`@Slf4j`；`@Autowired`；`private IAdjustAppInfoClient adjustAppInfoClient;`；`syncAdjustAfterBillingUpdate(billingRecord.getOrderId(), billingId);`；`private void syncAdjustAfterBillingUpdate(String orderId, Long billingId) {`；`threadPoolTaskExecutor.submit(() -> {`
- `f13e9263`：涉及 2 个文件；新增证据：`if (CollUtil.isNotEmpty(dto.getAdvIds()) || StrUtil.isNotBlank(dto.getCompany())) {`；`offerQueryDTO.setAdvIds(dto.getAdvIds());`；`offerQueryDTO.setCompany(dto.getCompany());`；`changedAdvIds.remove(null);`；`offerQueryDTO.setAdvIds(new ArrayList<>(changedAdvIds));`；`entity.setAppToken(StrUtil.blankToDefault(dto.getAppToken(), "unknown"));`
- `4221826e`：涉及 2 个文件；新增证据：`return String.format("%s_%s_%s_%s_%s_%s",`；`mapping.getAccountId(),`；`mapping.getAccountName());`；`return String.format("%s_%s_%s_%s_%s_%s",`；`dto.getAccountId(),`；`dto.getAccountName());`
- `749a364e`：涉及 1 个文件；新增证据：`private static final String DATA_SOURCE_SYNC = "sync";`；`private static final String DATA_SOURCE_MANUAL = "manual";`；`private static final Long DEFAULT_ADV_ID = -1L;`；`private static final String DEFAULT_ACCOUNT_ID = "-1";`；`private static final String DEFAULT_APP_TOKEN = "unknown";`；`if (DATA_SOURCE_MANUAL.equals(oldItem.getDataSource())) {`
- `a895337f`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 21 个文件；当前仍可在 `master` 定位 21 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferQueryByAdvAndCompanyDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferQueryByAdvCompanyPackageNameDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/feign/IOfferAttributeClient.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/feign/IOfferClient.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferByAdvAndCompanyVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferByAdvCompanyPackageNameVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/billing/BaseBillingDetailService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/billing/EnhancedOfferSyncService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/order/AdvOpportunityOrderBillingServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/feign/OfferAttributeClient.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/feign/OfferClient.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/mapper/OfferMapper.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/IOfferService.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/impl/OfferServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/adjust/dto/AdjustSyncRequestDTO.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/adjust/controller/AdjustAppInfoController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/adjust/mapper/AdjustAppAdvertiserMappingMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/adjust/service/IAdjustAppInfoService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/adjust/service/impl/AdjustAppInfoServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AdjustAppAdvertiserMappingMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
