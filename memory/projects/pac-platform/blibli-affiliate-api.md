---
id: pac-platform/blibli-affiliate-api
scope: project
project: pac-platform
feature: blibli-affiliate-api
updated: 2026-08-24
tags: [git-history, simon.ye, blibli_affiliate_api]
code_anchors:
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/entity/CpsAccountConfig.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/cps/CpsOrderUpsertResultVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/config/CpsOrderPullThreadPoolConfig.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/cps/CpsOrderDebugController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/CpsAccountConfigMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/ICpsAccountConfigService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/ICpsOrderCommissionService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/CpsAccountConfigServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/CpsOrderCommissionServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/AbstractCpsOrderPullJobHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/CpsOrderPullJobHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/CpsPageStrategy.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `blibli_affiliate_api`，共 13 条 Simon 提交，时间范围为
2026-08-04 至 2026-08-18。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `7c7ae114`（2026-08-04）：feat[blibli_affiliate_api]: 初步对接
- `59929aae`（2026-08-06）：feat[blibli_affiliate_api]: 取消demo代码
- `2e1b1ff3`（2026-08-13）：feat[blibli_affiliate_api]: blibli接入
- `eb13a140`（2026-08-14）：feat[blibli_affiliate_api]: 清除demo代码，接入cps订单拉取流程
- `2414c887`（2026-08-17）：feat[blibli_affiliate_api]: 代码整理
- `76e9d8a4`（2026-08-17）：feat[blibli_affiliate_api]: 代码整理
- `96638ba1`（2026-08-17）：feat[blibli_affiliate_api]: api对象处理
- `f404ab0e`（2026-08-17）：feat[blibli_affiliate_api]: response转换
- `29af199c`（2026-08-18）：feat[blibli_affiliate_api]: 默认值调整，取消退款快照，去除pb下发ad_commission_rate
- `50659455`（2026-08-18）：feat[blibli_affiliate_api]: cr调整，jobParam调整
- `781f5bd7`（2026-08-18）：feat[blibli_affiliate_api]: 使用自定义线程池
- `b225481a`（2026-08-18）：feat[blibli_affiliate_api]: DateTimeFormatter创建调整
- `feae3ada`（2026-08-18）：feat[blibli_affiliate_api]: super改this

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `7c7ae114`：涉及 16 个文件；新增证据：`@RestController`；`@RequiredArgsConstructor`；`@RequestMapping("/blibli/demo")`；`@Api(value = "Blibli 对接 Demo", tags = "Blibli 对接 Demo")`；`public class BlibliDemoController {`；`private final BlibliAffiliateClient blibliAffiliateClient;`
- `59929aae`：涉及 5 个文件；新增证据：`@RestController`；`@RequiredArgsConstructor`；`@RequestMapping("/blibli")`；`@Api(value = "Blibli 对接", tags = "Blibli 对接")`；`public class BlibliController {`；`private final BlibliAffiliateClient blibliAffiliateClient;`
- `2e1b1ff3`：涉及 18 个文件；新增证据：`@TableName(value = "cps_account_config")`；`@Data`；`public class CpsAccountConfig {`；`@TableId(type = IdType.AUTO)`；`private Integer id;`；`private String provider;`
- `eb13a140`：涉及 17 个文件；新增证据：`@Slf4j`；`@RestController`；`@RequiredArgsConstructor`；`@RequestMapping("/cps/debug")`；`@Api(value = "CPS 订单取数调试", tags = "CPS 订单取数调试")`；`public class CpsOrderDebugController {`
- `2414c887`：涉及 7 个文件；新增证据：`protected List<CpsOrderCommission> prepareOrdersForPersist(List<CpsOrderCommission> orders,`；`if (CollUtil.isEmpty(preparedOrders)) {`；`for (CpsOrderCommission order : preparedOrders) {`；`@Override`；`protected List<CpsOrderCommission> prepareOrdersForPersist(List<CpsOrderCommission> orders,`；`for (CpsOrderCommission order : orders) {`
- `76e9d8a4`：涉及 3 个文件；新增证据：`logInfo("[{}] 账号统计: accountId={}, 拉取={}, 快照={}, 插入={}, 更新={}, 跳过={}",`；`provider(), config.getId(), stat.getFetched(), stat.getSnapshotCount(),`；`stat.getInserted(), stat.getUpdated(), stat.getSkipped());`；`stat.addSnapshot(Math.max(0, CollUtil.size(preparedOrders) - CollUtil.size(orders)));`；`private BlibliApiResponse<BlibliOrderItemVO> parseResponse(String responseBody) {`；`JSON.parseObject(responseBody, new TypeReference<BlibliApiResponse<BlibliOrderItemVO>>() {`
- `96638ba1`：涉及 6 个文件；新增证据：`private Paging paging;`；`@Data`；`@ApiModel("Blibli 分页信息")`；`public static class Paging {`；`@ApiModelProperty("当前页码")`；`private Integer page;`
- `f404ab0e`：涉及 6 个文件；新增证据：`@ApiModelProperty("奖励佣金信息")`；`private Commission bonusCommission;`；`@ApiModelProperty("三级类目")`；`private String c3Name;`；`@Getter`；`@AllArgsConstructor`
- `29af199c`：涉及 2 个文件；新增证据：`order.setOrderAmount(String.valueOf(ObjectUtil.defaultIfNull(item.getOrderAmount(), 0L)));`；`order.setOpenCommissionAmount(String.valueOf(totalCommissionAmount));`；`order.setInnerCommissionAmount(BigDecimal.valueOf(totalCommissionAmount));`
- `50659455`：涉及 17 个文件；新增证据：`List<CpsAccountConfig> listByProviders(Collection<String> providers);`；`public List<CpsAccountConfig> listByProviders(Collection<String> providers) {`；`protected abstract CpsParsedOrdersVO parseOrders(String responseBody,`；`protected final void doExecute(List<CpsAccountConfig> accounts, CpsProviderEffectiveParamDTO providerParam) {`；`logWarn("[{}] 没有可执行的账号配置", provider());`；`for (CpsAccountConfig config : accounts) {`
- `781f5bd7`：涉及 2 个文件；新增证据：`@Slf4j`；`@Configuration`；`public class CpsOrderPullThreadPoolConfig {`；`public static final String CPS_ORDER_PULL_EXECUTOR = "cpsOrderPullThreadPoolTaskExecutor";`；`@Bean(name = CPS_ORDER_PULL_EXECUTOR)`；`public ThreadPoolTaskExecutor cpsOrderPullThreadPoolTaskExecutor() {`
- `b225481a`：涉及 2 个文件；新增证据：`return DatePattern.NORM_DATETIME_FORMATTER.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(epochMilli), zone));`；`return LocalDate.parse(date.trim(), DatePattern.NORM_DATE_FORMATTER).atTime(timeOfDay).toInstant(zone).toEpochMilli();`
- `feae3ada`：涉及 2 个文件；新增证据：`return this.lambdaQuery()`；`result.addAll(this.lambdaQuery()`；`this.saveBatch(toInsert, BATCH_SIZE);`；`this.updateBatchById(toUpdate, BATCH_SIZE);`

## 核心代码设计

本需求历史上共影响 55 个文件；当前仍可在 `master` 定位 34 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/entity/CpsAccountConfig.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/cps/CpsOrderUpsertResultVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/config/CpsOrderPullThreadPoolConfig.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/BlibliController.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/BlibliDemoController.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/BlibliSignController.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/cps/CpsOrderDebugController.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/CpsAccountConfigMapper.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/ICpsAccountConfigService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/ICpsOrderCommissionService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/CpsAccountConfigServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/CpsOrderCommissionServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/BlibliJobHandler.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/BlibliAffiliateClient.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/BlibliSignUtil.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/BlibliTimeUtil.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliApiCallResultDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliApiResponse.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliCommissionDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliOrderItemDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliOrderQueryDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliPagingDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliProductDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliSignRequestDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/dto/BlibliSignResultDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/vo/BlibliApiResponse.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/blibli/vo/BlibliOrderItemVO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/AbstractCpsOrderPullJobHandler.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/CpsOrderPullJobHandler.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/CpsPageStrategy.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliCpsOrderClient.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliCpsOrderJobHandler.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/BlibliSignUtil.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/dto/BlibliOrderQueryDTO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/vo/BlibliApiResponse.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/vo/BlibliExtConfigVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/blibli/vo/BlibliOrderItemVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/client/AbstractCpsHttpClient.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/client/CpsHttpRequestDTO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/client/ICpsOrderClient.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/constant/CpsProviderConstant.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dto/CpsHttpRequestDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dto/CpsOrderDebugFetchDTO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/dto/CpsPageCursorDTO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/util/CpsProviderMapUtil.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/vo/CpsAccountPullStatVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/vo/CpsParsedOrdersVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/vo/CpsPreparedOrdersVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/jobParam/blibli/BlibliOrderTaskJobParam.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/jobParam/cps/CpsAccountEffectiveParamDTO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/jobParam/cps/CpsAccountJobParamDTO.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/jobParam/cps/CpsOrderPullJobParamDTO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/jobParam/cps/CpsProviderEffectiveParamDTO.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/adv/CPSPbReissueTaskV2.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/EpochMilliUtil.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
