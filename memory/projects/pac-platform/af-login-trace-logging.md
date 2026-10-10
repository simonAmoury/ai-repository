---
id: pac-platform/af-login-trace-logging
scope: project
project: pac-platform
feature: af-login-trace-logging
updated: 2026-08-24
tags: [AppsFlyer, AF登录, af-login, token, 日志]
code_anchors:
  - path: pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/impl/AfLoginService.java
    symbol: login / checkToken
---

## 核心业务逻辑

历史热修（提交 `7dab0fb0`，2024-12-16）为 AF 登录接口增加链路日志：进入接口、开始向
AppsFlyer 获取 token、获取完成。鉴权失败仍在调用 AF 前抛未授权异常。

## 核心代码设计

- 日志围绕 `AfLoginService#login` 的三个关键边界，方便区分请求是否到达、是否通过本地 access token
  校验、是否卡在 AppsFlyer token 获取。
- 当前 `login` 已演进为通过账号密钥和媒体配置创建 `AppsFlyerClient`，但历史增加的三处日志仍保留；
  因此这个记忆只描述追踪边界，不把 2024 年的 client 构造参数当作当前事实。

## 踩过的坑 / 反复纠错点

- 历史代码会将整个 `AfLoginReqDto` 写入 INFO 日志。请求 DTO 含 access token 的可能性需要每次修改时
  核对；日志不应记录凭据原文。此处只记录该风险，不输出或沉淀任何真实凭据。
- 当前 `checkToken` 仍发生在外部 AF 请求之前；调整日志或 client 创建顺序时不要让非法 access token
  触发外部请求。

## 下次需交叉验证的锚点

- `AfLoginReqDto#toString()` 实际包含哪些字段，确认日志脱敏策略是否满足安全要求。
- `AfLoginService#login` 中 AppsFlyer client 的创建、密码读取及异常日志是否保留完整堆栈；该文件当前
  有工作区改动，修改前应先与用户现有改动合并核对。
