---
id: pac-platform/af-duplicated
scope: project
project: pac-platform
feature: af-duplicated
updated: 2026-08-24
tags: [git-history, simon.ye, af_duplicated]
code_anchors:
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/counter/CounterService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/counter/CounterServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/notify/FeiShuApprovalNotifier.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/common/constant/CacheConstant.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/AfApplyCardActionValueDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/AfApplyCardCacheDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAfAccountAppApplyService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/FeishuMessageCallbackHandlerServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/resources/mapper/AfAutoAuthTaskMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_duplicated`，共 5 条 Simon 提交，时间范围为
2026-07-01 至 2026-07-08。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `25c0e5db`（2026-07-01）：fix[af_duplicated]: trade服务授权任务回调幂等校验提前
- `93c277b7`（2026-07-02）：fix[af_duplicated]: sql优化
- `ba6390b2`（2026-07-02）：fix[af_duplicated]: 补充日志
- `68c78175`（2026-07-07）：feat[af_duplicated]: 去除重复日志
- `73f68c56`（2026-07-08）：feat[af_duplicated]: 审批补充飞书卡片置灰逻辑

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `25c0e5db`：涉及 3 个文件；新增证据：`CounterSnapshot onCallback(String counterKey, String lockKey, int success, int fail);`；`Boolean checkDuplicated(String duplicateKey);`；`public Boolean checkDuplicated(String duplicateKey){`；`@Override`；`public CounterSnapshot onCallback(String counterKey, String lockKey, int success, int fail) {`；`if (isDuplicated) {`
- `93c277b7`：涉及 1 个文件；新增证据：`JOIN (`；`SELECT CAST(`；`SUBSTRING_INDEX(`；`GROUP_CONCAT(id ORDER BY priority DESC, create_time ASC),`；`WHERE status IN ('WAIT', 'WAIT_RETRY')`
- `ba6390b2`：涉及 1 个文件；新增证据：`log.info("开始获取任务");`；`log.info("获取到任务：{}", executeTask.stream().map(AfAutoAuthTask::getId).collect(Collectors.toList()));`；`log.info("获取到任务锁，开始执行任务");`；`log.info("释放任务锁");`
- `68c78175`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `73f68c56`：涉及 7 个文件；新增证据：`if (MapUtil.isEmpty(userEmailMap)) {`；`tmplParams.put("applyId", String.valueOf(apply.getId()));`；`sendCardsAndCacheTasks(apply, stage, userEmailMap, tmplParams, newRemindMsgTmpId);`；`apply.getId(), apply.getNumber(), ObjectUtil.isNull(stage) ? StrUtil.EMPTY : stage.getText(), userEmailMap.keySet());`；`if (MapUtil.isEmpty(userEmailMap)) {`；`tmplParams.put("applyId", String.valueOf(apply.getId()));`

## 核心代码设计

本需求历史上共影响 12 个文件；当前仍可在 `master` 定位 12 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/counter/CounterService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/counter/CounterServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/notify/FeiShuApprovalNotifier.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/common/constant/CacheConstant.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/AfApplyCardActionValueDTO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/AfApplyCardCacheDTO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAfAccountAppApplyService.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/FeishuMessageCallbackHandlerServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java`（当前仍存在）
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
