---
id: pac-platform/af-email-optimize
scope: project
project: pac-platform
feature: af-email-optimize
updated: 2026-08-24
tags: [git-history, simon.ye, af_email_optimize]
code_anchors:
  - path: pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyApproveContext.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeContext.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandlerDispatcher.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyProcessBuildContext.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApproveOutcome.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/CompleteNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/PreApproveNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReApproveNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReviewNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/SubmitNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_email_optimize`，共 12 条 Simon 提交，时间范围为
2026-07-03 至 2026-07-09。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `6ff2ccb5`（2026-07-03）：feat[af_email_optimize]: 流程调整＋发送飞书通知
- `0de7edbc`（2026-07-06）：feat[af_email_optimize]: 分页查询补充筛选参数
- `18279115`（2026-07-06）：feat[af_email_optimize]: 飞书回调
- `3653c32a`（2026-07-06）：feat[af_email_optimize]: 枚举类型调整
- `6dc9bed1`（2026-07-06）：feat[af_email_optimize]: 飞书回调
- `903abe30`（2026-07-06）：feat[af_email_optimize]: 解决循环依赖
- `3bc334b4`（2026-07-07）：feat[af_email_optimize]: 飞书通知收件人调整
- `570ac1b3`（2026-07-07）：feat[af_email_optimize]: 代理账号改为精准匹配
- `68aea477`（2026-07-07）：feat[af_email_optimize]: 飞书卡片补充信息，审批流程调整
- `be6004e3`（2026-07-07）：feat[af_email_optimize]: 根据包获取CM，保留非active用户
- `cad07af2`（2026-07-08）：feat[af_email_optimize]: 飞书通知用户调整，节点判断逻辑统一
- `14a0e87d`（2026-07-09）：feat[af_email_optimize]: 通知人员逻辑调整+note更改+事务处理

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `6ff2ccb5`：涉及 33 个文件；新增证据：`@Data`；`@Builder`；`public class ApplyApproveContext {`；`private AfAccountAppApply apply;`；`private List<AfAccountAppApplyProcess> processList;`；`private AfAccountAppApplyProcess currentProcess;`
- `0de7edbc`：涉及 7 个文件；新增证据：`@ApiModelProperty("代理账号（模糊匹配）")`；`private String agency;`；`@ApiModelProperty(hidden = true, value = "代理账号ID，由 agency 解析后用于过滤")`；`private List<Long> accountIdList;`；`@ApiModelProperty("授权邮箱（模糊匹配）")`；`private String email;`
- `18279115`：涉及 3 个文件；新增证据：`BOP_APPROVAL_REJECT_BTN_CLICK("false", "BOP三方内部授权驳回按钮被点击"),`；`BOP_APPROVAL_RETRY_BTN_CLICK("retry", "BOP三方内部授权重试按钮被点击");`；`approve(String.valueOf(afAccountAppApply.getId()), status, AfAccountAppApplyConstant.FEI_SHU_PASS_NOTE);`；`approve(String.valueOf(afAccountAppApply.getId()), status, AfAccountAppApplyConstant.FEI_SHU_REJECT_NOTE);`；`approve(String.valueOf(afAccountAppApply.getId()), status, AfAccountAppApplyConstant.FEI_SHU_REJECT_NOTE);`；`updateFeiShuMessageCard(eventKeyEnum, NumberUtil.parseLong(updateCardParamMap.get("taskId")), updateCardParamMap);`
- `3653c32a`：涉及 7 个文件；新增证据：`public String resolve(MixStatusEnum mixStatus) {`；`return AuthStatusEnum.PENDING.getValue();`；`return AuthStatusEnum.NONE.getValue();`；`return AuthStatusEnum.FAILED.getValue();`；`return AuthStatusEnum.SUCCESS.getValue();`；`private String authStatus;`
- `6dc9bed1`：涉及 2 个文件；新增证据：`@Data`；`@EqualsAndHashCode(callSuper = true)`；`public class AfApplyCardActionValueDTO extends FeiShuCardActionValueDTO {`；`private String result;`；`private String bopApprovalKey;`；`@Data`
- `903abe30`：涉及 2 个文件；新增证据：`@Lazy`；`@Autowired`；`private IAfAccountAppApplyService afAccountAppApplyService;`；`@Lazy`；`@Autowired`；`private ApplyNodeHandlerDispatcher applyNodeHandlerDispatcher;`
- `3bc334b4`：涉及 3 个文件；新增证据：`if (ObjectUtil.isNotNull(activeSuperiorId)) {`；`preApproveUserIds.add(activeSuperiorId);`；`private List<Long> selectApprovalRecipients(List<Long> approverIds) {`；`if (CollUtil.isNotEmpty(nonOcApproverIds)) {`；`return approverIds.stream()`；`public Long resolveActiveUpward(Long startUserId, UserStatusView view) {`
- `570ac1b3`：涉及 5 个文件；新增证据：`return pageResult.convert(apply -> convertToPageVO(apply, accountNameMap, userNameMap, processGroupMap, nullDefaultProc));`；`private AfAccountAppApplyPageVO convertToPageVO(AfAccountAppApply apply,`；`fillApproverAndMixStatus(pageVo, apply, currentProcessList, userNameMap, nullDefaultProc);`；`fillLatestApprovalComment(pageVo, currentProcessList);`；`pageVo.setApprovedAuth(checkApprovedAuth(apply, currentProcessList));`；`private void fillApproverAndMixStatus(AfAccountAppApplyPageVO pageVo, AfAccountAppApply apply,`
- `68aea477`：涉及 4 个文件；新增证据：`private List<AfAccountAppApplyProcess> listOcReApproveRecords(List<AfAccountAppApplyProcess> processList, Long operatorId) {`；`feiShuApprovalNotifier.sendFeiShuReviewRemindCard(apply, BigTool.toLongList(reviewProcess.getAuditUsers()),reviewProcess.getNote());`；`public void sendFeiShuReviewRemindCard(AfAccountAppApply apply, List<Long> approverIds, String errorMsg) {`；`tmplParams.put("errorMsg", errorMsg);`；`cardTableRaws.add(fastBuildItem("申请原因", apply.getNote()));`；`cardTableRaws.add(fastBuildItem("申请原因", apply.getNote()));`
- `be6004e3`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `cad07af2`：涉及 6 个文件；新增证据：`private List<Long> notifyReApproveUserIds;`；`reApproveUserIds.addAll(BigTool.toLongList(process.getAuditUsers()));`；`return ApproveOutcome.builder().notifyReApproveUserIds(new ArrayList<>(reApproveUserIds)).build();`；`void sendReApproveCard(AfAccountAppApply apply, List<Long> reApproveUserIds);`；`public void sendReApproveCard(AfAccountAppApply apply, List<Long> reApproveUserIds) {`；`if (CollUtil.isEmpty(reApproveUserIds)) {`
- `14a0e87d`：涉及 9 个文件；新增证据：`private final ActiveUserResolver activeUserResolver;`；`private final ActiveUserResolver activeUserResolver;`；`private final TransactionTemplate transactionTemplate;`；`transactionTemplate.execute(status -> {`；`if (succeed) {`；`apply.setStatus(ApplyStatusEnum.COMPLETE.getState());`

## 核心代码设计

本需求历史上共影响 46 个文件；当前仍可在 `master` 定位 40 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyApproveContext.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeContext.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandlerDispatcher.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyProcessBuildContext.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApproveOutcome.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/CompleteNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/PreApproveNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReApproveNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReviewNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/SubmitNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/notify/FeiShuApprovalNotifier.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ActiveUserResolver.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/AuthStatusResolver.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/CmResolver.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveDecisionResolver.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveDecisionResolverImpl.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveNode.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/ReApproveNodeBuilder.java`（当前已不存在或已改名）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/UserStatusView.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/workflow/AfAccountAppApplyWorkflow.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/common/constant/AfAccountAppApplyConstant.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/common/constant/AfAccountAppApplyMessageConstant.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/common/constant/CacheConstant.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/controller/AfAccountAppApplyController.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/AfApplyCardActionValueDTO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/dto/FeiShuCardActionValueDTO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/entity/AfAccountAppApply.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/entity/AfAccountAppApplyProcess.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AfAccountAppApplyPageVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AfAccountAppApplyRequestVo.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/vo/AfAccountAppApplyVO.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAfAccountAppApplyAutoService.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyAutoServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/FeishuMessageCallbackHandlerServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/utils/FeiShuCardApprovalHelper.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/resources/mapper/AfAccountAppApplyMapper.xml`（当前仍存在）
- `pac-common/build.gradle`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/constant/AfApplyConstant.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/client/IAfAccountClient.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/notify/bean/approve/CardApproveParam.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/client/AfAccountClient.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/IAfAccountService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAccountServiceImpl.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
