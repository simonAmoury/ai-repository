---
id: pac-platform/offer-publication-settings
scope: project
project: pac-platform
feature: offer-publication-settings
updated: 2026-08-24
tags: [Offer, 创建Offer, 编辑Offer, unSyncField, recommendPub, showToAffiliate]
code_anchors:
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferDTO.java
    symbol: unSyncField / recommendPub / showToAffiliate
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/entity/OfferOrderInfo.java
    symbol: recommendPub
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/entity/OfferSetting.java
    symbol: unSyncField / showToAffiliate
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/impl/OfferServiceImpl.java
    symbol: addOfferOrderInfo / addOfferSetting / updateOfferOrderInfo / updateOfferSetting / updateOfferSettingAndOrderInfo
---

## 核心业务逻辑

历史需求（提交 `b6426e31`，2024-11-22）为 Offer 创建和编辑增加三项可配置属性：

- `unSyncField`：以逗号分隔的不同步字段；仅接入方式 `businessMode="1"` 时生效。
- `recommendPub`：是否公开（1 公开、0 不公开），保存到 `OfferOrderInfo`。
- `showToAffiliate`：是否向渠道展示（1 展示、0 不展示），保存到 `OfferSetting`。

创建与编辑都必须把三项从 `OfferDTO` 传递到各自的持久化对象，避免只在创建或编辑的一端生效。

## 核心代码设计

- `OfferDTO` 是创建和编辑共用的入参载体；字段归属按数据库实体分开落库：公开属性落
  `OfferOrderInfo`，不同步/渠道展示属性落 `OfferSetting`。
- `OfferServiceImpl#addOfferSetting` 在历史实现中先保留线上普通 Offer 的默认展示规则，随后用
  DTO 的 `showToAffiliate` 赋值；当前代码仍保留这两个步骤，最终值以 DTO 为准。
- 新增时 `unSyncField` 仅在 `businessMode="1"` 时写入，空文本归一为 `null`；编辑时
  `updateOfferSetting` 同样以该条件决定是否更新该列，保持创建/编辑的业务边界一致。
- 当前额外存在 `updateOfferSettingAndOrderInfo`，用于同时直接更新这三项字段；这是后续演进的
  入口，非历史提交原始范围，但属于下次改动必须核对的调用路径。

## 踩过的坑 / 反复纠错点

- 历史创建逻辑原本会按线上状态给 `recommendPub` 写默认值，随后立即覆盖为 DTO 的值；结果是
  请求未传该字段时可能写入 `null`。这是当前代码中已验证仍存在的顺序，不能从历史标题推断
  “线上 Offer 一定公开”；需要调用方/数据库默认值共同确认。
- `showToAffiliate` 也有同样的默认值后覆盖路径。若要恢复默认行为，应先确认 DTO 是否允许省略、
  数据库列默认值，以及现有调用方的实际传值，不能仅删掉后一行赋值。
- `unSyncField` 的业务条件由字符串业务模式决定；更换业务模式枚举/编码前必须同步核对
  `businessMode="1"` 是否仍代表历史的 2.0 接入方式。

## 下次需交叉验证的锚点

- `OfferDTO`、`OfferOrderInfo`、`OfferSetting` 的字段类型和注释是否仍与上述字段归属一致。
- `OfferServiceImpl` 的新增、编辑及 `updateOfferSettingAndOrderInfo` 三条写入路径是否都覆盖所需字段。
- `businessMode="1"` 的语义及 `recommend_pub`、`show_to_affiliate`、`un_sync_field` 的表默认值；
  本次未查数据库，不能把默认值写成事实。
