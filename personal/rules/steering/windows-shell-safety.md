# Windows Shell 执行安全规则

本机 shell 环境（Windows + PowerShell/cmd）有三个已实测确认的坑，叠加起来会让命令看似「卡住」很久，实际命令早已执行完、只是输出残缺导致反复重试或构造更复杂命令。以下为强制规避做法。

## 已确认的环境事实

1. **控制台代码页是 936（GBK），不是 UTF-8**。`chcp` 实测返回 `Active code page: 936`。直接读含中文的 UTF-8 文件会显示乱码；用 `Add-Content` / `echo` 把中文写进文件会写成 GBK 字节，损坏原文件。
2. **stdout 捕获残缺，基本只回传尾部**。实测：`Write-Output "A"; cmd /c echo B` 只回来 `B`；`dir /a` 只回来末尾汇总行、文件列表全丢；`dir /b` 13 个目录只回来最后一个。
3. **命令行会被截断，嵌套引号会失败**。命令回显常缺开头字符；`findstr /c:"中文"` 这类嵌套引号命令直接执行失败。

## 强制做法

- **命令里绝不嵌中文**。需要把中文内容写入文件时：先用文件写入工具（`fs_write`）写到**工作区内**的临时文件（原生 UTF-8），再用 `Copy-Item` 原样字节拷贝到目标位置。工作区外的路径也走这个中转方式，不要在命令字符串里拼中文正文。
- **需要看输出时，别依赖 stdout**。用 `... | Out-File -FilePath <工作区内文件> -Encoding utf8` 落盘，再用 `read_file` 读取。只有确认输出短且是纯 ASCII 单行时才直接看回显。
- **一条命令只做一件事**。禁止用 `;` 串联多条语句（前面语句的输出会丢）。
- **每次调用都显式传 `timeout`**，让异常情况快速失败，而不是无限等待。
- **文件与搜索操作优先用专用工具**，不要用 shell：读文件用 `read_file`，写文件用 `fs_write`，找文件用 `file_search`，搜内容用 `grep_search`。`cat`/`dir`/`findstr`/`Add-Content` 一律不作为首选。
- **多行命令、here-string、未闭合引号是禁区**。在 GBK 交互式会话里这类命令可能停在续行提示符等待输入，表现为长时间无响应。

## 判断「是不是真卡住」

命令回显残缺、为空、或只有尾部片段时，**不要立即重试**，先按上面的方式把输出落盘再读一次确认执行结果；重复执行有副作用的命令（写库、删文件、install）风险更高。

## Bash 工具在 Windows 上不可靠

实测：Bash 工具的管道输出（`grep -rn`、`env | grep`、`git log`）在本机频繁超时无返回，而 PowerShell 工具同类操作全部正常。推测 Bash 走 Git Bash（MSYS2/Cygwin）层时，stdout 捕获机制与上述环境坑叠加，导致工具层认为命令未结束、一直等到 timeout。

**强制做法**：
- **交互式诊断、调试、看输出，一律用 PowerShell**，不用 Bash。
- Bash 工具仅用于执行**已验证过的 POSIX 脚本**（如项目里既有的 `.sh` 构建脚本），且脚本内部不依赖交互式输入、stdout 正确性。
- 需要 `grep` / `find` 能力时，用专用工具 `grep_search` / `file_search`，或用 PowerShell 的 `Select-String` / `Get-ChildItem`。
