---
id: pac-platform/af-password
scope: project
project: pac-platform
feature: af-password
updated: 2026-08-24
tags: [git-history, simon.ye, af_password]
code_anchors:
  - path: pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/controller/AfLoginController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/service/impl/AfLoginService.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `af_password`，共 2 条 Simon 提交，时间范围为
2025-09-29 至 2025-09-30。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `0823951e`（2025-09-29）：hotfix[af_password]: 切换获取密码方式
- `8cdeb12c`（2025-09-30）：hotfix[af_password]: 切换获取密码方式

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `0823951e`：涉及 3 个文件；新增证据：`private Supplier<String> pwdGetter;`；`private static AppsFlyerClient newInstance(String username, String host, String key, Supplier<String> pwdGetter) {`；`appsFlyerClient.setPwdGetter(pwdGetter);`；`public static AppsFlyerClient getInstance(String username, String host, String key, Supplier<String> pwdGetter) {`；`instances.computeIfAbsent(clientKey, k -> newInstance(username, host, key, pwdGetter));`；`if (StrUtil.isNotBlank(mediaConfigPwd)){`
- `8cdeb12c`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff

## 核心代码设计

本需求历史上共影响 3 个文件；当前仍可在 `master` 定位 3 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-common/src/main/java/com/tecdo/pac/common/client/AppsFlyerClient.java`（当前仍存在）
- `pac-ops/pac-af-login/src/main/java/com/tecdo/pac/af/controller/AfLoginController.java`（当前仍存在）
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
