# Java 代码风格规范

## 优先使用策略模式（避免堆叠 if-else / switch-case）

有明显业务维度划分（如按状态、类型、节点、渠道等分支处理逻辑），且各分支职责相对独立、可抽象为统一接口的场景，优先使用策略类（策略模式）组织代码，而非在单个方法内堆叠多段 if-else 或 switch-case。

判断准则：
- 分支数量较多（3 个以上），且每个分支的处理逻辑有一定复杂度（不是简单的字面量映射）
- 未来可能新增/调整分支（如新增一种状态、一种节点类型）
- 各分支逻辑可以收敛为同一组方法签名（如都需要 build/handle/approve 等相同动作）

拆分方式：
- 定义统一接口（如 XxxHandler），每个业务分支实现一个类，通过枚举/类型字段注册到统一入口（Dispatcher），由 Dispatcher 按类型分发，调用方只面向接口和分发器，不感知具体实现
- 简单的字面量映射（如枚举转文案、固定数值映射）不必上升为策略类，用枚举自身携带属性或简单 switch 即可，避免过度设计



## 多线程正确性规则

- 使用 `Semaphore`/`CountDownLatch` 等并发控制原语时，`release()`/`countDown()` 必须放在 `finally` 块中执行，避免异常路径下计数泄漏导致死锁。
- 捕获 `InterruptedException` 后，必须调用 `Thread.currentThread().interrupt()` 恢复中断标志，不要吞掉中断信号。
- 多线程并发写入的集合必须使用线程安全容器（如 `Collections.synchronizedList`、`ConcurrentHashMap`），禁止对普通集合做无保护的并发写入。

## 异常日志记录规范

- 记录异常日志时，异常对象（`Throwable`/`Exception`）必须作为日志方法的最后一个参数传入（如 `log.error("操作失败: {}", msg, e)`），以保留完整堆栈信息；不要仅拼接 `e.getMessage()` 到日志文本中而丢弃堆栈。


## 多级判空使用 Optional 链式处理

- 涉及多级属性的连续判空取值（如 `a.getB().getC().getD()` 这类链路，中间任一环节可能为 null），优先使用 `Optional` 链式调用（`Optional.ofNullable(a).map(A::getB).map(B::getC).map(C::getD).orElse(default)`），避免多层嵌套 `if (xxx != null)` 判断。
- 仅有单层判空（只判断一个对象是否为 null）时，不必强套 Optional，直接判空即可，避免过度设计。
- 需要在链路中间失败时提前返回/抛异常的场景，可用 `Optional.ofNullable(x).orElseThrow(...)` 或 `.filter(...)` 表达，不要用 Optional 包一层又立刻 `.get()` 破坏空安全语义。
