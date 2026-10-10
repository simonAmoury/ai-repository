---
id: pac-platform/af-auth-trace
scope: project
project: pac-platform
feature: af-auth-trace
updated: 2026-08-24
tags: [git-history, simon.ye, afAuth]
code_anchors:
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/AfAutoAuthLog.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/AfAutoAuthLogMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/AfAutoAuthLogService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/AfAutoAuthLogServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/resources/mapper/AfAutoAuthLogMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/pojo/af/AfAuthBasicInfo.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/pojo/af/AfAuthDetailInfo.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/common/af/GlobalThreadLocal.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/function/TimeTask.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/TimeConsumerUtil.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `afAuth`，共 4 条 Simon 提交，时间范围为
2025-03-17 至 2025-03-21。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `0ce2a3d1`（2025-03-17）：feat [afAuth]: 日志埋点
- `a91eb561`（2025-03-17）：feat [afAuth]: 日志埋点
- `5d3fbc9f`（2025-03-20）：fix [afAuth]: 日志埋点
- `42e9a893`（2025-03-21）：fix [afAuth]: 异常抛出

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `0ce2a3d1`：涉及 12 个文件；新增证据：`@Data`；`@TableName(value = "af_auto_auth_log")`；`public class AfAutoAuthLog {`；`@TableId(value = "id", type = IdType.INPUT)`；`private Integer id;`；`@TableField(value = "batch_id")`
- `a91eb561`：涉及 2 个文件；新增证据：`saveAfAutoAuthLog(Boolean.TRUE);`；`saveAfAutoAuthLog(Boolean.FALSE);`；`threadPoolConfig.threadPoolTaskExecutor().execute(() -> {`；`log.setOperate(detailInfo.getOperate());`；`log.setErrorMsg(detailInfo.getErrorMsg());`；`log.setErrorMsgDetail(detailInfo.getErrorMsgDetail());`
- `5d3fbc9f`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `42e9a893`：涉及 1 个文件；新增证据：`task.run();`

## 核心代码设计

本需求历史上共影响 12 个文件；当前仍可在 `master` 定位 12 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/AfAutoAuthLog.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/AfAutoAuthLogMapper.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/AfAutoAuthLogService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/AfAutoAuthLogServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/resources/mapper/AfAutoAuthLogMapper.xml`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/af/AfAuthBasicInfo.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/af/AfAuthDetailInfo.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/common/af/GlobalThreadLocal.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/function/TimeTask.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/TimeConsumerUtil.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
