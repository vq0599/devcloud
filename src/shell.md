<!-- shell语法笔记 -->
<!-- 2022-10-17 -->

> https://shellscript.readthedocs.io/zh_CN/latest/index.html
## 文件操作符
- `-d`：检测文件是否是目录，如果是，则返回 `true`

- `-r`：检测文件是否可读，如果是，则返回 `true`

- `-w`：检测文件是否可写，如果是，则返回 `true`

- `-x`：检测文件是否可执行，如果是，则返回 `true`

- `-s`：检测文件是否为空（文件大小是否大于0），不为空返回 `true`

- `-e`：检测文件（包括目录）是否存在，如果是，则返回 `true`

## 奇怪语法

### `:-`
```shell
# 如果MY_VAR已经定义且不为空，则使用其值，否则使用默认值"fallback"
result=${MY_VAR:-fallback}
```