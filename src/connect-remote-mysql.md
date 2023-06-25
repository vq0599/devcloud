<!-- SSH连接远程数据库 -->
<!-- 2022-10-18 -->

### 步骤
1. 开一个SSH隧道
```shell
ssh -fCPN -L 3307:127.0.0.1:3306 root@38.76.1906.152
```
2. 本地服务访问`127.0.0.1:3307`

### 为什么不直接用`ip:port`的方式连接？
MySQL默认不允许远程直连，需要修改一堆环境配置太折腾了。