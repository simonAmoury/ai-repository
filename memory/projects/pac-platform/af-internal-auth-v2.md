---
id: pac-platform/af-internal-auth-v2
scope: project
project: pac-platform
feature: af-internal-auth-v2
updated: 2026-08-24
tags: [git-history, simon.ye, af_internal_auth_v2]
code_anchors:
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/feign/IOfferClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/PackageCmWithPlatformRequestVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/feign/OfferClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/mapper/OfferMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/IOfferService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/impl/OfferServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/PreApproveNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReApproveNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReviewNodeHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/notify/FeiShuApprovalNotifier.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_internal_auth_v2`，共 14 条 Simon 提交，时间范围为
2026-07-20 至 2026-07-27。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `6d3114a4`（2026-07-20）：feat[af_internal_auth_v2]: 飞书通知置灰调整，详情接口调整，审核人取值调整
- `f783c5cc`（2026-07-21）：feat[af_internal_auth_v2]: 去除审核人角色字段
- `13cf0282`（2026-07-22）：feat[af_internal_auth_v2]: 增加AF平台的筛选
- `1c23b832`（2026-07-22）：feat[af_internal_auth_v2]: 去除二次校验，修复sql
- `a1bd3fb1`（2026-07-22）：feat[af_internal_auth_v2]: 去除二次校验
- `6122f55a`（2026-07-23）：feat[af_internal_auth_v2]: 过滤deleted的offer，抽取飞书卡片过期时间到apollo
- `c0457122`（2026-07-23）：feat[af_internal_auth_v2]: 人工初审通过后，校验复审是否满足自动通过
- `0b38b2cd`（2026-07-24）：fix[af_internal_auth_v2]: 创建人全程可见自己的单据
- `d5bc79e3`（2026-07-24）：feat[af_internal_auth_v2]: 复核授权失败展示调整，复核审批人调整
- `f2a021dd`（2026-07-24）：feat[af_internal_auth_v2]: 授权失败原因限制字数调整
- `39d41b14`（2026-07-27）：fix[af_internal_auth_v2]: 飞书卡片过期处理
- `4b906694`（2026-07-27）：fix[af_internal_auth_v2]: 飞书卡片过期处理
- `4cac751b`（2026-07-27）：fix[af_internal_auth_v2]: 飞书卡片过期处理
- `dd4c8463`（2026-07-27）：fix[af_internal_auth_v2]: 飞书卡片过期处理

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `6d3114a4`：涉及 7 个文件；新增证据：`ObjectUtil.equals(right.getType(), PRIMARY_CM_TYPE) ? 1 : 0,`；`ObjectUtil.equals(left.getType(), PRIMARY_CM_TYPE) ? 1 : 0))`；`StrUtil.maxLength(authResultDTO.getLogMsg(), 125), ctx.getOperatorId());`；`public void greyCurrentCards(Long applyId) {`；`if (ObjectUtil.isNull(cache) || CollUtil.isEmpty(cache.getEntries()) || MapUtil.isEmpty(cache.getTmplParams())) {`；`pacRedis.del(cardKey);`
- `f783c5cc`：涉及 7 个文件；新增证据：`ApplyProcessStatusEnum.PENDING, CollUtil.join(reviewUserIds, StrUtil.COMMA));`
- `13cf0282`：涉及 8 个文件；新增证据：`@PostMapping("/cm/package/company/platform")`；`R<List<OfferPackage2CmVO>> getCmByPackageNameAndCompanyAndPlatform(@RequestBody PackageCmWithPlatformRequestVO vo);`；`@Override`；`public R<List<OfferPackage2CmVO>> getCmByPackageNameAndCompanyAndPlatform(PackageCmWithPlatformRequestVO vo) {`；`return R.failure(this.getClass().getName());`；`@Data`
- `1c23b832`：涉及 3 个文件；新增证据：`private static final int AF_PLATFORM_ID = 1;`
- `a1bd3fb1`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `6122f55a`：涉及 2 个文件；新增证据：`@Value("${af.apply.approve.card.cache.expire.days:7}")`；`private long cardCacheExpireDays;`；`pacRedis.expire(cardKey, Duration.ofDays(cardCacheExpireDays));`
- `c0457122`：涉及 1 个文件；新增证据：`private final ReApproveNodeHandler reApproveNodeHandler;`；`if (reAutoPass) {`；`return ApproveOutcome.builder().triggerAsyncAuth(true).build();`；`reApproveProcess.setAuditStatus(ApplyProcessStatusEnum.APPROVAL.getState());`
- `0b38b2cd`：涉及 1 个文件；新增证据：`and (`
- `d5bc79e3`：涉及 2 个文件；新增证据：`reviewUserIds.add(ctx.getCreatorId());`；`reviewUserIds.addAll(ctx.getOcUserIds());`；`throw new ServiceException("授权package：" + appId + "在此agency账号下不存在，请检查包名是否正确");`；`log.error("授权失败：{}", ExceptionUtils.getStackTrace(e));`；`authResultDTO.setAuthAppMsg(StrUtil.maxLength(e.getMessage(), 50));`；`throw new ServiceException("授权package：" + appId + "在此agency账号下不存在，请检查包名是否正确");`
- `f2a021dd`：涉及 1 个文件；新增证据：`authResultDTO.setAuthAppMsg(StrUtil.maxLength(e.getMessage(), 100));`；`authResultDTO.setAuthTransparentMsg(StrUtil.maxLength(errMsg, 100));`；`authResultDTO.setAuthAppMsg(StrUtil.maxLength(e.getMessage(), 100));`；`reviewProcess.setNote(StrUtil.maxLength(authResultDTO.getLogMsg(), 100));`
- `39d41b14`：涉及 1 个文件；新增证据：`if (StrUtil.isNotBlank(pacRedis.get(expireKey))) {`
- `4b906694`：涉及 1 个文件；新增证据：`if (ObjectUtil.isNull(pacRedis.get(expireKey))) {`
- `4cac751b`：涉及 3 个文件；新增证据：`tmplParams.put("expire_key", expireKey);`；`pacRedis.setEx(expireKey, true, Duration.ofDays(cardCacheExpireDays));`；`pacRedis.del(expireKey);`；`pacRedis.del(StrUtil.format(CacheConstant.AF_ACCOUNT_APPLY_FEISHU_CARD_EXPIRE_TPL, applyId));`
- `dd4c8463`：涉及 4 个文件；新增证据：`tmplParams.put("expire_key", StrUtil.format(CacheConstant.AF_ACCOUNT_APPLY_FEISHU_CARD_TPL, apply.getId()));`；`@Data`；`public class FeiShuCardCallbackValueDTO implements Serializable {`；`private static final long serialVersionUID = 1L;`；`private String type;`；`private String msgTmplId;`

## 核心代码设计

本需求历史上共影响 25 个文件；当前仍可在 `master` 定位 25 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/feign/IOfferClient.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/PackageCmWithPlatformRequestVO.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/feign/OfferClient.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/mapper/OfferMapper.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/IOfferService.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/impl/OfferServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ApplyNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/PreApproveNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReApproveNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/handler/ReviewNodeHandler.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/notify/FeiShuApprovalNotifier.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/resolver/AfApplySplitResolver.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/biz/workflow/AfAccountAppApplyWorkflow.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/common/constant/CacheConstant.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/domain/entity/AfAccountAppApplyProcess.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/IAfAccountAppApplyLogService.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyAutoServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyLogServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyServiceImpl.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/resources/mapper/AfAccountAppApplyMapper.xml`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/constant/AfApplyConstant.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/domain/dto/FeiShuCardCallbackValueDTO.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/domain/vo/FeiShuMessageCardCallbackVO.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/feishu/service/impl/FeiShuMessageCardCallbackServiceImpl.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
