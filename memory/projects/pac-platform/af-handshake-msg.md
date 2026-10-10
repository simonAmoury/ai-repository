---
id: pac-platform/af-handshake-msg
scope: project
project: pac-platform
feature: af-handshake-msg
updated: 2026-08-24
tags: [git-history, simon.ye, af_handshake_msg]
code_anchors:
  - path: pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/AfAutoAuthBatchResultDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/AfHandshakeSyncService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/common/utils/ConcurrentHelper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAgencyPidService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAgencyAppServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/handle/FeishuMessageCallbackHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_handshake_msg`，共 11 条 Simon 提交，时间范围为
2026-05-08 至 2026-05-13。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `6243374f`（2026-05-08）：fix[af_handshake_msg]: 成功失败条数调整
- `c5bdbfdd`（2026-05-08）：fix[af_handshake_msg]: 申单发送TO通知找不到用户
- `321feaf9`（2026-05-09）：fix[af_handshake_msg]: 关闭授权发送socket通知
- `3f51ff1f`（2026-05-09）：fix[af_handshake_msg]: 失败条数调整
- `eb1b5348`（2026-05-09）：fix[af_handshake_msg]: 等待所有完成再返回
- `40f8e255`（2026-05-11）：feat[af_handshake_msg]: af开授权增加事务
- `d74dd4fc`（2026-05-11）：change[af_handshake_msg]: af_agency_pid数据源调整
- `18a2c937`（2026-05-12）：change[af_handshake_msg]: 飞书回调实际业务逻辑改为异步执行
- `4861fb57`（2026-05-12）：fix[af_handshake_msg]: 事件回显
- `851abd46`（2026-05-12）：change[af_handshake_msg]: 飞书回调实际业务逻辑改为异步执行
- `8d76e9a6`（2026-05-13）：fix[af_handshake_msg]: 事件回显

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `6243374f`：涉及 2 个文件；新增证据：`private int successNum;`；`private int failNum;`；`batchResultDTO.setSuccessNum(counterService.getFieldValue(countKey, FIELD_SUCCESS));`；`batchResultDTO.setTotal(counterService.getFieldValue(countKey, FIELD_FAIL));`；`batchResultDTO.setFailNum(batchResultDTO.getFailNum()+allTrmApproveIds.size());`；`if (batchResultDTO.getFailNum() < size) {`
- `c5bdbfdd`：涉及 1 个文件；新增证据：`if (StrUtil.isNotBlank(uvo.getAccount()) && StrUtil.isNotBlank(uvo.getEmail())) {`；`map.put(uvo.getAccount(), uvo.getEmail());`
- `321feaf9`：涉及 1 个文件；新增证据：`batchResultDTO.setTotal(counterService.getFieldValue(countKey, FIELD_TOTAL));`；`batchResultDTO.setSuccessNum(counterService.getFieldValue(countKey, FIELD_SUCCESS));`；`batchResultDTO.setFailNum(counterService.getFieldValue(countKey, FIELD_FAIL));`
- `3f51ff1f`：涉及 1 个文件；新增证据：`batchResultDTO.setFailNum(counterService.getFieldValue(countKey, FIELD_FAIL));`
- `eb1b5348`：涉及 1 个文件；新增证据：`errorMessages.add(cause != null ? cause.getMessage() : e.getMessage());`；`if (throwOnFailure && !errorMessages.isEmpty()) {`；`throw new ServiceException(String.join("; ", errorMessages));`
- `40f8e255`：涉及 1 个文件；新增证据：`@Transactional(rollbackFor = Exception.class)`
- `d74dd4fc`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `18a2c937`：涉及 1 个文件；新增证据：`private final FeishuMessageCallbackHandler feishuMessageCallbackHandler;`；`feishuMessageCallbackHandler.handleAfHandshakeCallback(value);`；`@Async(value = "ThreadPoolConfig")`；`public void handleAfHandshakeCallback(Map<String, String> value) {`
- `4861fb57`：涉及 1 个文件；新增证据：`getSelectedEvent(trmApproveIds);`
- `851abd46`：涉及 1 个文件；新增证据：`private final ThreadPoolConfig threadPoolConfig;`；`threadPoolConfig.threadPoolTaskExecutor().submit(() -> handleAfHandshakeCallback(value));`
- `8d76e9a6`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 7 个文件；当前仍可在 `master` 定位 7 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/dto/ws/AfAutoAuthBatchResultDTO.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/AfHandshakeSyncService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/common/utils/ConcurrentHelper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAgencyPidService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAgencyAppServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/handle/FeishuMessageCallbackHandler.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
