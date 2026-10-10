---
id: pac-platform/mix-report-filter
scope: project
project: pac-platform
feature: mix-report-filter
updated: 2026-08-24
tags: [git-history, simon.ye, mixReportFilter]
code_anchors:
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaPageDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaDetailVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaPageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateBasicVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateDetailInfoVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateEncourageVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/Media.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateDetailInfo.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateEncourage.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/controller/MediaController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaServiceImpl.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `mixReportFilter`，共 3 条 Simon 提交，时间范围为
2025-01-15 至 2025-01-15。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `58749ad7`（2025-01-15）：feat[mixReportFilter]: 混量日报过滤指定数据
- `a7e65aca`（2025-01-15）：feat[mixReportFilter]: 媒体报价单接口定义
- `bd36221f`（2025-01-15）：feat[mixReportFilter]: 媒体报价单接口定义

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `58749ad7`：涉及 1 个文件；新增证据：`@Value("${pac.mix_report.filter_aff_ids}")`；`private List<Integer> filterAffIds;`；`@Value("${pac.mix_report.filter_to_names}")`；`private List<String> filterToNames;`
- `a7e65aca`：涉及 1 个文件；新增证据：`@Api(tags = "媒体报价单")`
- `bd36221f`：涉及 15 个文件；新增证据：`@Data`；`@EqualsAndHashCode(callSuper = true)`；`@ApiModel(value = "媒体报价单分页DTO")`；`public class MediaPageDTO extends PQuery implements Serializable {`；`private static final long serialVersionUID = -7623531677357258898L;`；`@ApiModelProperty(value = "渠道ID")`

## 核心代码设计

本需求历史上共影响 16 个文件；当前仍可在 `master` 定位 16 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/dto/MediaPageDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaDetailVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaPageVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateBasicVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateDetailInfoVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/api/vo/MediaRebateEncourageVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/Media.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateDetailInfo.java`（当前仍存在）
- `pac-biz-api/pac-biz-affiliate-api/src/main/java/com/tecdo/pac/biz/affiliate/entity/MediaRebateEncourage.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/controller/MediaController.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/MediaService.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/java/com/tecdo/pac/biz/affiliate/service/impl/MediaServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaRebateDetailInfoMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-affiliate/src/main/resources/mapper/MediaRebateEncourageMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/MixReportServiceImpl.java`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
