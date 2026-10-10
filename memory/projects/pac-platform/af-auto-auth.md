---
id: pac-platform/af-auto-auth
scope: project
project: pac-platform
feature: af-auto-auth
updated: 2026-08-24
tags: [git-history, simon.ye, afAutoAuth]
code_anchors:
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/constant/TradeCacheConstant.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/AfAutoAuthTaskCallbackDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/feign/IPostBackAdvNonChargeEventMappingClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/feign/ITrmApproveClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvDateReportServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/PostBackAdvNonChargedEventMappingController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/feign/TrmApproveClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/IPostBackAdvNonChargedEventMappingService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ITrmApproveAutoService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ITrmApproveService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/PostBackAdvNonChargedEventMappingServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `afAutoAuth`，共 20 条 Simon 提交，时间范围为
2025-03-21 至 2025-04-24。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `d4107f68`（2025-03-21）：feat [afAutoAuth]: 实体新增
- `8c24ce14`（2025-03-24）：feat [afAutoAuth]: 添加任务
- `8c2ceea9`（2025-03-24）：feat [afAutoAuth]: 添加任务
- `4eb6d429`（2025-03-25）：feat [afAutoAuth]: 授权逻辑迁移
- `b9db3075`（2025-03-31）：feat [afAutoAuth]: 任务回调
- `4774c54b`（2025-04-01）：feat [afAutoAuth]: 任务执行bug修复
- `7ddd2dd4`（2025-04-01）：feat [afAutoAuth]: 任务筛选+申批单总量key释放
- `67b03d40`（2025-04-02）：feat [afAutoAuth]: 任务执行bug修复
- `4fe4355e`（2025-04-07）：feat[afAutoAuth]: adv工具调整
- `5997dc93`（2025-04-10）：fix[afAutoAuth]: bug修复
- `32050a9c`（2025-04-14）：fix[afAutoAuth]: 授权事件修复
- `3b268c6c`（2025-04-15）：fix[afAutoAuth]: 日志补充
- `461875df`（2025-04-15）：fix[afAutoAuth]: 锁修复
- `5186f560`（2025-04-15）：fix[afAutoAuth]: 截图处理
- `a6456948`（2025-04-15）：fix[afAutoAuth]: 任务状态扭转新增，事件入参调整
- `f8eac6eb`（2025-04-15）：fix[afAutoAuth]: websocket修复
- `4509fb9a`（2025-04-16）：fix[afAutoAuth]: 事件映射处理
- `5af05a69`（2025-04-16）：fix[afAutoAuth]: afoption处理
- `61a59214`（2025-04-23）：fix[afAutoAuth]: 补充缺失字段
- `65de8822`（2025-04-24）：fix[afAutoAuth]: 加入队列条件调整

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `d4107f68`：涉及 16 个文件；新增证据：`@Data`；`@TableName(value = "af_auto_auth_task")`；`public class AfAutoAuthTask {`；`@TableId(value = "id", type = IdType.INPUT)`；`private Integer id;`；`@TableField(value = "prt")`
- `8c24ce14`：涉及 2 个文件；新增证据：`R<AutoAuthTaskAddVO> addAutoAuthTask(@RequestBody AutoAuthTaskAddDTO addDTO);`；`@Component`；`private final RedissonClient redissonClient;`；`task.setCreator(AuthUtil.getAccount());`；`task.setUpdateTime(DateUtil.now());`；`this.saveBatch(taskMap.values());`
- `8c2ceea9`：涉及 17 个文件；新增证据：`@FeignClient(value = PacAppConstant.APP_NAME_FOREIGN,`；`public interface IAfAutoAuthTaskClient {`；`@PostMapping(value = "add")`；`R<AutoAuthTaskAddVO> addAutoAuthTask(AutoAuthTaskAddDTO addDTO);`；`class IAfAutoAuthTaskClientFallback implements IAfAutoAuthTaskClient {`；`@Override`
- `4eb6d429`：涉及 29 个文件；新增证据：`@GetMapping("/approve/auto/log")`；`R<List<TrmApproveAutoLog>> getApproveAutoLogList(@RequestBody List<Integer> trmApproveIdList);`；`@PostMapping("/approve/saveOrUpdate/auto/log")`；`R<String> saveOrUpdateApproveAutoLog(@RequestBody Collection<TrmApproveAutoLog> logs);`；`@Override`；`public R<List<TrmApproveAutoLog>> getApproveAutoLogList(List<Integer> trmApproveIdList) {`
- `b9db3075`：涉及 27 个文件；新增证据：`@Data`；`public class AfAutoAuthTaskCallbackDTO implements Serializable {`；`private static final long serialVersionUID = -7146870348927806193L;`；`private Integer taskId;`；`private String prt;`；`private String pid;`
- `4774c54b`：涉及 1 个文件；新增证据：`task.setStatus(task.getRetry() <= retry ? AutoAuthConstant.TaskStatus.WAIT_RETRY.name() : AutoAuthConstant.TaskStatus.FAIL.name());`
- `7ddd2dd4`：涉及 2 个文件；新增证据：`pacRedis.set(AutoAuthConstant.AF_AUTO_AUTH_TOTAL_NUM + batchId, trmApproveList.size());`；`pacRedis.del(AutoAuthConstant.AF_AUTO_AUTH_TOTAL_NUM + batchId);`；`inner join (select MIN(id) as id`；`where status in ('WAIT', 'WAIT_RETRY')`
- `67b03d40`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `4fe4355e`：涉及 4 个文件；新增证据：`public static void waitByClassName(WebDriver driver, String className, int timeOutInSeconds) {`；`new WebDriverWait(driver, timeOutInSeconds).until(webDriver -> {`；`return oe.isPresent();`；`XxlJobHelper.log(StrUtil.format("等待元素{}失败：", className), e);`；`XxlJobHelper.log(StrUtil.format("等待元素{}失败：",className), e);`；`public static void waitByXPath(WebDriver driver, String xPath, int timeOutInSeconds) {`
- `5997dc93`：涉及 3 个文件；新增证据：`Arrays.asList(rLocks).forEach(RLock::forceUnlock);`；`task.setRetry(task.getRetry() + 1);`；`task.setStatus(task.getRetry() < retry ? AutoAuthConstant.TaskStatus.WAIT_RETRY.name() : AutoAuthConstant.TaskStatus.FAIL.name());`
- `32050a9c`：涉及 4 个文件；新增证据：`R<List<PostBackAdvNonChargedEventMapping>> listPackageOrAdvEvents(@RequestParam(value = "advId") Integer advId, @RequestParam(value = "packageName") String packageName);`；`public R<List<PostBackAdvNonChargedEventMapping>> listPackageOrAdvEvents(Integer advId, String packageName) {`；`public R<List<PostBackAdvNonChargedEventMapping>> listPackageOrAdvEvents(Integer advId, String packageName) {`；`return R.data(service.listPackageOrAdvEvents(advId, packageName));`；`saveAfEventMappingLog(approveAsyncVO, advNonChargedEventMappings, offerBaseInfoDTO);`
- `3b268c6c`：涉及 1 个文件；新增证据：`log.info("初始化信号量：{}", semaphoreNum);`；`log.info("信号量更新开始，当前可用:{}", semaphore.availablePermits());`；`log.info("信号量更新结束，当前可用：{}", semaphore.availablePermits());`；`log.info("当前可用信号量：{}", semaphore.availablePermits());`；`log.info("使用信号量：{}，使用的任务：{}", num, currentExecuteTask.stream().map(AfAutoAuthTask::getId).collect(Collectors.toList()));`；`log.info("当前可用信号量：{}", semaphore.availablePermits());`
- `461875df`：涉及 1 个文件；新增证据：`rLock.unlock();`
- `5186f560`：涉及 2 个文件；新增证据：`log.info("添加至任务队列结束，发送通知：{}", result);`
- `a6456948`：涉及 2 个文件；新增证据：`return buildAutoAuthAddDetail(autoAuthKey, authApproveIds, authTrmApproveAsyncVOs.get(0), approveAfOption, approveAsyncVO1.getPostBackAdvNonChargedEventMappingIds());`；`private AutoAuthTaskAddDTO.AddDetail buildAutoAuthAddDetail(String autoAuthKey, List<Integer> authApproveIds, TrmApproveAsyncVO trmApproveAsyncVO, TrmApproveAfOption approveAfOption, List<Long> advNonChargedEventMappingIdList) {`；`addDetail.setPostBackAdvNonChargedEventMappingIdList(advNonChargedEventMappingIdList);`；`this.lambdaUpdate().eq(AfAutoAuthTask::getStatus, AutoAuthConstant.TaskStatus.RUNNING.name())`
- `f8eac6eb`：涉及 2 个文件；新增证据：`batchResultDTO.convertType(WebSocketNoticeConstant.LOADING);`；`batchResultDTO.setTaskType(AutoAuthConstant.AutoAuthTaskType.AUTH.name().equals(callbackDTO.getType()) ? 1 : 2);`；`batchResultDTO.setSuccessNum(new AtomicInteger(successNum));`；`batchResultDTO.setFailNum(new AtomicInteger(failNum));`；`batchResultDTO.setNoticeType(WebSocketNoticeConstant.LOADING);`；`batchResultDTO.setNoticeType(failNum == 0 ? WebSocketNoticeConstant.COMPLETE : WebSocketNoticeConstant.WARNING);`
- `4509fb9a`：涉及 5 个文件；新增证据：`@GetMapping(value = "listPackageAvailableEvents")`；`R<List<PostBackAdvNonChargedEventMapping>> listPackageAvailableEvents(@RequestParam(value = "advIds") List<Integer> advIds, @RequestParam(value = "packageNames") List<String> packageNames);`；`@Override`；`public R<List<PostBackAdvNonChargedEventMapping>> listPackageAvailableEvents(List<Integer> advIds, List<String> packageNames) {`；`return R.failure(this.getClass().getName());`；`@Override`
- `5af05a69`：涉及 1 个文件；新增证据：`addDetail.setInstallSdkKey(approveAfOption.getInstallSdkKey());`
- `61a59214`：涉及 2 个文件；新增证据：`addDetail.setInstallSdkKey(approveAfOption.getInstallSdkKey());`；`addDetail.setResultClickCap(trmApproveAsyncVO.getClickCap());`；`task.setIsAfRetry(addDTO.getIsAfRetry());`
- `65de8822`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 60 个文件；当前仍可在 `master` 定位 56 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/constant/TradeCacheConstant.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/AfAutoAuthTaskCallbackDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/feign/IPostBackAdvNonChargeEventMappingClient.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/feign/ITrmApproveClient.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/AdvDateReportServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/utils/SeleniumUtil.java`（当前已不存在或已改名）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/PostBackAdvNonChargedEventMappingController.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/feign/TrmApproveClient.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/IPostBackAdvNonChargedEventMappingService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ITrmApproveAutoService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ITrmApproveService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/PostBackAdvNonChargedEventMappingServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/test/java/com/tecdo/pac/biz/trade/SeleniumTest.java`（当前仍存在）
- `pac-common/build.gradle`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/af/AfAuthBasicInfo.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/SeleniumUtil.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/client/IAfAutoAuthTaskClient.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/constant/AutoAuthConstant.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AutoAuthTaskAddDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AutoAuthTaskRemoveDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthLog.java`（当前已不存在或已改名）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthScreenshot.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTask.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTaskEventMapping.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTaskLog.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTaskTrmApproveMapping.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AutoAuthTaskAddVO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/vo/AutoAuthTaskRemoveVO.java`（当前仍存在）
- `pac-ops/pac-foreign/build.gradle`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/client/AfAutoAuthTaskClient.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/common/constant/AutoAuthConstant.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAutoAuthTaskController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/IAfAutoAuthTaskController.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/jobs/XxlJobHandler.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthLogMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthScreenshotMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthTaskEventMappingMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthTaskMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthTaskTrmApproveMappingMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthLogService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthScreenshotService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthTaskEventMappingService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthTaskService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthTaskTrmApproveMappingService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthLogServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthScreenshotServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskEventMappingServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskTrmApproveMappingServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/AfAutoAuthAddTaskBasicCheckStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/AfAutoAuthAddTaskCheckStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/config/ApolloRefreshConfig.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/wx/constant/ForeignConfigConstant.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthLogMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthScreenshotMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthTaskEventMappingMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthTaskMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthTaskTrmApproveMappingMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
