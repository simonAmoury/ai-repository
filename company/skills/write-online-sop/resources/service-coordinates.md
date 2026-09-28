# 服务坐标对照表

写 Apollo 配置表时，按服务名查 appid / cluster 填入。

## 生产环境（PRO-HWGZ）

| 服务 | appid | env | cluster |
|------|-------|-----|---------|
| pac-foreign | pac-platform | PRO-HWGZ | pac-platform-cluster |
| pac-bop-admin | pac-bop | PRO-HWGZ | default |

## 使用说明

- 其它环境（测试 / 预发）的坐标以实际 Apollo 控制台为准，不要照抄生产值。
- 表里没有的服务：去 Apollo 控制台确认 appid 与 cluster 后再填，不要猜。确认后把新服务补进本表，下次即可直接查。
- appid 与服务名经常不一致（如 `pac-foreign` 的 appid 是 `pac-platform`），务必按表查，不要用服务名当 appid。
