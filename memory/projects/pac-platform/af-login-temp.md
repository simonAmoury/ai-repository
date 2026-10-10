---
id: pac-platform/af-login-temp
scope: project
project: pac-platform
feature: af-login-temp
updated: 2026-08-24
tags: [git-history, simon.ye, af_login_temp]
code_anchors:
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/capsolver/AwsWafCaptchaSolver.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/capsolver/CapsolverConfig.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinConfig.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinConstant.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinRequestParam.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinResponse.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/controller/AfLoginController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/IAfLoginService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/impl/AfLoginService.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_login_temp`，共 9 条 Simon 提交，时间范围为
2025-07-08 至 2025-07-15。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `28f4f781`（2025-07-08）：feat[af_login_temp]: 跳过token校验（临时）
- `b8f45d86`（2025-07-08）：feat[af_login_temp]: 补充cookie
- `e57aa9df`（2025-07-08）：feat[af_login_temp]: 补充cookie
- `f3ed5b8a`（2025-07-10）：feat[af_login_temp]: 接入海豚
- `6ca2c9d7`（2025-07-14）：feat[af_login_temp]: 增加等待时间
- `67af216f`（2025-07-15）：feat[af_login_temp]: 获取cookie接口
- `787168b0`（2025-07-15）：feat[af_login_temp]: 主动刷新cookie
- `8368939e`（2025-07-15）：feat[af_login_temp]: 优化
- `95471335`（2025-07-15）：feat[af_login_temp]: 获取cookie接口

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `28f4f781`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `b8f45d86`：涉及 1 个文件；新增证据：`private String getCookie() {`
- `e57aa9df`：涉及 1 个文件；新增证据：`private String getCookie(){`；`redisTemplate.delete(CUR_KEY);`
- `f3ed5b8a`：涉及 6 个文件；新增证据：`private HttpResponse executeRequest(HttpRequest request) {`；`if (response.getStatus() == 202) {`；`refreshCookie();`；`request.header("Cookie", getCookie());`；`return request.execute();`；`private void refreshCookie() {`
- `6ca2c9d7`：涉及 1 个文件；新增证据：`private HttpResponse executeRequest(HttpRequest request) throws InterruptedException {`；`Thread.sleep(5000);`
- `67af216f`：涉及 3 个文件；新增证据：`@GetMapping("/get-cookie")`；`@ApiOperation(value = "获取AF cookie")`；`public R<String> getCookie() throws InterruptedException {`；`return R.data(afLoginService.getCookie());`；`String getCookie() throws InterruptedException;`；`@Resource`
- `787168b0`：涉及 2 个文件；新增证据：`private void refreshCookie() throws InterruptedException {`；`redisTemplate.opsForValue().set(AWS_REDIS_KEY, cookie, 10, TimeUnit.MINUTES);`；`public class AwsWafCaptchaSolver {`；`private final static Logger log = LoggerFactory.getLogger(AwsWafCaptchaSolver.class);`；`private static final String CAPSOLVER_API_KEY = "CAP-1930F4794954E5CDF4F58064775F273F513D52AB4D93706D46F0229A7D0CBBD6";`；`private static final String CREATE_TASK_URL = "https://api.capsolver.com/createTask";`
- `8368939e`：涉及 3 个文件；新增证据：`taskPayload.put("clientKey", config.getKey());`；`taskDetails.put("awsChallengeJS", config.getAfJsUrl());`；`resultPayload.put("clientKey", config.getKey());`；`@Data`；`@Configuration`；`public class CapsolverConfig {`
- `95471335`：涉及 4 个文件；新增证据：`request.header("Cookie", cookie);`；`private static final CapsolverConfig config = SpringUtil.getBean(CapsolverConfig.class);`；`public static String refreshCookie() throws InterruptedException {`；`@Value(value = "${af.cookie_expire}")`；`private int afCookieExpire;`；`return AwsWafCaptchaSolver.refreshCookie();`

## 核心代码设计

本需求历史上共影响 12 个文件；当前仍可在 `master` 定位 11 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/AwsWafCaptchaSolver.java`（当前已不存在或已改名）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/capsolver/AwsWafCaptchaSolver.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/capsolver/CapsolverConfig.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinClient.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinConfig.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinConstant.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinRequestParam.java`（当前仍存在）
- `pac-common/src/main/java/com/tecdo/pac/common/utils/dolphin/DolphinResponse.java`（当前仍存在）
- `pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/controller/AfLoginController.java`（当前仍存在）
- `pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/IAfLoginService.java`（当前仍存在）
- `pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/impl/AfLoginService.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
