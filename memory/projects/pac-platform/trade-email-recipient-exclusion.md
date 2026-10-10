---
id: pac-platform/trade-email-recipient-exclusion
scope: project
project: pac-platform
feature: trade-email-recipient-exclusion
updated: 2026-08-24
tags: [邮件通知, click cap, 收件人, pac.trade.remove.emails, UserCache]
code_anchors:
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/EmailServiceImpl.java
    symbol: sendEmail（收件人汇总后根据 removeEmails 排除）
  - path: pac-biz-api/pac-biz-system-api/src/main/java/com/tecdo/pac/biz/system/api/feign/IOldUserClient.java
    symbol: listByEmails（历史实现遗留接口）
  - path: pac-biz/pac-biz-system/src/main/java/com/tecdo/pac/biz/system/feign/OldUserClient.java
    symbol: listByEmails（历史实现遗留接口）
  - apollo: pac.trade.remove.emails
---

## 核心业务逻辑

历史需求（提交 `d8946e0b`、`5986cd46`，2024-11-25 ~ 2024-11-27）在交易邮件通知中增加
收件人排除名单。邮件原本汇总 TO 和 CM 用户后发送；排除名单内的邮箱需要被转换为用户 ID 并从
汇总名单中移除，再查询活跃用户、生成邮件。

名单从配置 `pac.trade.remove.emails` 读取，使用英文逗号分隔；它是邮件收件人策略，不改变
TO/CM 的原始计算规则。

## 核心代码设计

- 历史初版新增 `IOldUserClient#listByEmails` 及 system 服务实现，以邮箱批量反查旧用户，再从
  `allUserIds` 移除。
- 同日修订把写死邮箱改为 Spring 配置 `@Value("${pac.trade.remove.emails}")`，避免每次名单调整
  都改代码。
- **现状已演进**：`EmailServiceImpl#sendEmail` 不再调用 `IOldUserClient`，而是用
  `UserCache#getUserInfoByEmail` 直接从邮箱取得用户 ID；历史 Feign 接口和实现仍存在。下次修改
  收件人过滤时，应以缓存路径为当前事实，不能误以为 Feign 仍是运行时依赖。

## 踩过的坑 / 反复纠错点

- 排除必须发生在 TO/CM ID 汇总完成后、查询邮件接收人之前；只从某一个来源集合删除会让同一用户
  经另一个来源重新进入收件人。
- 该配置若缺失或为空，`split` 结果和 `@Value` 绑定的行为需要在实际配置环境确认；当前代码没有
  可见默认值，也没有在本次任务中读取 Apollo，不能假定空配置安全。
- 旧的 `IOldUserClient` fallback 对 `listByEmails` 返回 `null`，如果重新改回 Feign 调用必须补齐
  空结果处理，否则网络降级时会在 stream 调用处空指针。当前缓存实现先 `filter(Objects::nonNull)`，
  对单个查不到用户可安全跳过。

## 下次需交叉验证的锚点

- 各环境的 `pac.trade.remove.emails` 当前值和是否包含已失效邮箱；这是外部配置，应由发布人员核对。
- `EmailServiceImpl#sendEmail` 是否仍为所有相关邮件入口；若新增其他发送服务，明确是否共用排除策略。
- `UserCache#getUserInfoByEmail` 的缓存刷新与用户邮箱变更行为；名单按邮箱配置，邮箱变化可能导致
  排除失效。
