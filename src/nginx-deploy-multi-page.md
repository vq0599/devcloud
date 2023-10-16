<!-- Nginx部署多页面应用自动匹配一级路径 -->
<!-- 2023-10-16 -->

```nginx
server {
    listen       80 default_server;
    server_name   localhost;
    root   /usr/share/nginx/html;

    location ~ ^/([^/]+)/?.*$ {
        try_files $uri /$1/index.html /index.html;
    }
}
```

别小看这一小段，可以省很多事情~