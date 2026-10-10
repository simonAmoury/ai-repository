---
id: pac-platform/goodshort-koc-api-client
scope: project
project: pac-platform
feature: goodshort-koc-api-client
updated: 2026-09-11
tags: [pac-biz-adv, GoodShort, novelopen, KOC, CPS, cps_account_config, MD5签名, TypeReference, 口令生成, onelink, 短剧, 免鉴权接口, skip-url]
code_anchors:
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/goodshort/GoodShortOpenApiClient.java
    symbol: initBooks / generatePartnerCode / listFreeContent / post(公共参数注入+签名+解析) / execute(Hutool POST)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/goodshort/GoodShortSignUtil.java
    symbol: buildStringA(非空过滤+key升序) / sign(MD5转大写) / SIGN_HEADER="sign"
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/goodshort/vo/GoodShortResponseVO.java
    symbol: STATUS_SUCCESS=0 / STATUS_CODE_ALREADY_GENERATED=20005 / dataIfStatusIn(int...)
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/goodshort/vo/GoodShortExtConfigVO.java
    symbol: of(extConfigJson)（host/pid/key 三键必填，host 必须带 /creek）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/goodshort/dto/GoodShortInitBooksDTO.java
    symbol: PAGE_SIZE_MAX=200（文档标称 50，实测 200/500 均可）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/service/impl/GoodShortOpenApiServiceImpl.java
    symbol: accountConfig()（provider=GoodShort 单账号，多条直接抛异常不取第一条）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/controller/cps/GoodShortOpenApiController.java
    symbol: /cps/goodshort/book/page / invite-code/generate / book/free-content（无 @ApiScope，网关放行）
  - path: pac-biz/pac-biz-adv/src/main/java/com/tecdo/pac/biz/adv/task/cps/constant/CpsProviderConstant.java
    symbol: GOOD_SHORT = "GoodShort"
  - path: .kiro/specs/cps-goodshort-integration/online-sop.md
    symbol: 第三节(ext_config 补 host 的 JSON_SET SQL) / 第四节(网关 skip-url) / 第六节(无鉴权与限流说明)
  - table: cps_account_config（GoodShort 记录 id=4，ext_config 需含 host/pid/key）
  - path: D:/access/goodshort/Goodshort-KOC推广接口文档.docx
    symbol: v1.0.5 接口文档（签名算法、7 个接口的参数与返回）
  - path: D:/access/goodshort/api_raw_log.txt
    symbol: 4 个接口的实测原始报文（字段映射依据）
  - path: D:/access/goodshort/goodshort_api_test.py
    symbol: 联调脚本（含 24 位密钥探测逻辑）
---

## 核心业务逻辑

GoodShort（域名 novelopen.com）是 CPS 短剧客户，走 KOC 达人推广模式：机构拿 pid + 签名密钥，
达人选一部短剧生成口令/落地页/OneLink 去海外平台推广，通过该链路进来的用户产生的订单由平台回传，
订单里原样带回 `customParams`（达人标识）。

**本阶段只做 3 个接口的封装与透传，不落库、不拉订单。**

- `/open/book/initBooks` 短剧列表全量（分页，按 language）
- `/open/inviteCode/generate/partner/code` 生成口令与分享链接
- `/open/book/freeContent` 短剧免费剧集（视频链接，带签名与过期时间）

订单列表 `/open/partner/orders`、订单转化明细 `/open/promotion/analyticalReport`、账号报备
`/open/filing/report|query`、短剧增量 `/open/book/incrementBooks` 均**未实现**，属后续阶段。

- **签名**：取全部非空参数按参数名 ASCII 升序拼 `k1=v1&k2=v2`，末尾追加 `&key=密钥`，MD5 后转大写，
  放 header `sign`。`sign` 自身不参与签名，空值参数不参与签名。**签名走 header，不进 body。**
- **凭证来源**：`cps_account_config` 中 `provider='GoodShort'` 的 `ext_config`，三键 `host`/`pid`/`key`。
  `host` 必须带 `/creek` 前缀（代码 path 形如 `/open/book/initBooks`，不含 `/creek`）。
- **口令唯一键 = `pid + bookId + customParams + codeMedia`**，`shareUrlType` 不参与。
  同组合重复调用返回首次生成的口令，不会新建。
- **接口无鉴权**：用户明确要求跳过权限校验，controller 不加 `@ApiScope`，改由网关
  `pac.security.skip-url` 放行 `/pac-adv/cps/goodshort/**`（需重启网关，不热生效）。

## 核心代码设计

- 目录 `task/cps/goodshort/`，与 `task/cps/blibli/`、`task/cps/cj/` 平级，结构对齐：Client + SignUtil + dto/ + vo/ + enums/。
- **没有继承 `AbstractCpsHttpClient`**：那个基类实现的是 `ICpsOrderClient`，契约是「订单取数、一次一页」
  （`provider()` + `fetchPage(config, param, cursor)`），本次三个接口不是订单取数，语义套不进去。
  因此 `GoodShortOpenApiClient` 独立成类，自己用 Hutool `HttpRequest` 发 POST。
  代价是与基类的 `executeHttp` 有约 20 行重复，换来不动既有 Blibli/CJ 链路。
  ⚠️ 后续做 GoodShort 订单拉取时，应另建 `GoodShortCpsOrderClient extends AbstractCpsHttpClient` 走框架，
  不要把订单接口硬塞进 `GoodShortOpenApiClient`。
- **请求体与待签参数共用同一个 `JSONObject`**：`JSON.toJSON(dto)` 拿到 JSONObject 后 put 进 `pid`/`timestamp`，
  再由它同时产出 `sign` 与 body。这样两者字段集合天然一致，不会出现「签了 5 个字段、发了 6 个」的验签失败。
  fastjson 默认不序列化 null，正好对上「空值不参与签名」。
- **`TypeReference` 保留泛型实参**：响应是 `GoodShortResponseVO<T>` 包装，直接传 `.class` 会因擦除把
  `data` 变成 `JSONObject`，等调用方取值时才 `ClassCastException`（堆栈指向业务代码而非解析处）。
  三个 `TypeReference` 提成 `private static final` 常量复用（Type 解析一次即不变、无状态）。
- **业务码校验集中在 `GoodShortResponseVO#dataIfStatusIn(int...)`**，各方法自己声明可接受的 status，
  而不是在通用 `post()` 里塞特例判断。
- `GoodShortOpenApiServiceImpl#accountConfig()` 按 `provider` 查配置，**多条直接抛异常不取第一条**
  （`cps_account_config` 唯一约束只在主键，provider 可重复）。真要多 pid 需给三个接口加账号入参。
- 校验两层：DTO 上 JSR-303（controller `@Valid` 拦）+ client 内 `AssertX`（后续定时任务直接调 client 时兜底）。
- `PAGE_SIZE_MAX` / `CUSTOM_PARAMS_MAX_LENGTH` 定义在 DTO 上，`@Max` / `@Size` 与 client 的 `AssertX` 共用同一常量。

## 踩过的坑 / 反复纠错点

- **`status=20005`（口令已生成）是「失败码但带有效数据」**：实测重复调用生成口令接口，
  HTTP 200、`status=20005`、`success=false`，但 `data` 里**仍完整带回首次生成的 `code` 与 `shareUrl``。
  若按 `success!=true` 一律抛异常，幂等重跑必然失败、功能不可用。因此把 `20005` 与 `0` 一并当作可接受状态。
  这是实测确认的，不是文档写的。
- **`codeMedia` 参与口令唯一键**：实测同 `bookId`+`customParams`、仅加 `codeMedia=TIKTOK`，
  拿到的是**新的 code**（首次生成，`status=0`），不是复用。文档虽写了唯一键含 codeMedia，但容易被当成可选参数忽略。
- **文档的 `pageSize` 上限过时**：`initBooks` 文档标称「最大限制 50」，**实测 200 与 500 均正常返回**
  （200 → records 200 条 / total 1303 / pages 7；500 → records 500 条 / pages 3）。代码取 200，
  兼顾单响应体大小（record 带 `introduce` 长文本）。⚠️ 订单列表与订单转化明细文档标的是 500，
  与 initBooks 不是一套口径，**后续做那两个接口时要单独实测，不要套用本次结论**。
- **密钥实际是 24 位，不是文档说的 32 字节**：文档写「密钥的长度为 32 个字节」，实际下发的
  `606d4010a1804506b7e7b29b` 是 24 位。联调脚本里因此写了密钥长度候选探测逻辑。24 位那个能通过验签。
- **`host` 必须带 `/creek`**：接口域名是 `https://api.novelopen.com/creek/`，
  而各接口 path 是 `/open/book/initBooks`。ext_config 里只写 `https://api.novelopen.com` 会 404。
  最初实现给 host 加了默认值兜底，后按用户要求改为必填（与 Blibli/CJ 的 ext_config 风格一致）。
- **业务错误全走 HTTP 200**：验签失败、参数非法都是 200 + 响应体里的 `status`/`success`，
  只看 HTTP 状态码会当成功。因此 `execute()` 只拦非 2xx，业务成败由 `dataIfStatusIn` 判。
- **`ctime`/`utime` 用 String 原样保留**：平台返回 `2026-09-07T06:18:32.000+0000`（无冒号时区偏移），
  fastjson 1.2.66 对该格式的解析行为**未实测**，没敢直接映射成时间类型。后续要落库先验证转换。
- **`labelNames` 实测返回 `null`**：文档写 `string[]` 短剧标签，实测报文里 1283 条 ENGLISH 短剧全是 null，
  只有文档示例里有值。不要假设一定有标签。
- **`Hutool StrUtil` 的常量别凭记忆用**：一开始写了 `StrUtil.EQUALS`、`StrUtil.toStringOrNull()`，
  两者是否存在都没核实过，改成字面量 `"="` / `"&"` + `String.valueOf()`。
- **工作区外的资料读不了**：`D:\access\goodshort` 下的 docx / py / txt 用 `read_file` 与 `list_directory`
  一律 Access denied，必须先 `Copy-Item` 到工作区再读。docx 走「复制成 .zip → `Expand-Archive` →
  解析 `word/document.xml`」提取正文（表格要单独按 `w:tbl` / `w:tr` / `w:tc` 遍历，否则表格内容全丢）。

## 下次需交叉验证的锚点

- `cps_account_config` 中 `provider='GoodShort'` 是否仍只有 1 行、`ext_config` 是否已含 `host`
  （本次交付时用户手动执行 `JSON_SET` 补，未由我验证落库结果）。
- Apollo 的 `pac.security.skip-url` 是否已加 `/pac-adv/cps/goodshort/**`、索引是否连续未断号、
  两个环境的网关是否都重启过。
- `GoodShortInitBooksDTO.PAGE_SIZE_MAX` 是否仍为 200；若后续加了订单接口，其 pageSize 上限是否单独实测过。
- 三个接口是否仍无 `@ApiScope`、是否已按需补 `@RedisLimit`（生成口令平台侧限同组合 2 秒 1 次，当前未加限流）。
- 做订单拉取时：是否新建了 `GoodShortCpsOrderClient extends AbstractCpsHttpClient` 走 CPS 骨架，
  而不是继续往 `GoodShortOpenApiClient` 里堆；`customParams` 的达人标识如何映射到 `offline_` tag 体系
  （订单接口回传 `customParams` 与 `channelCode`，本次未涉及）。
- **本次从未在 Java 侧真实发起过调用**（模块 `test.enabled=false`）。验证靠的是：Python 脚本实测 4 个接口
  + PowerShell 用本实现的拼串规则重算历史成功请求的 sign 复现一致（`match=True`）+ `compileJava` 通过。
  Java 链路首次真实调用仍待冒烟。
