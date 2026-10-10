---
id: pac-platform/affiliate-au-account-management
scope: project
project: pac-platform
feature: affiliate-au-account-management
updated: 2026-08-24
tags: [Affiliate, AU账户, TPP账户, 注册链接, AccountAffMapping]
code_anchors:
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/AffiliateAuDTO.java
    symbol: AU 账户创建/编辑入参
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/AffiliateRemoveAuDTO.java
    symbol: affiliateId / accountId
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/AffiliateRefreshLinkVO.java
    symbol: link / linkEffectiveTime
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/AccountVO.java
    symbol: AU 账户列表展示字段
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/controller/AffiliateController.java
    symbol: addAu / editAu / removeAu / refreshLink
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/AffiliateServiceImpl.java
    symbol: addAu / editAu / removeAu / refreshLink / generateLink / getAffAccount
  - table: account（AU 账户）/ account_aff_mapping（渠道与账户关联）
---

## 核心业务逻辑

历史需求源分支 `feat_TPP_acount_migration`（2024-12-18 ~ 2025-01-02）为渠道增加 AU/TPP
账户管理：新增、编辑、删除、刷新注册链接，并在渠道账户查询中展示联系方式、地区、Skype、QQ 和
注册链接使用状态。

- 创建 AU：用户名唯一，账户状态为 active、角色为 au；创建账户后关联到传入的 affiliate。
- 注册链接：生成注册编码和链接、设置“未使用”状态及有效期；刷新链接应重新生成并返回链接与到期时间。
- 编辑 AU：按用户名定位账户并更新联系信息；密码只在前端传值与已保存值不同的时候重新加密写入。
- 删除 AU：指定账户和渠道关联；要求该渠道至少保留一个账户，同时受该账户关联的其他渠道最少账户数
  约束，满足才移除账户及关联关系。
- 2024-12-24 最终提交移除了四个 AU 管理接口上的 `@ApiScope` 权限注解；这是历史事实，当前
  Controller 仍未标注这些接口权限，不能默认它们仍受 `ApiPermissionConstants` 的细粒度规则保护。

## 核心代码设计

- API 层以 `AffiliateAuDTO` 承载新增/编辑，以 `AffiliateRemoveAuDTO` 承载删除，以
  `AffiliateRefreshLinkVO` 返回刷新后的链接信息；Controller 仅转发到 `AffiliateService`。
- `AffiliateServiceImpl#addAu` 和 `removeAu` 都标有事务：创建时要同时写 account 与
  account_aff_mapping，删除时要同时移除两侧数据，避免半完成关系。
- `generateLink` 从新增逻辑抽出，供创建与刷新复用；注册链接由 TPP 登录页前缀与注册编码拼接，
  有效期由该方法设置。
- `AccountVO` 的列表展示由渠道查询组装；其中包含账户敏感字段的历史演进，展示/API 脱敏策略必须
  以现行安全规则为准，不在本记忆记录具体密码或链接内容。

## 踩过的坑 / 反复纠错点

- 删除不是简单按 accountId 删除：历史先补了“当前渠道至少保留一条”，再补了账户涉及的其他渠道也
  不能少于一条的检查。改删除逻辑时必须重看多渠道关联，而不是只验证请求中的 affiliateId。
- 历史实现对 account 采用删除，再删除当前渠道 mapping；如果账户可关联多个渠道，必须核对 account
  删除的级联/逻辑删除语义及剩余 mapping 是否会留下悬挂数据。本次未查表约束，不能断言这一点已安全。
- 注册链接编码基于账户对象序列化后做 MD5；字段或序列化顺序改变会改变链接。刷新链接的有效期计算用
  `Calendar.DAY_OF_WEEK + 2`，其准确含义需单独验证，不应仅凭变量名理解为“两个自然日”。
- 账户列表历史上曾传出密码字段；即便当前为加密摘要，也属于敏感信息。任何接口改造先确认是否应完全
  排除该字段而不是只依赖前端隐藏。

## 下次需交叉验证的锚点

- `AffiliateController` 上 AU 管理接口当前实际鉴权链路；由于注解已移除，需确认是否有全局权限控制。
- `account` 与 `account_aff_mapping` 的外键/逻辑删除配置，以及 `removeAu` 对多渠道账户的最终数据一致性。
- `affiliatePropConfig.getTppLoginPageUrl()` 的配置与注册链接有效期约定；属外部配置，发布时核对各环境。
- `AccountVO` 及任何账户查询是否继续暴露密码或注册链接等敏感数据，按当前安全规范收敛。
