---
id: pac-platform/simon-master-history
scope: project
project: pac-platform
feature: simon-master-history
updated: 2026-08-24
tags: [git-history, master, simon.ye, historical-catalog]
code_anchors: []
source:
  ref: master
  revision: 86fd6464aaf80c717aecd42a1fd8ec7a0a2b3fc0
  author: simon.ye <simon.ye@tec-do.com>
  extraction: git log master --author='simon.ye'
---

## 核心业务逻辑

这是 Simon 在 `master` 历史中的需求索引，而不是当前代码事实快照。以提交作者为
`simon.ye <simon.ye@tec-do.com>` 精确筛选，共 499 条提交（2024-11-22 至
2026-08-21）。归类优先使用 `master` 首父合并记录里的源分支名；提交标题中的方括号
标签只在合并信息缺失或作为同一源分支内的子需求时使用。

统计口径：422 条带需求标签、37 条是“合并 master/子分支”过程提交、40 条早期无标签
提交。过程提交保留在索引中但不单独视为新需求。

### 已由合并边界确认的早期源分支

| 源分支 | 提交数 | 时间 | 从提交标题确认的范围 |
| --- | ---: | --- | --- |
| `feat_week47_optimize` | 4 | 2024-11-22 ~ 2024-12-11 | Offer 新增/编辑字段、H5 线下渠道删除/批量删除、查询逻辑删除过滤 |
| `feat/邮件通知场景优化` | 3 | 2024-11-25 ~ 2024-11-27 | click cap 邮件通知和编码调整 |
| `feat_workbench_package_2024_12_13` | 11 | 2024-12-13 ~ 2024-12-18 | 控制台包维度、Swagger、广告主导出、字段映射和平台筛选 |
| `hotfix_af_login` | 1 | 2024-12-16 | AF 登录修复 |
| `feat_TPP_acount_migration` | 10 | 2024-12-18 ~ 2025-01-02 | AU/TPP 账户增删改查、刷新链接、展示字段、权限处理 |
| `feat_adv_migration` | 33 | 2024-12-17 ~ 2025-01-09 | 广告主迁移详情、分页、导出、排序、数据权限 |
| `feat_mix_tag_20241230` | 31 | 2024-12-31 ~ 2025-01-15 | 混量标签、批量改 Offer、唯一性、地区/default_url/API tracking 校验 |
| 未能仅凭合并消息确认 | 1 | 2024-12-25 | `feat: 临时处理`；不推断其所属需求 |

### 带标签的需求分组（422 条）

- `af_msg`（55，2026-02-27 ~ 2026-04-01）
- `af_handshake`（38，2026-04-07 ~ 2026-05-07）
- `advMigration`（27，2025-01-02 ~ 2025-01-09）
- `mixTag`（27，2025-01-02 ~ 2025-01-15）
- `rta_page`（21，2025-07-28 ~ 2025-08-26）
- `afAutoAuth`（20，2025-03-21 ~ 2025-04-24）
- `mixGroup`（18，2025-04-28 ~ 2025-05-07）
- `af_optimize`（15，2026-01-19 ~ 2026-02-06）
- `media`（14，2025-01-14 ~ 2025-01-23）
- `af_internal_auth_v2`（14，2026-07-20 ~ 2026-07-27）
- `block_blast`（13，2025-12-30 ~ 2026-01-12）
- `blibli_affiliate_api`（13，2026-08-04 ~ 2026-08-18）
- `aj_adv_sync`（12，2026-05-19 ~ 2026-06-02）
- `af_email_optimize`（12，2026-07-03 ~ 2026-07-09）
- `af_handshake_msg`（11，2026-05-08 ~ 2026-05-13）
- `af_login_temp`（9，2025-07-08 ~ 2025-07-15）
- `affiliateTag`（8，2025-02-27 ~ 2025-03-04）
- `lazada更换url`（8，2025-02-25 ~ 2025-02-27）
- `mixGroupSub`（7，2025-05-12 ~ 2025-05-22）
- `mix_config_reuse`（6，2025-06-24 ~ 2025-06-27）
- `af_duplicated`（5，2026-07-01 ~ 2026-07-08）
- `afAuth`（4，2025-03-17 ~ 2025-03-21）
- `mix_multiple`（4，2025-07-02 ~ 2025-07-25）
- `shopee_rtg`（4，2025-12-27 ~ 2025-12-29）
- `tts_job_param`（4，2026-08-12）
- `af_advanced_privacy`（3，2026-06-30）
- `meituan_v3`（3，2025-04-02 ~ 2025-04-03）
- `multiCountryPrice`（3，2025-09-20）
- `mixReportFilter`（3，2025-01-15）
- `af_auth_close`（3，2025-09-04 ~ 2025-09-22）
- `af_retry`（3，2026-02-09）
- `af_email_optimize_v2`（3，2026-07-17）
- `af_login`（3，2025-09-26 ~ 2025-10-11）
- `af_two_factory_auth`（3，2025-09-09 ~ 2025-09-10）
- `af`（2，2025-08-19 ~ 2025-08-20）
- `af_auth`（2，2025-08-05 ~ 2025-08-06）
- `af_password`（2，2025-09-29 ~ 2025-09-30）
- `trial_price`（2，2025-07-14 ~ 2025-07-16）
- `tts_my_region_support`（2，2026-08-04）
- `trmDownImport`（1，2025-02-05）
- `shopee_rtg_consume_data`（1，2025-12-19）
- `pb_header_large`（1，2025-09-18）
- `offline_approve_link_macro_whitelist`（1，2026-08-06）
- `af_network_log`（1，2026-03-16）
- `foodpanda`（1，2025-06-12）
- `afAuthPlatform`（1，2025-05-07）
- `mix_group_sub`（1，2025-06-24）
- `mix_group`（1，2025-06-24）
- `af_code_clear`（1，2026-02-26）
- `mediaTag`（1，2025-01-20）
- `af_hand_check`（1，2025-04-03）
- `blibli_offline`（1，2026-08-21）
- `handshake_merge`（1，2026-05-19）
- `af_auth_screenshot`（1，2025-09-22）
- `tts_vn_ph_currency`（1，2026-08-19）

## 核心代码设计

此索引不把提交标签直接当作“当前模块名”。下次要恢复某一需求时，先按下列顺序定位：

1. 用源分支名查询其合并提交：`git log master --first-parent --merges --grep=<branch>`。
2. 用合并提交的两个父节点取增量：`git log <merge>^1..<merge>^2 --author='simon.ye'`。
3. 再读取这些提交影响的当前文件，才补充/更新对应需求的独立记忆和 `code_anchors`。

已有的独立记忆仍是专题事实来源：`cj-cps-order-pull.md`、
`coupang-order-reports-v2.md`、`cps-order-pull-framework.md`、
`offline-approve-link-macro-whitelist.md`、`tts-creator-auth-provider-jobparam.md`、
`url-param-replacer.md`。本索引只负责发现历史需求与源分支，不覆盖其中已验证的业务结论。

## 踩过的坑 / 反复纠错点

- `master` 上的提交并不保存创建时分支名；合并后的 `git branch --contains <commit>` 会返回大量后续分支，不能据此反推原始分支。
- “Merge master into feature”与子分支合并是开发过程，不是新增需求；本次单独计数为 37 条，避免污染需求数量。
- 提交标题标签是辅助证据：例如 `af_handshake_msg` 是 `faet_af_handshake_merage` 中的子分支；保留父子关系，不把它们合并成一个无法检索的大需求。
- 未标注需求且没有可靠合并边界的提交保持“未确认”，不凭文件名或时间邻近关系猜测归属。

## 交叉验证提示

- 本索引基于 `master@86fd6464aaf80c717aecd42a1fd8ec7a0a2b3fc0`。历史新增后需重新执行作者筛选，并更新总数和分组。
- 任何业务结论必须读取当前代码；本文件不提供 `code_anchors`，因为它横跨多条已合并且可能已演进/删除的分支。
- 处理某一标签时，先检查是否已有同主题独立记忆；有则更新独立记忆，不要把具体规则堆回本总索引。
