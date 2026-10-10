---
id: pac-platform/af-optimize
scope: project
project: pac-platform
feature: af-optimize
updated: 2026-08-24
tags: [git-history, simon.ye, af_optimize]
code_anchors:
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/pojo/af/AfAuthDetailInfo.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/SeleniumUtil.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/TimeConsumerUtil.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoTaskVariable.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAutoAuthTaskController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthLogMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoTaskVariableMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthLogService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoTaskVariableService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthLogServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_optimize`，共 15 条 Simon 提交，时间范围为
2026-01-19 至 2026-02-06。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `7c808ceb`（2026-01-19）：feat[af_optimize]: 策略迁移，初步
- `efab7a7c`（2026-01-19）：feat[af_optimize]: 策略调度
- `07ecfdde`（2026-01-23）：feat[af_optimize]: 流程补充
- `943faa16`（2026-01-26）：feat[af_optimize]: 获取点击链增加重试
- `ab70b1ac`（2026-01-26）：feat[af_optimize]: 去掉appsflyerClient缓存
- `ce187020`（2026-01-26）：feat[af_optimize]: 修复driver，去除无用字段
- `790a9313`（2026-01-30）：feat[af_optimize]: 代码整理
- `8e2ee6a4`（2026-01-30）：feat[af_optimize]: 冲突解决
- `a0042a5f`（2026-02-02）：feat[af_optimize]: 代码整理
- `17b53612`（2026-02-03）：feat[af_optimize]: 补充测试异常步骤
- `83aa2a7a`（2026-02-03）：feat[af_optimize]: 补充测试异常步骤
- `fb348b88`（2026-02-03）：fix[af_optimize]: 参数传递问题
- `96f72d13`（2026-02-04）：fix[af_optimize]: 参数传递问题
- `d615f910`（2026-02-05）：fix[af_optimize]: 异常处理
- `0fd4ab3a`（2026-02-06）：feat[af_optimize]: 去除冗余代码

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `7c808ceb`：涉及 14 个文件；新增证据：`private final AfAuthStrategyOrchestrator afAuthStrategyOrchestrator;`；`context.setTask(task);`；`context.setLogMap(logMap);`；`context.setTrmApproveIdList(trmApproveIdList);`；`context.setAfAutoAuthTaskEventMappingList(afAutoAuthTaskEventMappingList);`；`context.setIsSupportVta(isSupportVta);`
- `efab7a7c`：涉及 17 个文件；新增证据：`public static Optional<OperateEnum> getOperateEnumByCode(String code) {`；`return Arrays.stream(OperateEnum.values()).filter(k -> k.name().equals(code)).findFirst();`；`AfAutoAuthTaskLog getLatestLog(@Param("task") AfAutoAuthTask task);`；`AfAutoAuthTaskLog getLatestLog(AfAutoAuthTask task);`；`@Override`；`public AfAutoAuthTaskLog getLatestLog(AfAutoAuthTask task) {`
- `07ecfdde`：涉及 15 个文件；新增证据：`public static List<OperateEnum> operateEnumListWithOrder =`；`ListUtil.of(OperateEnum.CODE_40001, OperateEnum.CODE_40002, OperateEnum.CODE_40003, OperateEnum.CODE_40050, OperateEnum.CODE_40004, OperateEnum.CODE_40005, OperateEnum.CODE_40006, OperateEnum.CODE_40051, OperateEnum.CODE_40052, null);`；`public static Optional<OperateEnum> getNextOperateEnum(OperateEnum operateEnum) {`；`return Optional.ofNullable(operateEnumListWithOrder.get(operateEnumListWithOrder.indexOf(operateEnum) + 1));`；`public static <T> T getTimeConsumerMillisWithAfLog(TimeTask<T> task, @NotNull AfAuthDetailInfo.OperateEnum operateEnum, Consumer<T> consumer) {`；`log.error("授权失败，selenium异常：{}", e.getMessage());`
- `943faa16`：涉及 1 个文件；新增证据：`driver.get(StrUtil.format(AppsFlyerConst.WebPath.MARKETPLACE_INTEGRATED_PARTNERS_PAGE, task.getPackageName(), task.getPid()));`；`driver.manage().window().setSize(new Dimension(1920, 540));`；`new WebDriverWait(driver, 60).until(webDriver -> webDriver.findElement(By.className("mp-MuiTab-wrapper")));`；`if (attributionLinkTab.isPresent()) {`；`executor.executeScript("arguments[0].click();", attributionLinkTab.get());`；`SeleniumUtil.waitByClassNameAndText(driver, "attrLink-MuiTypography-body2", "Click-through lookback window", 60);`
- `ab70b1ac`：涉及 1 个文件；新增证据：`return newInstance(username, host, key);`；`return newInstance(username, host, key, pwdGetter);`；`if (StrUtil.isNotBlank(mediaConfigPwd)) {`；`if (isCloseAuth) {`；`if (isCloseAuth) {`
- `ce187020`：涉及 4 个文件；新增证据：`executeTaskWithRetry(task, context, continueFlag);`；`cleanupAndCallback(context, task, logMap, trmApproveIdList);`；`private void executeTaskWithRetry(AfAutoAuthTask task, AfAuthContext context, boolean continueFlag) {`；`if (TRM_APPROVE_AUTO_LOG_SUCCESS.equals(context.getTrmApproveAutoLog().getStatus())) {`；`handleTaskException(task, context.getTrmApproveAutoLog(), "任务执行被中断", e);`；`handleTaskException(task, context.getTrmApproveAutoLog(), "授权异常", e);`
- `790a9313`：涉及 1 个文件；新增证据：`context.setTask(task);`；`context.setLogMap(logMap);`；`context.setTrmApproveIdList(trmApproveIdList);`；`context.setTrmApproveAutoLog(trmApproveAutoLog);`
- `8e2ee6a4`：涉及 2 个文件；新增证据：`private AfAuthContext initAfAuthContext(AfAutoAuthTask task, Map<Integer, TrmApproveAutoLog> logMap, List<Integer> trmApproveIdList, List<AfAutoAuthTaskEventMapping> afAutoAuthTaskEventMappingList, TrmApproveAutoLog trmApproveAutoLog, List<Integer> totalTrmApproveIdList) {`；`context.setTotalTrmApproveIdList(totalTrmApproveIdList);`；`context.setTask(task);`；`context.setLogMap(logMap);`；`context.setTrmApproveIdList(trmApproveIdList);`；`context.setTrmApproveAutoLog(trmApproveAutoLog);`
- `a0042a5f`：涉及 2 个文件；新增证据：`initAfAuthContext(context,task, logMap, trmApproveIdList, taskEventMap.get(task.getId()), trmApproveAutoLog, batchTotalTrmApproveIdMap.get(task.getBatchId()));`；`private void initAfAuthContext(AfAuthContext context , AfAutoAuthTask task, Map<Integer, TrmApproveAutoLog> logMap, List<Integer> trmApproveIdList, List<AfAutoAuthTaskEventMapping> afAutoAuthTaskEventMappingList, TrmApproveAutoLog trmApproveAutoLog, List<Integer> totalTrmApproveIdList) {`；`where origin.status in ('WAIT', 'WAIT_RETRY', 'FAIL')`；`and t.status in ('WAIT', 'WAIT_RETRY', 'FAIL')`
- `17b53612`：涉及 2 个文件；新增证据：`default void executeStrategy(AfAuthContext context, String errorStep) {`；`if (context.getOperateEnum().name().equals(errorStep)) {`
- `83aa2a7a`：涉及 5 个文件；新增证据：`private AfAuthContext initAfAuthContext(AfAutoAuthTask task, Map<Integer, TrmApproveAutoLog> logMap, List<Integer> trmApproveIdList, List<AfAutoAuthTaskEventMapping> afAutoAuthTaskEventMappingList, TrmApproveAutoLog trmApproveAutoLog, List<Integer> totalTrmApproveIdList) {`；`context.setTask(task);`；`context.setLogMap(logMap);`；`context.setTrmApproveIdList(trmApproveIdList);`；`context.setTrmApproveAutoLog(trmApproveAutoLog);`；`callback(task, trmApproveIdList, screenshotList, context.getTrmApproveIdList(), context.getTrmApproveAutoLog().getSkipRecheck());`
- `fb348b88`：涉及 1 个文件；新增证据：`executeTaskWithRetry( context, continueFlag);`；`private void executeTaskWithRetry( AfAuthContext context, boolean continueFlag) {`
- `96f72d13`：涉及 1 个文件；新增证据：`context.setTask(task);`；`context.setLogMap(logMap);`；`context.setTrmApproveIdList(trmApproveIdList);`；`context.setTrmApproveAutoLog(trmApproveAutoLog);`；`executeAuthTask(context);`；`private void executeAuthTask(AfAuthContext context) {`
- `d615f910`：涉及 4 个文件；新增证据：`log.error("授权失败，af业务异常：", e);`；`log.error("授权失败，selenium异常：", e);`；`log.error("授权失败，业务异常：", e);`；`closeIntegration(finalRealPid, packageName, marketplaceConfiguration, finalAppsFlyerClient);`；`setPermissions(finalAppsFlyerClient, finalRealPid, packageName, marketplaceConfiguration, Boolean.FALSE);`；`log.error("取消授权失败，af业务异常：", e);`
- `0fd4ab3a`：涉及 4 个文件；新增证据：`default void executeStrategy(AfAuthContext context) {`；`saveAfAutoAuthLog();`；`private void saveAfAutoAuthLog() {`；`GlobalThreadLocal.cleanAll();`；`getLink(driver, task);`；`throw new AppsFlyerClient.AfServiceException("获取授权点击链接失败！");`

## 核心代码设计

本需求历史上共影响 29 个文件；当前仍可在 `master` 定位 28 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/af/AfAuthDetailInfo.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/SeleniumUtil.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/TimeConsumerUtil.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoTaskVariable.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/controller/AfAutoAuthTaskController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoAuthLogMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AfAutoTaskVariableMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoAuthLogService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AfAutoTaskVariableService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthLogServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoTaskVariableServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/AfAuthContext.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/AfAuthStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/AfAuthStrategyOrchestrator.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/AfAutoAuthTaskStrategyHelper.java`（当前已不存在或已改名）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/AfterScreenshotStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/BeforeScreenshotStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/GetAppsFlyerClientStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/GetAttributionLinksStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/GetMarketplaceConfigurationStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/SearchRealPidStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/SetAttributionLinkStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/SetIntegrationPageInfoStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/strategy/auth/SetPermissionsStrategy.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthLogMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthTaskMapper.xml`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AfAutoTaskVariableMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
