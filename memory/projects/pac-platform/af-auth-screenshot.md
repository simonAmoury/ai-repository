---
id: pac-platform/af-auth-screenshot
scope: project
project: pac-platform
feature: af-auth-screenshot
updated: 2026-08-24
tags: [git-history, simon.ye, af_auth_screenshot]
code_anchors:
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/approve/audit/retrial/AfAutoAuthOptionDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveAsyncVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AutoAuthTaskAddDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTask.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_auth_screenshot`，共 1 条 Simon 提交，时间范围为
2025-09-22 至 2025-09-22。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `7cd720c7`（2025-09-22）：feat[af_auth_screenshot]: 补充参数

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `7cd720c7`：涉及 6 个文件；新增证据：`@ApiModelProperty(value = "是否需要截图：false否 true是")`；`private Boolean needScreenshot;`；`@ApiModelProperty(value = "是否需要截图：0否 1是")`；`private Boolean needScreenshot;`；`private AutoAuthTaskAddDTO.AddDetail  buildAutoAuthAddDetail(String autoAuthKey, List<Integer> authApproveIds, TrmApproveAsyncVO trmApproveAsyncVO, TrmApproveAfOption approveAfOption, List<Long> advNonChargedEventMappingIdList) {`；`addDetail.setNeedScreenshot(trmApproveAsyncVO.getNeedScreenshot());`

## 核心代码设计

本需求历史上共影响 6 个文件；当前仍可在 `master` 定位 6 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/approve/audit/retrial/AfAutoAuthOptionDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/TrmApproveAsyncVO.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/dto/AutoAuthTaskAddDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AfAutoAuthTask.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
