---
id: pac-platform/h5-adv-offline-data-soft-delete
scope: project
project: pac-platform
feature: h5-adv-offline-data-soft-delete
updated: 2026-08-24
tags: [H5线下数据, h5_adv_offline_data, 逻辑删除, 批量删除, status, 广告主]
code_anchors:
  - path: pac-biz-api/pac-biz-trade-api/src/main/java/com/tecdo/pac/biz/trade/api/entity/H5AdvOfflineData.java
    symbol: deleted（@TableLogic / INSERT 自动填充）
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/controller/H5AdvOfflineDMController.java
    symbol: DELETE /remove
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/IH5AdvOfflineDataService.java
    symbol: remove(List<Integer>)
  - path: pac-biz/pac-biz-trade/src/main/java/com/tecdo/pac/biz/trade/service/impl/H5AdvOfflineDataServiceImpl.java
    symbol: remove（管理员、status=0、全量校验后逻辑删除）/ listByAffIdAndSite / listByAdvIdDateAndSite
  - path: pac-biz/pac-biz-trade/src/main/resources/mapper/H5AdvOfflineDataMapper.xml
    symbol: customList / listByAffIdAndSite / listByAdvIdDateAndSite（deleted=0）
  - path: pac-ops/pac-foreign/src/main/resources/mapper/H5AdvOfflineDataMapper.xml
    symbol: list（deleted=0）
  - path: pac-biz/pac-biz-job/src/main/java/com/tecdo/pac/biz/job/task/trade/H5OfflineDataConfirmJob.java
    symbol: status=0 自动确认任务
  - table: h5_adv_offline_data（deleted 逻辑删除标记）
---

## 核心业务逻辑

历史需求由提交 `5eecd2d2`（2024-11-25）和修复提交 `b14dbd8f`（2024-12-11）组成：
H5 广告主线下数据支持按 ID 批量删除，但只能删除未确认记录；删除采用逻辑删除，后续页面、
渠道分成同步、导入重复校验和 foreign 消费数据查询均不可再读取被删除的数据。

- 删除接口：`DELETE /h5AdvOfflineDM/remove`，请求体为 ID 列表。
- 仅管理员可操作，ID 列表不能为空。
- 仅 `status=0`（未确认）记录可删除；请求中的任一记录不存在、已确认或不满足状态条件，
  整批拒绝，不能部分删除。
- 实体 `deleted` 是 MyBatis-Plus `@TableLogic` 字段，因此 `remove()` 更新逻辑删除标记，
  不物理删除历史行。

## 核心代码设计

- Controller 只接收 ID 集合并委托 `IH5AdvOfflineDataService#remove`；管理员校验、状态校验和写操作
  集中在服务层，避免绕过规则的删除入口。
- 服务层先以 `status=0 AND id IN (...)` 做 count，再要求计数等于传入 ID 个数，保证批量操作的
  原子性语义；成功后用 `lambdaUpdate().in(...).remove()` 触发逻辑删除。
- `H5AdvOfflineData#deleted` 声明逻辑删除及插入填充，使标准 MyBatis-Plus 查询默认避开删除行；
  自定义 SQL 不能依赖该默认能力，所以分别在 trade 的分页/站点查询和 foreign 的消费查询中显式
  添加 `deleted=0`。
- 2024-12-11 的补丁补齐了最初遗漏的 `listByAffIdAndSite`、`listByAdvIdDateAndSite` 与 foreign
  查询条件。这些查询会参与分成比例同步和导入重复判断，遗漏会导致删除记录仍影响业务。

## 踩过的坑 / 反复纠错点

- 给实体添加 `@TableLogic` 不会自动约束 Mapper XML 自定义查询；所有自定义查询都必须显式过滤
  `deleted=0`，并覆盖管理端和 foreign 两个模块。
- 删除资格按 `status=0` 统一判断。`H5OfflineDataConfirmJob` 也以 `status=0` 找待确认记录并改为
  `1`，因此确认后的数据不可删除是为了不破坏已进入确认流程的数据。
- count 与输入 ID 数量比较对重复 ID 的处理取决于请求是否去重：`[1,1]` 会使 count 小于 2 而失败。
  当前实现的行为是安全拒绝；如需支持重复 ID，应先明确在 Controller 去重还是在服务层改为比较
  去重后的数量，不能静默放宽。
- 本次只核对代码，未查表结构或历史数据，`deleted` 的默认值和存量迁移策略不可从代码推断。

## 下次需交叉验证的锚点

- `h5_adv_offline_data.deleted` 的数据库默认值、存量行是否已回填为 0，以及 MyBatis-Plus 全局逻辑删除
  值是否仍与该列一致。
- 新增 Mapper XML 或查询 H5 线下数据时，检查是否有 `deleted=0`；尤其是新建的数据导出、同步、
  重复校验和 foreign 查询路径。
- `H5AdvOfflineDataServiceImpl#remove` 的权限和状态常量是否仍与确认任务的状态机一致；若引入更多
  状态，需要重新定义哪些状态可删除。
