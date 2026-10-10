---
id: pac-platform/tts-creator-auth-provider-jobparam
scope: project
project: pac-platform
feature: tts-creator-auth-provider-jobparam
updated: 2026-08-12
tags: [pac-biz-adv, TTS, TikTok, authCode, tts_creator_auth, provider, XXL-JOB]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/TtsCreatorAuthController.java
    symbol: authorize
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/TtsCreatorAuthServiceImpl.java
    symbol: authorizeAndSave / getByDimension / toLocalDateTime
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/ITtsCreatorAuthService.java
    symbol: authorizeAndSave / getByDimension / listByProviders
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/dto/TtsCreatorAuthAuthorizeDTO.java
    symbol: TtsCreatorAuthAuthorizeDTO
  - path: pac-biz-api/pac-biz-adv-api/src/main/java/com/tecdo/pac/biz/adv/api/entity/TtsCreatorAuth.java
    symbol: TtsCreatorAuth / provider
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/TTSXxlJobHandler.java
    symbol: resolveDimensions / buildDimensionsByProviders / ttsIdInsertOrUpdateCpsOriginProductTaskV2 / ttsIdSearchOrdersTaskV4
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/strategy/TtsTokenServiceV2.java
    symbol: authorize
  - table: tts_creator_auth
  - endpoint: POST /tts/creator-auth/authorize
---

## 核心业务逻辑

TTS 授权入口与任务侧 `TtsTokenServiceV2` 保持独立。管理接口接收 partner、country、appId、creator、provider、appKey、appSecret、authCode，调用 TikTok SDK 的 `AccessTokenAPI.getToken(authCode)` 获取 token；TTS 返回成功且 data 不为空后，按 `(partner, country, appId, creator)` 查询 `tts_creator_auth`，已有记录更新，不存在则新增。

授权成功后写入 provider、appKey、appSecret、accessToken、refreshToken、accessExpire、refreshExpire。接口只返回成功标识，不返回 token 或 secret。

`ttsIdInsertOrUpdateCpsOriginProductTaskV2` 与 `ttsIdSearchOrdersTaskV4` 的常规 jobParam 只传 `providers` 列表；`TTSXxlJobHandler#buildDimensionsByProviders` 批量按 provider 查 `tts_creator_auth`，反查出四元组后执行任务。provider 反查路径与完整 dimensions 路径最终共用 `validateDimensions`；provider 必须恰好命中一条记录，缺失或多条时整体不执行。

## 核心代码设计

- Controller：`TtsCreatorAuthController#authorize` 只接收校验后的 DTO、委托 `ITtsCreatorAuthService#authorizeAndSave`，不直接调用 SDK 或 Mapper。
- Service：`TtsCreatorAuthServiceImpl#authorizeAndSave` 独立完成外部授权、四元组查询、实体赋值和 `saveOrUpdate`。没有复用 `TtsTokenServiceV2#authorize`，避免管理接口受任务侧缓存、自动 refresh 和 ApiClient 生命周期影响。
- DTO：`TtsCreatorAuthAuthorizeDTO` 的八个字段均为必填，使用 `@NotBlank`；不要把真实 appSecret、authCode、token 写入文档、日志或记忆。
- 更新依据：`getByDimension` 按四元组查询；依赖数据库四元组唯一约束保证不会产生重复记录。provider 用于任务反查，数据库配置应保证 provider 唯一。
- 时间：TTS 返回的过期值是 epoch seconds。当前 `toLocalDateTime` 使用 `ZoneId.systemDefault()` 转成 `LocalDateTime`；`LocalDateTime` 本身不保存时区。若统一改 UTC，必须同时调整写入转换和过期判断，不能只改一个方法。

## 已验证结论

- `pac-biz-adv` 的 `compileJava` 已验证通过：`BUILD SUCCESSFUL`。
- 本次新增授权入口未改动 `TtsTokenServiceV2`；在实现调整后确认其 diff 为空，任务侧授权逻辑保持原状。
- 授权 response 曾按需求临时使用 `log.info("TTS auth response={}", response)` 打印完整响应。该响应可能包含 accessToken/refreshToken，验证完成后应改为只打印 code/message 或移除日志。
- 本次未使用真实 authCode、appSecret、accessToken、refreshToken 做外部接口实测；编译验证不等于真实授权链路验证。上线前必须用短时有效的真实 authCode 调接口，并核对表中四元组唯一记录和过期时间。

## 踩过的坑 / 反复纠错点

- 不要把 TTS 管理授权接口接到 `TtsTokenServiceV2`：后者包含任务侧缓存、自动 refresh、ApiClient 构造和重授权策略；本接口的职责只是 authCode 换 token 后新增/更新 `tts_creator_auth`。
- Controller 不要直接复制 `AccessTokenAPI`、时间转换或 Mapper 操作；Controller 只做参数接收和委托，具体逻辑放 `TtsCreatorAuthServiceImpl#authorizeAndSave`。
- 更新判断必须使用完整四元组，不能只按 creator、appId 或 provider 查询；数据库唯一约束与 Service 查询口径要保持一致。
- `provider` 是 jobParam 按 provider 反查四元组的配置键。新增或修改授权记录时必须同步维护 provider，否则两个 V2/V4 任务会反查不到该维度。
- `toLocalDateTime` 使用服务器 JVM 默认时区，而 MySQL `datetime` 不保存时区。跨时区部署时可能造成过期时间解释不一致；改为 UTC 时要同步修改 `TtsTokenServiceV2` 中的 now/过期判断。

## 上线前检查

1. 确认 `tts_creator_auth` 已有 `provider` 列，并按实际部署要求确认 provider 唯一约束是否已执行。
2. 使用不包含真实凭证的请求模板检查接口字段：`partner/country/appId/creator/provider/appKey/appSecret/authCode`。
3. 用短时有效 authCode 调用 `POST /tts/creator-auth/authorize`，确认 TTS 返回成功后才写库。
4. 重复使用同一四元组重新授权，确认原记录更新而非新增重复记录。
5. 清理或脱敏完整 response 日志，禁止保留真实 token、secret、authCode。
6. 用 `providers` 形式触发两个目标 XXL-JOB，确认维度反查成功；缺失或重复 provider 时应整体失败并有明确日志。

## 自测结论（2026-08-12）

- `:pac-biz:pac-biz-adv:compileJava` 通过，新增接口和 Service 无编译错误；诊断仅保留既有 MyBatis-Plus Lambda 方法引用的 null-safety warning。
- 自测发现并修复：`authorizeAndSave` 不应使用 `@Transactional` 包住外部 TTS API 调用，已移除事务注解；该流程先调用外部 API，成功后只执行一次新增/更新写库。
- 自测发现并补充：授权接口接收 appSecret/authCode，已增加 `@ApiScope(PacRoleConstant.HAS_ROLE_PERMISSIONS)`，限制 root/admin/permissions 角色访问。
- 当前仍保留完整 `TTS auth response` 日志是为了本次联调打印响应；该日志可能包含敏感 token，真实验证后必须改为仅打印 code/message 或删除。
- 当前未执行真实 TTS 授权、未验证线上数据库 DDL/数据补录；发布前必须确认 `tts_creator_auth.provider` 列和 provider 唯一性已落库，并用短时有效 authCode 验证真实新增/更新链路。
