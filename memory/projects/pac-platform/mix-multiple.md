---
id: pac-platform/mix-multiple
scope: project
project: pac-platform
feature: mix-multiple
updated: 2026-08-24
tags: [git-history, simon.ye, mix_multiple]
code_anchors:
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagV2DTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixSourceTagPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MixSourceTagConfigController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MultipleOfferMixController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixOfferGroupSourceTagMapping.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixSourceTagConfig.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixSourceTagConfigLog.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixSourceTagConfigServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `mix_multiple`，共 4 条 Simon 提交，时间范围为
2025-07-02 至 2025-07-25。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `9d0e7a33`（2025-07-02）：feat[mix_multiple]: 去除参数校验
- `ef30363d`（2025-07-02）：feat[mix_multiple]: 新增多offer混量
- `c813d63e`（2025-07-03）：feat[mix_multiple]: 调整为逻辑删除
- `d9872bfa`（2025-07-25）：feat[mix_multiple]: 优化交互

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `9d0e7a33`：涉及 1 个文件；新增证据：`public R<String> updateV2( @RequestBody MixSourceTagDTO dto) {`
- `ef30363d`：涉及 8 个文件；新增证据：`@ApiModelProperty(value = "是否启动offer组打包，true为是，false为否")`；`private Boolean isOfferGroup;`；`@ApiModelProperty(value = "是否启用多offer混量，true为是，false为否")`；`private Boolean isMultiple;`；`@ApiModelProperty(value = "是否启用多offer混量，true为是，false为否")`；`private Boolean isMultiple;`
- `c813d63e`：涉及 1 个文件；新增证据：`@TableLogic`
- `d9872bfa`：涉及 3 个文件；新增证据：`if (CollectionUtil.isNotEmpty(dto.getOfferIds()) && dto.getOfferIds().size() > 1 && dto.getIsMultiple()) {`；`throw new ServiceException("所选offer不在同一个广告主下，无法进行多offer混量");`；`throw new ServiceException("所选offer地区不一致，无法进行多offer混量");`；`if (CollectionUtil.isNotEmpty(sourceTagIdList) && sourceTagIdList.size() > 1 && dto.getIsMultiple()) {`

## 核心代码设计

本需求历史上共影响 9 个文件；当前仍可在 `master` 定位 9 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSourceTagV2DTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/vo/mix/MixSourceTagPageVO.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MixSourceTagConfigController.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MultipleOfferMixController.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixOfferGroupSourceTagMapping.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixSourceTagConfig.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/MixSourceTagConfigLog.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixSourceTagConfigServiceImpl.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
