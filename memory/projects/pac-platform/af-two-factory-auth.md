---
id: pac-platform/af-two-factory-auth
scope: project
project: pac-platform
feature: af-two-factory-auth
updated: 2026-08-24
tags: [git-history, simon.ye, af_two_factory_auth]
code_anchors:
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/test/java/com/tecdo/pac/biz/trade/AppsFlyerTest.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyAutoServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/build.gradle
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/pojo/appsflyer/AppsFlyerConst.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/aws/AESGCMEncryptor.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/aws/AwsContrast.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/aws/AwsWafTokenUtils.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/aws/FpUtils.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/aws/VerifyUtils.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/capsolver/AwsWafCaptchaSolver.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_two_factory_auth`，共 3 条 Simon 提交，时间范围为
2025-09-09 至 2025-09-10。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `21308081`（2025-09-09）：feat[af_two_factory_auth]: af登录补充2FA验证
- `a498182b`（2025-09-09）：feat[af_two_factory_auth]: 获取2FA验证码
- `097e7c17`（2025-09-10）：feat[af_two_factory_auth]: 解码调整

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `21308081`：涉及 19 个文件；新增证据：`private final IAccountKeyClient accountKeyClient;`；`private final IAccountKeyClient accountKeyClient;`；`private String key;`；`private static AppsFlyerClient newInstance(String username, String host, String key) {`；`appsFlyerClient.setKey(key);`；`public static AppsFlyerClient getInstance(String username, String host, String key) {`
- `a498182b`：涉及 5 个文件；新增证据：`if (StrUtil.isBlank(key)) {`；`try (HttpResponse responseResult = RetryUtil.doRequestWithRetry(() -> {`；`bodyMap.put("otp-input", GoogleAuthUtil.getOtp(username, key));`；`logApiReqRespInfo(request, response);`；`checkResponse(response);`；`AssertX.isTrue(loginSuccess, parseBody.getByPath("Message", String.class));`
- `097e7c17`：涉及 11 个文件；新增证据：`request.header("Cookie", getAwsToken(null));`；`redisTemplate.opsForValue().set(AwsContrast.AWS_KEY, cookie, 10, TimeUnit.MINUTES);`；`private String getAwsToken(String awsToken) {`；`if (StrUtil.isNotBlank(awsToken)) {`；`if (StrUtil.isNotBlank(awsToken)) {`；`log.info("AppsFlyerClient#{} request api: {}.", this.username, urlPath);`

## 核心代码设计

本需求历史上共影响 28 个文件；当前仍可在 `master` 定位 28 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/TrmApproveAutoServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/test/java/com/tecdo/pac/biz/trade/AppsFlyerTest.java`（当前仍存在）
- `pac-bop/pac-bop-admin/src/main/java/com/tecdo/pac/bop/admin/service/impl/AfAccountAppApplyAutoServiceImpl.java`（当前仍存在）
- `pac-common/build.gradle`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/client/pojo/appsflyer/AppsFlyerConst.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/aws/AESGCMEncryptor.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/aws/AwsContrast.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/aws/AwsWafTokenUtils.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/aws/FpUtils.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/aws/VerifyUtils.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/capsolver/AwsWafCaptchaSolver.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/googleauth/GoogleAuthUtil.java`（当前仍存在）
- `pac-common/src/main/resources/aws/webgl.json`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/client/IAccountKeyClient.java`（当前仍存在）
- `pac-ops-api/pac-foreign-api/src/main/java/com/tecdo/pac/foreign/api/appsflyer/entity/AccountKey.java`（当前仍存在）
- `pac-ops/pac-af-login/build.gradle`（当前仍存在）
- `pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/controller/AfLoginController.java`（当前仍存在）
- `pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/IAfLoginService.java`（当前仍存在）
- `pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/impl/AfLoginService.java`（当前仍存在）
- `pac-ops/pac-af-login/src/test/java/com/tecdo/pac/af/PacAfLoginApplicationTests.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/client/AccountKeyClient.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/mapper/AccountKeyMapper.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/AccountKeyService.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AccountKeyServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAccountAppServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/java/com/tecdo/pac/foreign/appsflyer/service/impl/AfAutoAuthTaskServiceImpl.java`（当前仍存在）
- `pac-ops/pac-foreign/src/main/resources/mapper/AccountKeyMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
