---
id: pac-platform/af-email-optimize-v2
scope: project
project: pac-platform
feature: af-email-optimize-v2
updated: 2026-08-24
tags: [git-history, simon.ye, af_email_optimize_v2]
code_anchors:
  - path: build.gradle
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeContext.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyProcessBuildContext.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/PreApproveNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReApproveNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReviewNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/notify/FeiShuApprovalNotifier.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/AfApplySplitResolver.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/AutoPassResolver.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/UserStatusView.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/workflow/AfAccountAppApplyWorkflow.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_email_optimize_v2`，共 3 条 Simon 提交，时间范围为
2026-07-17 至 2026-07-17。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `2dfc7c40`（2026-07-17）：feat[af_email_optimize_v2]: agency改为ID获取
- `c02e924b`（2026-07-17）：feat[af_email_optimize_v2]: agency改为名称获取
- `e24e4229`（2026-07-17）：feat[af_email_optimize_v2]: 三方内部授权v2

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `2dfc7c40`：涉及 4 个文件；新增证据：`private final IAfAccountClient afAccountClient;`；`public R<List<String>> recommendEmails(@ApiParam(name = "agency", value = "代理账户 AF 账号 ID") @RequestParam(name = "agency", required = false) String agency) {`；`if (StrUtil.isBlank(agency)) {`；`return R.data(Collections.emptyList());`；`AssertX.notNull(afAccount, "代理账户不存在：{}", agency);`；`return R.data(afApplyEmailRecommendService.recommendEmails(afAccount.getAgencyName()));`
- `c02e924b`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `e24e4229`：涉及 41 个文件；新增证据：`private Set<String> whiteEmailSet;`；`default AfAccountAppApplyProcess findByBizStatus(List<AfAccountAppApplyProcess> processList,`；`return processList.stream()`；`StrUtil.format("未找到阶段[{}]对应的审批流程记录", bizStatus.name())));`；`private final AutoPassResolver autoPassResolver;`；`if (ObjectUtil.isNotNull(parentId) && view.isActive(parentId)) {`

## 核心代码设计

本需求历史上共影响 41 个文件；当前仍可在 `master` 定位 35 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `build.gradle`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeContext.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyProcessBuildContext.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/PreApproveNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReApproveNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReviewNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/notify/FeiShuApprovalNotifier.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ActiveUserResolver.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/AfApplySplitResolver.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/AutoPassResolver.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveDecisionResolver.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveDecisionResolverImpl.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveNode.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveNodeBuilder.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/UserStatusView.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/workflow/AbstractWorkflow.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/workflow/AfAccountAppApplyWorkflow.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/controller/AfAccountAppApplyController.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/AfApplyCardCacheDTO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AfAccountAppApplyPageVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AfAccountAppApplyVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AfApplySplitGroupVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AfApplySplitPreviewVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAfAccountAppApplyService.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAfApplyEmailRecommendService.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAfApplyWhiteEmailService.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyAutoServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfApplyEmailRecommendServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfApplyWhiteEmailServiceImpl.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/constant/AfApplyConstant.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/constant/ApiPermissionConstants.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/feishu/dto/bitable/FeiShuBitableQueryDTO.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/feishu/feign/IFeiShuBitableClient.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/feishu/vo/bitable/FeiShuBitableRecordVO.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/controller/FeiShuBitableController.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/sdk/SpreadSheetSheetPlus.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/service/IFeiShuBitableService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/service/impl/IFeiShuBitableServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/notify/open/service/impl/MaterialServiceImpl.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
