---
id: pac-platform/af-msg
scope: project
project: pac-platform
feature: af-msg
updated: 2026-08-24
tags: [git-history, simon.ye, af_msg]
code_anchors:
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/feign/IAdvClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/approve/audit/retrial/AfAutoAuthEventOptionDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/approve/audit/retrial/AfAutoAuthOptionDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/entity/TrmApproveAfOption.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/feign/ITrmApproveClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveAfOptionVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveAsyncVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveOrderStatusVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/client/AdvClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/AdvertiserMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/IAdvService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_msg`，共 55 条 Simon 提交，时间范围为
2026-02-27 至 2026-04-01。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `e9d28578`（2026-02-27）：feat[af_msg]: 新建实体
- `56e447c6`（2026-02-28）：feat[af_msg]: 请求并保存握手信息
- `fd5bdad7`（2026-02-28）：feat[af_msg]: 异步处理并抛出异常
- `3ef6b42c`（2026-03-04）：feat[af_msg]: 同步事件
- `937e29f5`（2026-03-10）：feat[af_msg]: 同步oneLink
- `0b4ec354`（2026-03-11）：feat[af_msg]: 补充xxljob日志
- `0d169d47`（2026-03-11）：feat[af_msg]: 补充限流
- `7b0dfed8`（2026-03-11）：feat[af_msg]: 查询agencyApp接口
- `8f756ec3`（2026-03-11）：feat[af_msg]: 补充脚本刷新awstoken定时器
- `374a9a35`（2026-03-12）：feat[af_msg]: 补充定时器
- `a74be456`（2026-03-12）：feat[af_msg]: 增加表
- `e19bdb8b`（2026-03-13）：feat[af_msg]: 同步授权事件
- `b3d50a5e`（2026-03-17）：feat[af_msg]: 同步事件至adv+agency+appId维度
- `4fac9551`（2026-03-18）：feat[af_msg]: 添加任务+任务执行改造
- `7b619f78`（2026-03-18）：feat[af_msg]: 补充查询接口，添加任务包查询处理
- `00fc0cc3`（2026-03-19）：feat[af_msg]: 查询接口调整，实体调整，编辑接口
- `1173bc04`（2026-03-19）：feat[af_msg]: 补充批单页回显
- `5c7cbf76`（2026-03-19）：feat[af_msg]: 补充查询字段
- `fb52eddd`（2026-03-19）：feat[af_msg]: 查询接口调整
- `57c95516`（2026-03-20）：feat[af_msg]: 事件校验
- `90b5f708`（2026-03-20）：feat[af_msg]: 点击链异常区分
- `fbcbd573`（2026-03-20）：feat[af_msg]: 事件维度调整，去除实体
- `37e2b827`（2026-03-23）：feat[af_msg]: pid调整
- `53e2aeab`（2026-03-23）：feat[af_msg]: 查询接口字段调整
- `54e5dbc2`（2026-03-23）：feat[af_msg]: 同步、入库调整
- `6d43c4f9`（2026-03-23）：feat[af_msg]: 查询接口字段调整
- `6dbc8bcf`（2026-03-23）：feat[af_msg]: 校验接口调整
- `81374f81`（2026-03-23）：feat[af_msg]: 同步事件改为批量入参
- `9600f124`（2026-03-23）：feat[af_msg]: 补充afLog日志收集
- `caf269ad`（2026-03-23）：feat[af_msg]: 补充必填校验
- `e138d828`（2026-03-23）：feat[af_msg]: 事件同步下游赋默认值
- `3fc0c187`（2026-03-24）：feat[af_msg]: 补充事件变更log
- `420bf372`（2026-03-24）：feat[af_msg]: 补充回传方式
- `c811b80f`（2026-03-24）：feat[af_msg]: 删除af_agency_pid
- `da187718`（2026-03-24）：feat[af_msg]: 日志调整
- `c908c7c0`（2026-03-25）：feat[af_msg]: 批单回显补充信息
- `e327083e`（2026-03-25）：feat[af_msg]: 补充同步包
- `27fc44d3`（2026-03-26）：feat[af_msg]: 空事件处理
- `82ced7a7`（2026-03-26）：feat[af_msg]: 枚举回退
- `a5bb107c`（2026-03-26）：feat[af_msg]: 校验逻辑重写
- `acab1b44`（2026-03-26）：feat[af_msg]: rpc路径修改
- `47a97914`（2026-03-27）：feat[af_msg]: 减少创建client，oneLink方法加睡眠时间
- `4fff3c95`（2026-03-27）：fix[af_msg]: 字段名调整
- `75b6da4b`（2026-03-27）：fix[af_msg]: 枚举处理
- `9223bb6a`（2026-03-27）：fix[af_msg]: 删除无效代码
- `6ad23a51`（2026-03-30）：feat[af_msg]: 批量执行
- `939ba342`（2026-03-30）：feat[af_msg]: 限流调整
- `b1e9938b`（2026-03-31）：fix[af_msg]: 校验补充逻辑
- `f8b70547`（2026-03-31）：feat[af_msg]: 添加任务优化，补充task枚举值
- `48fb1ec2`（2026-04-01）：feat[af_msg]: 补充按审批单ID排序
- `6b3f22a0`（2026-04-01）：feat[af_msg]: 注释补充
- `97d0fc96`（2026-04-01）：feat[af_msg]: 枚举切换
- `c282a1b0`（2026-04-01）：feat[af_msg]: 删除冗余方法
- `e43bf8a9`（2026-04-01）：feat[af_msg]: 更换线程池，调整线程池策略
- `ef90809f`（2026-04-01）：feat[af_msg]: 补充默认值

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `e9d28578`：涉及 8 个文件；新增证据：`@Data`；`@TableName("af_agency_app")`；`public class AfAgencyApp {`；`@TableId(value = "id", type = IdType.AUTO)`；`private Integer id;`；`private String agencyName;`
- `56e447c6`：涉及 26 个文件；新增证据：`public AfDiscoverySearchResponse getActivePids(String appId) {`；`request.setQuery(null);`；`request.setOffset(0);`；`request.setLimit(1000);`；`filter.setKey("status");`；`filter.setValues(Collections.singletonList("active"));`
- `fd5bdad7`：涉及 2 个文件；新增证据：`public R<String> syncAfPids() {`；`return R.data("开始同步");`；`public R<String> syncOneAgencyPid(@RequestBody AfAgencyPidSyncDTO dto) {`；`return R.data("开始同步");`；`private final ThreadPoolTaskExecutor threadPoolTaskExecutor;`；`log.info("开始处理agency: {}",agency);`
- `3ef6b42c`：涉及 11 个文件；新增证据：`@Data`；`@NoArgsConstructor`；`@AllArgsConstructor`；`@Builder`；`@ApiModel(value = "af agency 信息同步DTO")`；`public class AfAgencyMsgSyncDTO {`
- `937e29f5`：涉及 4 个文件；新增证据：`@PostMapping("/syncAll/oneLink")`；`@ApiOperation("同步所有AF Agency App OneLink配置")`；`public R<String> syncAllOneLink() {`；`afAgencyAppService.syncAfAgencyAppsOneLinkTask();`；`return R.success("同步完成");`；`@PostMapping("/sync/oneLink")`
- `0b4ec354`：涉及 3 个文件；新增证据：`logInfo("同步开始");`；`logInfo("agency: {}, 同步成功的appId: {}", agency, successAppIds);`；`logError("agency: {} 同步异常", agency, e);`；`logInfo("同步成功的agency: {}", successAgencies);`；`logInfo("同步失败的agency及包名: {}", failedAgencies);`；`logInfo("同步结束");`
- `0d169d47`：涉及 2 个文件；新增证据：`@RedisLimit(time = 60, count = 1, type = LimitType.REQUEST_URI)`；`@RedisLimit(time = 30, count = 5, type = LimitType.REQUEST_URI_USERID)`；`@RedisLimit(time = 60, count = 1, type = LimitType.REQUEST_URI)`；`@RedisLimit(time = 30, count = 5, type = LimitType.REQUEST_URI_USERID)`；`@RedisLimit(time = 60, count = 1, type = LimitType.REQUEST_URI)`；`@RedisLimit(time = 30, count = 5, type = LimitType.REQUEST_URI_USERID)`
- `7b0dfed8`：涉及 8 个文件；新增证据：`@FeignClient(value = PacAppConstant.APP_NAME_FOREIGN,`；`public interface IAfAgencyAppClient {`；`@PostMapping("/query")`；`R<List<AfAgencyAppQueryVO>> query(@RequestBody AfAgencyAppQueryDTO dto);`；`@Component`；`class IAfAgencyAppClientFallback implements IAfAgencyAppClient {`
- `8f756ec3`：涉及 2 个文件；新增证据：`private final AfHandleHelper afHandleHelper;`；`@XxlJob("syncAwsWafToken")`；`public void syncAwsWafToken() {`；`XxlJobHelper.log("XXL-JOB, 获取AWS WAF Token");`；`afHandleHelper.syncAwsWafToken();`；`private final StringRedisTemplate redisTemplate;`
- `374a9a35`：涉及 1 个文件；新增证据：`private final IAfAgencyAppService afAgencyAppService;`；`@XxlJob("syncAfAgencyAppsEventTask")`；`public void syncAfAgencyAppsEventTask() {`；`XxlJobHelper.log("XXL-JOB, 同步所有Agency App Event配置开始");`；`afAgencyAppService.syncAfAgencyAppsEventTask();`；`XxlJobHelper.log("XXL-JOB, 同步所有Agency App Event配置完成");`
- `a74be456`：涉及 5 个文件；新增证据：`@Data`；`@NoArgsConstructor`；`@AllArgsConstructor`；`@Builder`；`@TableName("af_auth_event")`；`public class AfAuthEvent {`
- `e19bdb8b`：涉及 15 个文件；新增证据：`@Data`；`@Builder`；`public class AdvAgencyPackageQueryDTO {`；`private String agencyName;`；`private Collection<String> packageNames;`；`@PostMapping("/listAdvAgencyPackage")`
- `b3d50a5e`：涉及 3 个文件；新增证据：`@AllArgsConstructor`；`@NoArgsConstructor`；`logInfo("未找到关联的event信息，agency: {}, appIds: {}", agencyName, appIdSet);`；`AdvAgencyPackageQueryDTO.builder().agencyName(agencyName).packageNames(appIdSet).build()`；`logInfo("未找到关联的adv信息，agency: {}, appIds: {}", agencyName, appIdSet);`；`return advAgencyPackageQueryVOList.stream().flatMap(vo -> {`
- `4fac9551`：涉及 14 个文件；新增证据：`@Data`；`public class AfAutoAuthEventOptionDTO {`；`@ApiModelProperty(value = "广告主事件")`；`private String advEventName;`；`@ApiModelProperty(value = "下游事件")`；`private String partnerEventName;`
- `7b619f78`：涉及 10 个文件；新增证据：`private final IAfAuthEventClient afAuthEventClient;`；`queryDTO.setAgencyNames(Collections.singletonList(agencyName));`；`queryDTO.setAppIds(Collections.singletonList(packageName));`；`queryDTO.setSize(Integer.MAX_VALUE);`；`afAutoAuthEventOptionDTO.setAdvEventName(afAuthEventVO.getAdvEventName());`；`afAutoAuthEventOptionDTO.setPartnerEventName(afAuthEventVO.getPartnerEventName());`
- `00fc0cc3`：涉及 8 个文件；新增证据：`@ApiModelProperty("广告主事件名称")`；`private String advEventName;`；`@ApiModelProperty("创建时间范围")`；`private RangeDTO createTimeRange;`；`@ApiModelProperty("更新时间范围")`；`private RangeDTO updateTimeRange;`
- `1173bc04`：涉及 3 个文件；新增证据：`@TableField(value = "is_cancel_event_postback")`；`@ApiModelProperty(value = "是否取消事件回传：0否 1是")`；`private Byte isCancelEventPostback;`；`@ApiModelProperty(value = "是否取消事件回传：0否 1是")`；`private Byte isCancelEventPostback;`；`if (CollectionUtil.isEmpty(afAutoAuthOption.getAfAutoAuthEventOptions())) {`
- `5c7cbf76`：涉及 2 个文件；新增证据：`@ApiModelProperty("创建人Id")`；`private Long creator;`；`@ApiModelProperty("创建人")`；`private String creatorName;`；`@ApiModelProperty("更新人")`；`@ApiModelProperty("删除标识")`
- `fb52eddd`：涉及 1 个文件；新增证据：`and adv_event_name like concat('%', #{dto.advEventName}, '%')`
- `57c95516`：涉及 7 个文件；新增证据：`@Data`；`public class AfAuthEventCheckDTO {`；`@NotEmpty(message = "查询条件不能为空")`；`@ApiModelProperty(value = "查询条件列表", required = true)`；`private List<Item> items;`；`@Data`
- `90b5f708`：涉及 2 个文件；新增证据：`CODE_40025(40025, "点击链格式有误，请到Appsflyer核验", "点击链格式有误，请到Appsflyer核验",null),`；`checkClickLink(task);`；`private void checkClickLink(AfAutoAuthTask task){`；`Optional.ofNullable(task.getClickThroughLink()).ifPresent(clickLink->{`；`if (!pattern.matcher(clickLink).matches()){`；`throw new AppsFlyerClient.AfServiceExceptionV2(AppsFlyerConst.ErrorMsgEnum.CODE_40025);`
- `fbcbd573`：涉及 24 个文件；新增证据：`private final IAfAgencyAppClient afAgencyAppClient;`；`queryDTO.setType(AfAgencyApp.TypeEnum.EVENT);`；`queryDTO.setAppIdList(Collections.singletonList(packageName));`；`queryDTO.setAgencyNameList(Collections.singletonList(agencyName));`；`afAutoAuthEventOptionDTO.setAdvEventName(afAgencyAppVO.getAdvEventName());`；`afAutoAuthEventOptionDTO.setPartnerEventName(afAgencyAppVO.getPartnerEventName());`
- `37e2b827`：涉及 2 个文件；新增证据：`return getAfAgencyAppsStrategyFunction.apply(Tuple3.tuple(agency, client, appId));`；`private List<AfAgencyApp> getAfAgencyAppsEventStrategy(Tuple3<String, AppsFlyerClient, String> tuple3) {`；`private List<AfAgencyApp> getAfAgencyAppsOneLinkStrategy(Tuple3<String, AppsFlyerClient, String> tuple3) {`；`@Value("${appsflyer.msg_pull.pid}")`；`private String afMsgPullPid;`；`public Map<String, String> getAfAgencyEventMsg(String agency, AppsFlyerClient client, String appId) {`
- `53e2aeab`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `54e5dbc2`：涉及 2 个文件；新增证据：`saveEventResult(agency, resultList);`；`saveOneLinkResult(agency, resultList);`；`saveEventResult(item.getAgencyName(), resultList);`；`saveOneLinkResult(item.getAgencyName(), resultList);`；`private void saveEventResult(String agencyName, List<AfAgencyApp> resultList) {`；`Optional.ofNullable(historyMap.get(StrUtil.format("{}-{}-{}", k.getAgencyName(), k.getAppId(), k.getAdvEventName()))).ifPresent(history -> {`
- `6d43c4f9`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `6dbc8bcf`：涉及 2 个文件；新增证据：`private List<EventItem> eventItemList;`；`@ApiModelProperty(value = "afAgencyApp主键ID")`；`private List<Integer> afAgencyAppIds;`；`eventItem.setAdvEventName(split[0]);`；`eventItem.setPartnerEventName(split[1]);`；`eventItem.setAfAgencyAppIds(CollStreamUtil.toList(entry.getValue(), AfAgencyApp::getId));`
- `81374f81`：涉及 3 个文件；新增证据：`@Valid`；`@NotEmpty(message = "items不能为空")`；`@ApiModelProperty(value = "同步条件列表", required = true)`；`private List<Item> items;`；`@Data`；`@NoArgsConstructor`
- `9600f124`：涉及 1 个文件；新增证据：`@AfAuthLog`；`@AfAuthLog`；`@AfAuthLog`；`@AfAuthLog`
- `caf269ad`：涉及 2 个文件；新增证据：`@ApiModelProperty(value = "agencyName", notes = "agencyName不能为空", required = true)`；`public R<String> sync(@Validated @RequestBody AfAgencyMsgSyncDTO dto) {`；`public R<String> syncOneLink(@Validated @RequestBody AfAgencyMsgSyncDTO dto) {`
- `e138d828`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `3fc0c187`：涉及 6 个文件；新增证据：`@Data`；`@Builder`；`@AllArgsConstructor`；`@NoArgsConstructor`；`@TableName("af_agency_app_log")`；`public class AfAgencyAppLog {`
- `420bf372`：涉及 7 个文件；新增证据：`@ApiModelProperty(value = "事件回传方式：ALL-全量回传，PARTIAL-部分回传，NONE-全量不回传")`；`private AfEventPostbackEnum afEventPostbackType;`；`@TableField(value = "af_event_postback_type")`；`@ApiModelProperty(value = "af事件回传类型")`；`@EnumValue`；`private AfEventPostbackEnum afEventPostbackType;`
- `c811b80f`：涉及 6 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `da187718`：涉及 3 个文件；新增证据：`return R.data("同步完成");`；`return R.data("同步完成");`；`appIds.forEach(appId -> {`；`emptyAppIds.add(appId);`；`failedAppIds.add(appId);`；`saveEventResult(agency, resultList);`
- `c908c7c0`：涉及 2 个文件；新增证据：`@ApiModelProperty(value = "事件回传方式：ALL-全量回传，PARTIAL-部分回传，NONE-全量不回传")`；`private AfEventPostbackEnum afEventPostbackType;`；`@ApiModelProperty(value = "自动授权事件映射")`；`private List<AfAutoAuthEventOptionDTO> afAutoAuthEventOptions;`；`afAutoAuthEventOptionDTO.setAdvEventName(k.getAdvEventName());`；`afAutoAuthEventOptionDTO.setPartnerEventName(k.getEventName());`
- `e327083e`：涉及 5 个文件；新增证据：`@PostMapping("/syncByAgencyName")`；`R<String> batchSyncAgencyAppsByAgencyName(@RequestParam("agencyNames") Set<String> agencyNames);`；`@Override`；`public R<String> batchSyncAgencyAppsByAgencyName(Set<String> agencyNames) {`；`return R.failure(this.getClass().getName());`；`@Override`
- `27fc44d3`：涉及 1 个文件；新增证据：`if (CollectionUtil.isEmpty(allEvents)) {`；`result.setConsistent(true);`
- `82ced7a7`：涉及 2 个文件；新增证据：`ALL(0, "全量回传"),`；`PARTIAL(1, "部分回传"),`；`NONE(2, "全量不回传"),`；`private final Integer code;`；`ALL(0, "全量回传"),`；`PARTIAL(1, "部分回传"),`
- `a5bb107c`：涉及 13 个文件；新增证据：`@GetMapping("/getTrmApproveOrderStatus")`；`R<List<TrmApproveOrderStatusVO>> getTrmApproveOrderStatus(@RequestParam("trmApproveIds") List<Integer> trmApproveIds);`；`@Override`；`public R<List<TrmApproveOrderStatusVO>> getTrmApproveOrderStatus(List<Integer> trmApproveIds) {`；`return R.failure(this.getClass().getName());`；`@Data`
- `acab1b44`：涉及 2 个文件；新增证据：`@RequestMapping("/af/agency/app/client")`
- `47a97914`：涉及 2 个文件；新增证据：`if (CollectionUtil.isEmpty(agencyAccountMap.get(agency))) {`；`logError("agency: {} , 无可用账号", agency);`；`private List<AfAgencyApp> getAfAgencyApps(AppsFlyerClient client,`；`if (CollectionUtil.isEmpty(agencyAccountMap.get(agency))) {`；`logError("agency: {} , 无可用账号", agency);`；`private void logError(String format, Object arg) {`
- `4fff3c95`：涉及 3 个文件；新增证据：`private List<Item> items;`；`private final ThreadPoolTaskExecutor threadPoolTaskExecutor;`；`public List<AppsFlyerClient> randomGetAllAvailableClient(List<AfAccount> afAccounts) {`；`AssertX.notEmpty(afAccounts, "未找到该Agency可用于授权的AF账号，可能为新主体，请联系技术人员处理。");`；`appsFlyerClient.getToken();`；`clientList.add(appsFlyerClient);`
- `75b6da4b`：涉及 2 个文件；新增证据：`ALL("全量回传"),`；`PARTIAL("部分回传"),`；`NONE("全量不回传"),`；`enum CallbackResult {`；`ALL("全量回传"),`；`PARTIAL("部分回传"),`
- `9223bb6a`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `6ad23a51`：涉及 2 个文件；新增证据：`private static final int SYNC_CONCURRENCY_LIMIT = 5;`；`futures.add(submitWithSemaphore(semaphore, () -> syncEventForAgency(agency, appIds, agencyAccountMap)));`；`logInfo("同步结束, 全部成功: {}", allSuccess);`；`private void syncEventForAgency(String agency, List<String> appIds, Map<String, List<AfAccount>> agencyAccountMap) {`；`if (CollectionUtil.isEmpty(agencyAccountMap.get(agency))) {`；`logError("agency: {} , 无可用账号", agency);`
- `939ba342`：涉及 2 个文件；新增证据：`@RedisLimit(time = 3 * 60, count = 1, type = LimitType.REQUEST_URI_USERID)`
- `b1e9938b`：涉及 1 个文件；新增证据：`if (!requestKeys.equals(resultKeys)) {`；`result.setConsistent(false);`
- `f8b70547`：涉及 3 个文件；新增证据：`trmApproveAutoLogService.saveOrUpdateBatch(trmApproveAutoLogList);`；`@TableField(value = "af_event_postback_type")`；`private AutoAuthConstant.AfTaskEventPostbackEnum afEventPostbackType;`
- `48fb1ec2`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `6b3f22a0`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `97d0fc96`：涉及 1 个文件；新增证据：`switch (Objects.requireNonNull(TrmApproveConstant.OrderStatusEnum.ofCode(orderStatus))) {`
- `c282a1b0`：涉及 8 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `e43bf8a9`：涉及 2 个文件；新增证据：`private final ThreadPoolTaskExecutor afThreadPoolTaskExecutor;`；`return afThreadPoolTaskExecutor.submit(() -> {`；`afThreadPoolTaskExecutor.submit(() -> {`；`executor.setCorePoolSize(Runtime.getRuntime().availableProcessors() * 6);`；`executor.setQueueCapacity(100);`；`executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());`
- `ef90809f`：涉及 1 个文件；新增证据：`@Value("${appsflyer.msg_pull.pid:adeliver_int}")`

## 核心代码设计

本需求历史上共影响 99 个文件；当前仍可在 `master` 定位 80 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/AdvAgencyPackageQueryDTO.java`（当前已不存在或已改名）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/feign/IAdvClient.java`（当前仍存在）
- `pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/vo/AdvAgencyPackageQueryVO.java`（当前已不存在或已改名）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/approve/audit/retrial/AfAutoAuthEventOptionDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/approve/audit/retrial/AfAutoAuthOptionDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/entity/TrmApproveAfOption.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/enums/AfEventPostbackEnum.java`（当前已不存在或已改名）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/feign/ITrmApproveClient.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveAfOptionVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveAsyncVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveOrderStatusVO.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/client/AdvClient.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/mapper/AdvertiserMapper.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/IAdvService.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/resources/mapper/AdvertiserMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/TrmApproveController.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/feign/TrmApproveClient.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ITrmApproveAutoService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ITrmApproveService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/approve/audit/TrmApproveAuditService.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/appsflyer/AfDiscoverySearchRequest.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/appsflyer/AfDiscoverySearchResponse.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/appsflyer/AppsFlyerConst.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/aws/AwsWafTokenUtils.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/client/IAfAccountAppClient.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/client/IAfAgencyAppClient.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/client/IAfAuthEventClient.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/constant/AutoAuthConstant.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAgencyAppQueryDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAgencyEventCheckDTO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAgencyEventUpdateDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAgencyMsgSyncDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAgencyPidSyncDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAuthEventCheckDTO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAuthEventPageQueryDTO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAuthEventSyncDTO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAuthEventUpdateDTO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfTaskAutoAuthEventOptionDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AutoAuthTaskAddDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAgencyApp.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAgencyAppLog.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAgencyPid.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAuthEvent.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTask.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTaskEventMapping.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AfAgencyAppQueryVO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AfAgencyAppVO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AfAgencyEventCheckVO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AfAuthEventCheckVO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AfAuthEventVO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/TrmApproveLatestEventVO.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/client/AfAccountAppClient.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/client/AfAgencyAppClient.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/client/AfAuthEventClient.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAccountAppController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAgencyAppController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAgencyPidController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAuthEventController.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/jobs/XxlJobHandler.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAccountMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAgencyAppLogMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAgencyAppMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAgencyPidMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAuthEventMapper.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthTaskEventMappingMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthTaskEventMappingService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAccountAppService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAccountService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAgencyAppLogService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAgencyAppService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAgencyPidService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAuthEventService.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAccountAppServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAccountServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAgencyAppLogServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAgencyAppServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAgencyPidServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAuthEventServiceImpl.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskEventMappingServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/AfHandleHelper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/AfterScreenshotStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/BeforeScreenshotStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/GetAppsFlyerClientStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/GetAttributionLinksStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/SetAttributionLinkStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/SetIntegrationPageInfoStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/SetPermissionsStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/config/AfThreadPoolConfig.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAccountMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAgencyAppLogMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAgencyAppMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAgencyPidMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAuthEventMapper.xml`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthTaskEventMappingMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
