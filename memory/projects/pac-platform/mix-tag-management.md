---
id: pac-platform/mix-tag-management
scope: project
project: pac-platform
feature: mix-tag-management
updated: 2026-08-24
tags: [git-history, simon.ye, mixTag]
code_anchors:
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/constant/OfferAttributeConstant.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/constant/OfferBatchModifyConstant.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/BatchModifyOfferExcelV2DTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferBaseInfoDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferUniqueQueryDTO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/entity/Offer.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/enums/OfferBatchModifyEnum.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferUniqueInfoVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferVO.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/controller/OfferController.java
    symbol: 历史提交影响文件；需按当前实现核对
  - path: pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/enums/OfferAttributeKeyEnum.java
    symbol: 历史提交影响文件；需按当前实现核对
---

## 核心业务逻辑

该需求来自历史标签/源分支 `mixTag`，共 27 条 Simon 提交，时间范围为
2025-01-02 至 2025-01-15。提交标题是唯一已核对的历史业务描述；
本记忆不把标题之外的推断写成事实。

### 完整提交清单

- `209c5332`（2025-01-02）：feat[mixTag]: 批量修改offer
- `d3a54410`（2025-01-02）：feat[mixTag]: 批量修改offer
- `940cf01b`（2025-01-06）：feat[mixTag]: 地区限制
- `d3a637ae`（2025-01-06）：feat[mixTag]: default_url校验
- `40ca67c7`（2025-01-07）：feat[mixTag]: 唯一性校验处理
- `91389b7a`（2025-01-07）：feat[mixTag]: 修改offer
- `95d63b72`（2025-01-07）：feat[mixTag]: 唯一性校验处理
- `9a958841`（2025-01-07）：feat[mixTag]: 提示修改
- `bd426b6e`（2025-01-07）：feat[mixTag]: 代码优化
- `cfc93335`（2025-01-07）：feat[mixTag]: 唯一性校验处理
- `00295988`（2025-01-08）：fix[mixTag]: apitracking处理
- `0b43d8ff`（2025-01-09）：fix[mixTag]: 提示语修改
- `65a03aad`（2025-01-09）：fix[mixTag]: 编辑校验处理
- `b45d5b05`（2025-01-09）：fix[mixTag]: 唯一性校验
- `bab43af2`（2025-01-09）：fix[mixTag]: 同一offer跳过校验
- `e3ee6973`（2025-01-09）：fix[mixTag]: 批量修改
- `39e3b973`（2025-01-10）：fix[mixTag]: 唯一性校验、提示信息
- `414d2817`（2025-01-10）：feat[mixTag]: 补充接口权限
- `53242623`（2025-01-10）：fix[mixTag]: 唯一性校验
- `8b931764`（2025-01-10）：fix[mixTag]: 唯一性校验
- `af6e91db`（2025-01-10）：feat[mixTag]: AF增加额外校验
- `b2e3b532`（2025-01-10）：feat[mixTag]: AF增加额外校验
- `3c0c0bd2`（2025-01-11）：feat[mixTag]: 技术方案调整
- `6b7afdcb`（2025-01-13）：fix[mixTag]: 唯一性校验
- `72b44214`（2025-01-13）：fix[mixTag]: 唯一性校验
- `96a180db`（2025-01-13）：fix[mixTag]: 调整VO类型
- `f4c2a895`（2025-01-15）：fix[mixTag]: 混量标签增加默认值

### 提交内容证据

已逐条读取完整 `git show --unified=0` diff；以下仅摘录可安全记录的方法、类型或注解变更，
不保存密码、token 等可能敏感的代码行。完整差异仍以提交哈希为准。

- `209c5332`：涉及 1 个文件；新增证据：无可安全摘录的方法/类型声明，详见完整 diff
- `d3a54410`：涉及 7 个文件；新增证据：`private String advStrOfferId;`；`private String pid;`；`@Builder`；`private String packageName;`；`private String pid;`；`private String country;`
- `940cf01b`：涉及 2 个文件；新增证据：`private String checkOfferUnique(OfferDTO dto) {`；`if (TrackingTypeEnum.ONLINE.getCode().equals(dto.getTrackingType()) && dto.getIsMixAmount()) {`；`if (country.contains(CountryEnum.GLOBAL.getCode()) || country.contains(StrUtil.COMMA)) {`；`private boolean validateMixTag(Object value, OfferBaseInfoDTO offerBaseInfo, StringBuilder errBuilder) {`；`if (offerBaseInfo.getIsMixAmount()) {`；`if (country.contains(CountryEnum.GLOBAL.getCode()) || country.contains(StrUtil.COMMA)) {`
- `d3a637ae`：涉及 8 个文件；新增证据：`private Boolean isMixAmount;`；`@StrategyBinding(value = FIELD_DEFAULT_URL+","+FIELD_OFFER_NAME+","+FIELD_TERM+","+FIELD_OFFER_STATUS)`；`@Component`；`@StrategyBinding(value = OfferBatchModifyConstant.FIELD_DEFAULT_URL)`；`public class DefaultUrlValidator implements FieldValidator {`；`@Override`
- `40ca67c7`：涉及 1 个文件；新增证据：`if (OfferSingleModifyEnum.OFFER_STATUS.getCode().equals(dto.getModifyField())) {`；`if (Objects.nonNull(mixOfferUniqueInfo)) {`；`if (StrUtil.isNotBlank(msg)) {`；`throw new ServiceException(msg);`
- `91389b7a`：涉及 1 个文件；新增证据：`if (offer.getIsMixAmount()) {`；`AssertX.notNull(uniqueInfo, "不符合混量标签条件的offer:" + dto.getOfferId());`；`if (StrUtil.isNotBlank(msg)) {`；`throw new ServiceException(msg);`
- `95d63b72`：涉及 5 个文件；新增证据：`OfferUniqueInfoVO getMixOfferByUnique(@Param("dto") OfferUniqueQueryDTO dto);`；`OfferUniqueInfoVO getMixOfferUniqueInfo(@Param("offerId") Integer offerId);`；`AssertX.notNull(uniqueInfo, "该offer不存在:" + dto.getOfferId());`；`if (StrUtil.isNotBlank(msg)) {`；`throw new ServiceException(msg);`；`and o.status in ('active', 'pending')`
- `9a958841`：涉及 1 个文件；新增证据：`errBuilder.append("混量offer的追踪链接必须携带af_channel参数");`
- `bd426b6e`：涉及 1 个文件；新增证据：`@Value("${pac.offer.default_url.mix_tag_limit}")`；`private List<String> mixTagLimit;`；`if (exist) {`
- `cfc93335`：涉及 6 个文件；新增证据：`private Integer offerId;`；`private Boolean isMixAmount;`；`OfferUniqueInfoVO getMixOfferUniqueInfo(@Param("dto") OfferUniqueQueryDTO dto);`；`if (OfferSingleModifyEnum.OFFER_STATUS.name().equals(dto.getModifyField())) {`；`if (StrUtil.isNotBlank(msg)) {`；`throw new ServiceException(msg);`
- `00295988`：涉及 1 个文件；新增证据：`if (Objects.nonNull(isMixAmount) && isMixAmount) {`
- `0b43d8ff`：涉及 2 个文件；新增证据：`errBuilder.append(StrUtil.format("已存在包名+PID+地区+广告主id重复的混量offer（{}），无法重复创建;", offerUniqueInfoVO.getOfferId()));`；`errBuilder.append("混量offer的追踪链接必须携带完整的af_channel参数;");`
- `65a03aad`：涉及 3 个文件；新增证据：`List<OfferUniqueInfoVO> getMixOfferByUnique(@Param("dto") OfferUniqueQueryDTO dto);`；`if (offerUniqueInfoVOS.size() > 1) {`；`return StrUtil.format("已存在包名+PID+地区+广告主id重复的混量offer（{}），无法重复创建。", offerUniqueInfoVOS.stream().map(OfferUniqueInfoVO::getOfferId).filter(k -> !offerId.equals(k)).findFirst());`；`return checkOfferUnique(Integer.valueOf(row.getOfferId()), queryDTO, errBuilder);`；`private boolean checkOfferUnique(Integer offerId, OfferUniqueQueryDTO queryDTO, StringBuilder errBuilder) {`；`if (CollectionUtil.isEmpty(offerUniqueInfoVoList)) {`
- `b45d5b05`：涉及 1 个文件；新增证据：`if (CollectionUtil.isNotEmpty(offerUniqueInfoVOS)) {`
- `bab43af2`：涉及 1 个文件；新增证据：`private String checkOfferUnique(Integer offerId, String packageName, String country, String pid, String advertiserOfferId, Boolean isMixAmount, String offerStatus) {`；`if (!offerId.equals(offerUniqueInfoVO.getOfferId())) {`；`return StrUtil.format("已存在包名+PID+地区+广告主id重复的混量offer（{}），无法重复创建。", offerUniqueInfoVO.getOfferId());`
- `e3ee6973`：涉及 2 个文件；新增证据：`if (!offerBaseInfo.getIsMixAmount()) {`；`errBuilder.append("混量offer的追踪链接必须携带完整的af_channel参数");`
- `39e3b973`：涉及 3 个文件；新增证据：`if (country.contains(CountryEnum.GLOBAL.getCode())) {`；`if (country.contains(StrUtil.COMMA)) {`；`if (Objects.nonNull(offerUniqueInfoVO) && !offerId.equals(offerUniqueInfoVO.getOfferId())) {`；`return StrUtil.format("已存在包名+PID+地区+广告主id重复的混量offer（{}），无法重复创建。", offerUniqueInfoVO.getOfferId());`；`if (Objects.nonNull(offerUniqueInfoVO) && !offerId.equals(offerUniqueInfoVO.getOfferId())) {`；`if (country.contains(CountryEnum.GLOBAL.getCode())) {`
- `414d2817`：涉及 1 个文件；新增证据：`@ApiScope(OfferManager.OFFER_BATCH_MODIFY)`
- `53242623`：涉及 2 个文件；新增证据：`if (Objects.nonNull(offerUniqueInfoVO)) {`；`if (Objects.isNull(offerId) || !offerId.equals(offerUniqueInfoVO.getOfferId())) {`；`return StrUtil.format("已存在包名+PID+地区+广告主id重复的混量offer（{}），无法重复创建。", offerUniqueInfoVO.getOfferId());`；`if (Objects.nonNull(offerUniqueInfoVO)) {`；`if (Objects.isNull(offerId) || !offerId.equals(offerUniqueInfoVO.getOfferId())) {`；`errBuilder.append(StrUtil.format("已存在包名+PID+地区+广告主id重复的混量offer（{}），无法重复创建;", offerUniqueInfoVO.getOfferId()));`
- `8b931764`：涉及 4 个文件；新增证据：`OfferUniqueInfoVO getMixOfferByUnique(@Param("dto") OfferUniqueQueryDTO dto);`；`if (Objects.nonNull(offerUniqueInfoVO)) {`
- `af6e91db`：涉及 1 个文件；新增证据：`if (!exist)  {`
- `b2e3b532`：涉及 1 个文件；新增证据：`if (offerBaseInfo.getIsAppsflyer()) {`；`if (StrUtil.isBlank(pidValue)) {`；`errBuilder.append("三方平台为AF追踪链接必须携带完整pid参数");`
- `3c0c0bd2`：涉及 12 个文件；新增证据：`private String isMixAmount;`；`private String isMixAmount;`；`private String isMixAmount;`；`Optional.ofNullable(attributeMap.get(item.getId())).flatMap(map -> Optional.ofNullable(map.get(OfferAttributeConstant.IS_MIX_AMOUNT))).ifPresent(item::setIsMixAmount);`；`if (CollectionUtil.isNotEmpty(offerAttrMap) && CollectionUtil.isNotEmpty(offerAttrMap.get(Long.valueOf(dto.getOfferId())))) {`；`if (Boolean.TRUE.toString().equals(isMixAmount)) {`
- `6b7afdcb`：涉及 4 个文件；新增证据：`private String isMixAmount;`；`if (Boolean.TRUE.toString().equals(offerUniqueInfoVO.getIsMixAmount()) && (Objects.isNull(offerId) || !offerId.equals(offerUniqueInfoVO.getOfferId()))) {`；`if (Boolean.TRUE.toString().equals(offerUniqueInfoVO.getIsMixAmount()) && (Objects.isNull(offerId) || !offerId.equals(offerUniqueInfoVO.getOfferId()))) {`
- `72b44214`：涉及 4 个文件；新增证据：`if (Objects.isNull(offerId) || !offerId.equals(offerUniqueInfoVO.getOfferId())) {`；`if (StrUtil.isNotBlank(defaultUrl)) {`；`if (Objects.isNull(offerId) || !offerId.equals(offerUniqueInfoVO.getOfferId())) {`；`left join (select offer_id, field_value from offer_attribute where field_key = 'subject_id') as pidTemp`；`left join (select offer_id, field_value from offer_attribute where field_key = 'is_mix_amount') as temp`
- `96a180db`：涉及 2 个文件；新增证据：`private Boolean isMixAmount;`；`offerVO.setIsMixAmount(Boolean.valueOf(offerAttribute.getFieldValue()));`
- `f4c2a895`：涉及 1 个文件；新增证据：`attributes.add(buildOfferAttribute(offerId, OfferAttributeKeyEnum.is_mix_amount.name(), Objects.nonNull(dto.getIsMixAmount()) ? dto.getIsMixAmount() : "false"));`

## 核心代码设计

本需求历史上共影响 19 个文件；当前仍可在 `master` 定位 19 个。
以下文件清单来自逐条 `git show --name-only`，用于恢复需求时回看每条提交完整 diff；“当前仍存在”
只表示路径可解析，不等同于历史语义未漂移。

- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/constant/OfferAttributeConstant.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/constant/OfferBatchModifyConstant.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/BatchModifyOfferExcelV2DTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferBaseInfoDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/dto/OfferUniqueQueryDTO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/entity/Offer.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/enums/OfferBatchModifyEnum.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferUniqueInfoVO.java`（当前仍存在）
- `pac-biz-api/pac-biz-offer-api/src/main/java/com/tecdo/pac/biz/offer/api/vo/OfferVO.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/controller/OfferController.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/enums/OfferAttributeKeyEnum.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/mapper/OfferMapper.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/service/impl/OfferServiceImpl.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/strategy/modify/modifier/OfferBaseModifier.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/strategy/validation/TecOfferValidationStrategy.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/strategy/validation/validator/CountryValidator.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/java/com/tecdo/pac/biz/offer/strategy/validation/validator/DefaultUrlValidator.java`（当前仍存在）
- `pac-biz/pac-biz-offer/src/main/resources/mapper/OfferMapper.xml`（当前仍存在）

## 踩过的坑 / 反复纠错点

- 同一标签可能包含功能、修复和代码整理；必须以本节完整提交清单回看，不能只取第一条或最后一条提交。
- 历史改动文件在当前 `master` 上可能被重命名、删除或被后续需求覆盖；当前路径不存在时保留提交哈希
  作为唯一可靠回溯入口。
- 本文由历史提交范围自动整理，未在没有明确 diff 证据的情况下虚构字段、状态、配置或外部平台规则。

## 下次需交叉验证的锚点

- 先运行 `git show <hash>` 阅读与本次问题相关的完整变更，再读取上方仍存在的当前文件。
- 若需要恢复具体业务规则，逐一比较 `<hash>^..<hash>` 与当前 `master`，确认后再更新本记忆的
  `code_anchors` 和核心业务逻辑；不要把历史文件路径直接当作当前实现。
