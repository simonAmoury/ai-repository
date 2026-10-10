---
id: pac-platform/lazada-url
scope: project
project: pac-platform
feature: lazada-url
updated: 2026-08-24
tags: [git-history, simon.ye, lazada更换Url]
code_anchors:
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/common/LazadaOApiConst.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/controller/LazadaController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/dto/lazada/LazadaExcelImportHotProductDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/dto/lazada/LazadaProductLinkData.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/entity/adplform/LazadaDefaultUrlChangeLog.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/entity/adplform/LazadaHotProduct.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/param/LazadaOfferDefaultUrlChangeParams.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/mapper/adplatform/LazadaDefaultUrlChangeLogMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/mapper/adplatform/LazadaHotProductMapper.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/LazadaDefaultUrlChangeLogService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/LazadaHotProductService.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/LazadaService.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `lazada更换Url`，共 4 条 Simon 提交，时间范围为
2025-02-25 至 2025-02-27。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `0be3ab24`（2025-02-25）：feat [lazada更换Url]: 新增表
- `27a8e3b5`（2025-02-26）：feat [lazada更换Url]: 链接转换
- `2d9f5eba`（2025-02-27）：feat [lazada更换Url]: 补充swagger
- `d13edc44`（2025-02-27）：feat [lazada更换Url]: 最新一批使用完进行重置

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `0be3ab24`：涉及 12 个文件；新增证据：`static String buildServerUrl(String country) {`；`switch (countryLowerCase) {`；`return StrUtil.format(URL_BASE_1, countryLowerCase);`；`return StrUtil.format(URL_BASE_2, countryLowerCase);`；`return StrUtil.format(URL_BASE_3, countryLowerCase);`；`throw new IllegalArgumentException("Unsupported country: " + country);`
- `27a8e3b5`：涉及 10 个文件；新增证据：`@RequiredArgsConstructor`；`@Api(tags = "lazada客户控制器")`；`@RestController`；`@RequestMapping(value = "lazada")`；`public class LazadaController {`；`private final LazadaService lazadaService;`
- `2d9f5eba`：涉及 1 个文件；新增证据：`@ApiOperation(value = "导入线下数据表")`；`@ApiOperation(value = "链接转换")`
- `d13edc44`：涉及 3 个文件；新增证据：`void reSetLastBatch();`；`if (CollectionUtil.isEmpty(productMap)) {`；`lazadaHotProductMapper.reSetLastBatch();`；`allCountrys.removeAll(productMap.keySet());`；`productMap.putAll(replenishMap);`

## 核心代码设计

本需求历史上共影响 19 个文件；当前仍可在 `master` 定位 19 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/common/LazadaOApiConst.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/controller/LazadaController.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/dto/lazada/LazadaExcelImportHotProductDTO.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/dto/lazada/LazadaProductLinkData.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/entity/adplform/LazadaDefaultUrlChangeLog.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/entity/adplform/LazadaHotProduct.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/domain/param/LazadaOfferDefaultUrlChangeParams.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/mapper/adplatform/LazadaDefaultUrlChangeLogMapper.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/mapper/adplatform/LazadaHotProductMapper.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/LazadaDefaultUrlChangeLogService.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/LazadaHotProductService.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/LazadaService.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/impl/LazadaDefaultUrlChangeLogServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/impl/LazadaHotProductServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/service/impl/LazadaServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/offer/LazadaOfferDefaultUrlChangeTaskHandler.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/postback/LazadaPostbackReissueTask.java`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/resources/mapper/adplform/LazadaDefaultUrlChangeLogMapper.xml`（当前仍存在）
- `pac-biz/pac-biz-job/src/main/resources/mapper/adplform/LazadaHotProductMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
