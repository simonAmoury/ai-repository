---
id: pac-platform/af-handshake
scope: project
project: pac-platform
feature: af-handshake
updated: 2026-08-24
tags: [git-history, simon.ye, af_handshake]
code_anchors:
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferBaseInfoDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/entity/Agency.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/AfAutoAuthBatchResultDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/AfHandshakeNoticeDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/WebSocketNoticeDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/enums/WebsocketBizEnum.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/feign/IWebSocketClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/TrmApprovePageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmPageSelectVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-system/src/main/java/com/tecdo/pac/biz/system/feign/WebSocketClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/AfHandshakeSyncService.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_handshake`，共 38 条 Simon 提交，时间范围为
2026-04-07 至 2026-05-07。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `dfd6f2a7`（2026-04-07）：feat[af_handshake]: 同步PID握手信息功能
- `a5e21d98`（2026-04-08）：feat[af_handshake]: 提取公共工具
- `75134b6d`（2026-04-09）：feat[af_handshake]: 指定枚举入库类型
- `bbca60f8`（2026-04-09）：feat[af_handshake]: 按pid同步所有prt信息
- `eb329411`（2026-04-09）：feat[af_handshake]: 改为枚举值
- `316faea5`（2026-04-13）：feat[af_handshake]: 补充xxljob打印配置
- `50985d5a`（2026-04-13）：feat[af_handshake]: 补充飞书回调类型，foreign回调入口
- `e9351985`（2026-04-13）：feat[af_handshake]: 补充代理账号类型
- `3a4a4313`（2026-04-14）：feat[af_handshake]: 测试回调
- `422b1d04`（2026-04-14）：feat[af_handshake]: 批单分页查询增加握手信息
- `b1d2bb3c`（2026-04-14）：feat[af_handshake]: 申单增加同步握手信息功能
- `1744afd2`（2026-04-15）：feat[af_handshake]: 批单分页查询筛选条件改为批量
- `41b3e4c6`（2026-04-15）：feat[af_handshake]: 发通知处理
- `9afc2a31`（2026-04-15）：feat[af_handshake]: 发通知处理
- `104c6d7a`（2026-04-16）：feat[af_handshake]: 通知加回调处理
- `58ec43e2`（2026-04-16）：feat[af_handshake]: 批单分页补充代理账号类型
- `6566125e`（2026-04-16）：feat[af_handshake]: 增加防重+删除用过的key
- `7389725a`（2026-04-16）：feat[af_handshake]: 批单导出
- `ab6ece69`（2026-04-16）：feat[af_handshake]: 重新发送通知调整
- `cd9241f3`（2026-04-16）：feat[af_handshake]: 取消导出
- `f7086d5d`（2026-04-16）：feat[af_handshake]: 通知加回调处理
- `ac0ed735`（2026-04-17）：feat[af_handshake]: 同步接口补充异常抛出
- `b86ab6d9`（2026-04-17）：feat[af_handshake]: 参数类型转换
- `7077fdf6`（2026-04-23）：feat[af_handshake]: 落库逻辑调整+异常处理
- `8645686a`（2026-04-23）：feat[af_handshake]: 缺包信息时，重新同步包信息
- `5292dd14`（2026-04-24）：feat[af_handshake]: 握手信息通知CM
- `2cd939ab`（2026-04-27）：feat[af_handshake]: 批单通知合并
- `27f9d068`（2026-04-28）：feat[af_handshake]: 批单通知调整
- `85bc7e85`（2026-04-28）：feat[af_handshake]: 批单回调赋值
- `c122ccb4`（2026-04-28）：feat[af_handshake]: 批单通知调整
- `ef77a401`（2026-04-28）：feat[af_handshake]: 批单通知redis key修改
- `9f74c8ef`（2026-04-29）：feat[af_handshake]: 批单查询调整
- `338fd7e4`（2026-04-30）：feat[af_handshake]: 飞书防抖变量名修改
- `aabe030a`（2026-04-30）：feat[af_handshake]: 补充全量同步的定时器
- `af879b9e`（2026-05-06）：bugfix[af_handshake]: 事务中数据源切换
- `11af45ea`（2026-05-07）：bugfix[af_handshake]: AF请求失败，依旧落库af_agency_pid
- `7432ad52`（2026-05-07）：bugfix[af_handshake]: 同步握手时去重
- `803a49f2`（2026-05-07）：bugfix[af_handshake]: TO飞书通知，更改名称字段

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `dfd6f2a7`：涉及 17 个文件；新增证据：`@Data`；`@NoArgsConstructor`；`@AllArgsConstructor`；`@Builder`；`@ApiModel(value = "af agency pid 查询DTO")`；`public class AfAgencyPidQueryDTO {`
- `a5e21d98`：涉及 1 个文件；新增证据：`futures.add(ConcurrentHelper.submitWithSemaphore(semaphore, afThreadPoolTaskExecutor, () -> syncEventForAgency(agency, appIds, agencyAccountMap)));`；`futures.add(ConcurrentHelper.submitWithSemaphore(semaphore, afThreadPoolTaskExecutor, () -> syncOneLinkForAgency(agency, appIds, agencyAccountMap)));`；`dto.getItems().forEach(item -> futures.add(ConcurrentHelper.submitWithSemaphore(semaphore, afThreadPoolTaskExecutor, () -> syncAfAgencyAppEventByItem(item))));`；`ConcurrentHelper.awaitAll(futures, true);`；`dto.getItems().forEach(item -> futures.add(ConcurrentHelper.submitWithSemaphore(semaphore, afThreadPoolTaskExecutor, () -> syncAfAgencyAppOneLinkByItem(item))));`；`ConcurrentHelper.awaitAll(futures, true);`
- `75134b6d`：涉及 1 个文件；新增证据：`@EnumValue`
- `bbca60f8`：涉及 3 个文件；新增证据：`@PostMapping("/syncByPidList")`；`@ApiOperationSupport(order = 4)`；`@ApiOperation(value = "对所有 prt 同步指定 pidList 的握手状态")`；`@RedisLimit(time = 60, count = 1, type = LimitType.REQUEST_URI)`；`public R<String> syncByPidList(@RequestBody List<String> pidList) {`；`afAgencyPidService.syncByPidList(pidList);`
- `eb329411`：涉及 2 个文件；新增证据：`public static HandshakeStatusEnum of(String value)  {`；`AssertX.isTrue(ObjectUtil.isNotNull(handshakeStatus), "未匹配的握手状态：" + result.getData().getStatus());`
- `316faea5`：涉及 1 个文件；新增证据：`public static class ContextCopyTaskDecorator implements TaskDecorator {`；`private static final Logger log = LoggerFactory.getLogger(com.tecdo.pac.core.executor.decorator.ContextCopyTaskDecorator.class);`；`public Runnable decorate(Runnable runnable) {`；`return () -> {`；`contextMapOpt.ifPresent(MDC::setContextMap);`；`XxlJobContext.setXxlJobContext(xxlJobContext);`
- `50985d5a`：涉及 6 个文件；新增证据：`DUAL_ROLE_APPROVAL(7, "双角色预审批", "trade", TYPE_DUAL_ROLE_APPROVAL),`；`AF_HANDSHAKE(8, "AF握手信息", "foreign", TYPE_AF_HANDSHAKE)`；`@RestController`；`@RequiredArgsConstructor`；`@RequestMapping("/fs/message")`；`@Api(value = "飞书消息回调", tags = "飞书消息回调")`
- `e9351985`：涉及 1 个文件；新增证据：`private AgencyTypeEnum agencyType;`；`@Getter`；`@AllArgsConstructor`；`public enum AgencyTypeEnum {`；`INTERNAL("internal", "内部"),`；`EXTERNAL("external", "外部"),`
- `3a4a4313`：涉及 3 个文件；新增证据：`private final PacRedis pacRedis;`；`private static final Long AF_HANDSHAKE_NOTIFY_TMPL_ID = 2043899948546375682L;`；`agencyPidMap.forEach((agencyName, pidList) -> items.add(`；`AfAgencyPidQueryDTO.AgencyPidQueryItem.builder()`；`if (CollUtil.isEmpty(refreshedResult)) {`；`if (CollUtil.isEmpty(stillNotOk)) {`
- `422b1d04`：涉及 3 个文件；新增证据：`@ExcelIgnore`；`@ApiModelProperty(value = "握手状态")`；`private HandshakeStatusEnum handshakeStatus;`；`@ApiModelProperty(value = "握手状态")`；`private HandshakeStatusEnum handshakeStatus;`
- `b1d2bb3c`：涉及 8 个文件；新增证据：`private Agency.AgencyTypeEnum agencyType;`；`@Slf4j`；`@Service`；`@RequiredArgsConstructor`；`public class AfHandshakeSyncService {`；`private final IAfAgencyPidClient afAgencyPidClient;`
- `1744afd2`：涉及 2 个文件；新增证据：`private List<HandshakeStatusEnum> handshakeStatusList;`
- `41b3e4c6`：涉及 1 个文件；新增证据：`if (ObjectUtil.isNull(offerBaseInfo)) {`；`for (TrmApprove approve : trmApproves) {`；`if (ObjectUtil.isNull(info) || StrUtil.isBlank(info.getAgencyName()) || StrUtil.isBlank(approve.getPid())) {`；`agencyPidApproveMap.computeIfAbsent(key, k -> new ArrayList<>()).add(approve);`；`for (AfAgencyPidVO vo : stillNotOk) {`；`if (CollUtil.isEmpty(matched)) {`
- `9afc2a31`：涉及 2 个文件；新增证据：`if (MapUtil.isEmpty(userMap)) {`；`log.warn("TO 用户信息为空，跳过飞书通知");`；`if (MapUtil.isEmpty(rowMap)) {`；`toRowsMap.forEach((toName, toRows) -> sendCardToReceiver(toName, toNameEmailMap.get(toName), toRows));`；`private Map<Long, UserVO> queryToUserMap(List<TrmApprove> trmApproves) {`；`if (StrUtil.isBlank(userIdStr)) {`
- `104c6d7a`：涉及 2 个文件；新增证据：`@Value("${af_handshake_to_tmplId}")`；`private Long AF_HANDSHAKE_TO_NOTIFY_TMPL_ID;`；`agencyPidMap.forEach((agency, pidList) -> {`；`for (String pid : pidList) {`；`if (!cachedKeySet.contains(agency + "|" + pid)) {`；`notOkMap.computeIfAbsent(agency, k -> new ArrayList<>()).add(pid);`
- `58ec43e2`：涉及 2 个文件；新增证据：`@ExcelIgnore`；`@ApiModelProperty(value = "三方平台账户类型")`；`private Agency.AgencyTypeEnum agencyType;`
- `6566125e`：涉及 4 个文件；新增证据：`tmplParams.put("prevent_duplication",Boolean.TRUE);`；`tmplParams.put("interval_time", 5 * 1000);`；`updateOriginalCard(taskId, rows, redisKey);`；`log.error("AF握手回调：未从Redis找到taskId, uniqueId: {}, redisKey: {}", uniqueId, redisKey);`；`throw new ServiceException(StrUtil.format("AF握手回调：未从Redis找到taskId, uniqueId: {}, redisKey: {}", uniqueId, redisKey));`；`tmplParams.put("prevent_duplication",Boolean.TRUE);`
- `7389725a`：涉及 1 个文件；新增证据：`@ExcelProperty(value = "握手状态", order = 31)`
- `ab6ece69`：涉及 1 个文件；新增证据：`tmplParams.put("tableData", JsonUtil.toJson(rows));`；`tmplParams.put("uniqueId", uuid);`
- `cd9241f3`：涉及 1 个文件；新增证据：`@ExcelIgnore`；`@ApiModelProperty(value = "浮动扣量比例")`；`private BigDecimal oldFloatRatio;`；`@ExcelIgnore`；`@ApiModelProperty(value = "佣金扣价比例")`；`private BigDecimal showPricePercent;`
- `f7086d5d`：涉及 4 个文件；新增证据：`private final PacRedis pacRedis;`；`private Long resolveCmId(String cmUsername) {`；`if (StrUtil.isBlank(cmUsername)) {`；`return ObjectUtil.isNotNull(user) ? user.getId() : null;`；`tmplParams.put("tableData", JsonUtil.toJson(toRows));`；`tmplParams.put("uniqueId", uuid);`
- `ac0ed735`：涉及 1 个文件；新增证据：`ConcurrentHelper.awaitAll(futures, true);`；`logError(errMsg);`；`throw new ServiceException(errMsg);`；`logError(errMsg);`；`throw new ServiceException(errMsg);`
- `b86ab6d9`：涉及 2 个文件；新增证据：`tmplParams.put("prevent_duplication","TRUE");`；`tmplParams.put("interval_time", String.valueOf(5000));`；`tmplParams.put("prevent_duplication","TRUE");`；`tmplParams.put("interval_time", String.valueOf(5000));`
- `7077fdf6`：涉及 2 个文件；新增证据：`UNAVAILABLE("unavailable", "PID不可用"),`；`ERROR("error","同步错误")`；`resultList.add(buildAfAgencyPid(agency, pid, handshakeStatus, packageName));`；`for (AfAgencyPid entity : entityList) {`；`if (ObjectUtil.isNull(existing)) {`；`resultList.add(entity);`
- `8645686a`：涉及 1 个文件；新增证据：`private final IAfAccountAppService afAccountAppService;`；`logInfo("agency: {} 无关联的 package_name，触发同步", agency);`；`afAccountAppService.batchSyncAgencyAppsByAgencyName(Collections.singleton(agency));`；`if (CollUtil.isEmpty(agencyAppVOList)) {`；`logError(errMsg);`；`throw new ServiceException(errMsg);`
- `5292dd14`：涉及 6 个文件；新增证据：`@Setter`；`@Getter`；`@ApiModel(description = "AF握手检查通知")`；`public class AfHandshakeNoticeDTO extends WebSocketNoticeDTO {`；`@ApiModelProperty(value = "检查时间，精确到分钟")`；`private LocalDateTime checkTime;`
- `2cd939ab`：涉及 7 个文件；新增证据：`TURN_OFF_AF_AUTH_NOTICE("关闭AF授权通知"),`；`public interface CounterService {`；`Boolean incrementTotal(String counterKey, String lockKey, int total);`；`Boolean checkTotal(String counterKey, String lockKey, int total);`；`CounterSnapshot onCallback(String duplicateKey, String counterKey, String lockKey, int success, int fail);`；`@Slf4j`
- `27f9d068`：涉及 1 个文件；新增证据：`batchId, callbackDTO.getTaskId(), websocketBizEnum.getDesc(), success, failure);`；`StrUtil.format(AutoAuthConstant.AF_AUTO_AUTH_TASK_COUNT, websocketBizEnum.getDesc(), callbackDTO.getCreator()),`；`StrUtil.format(AutoAuthConstant.AF_AUTO_AUTH_TASK_COUNT_LOCK, websocketBizEnum.getDesc(), callbackDTO.getCreator()),`；`batchResultDTO.setWebsocketBizEnum(websocketBizEnum);`；`batchId, websocketBizEnum.getDesc(), snapshot.getTotal(), snapshot.getSuccess(), snapshot.getFail());`
- `85bc7e85`：涉及 1 个文件；新增证据：`batchResultDTO.setTotal(snapshot.getTotal());`
- `c122ccb4`：涉及 4 个文件；新增证据：`int getFieldValue(String counterKey, String field);`；`public static final String FIELD_TOTAL = "total";`；`public static final String FIELD_SUCCESS = "success";`；`public static final String FIELD_FAIL = "fail";`；`@Override`；`public int getFieldValue(String counterKey, String field) {`
- `ef77a401`：涉及 2 个文件；新增证据：`StrUtil.format(AutoAuthConstant.AF_AUTO_AUTH_TASK_COUNT, AutoAuthConstant.AutoAuthTaskType.getDesc(type), callbackDTO.getCreator()),`；`StrUtil.format(AutoAuthConstant.AF_AUTO_AUTH_TASK_COUNT_LOCK, AutoAuthConstant.AutoAuthTaskType.getDesc(type), callbackDTO.getCreator()),`；`public static String getDesc(String name) {`；`for (AutoAuthTaskType type : AutoAuthTaskType.values()) {`；`if (type.name().equals(name)) {`；`return type.getDesc();`
- `9f74c8ef`：涉及 1 个文件；新增证据：`AND coalesce(aap.handshake_status, 'default') in`
- `338fd7e4`：涉及 4 个文件；新增证据：`tmplParams.put("anti_shake","TRUE");`；`tmplParams.put("anti_shake","TRUE");`；`if (BooleanUtil.toBoolean(action.get("anti-shake"))) {`
- `aabe030a`：涉及 1 个文件；新增证据：`private final IAfAgencyPidService afAgencyPidService;`；`@XxlJob("syncAfAgencyPidTask")`；`public void syncAllAgencyPid() {`；`XxlJobHelper.log("XXL-JOB, 同步所有Agency Agency Pid 配置开始");`；`afAgencyPidService.syncAll();`；`XxlJobHelper.log("XXL-JOB, 同步所有Introduce local variable 配置完成");`
- `af879b9e`：涉及 1 个文件；新增证据：`DynamicDataSourceContextHolder.push("adplatform");`；`transactionTemplate.execute(status -> {`；`for (AfAgencyPid entity : entityList) {`；`if (ObjectUtil.isNull(existing)) {`；`resultList.add(entity);`；`existing.setHandshakeStatus(entity.getHandshakeStatus());`
- `11af45ea`：涉及 1 个文件；新增证据：`if (CollUtil.isNotEmpty(pidList)) {`；`saveResult(agency, errorList);`；`logInfo("agency: {}, 同步异常，已将 {} 个 pid 标记为 ERROR 状态", agency, pidList.size());`；`logError("agency: {}, 保存 ERROR 状态失败: {}", agency, saveEx.getMessage());`
- `7432ad52`：涉及 2 个文件；新增证据：`agencyPidMap.replaceAll((agency, pidList) -> pidList.stream().distinct().collect(Collectors.toList()));`；`return pidList.stream().distinct().collect(Collectors.toList());`
- `803a49f2`：涉及 1 个文件；新增证据：`return ObjectUtil.isNull(userVO) ? "" : StrUtil.blankToDefault(userVO.getAccount(), "");`

## 核心代码设计

本需求历史上共影响 51 个文件；当前仍可在 `master` 定位 50 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferBaseInfoDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/entity/Agency.java`（当前仍存在）
- `pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/AfAutoAuthBatchResultDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/AfHandshakeNoticeDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/WebSocketNoticeDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/enums/WebsocketBizEnum.java`（当前仍存在）
- `pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/feign/IWebSocketClient.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/TrmApprovePageVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmPageSelectVO.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-system/src/main/java/com/tecdo/pac/biz/system/feign/WebSocketClient.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/AfHandshakeSyncService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/counter/CounterService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/counter/CounterServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/counter/CounterSnapshot.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/approve/apply/BaseTrmApproveApplyService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/approve/apply/TrmApproveForToApplyService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/approve/apply/TrmApproveForTppApplyService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/resources/mapper/approve/audit/TrmApproveAuditMapper.xml`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/client/IAfAgencyPidClient.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/constant/AutoAuthConstant.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAgencyPidQueryDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAgencyPidSyncDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfAuthEventSyncDTO.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AfHandshakeCardRowDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAgencyPid.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/enums/HandshakeStatusEnum.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AfAgencyPidDistinctVO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AfAgencyPidVO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/notify/constant/CallbackBizType.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/wx/constant/ForeignCacheConstant.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/client/AfAgencyPidClient.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/common/utils/ConcurrentHelper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAgencyPidController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/jobs/XxlJobHandler.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAgencyPidMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthTaskMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthTaskService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAgencyPidService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAgencyAppServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAgencyPidServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/config/AfThreadPoolConfig.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/controller/AfHandshakeNotifyDemoController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/controller/FeishuMessageCallbackController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/handle/BaseMessageCardCallBackHandle.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/handle/FeishuMessageCallbackHandler.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/service/impl/FeiShuMessageCardCallbackServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAgencyPidMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthTaskMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
