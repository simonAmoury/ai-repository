---
id: pac-platform/tts-vn-ph-currency
scope: project
project: pac-platform
feature: tts-vn-ph-currency
updated: 2026-09-07
tags: [git-history, simon.ye, tts_vn_ph_currency, 已被后续需求取代]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/amount/PhpAmountParser.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/amount/VndAmountParser.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `tts_vn_ph_currency`，共 1 条 Simon 提交，时间范围为
2026-08-19 至 2026-08-19。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `50fc4e6c`（2026-08-19）：feat[tts_vn_ph_currency]: 增加VN、PH地区货币解析

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `50fc4e6c`：涉及 2 个文件；新增证据：`@Component`；`public class PhpAmountParser implements CurrencyAmountParser {`；`private static final String CURRENCY = "PHP";`；`@Override`；`public String getCurrency() {`；`@Override`

## 核心代码设计

本需求历史上共影响 2 个文件；当前仍可在 `master` 定位 2 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/amount/PhpAmountParser.java`（当前仍存在）
- `pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/amount/VndAmountParser.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
## 后续漂移（2026-09-07 更新）

本文件 `code_anchors` 里的 `PhpAmountParser`、`VndAmountParser` **已于 2026-09-07 删除**。
币种金额解析已重构为「`AmountFormat` 枚举承载 3 套算法 + 系统字典承载币种→格式映射」，
`CurrencyAmountParser` 接口、`CurrencyAmountParserDispatcher` 及全部 `*AmountParser` 均已移除。

VN/PH 的解析规则本身未变（PHP 与 MYR 同为逗号千分位·点小数点 → `COMMA_GROUPING`；
VND 为点千分位·无小数位 → `DOT_GROUPING_NO_DECIMAL`），但**新增币种的做法已完全不同**：
不再新建 parser 类，改为在字典 `code=cps-currency-amount-format` 加一行。

当前实现与完整结论见 `tts-th-region-support.md`，本文件仅保留历史提交回溯价值。
