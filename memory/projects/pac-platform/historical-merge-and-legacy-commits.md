---
id: pac-platform/historical-merge-and-legacy-commits
scope: project
project: pac-platform
feature: historical-merge-and-legacy-commits
updated: 2026-08-24
tags: [git-history, simon.ye, merge, legacy-commits, coverage]
code_anchors: []
---

## 核心业务逻辑

这是 Simon 历史需求记忆的提交覆盖索引，记录无法从带标签提交自动归类的过程提交，以及已经由
专题记忆整理、但尚未在其正文逐条列出哈希的早期提交。它不构成独立业务功能，唯一用途是确保
`master` 上按作者筛出的每条提交都有可回溯位置。

本轮作者提交总数 499 条；本文件补充 61 条：38 条合并过程提交，
23 条早期直接功能/修复提交。直接提交的业务结论以对应专题记忆为准；合并过程提交
只表达分支整合，不重复声称新增业务功能。

### 完整提交清单

- `32d056c5`（2026-08-12）：feat[tts_job_param]: 加锁
- `40e9f5f8`（2026-08-12）：feat[tts_job_param]: 去除事务
- `b462ffef`（2026-08-12）：feat[tts_job_param]: authCode换token
- `9462534b`（2026-08-12）：feat[tts_job_param]: jobParam入参调整
- `0220c8cd`（2026-08-06）：feat[offline_approve_link_macro_whitelist]: 授权时跳过链接校验，复核时增加宏参校验
- `8458d6f5`（2026-07-27）：Merge branch 'master' into feat_af_internal_auth_v2
- `0f2e824b`（2026-05-11）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `1bf83e99`（2026-05-09）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `45fd3fcd`（2026-05-09）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `e805cecd`（2026-05-09）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `ac7d3aec`（2026-05-09）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `064fd1b3`（2026-05-08）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `bbb63212`（2026-05-07）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `c8158145`（2026-05-06）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `d05e14e1`（2026-04-30）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `85d592ae`（2026-04-29）：Merge branch 'feat_af_handshake_msg_v1' into faet_af_handshake_merage
- `32554a43`（2026-04-28）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `89ffb4a4`（2026-04-28）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `9faf7e5f`（2026-04-28）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `d43b9368`（2026-04-28）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `f67ee232`（2026-04-27）：Merge branch 'feat_af_handshake_msg' into faet_af_handshake_merage
- `593c1afc`（2026-04-01）：Merge branch 'master' into feat_af_msg
- `50b42861`（2026-02-06）：Merge branch 'master' into feat_af_02_06
- `803962c1`（2026-01-30）：Merge branch 'master' into feat_af_optimize
- `112cbd43`（2026-01-12）：Merge branch 'master' into feat_block_blast_consume_data
- `5e317a83`（2025-10-13）：Merge branch 'master' into feat_af_auth_close
- `47f8da0f`（2025-09-22）：Merge branch 'master' into feat_af_auth_close
- `c539f606`（2025-09-20）：Merge remote-tracking branch 'origin/feature_mutiCountryPrice' into feature_mutiCountryPrice
- `57b85d8f`（2025-08-26）：Merge branch 'master' into feat_rta_page_yoyo
- `afb58c3b`（2025-06-25）：Merge branch 'master' into feat_mix_config_reuse_history
- `a5ee0467`（2025-06-24）：Merge branch 'master' into feat_mix_config_reuse_history
- `1d85b9d9`（2025-05-21）：Merge branch 'master' into feat_mix_group_sub
- `4e05a34e`（2025-04-14）：Merge branch 'master' into feat_af_auto_auth
- `bdc64bc0`（2025-03-26）：Merge remote-tracking branch 'origin/feat_af_event_package' into feat_af_auto_auth
- `8b497ced`（2025-03-04）：Merge branch 'master' into feat_affiliate_tag
- `04ba04cf`（2025-02-12）：Merge branch 'master' into feat_media_20250114
- `5e5541a1`（2025-01-13）：Merge branch 'master' into feat_mix_tag_20241230
- `03d98444`（2025-01-10）：Merge branch 'master' into feat_mix_tag_20241230
- `942f8682`（2025-01-09）：Merge branch 'master' into feat_adv_page_optimize
- `14ad5efe`（2025-01-08）：Merge branch 'master' into feat_adv_migration
- `4330c60e`（2025-01-02）：Merge branch 'master' into feat_TPP_acount_migration
- `46e03046`（2025-01-02）：feat: 唯一性校验改造
- `85a2d584`（2024-12-31）：fix: sql修复
- `aa25ff3f`（2024-12-31）：feat: 修改类型
- `b2bbad60`（2024-12-31）：feat: 混量标签
- `49a4f43f`（2024-12-30）：feat: 去除接口权限校验
- `5d1d501a`（2024-12-27）：fix: sql错误
- `f35f5180`（2024-12-24）：feat: 去除权限校验
- `cf02cd92`（2024-12-24）：feat: 增加TPP展示字段
- `64932981`（2024-12-24）：fix: sql错误
- `b416778b`（2024-12-20）：feat: 查询TPP账户增加返回值,编辑增加判断
- `f27c7200`（2024-12-19）：change: 导出调整
- `3a2ca4a6`（2024-12-19）：feat: 增加返回内容
- `aa334ee7`（2024-12-19）：fix: 创建时间映射修改
- `b31f8792`（2024-12-18）：feat: 删除账号校验增加
- `d434f4f3`（2024-12-18）：feat: 刷新Au账号链接
- `c2759571`（2024-12-18）：feat: 删除au账号
- `5df2b69b`（2024-12-18）：feat: au编辑
- `58e842e5`（2024-12-18）：feat: au新增
- `80980113`（2024-12-11）：Merge branch 'master' into feat_week47_optimize
- `5092a501`（2024-11-27）：Merge branch 'master' into feat/邮件通知场景优化

## 核心代码设计

- 合并提交的实际业务 diff 属于其第二父分支的增量，回溯时使用 `git log <merge>^1..<merge>^2`，
  不把“Merge master into feature”误写成需求实现。
- 2024 年无标签提交已分别由 `offer-publication-settings`、`h5-adv-offline-data-soft-delete`、
  `trade-email-recipient-exclusion`、`af-login-trace-logging`、`affiliate-au-account-management` 等
  专题记忆分析；本文件只补提交哈希索引。
- tts_job_param 与 offline_approve_link_macro_whitelist 已有专题记忆；相关提交留在此处保证
  499 条历史记录的覆盖可审计。

## 踩过的坑 / 反复纠错点

- 合并提交、同步 master 提交和子分支整合不是独立需求；若把它们拆成业务记忆会造成重复和错误归因。
- 文档里没有哈希不等于提交未被分析；但审计时必须保留精确 hash 才能证明覆盖范围。

## 下次需交叉验证的锚点

- 新增历史整理时先运行 git log master --author='simon.ye'，再检查是否新增未覆盖 hash。
- 需要业务规则时从本清单跳转到对应专题记忆或执行 git show <hash>，不要从合并标题推断语义。
