---
id: pac-platform/mix-config-reuse
scope: project
project: pac-platform
feature: mix-config-reuse
updated: 2026-08-24
tags: [git-history, simon.ye, mix_config_reuse]
code_anchors:
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSiteIdUpdateDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MixSourceTagConfigController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/SourceTagLog.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/SourceTagLogMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/IMixSourceTagConfigService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ISourceTagLogService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/ISourceTagLogServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixSourceTagConfigServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/task/XxlJobHandler.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-trade/src/main/resources/mapper/SourceTagLogMapper.xml
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `mix_config_reuse`，共 6 条 Simon 提交，时间范围为
2025-06-24 至 2025-06-27。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `5058c833`（2025-06-24）：change[mix_config_reuse]: 冲突解决
- `531a3e35`（2025-06-24）：feat[mix_config_reuse]: 复用历史sourceTag
- `231e9463`（2025-06-25）：fix[mix_config_reuse]: 补充缺失的无参构造函数
- `35c813f3`（2025-06-25）：change[mix_config_reuse]: 改为自增
- `0b134499`（2025-06-27）：fix[mix_config_reuse]: 修改为系统用户
- `d6de3463`（2025-06-27）：fix[mix_config_reuse]: 修改为系统用户

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `5058c833`：涉及 2 个文件；新增证据：`void refreshSourceTagConfig(List<Integer> offerIds);`；`public void refreshSourceTagConfig(List<Integer> offerIds) {`；`configList.forEach(config -> refreshSiteIdV2(config.getId(), true));`
- `531a3e35`：涉及 10 个文件；新增证据：`@Builder`；`service.editSiteId(dto, Boolean.FALSE);`；`@PostMapping(value = "/reUseSourceValue/{offerId}")`；`@ApiOperation(value = "复用历史sourceValue")`；`public R<String> reUseSourceValue(@PathVariable(value = "offerId") Integer offerId) {`；`service.reUseSourceValue(offerId);`
- `231e9463`：涉及 1 个文件；新增证据：`@NoArgsConstructor`；`@AllArgsConstructor`
- `35c813f3`：涉及 1 个文件；新增证据：`@TableId(value = "id", type = IdType.AUTO)`
- `0b134499`：涉及 1 个文件；新增证据：`editSiteId(mixSiteIdUpdateDTO, Boolean.TRUE);`
- `d6de3463`：涉及 1 个文件；新增证据：`saveConfigLog(config, isSystem);`

## 核心代码设计

本需求历史上共影响 10 个文件；当前仍可在 `master` 定位 10 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/dto/mix/MixSiteIdUpdateDTO.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/MixSourceTagConfigController.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/entity/adplatform/SourceTagLog.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/mapper/SourceTagLogMapper.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/IMixSourceTagConfigService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/ISourceTagLogService.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/ISourceTagLogServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixSourceTagConfigServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/task/XxlJobHandler.java`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/resources/mapper/SourceTagLogMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
