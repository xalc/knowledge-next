# TeslaMate

2024年底 似乎已经没有多少人玩teslamate了 因为一个简单的部署已经错误百出，不得不花费很长的时间来调试。

我买车的那年，可能tesla还属于相对小众的时代，大部分的用户还是比较潮的。社区的支持也很不错，照着文档很快就在docker中搭建了一套完整的teslamate， 这一套一直工作到今年失业前，用的是企业账号，里面有送的微软的ECS。 原计划是离职前把数据导出来，在给部署到自己的ecs上，可惜人算不如天算。 微软的ecs在离职前一两个月就对我们的账号停止服务了。也懒得在想办法找回了，所以里面的数据也就没法导出来了，虽有有遗憾，但是也只能如此了。

这次，想着还是重新搭起来把，可是搭建的过程完全没有之前顺畅，碰到了不少的部署问题，白白的折腾了挺长的时间，好在最终结果还是好的，能正常使用了。特记录下，避免后来者踩坑（有效期2024/12/25日）

第一个坑 docker image pull不下来

仁者见仁，八仙过海都能解决。

第二个坑 

部署好了后，访问域名直接 `404 page not found` 但是grafana又能连得上，排除了是域名配置错误。

后来经过一系列的排查，也是死马当活马医，决定先把log里面的错误给解决了。

 `earth does not exist` 

```jsx
database-1   | 2024-12-25 02:54:35.587 UTC [33] CONTEXT:  SQL function "ll_to_earth" during inlining
database-1   | 2024-12-25 02:54:35.587 UTC [33] STATEMENT:  CREATE INDEX "geofences__earth_box_ll_to_earth_latitude__longitude___radius_index" ON "geofences" ((earth_box(ll_to_earth(latitude, longitude), radius)))
teslamate-1  | ** (Postgrex.Error) ERROR 42704 (undefined_object) type "earth" does not exist
teslamate-1  |     (ecto_sql 3.7.1) lib/ecto/adapters/sql.ex:760: Ecto.Adapters.SQL.raise_sql_call_error/1
teslamate-1  |     (elixir 1.12.3) lib/enum.ex:1582: Enum."-map/2-lists^map/1-0-"/2
teslamate-1  |     (ecto_sql 3.7.1) lib/ecto/adapters/sql.ex:852: Ecto.Adapters.SQL.execute_ddl/4
```

找到方法 让降级数据库， 没问题。

[https://github.com/teslamate-org/teslamate/issues/4290#issuecomment-2426647487](https://github.com/teslamate-org/teslamate/issues/4290#issuecomment-2426647487)

降级成功。 能访问teslamate的登录页面了，但接下里又是第三个坑

第三个坑：

通过[https://docs.teslamate.org/docs/faq](https://docs.teslamate.org/docs/faq)  得到token和refresh token输入后报错：

Error: :api_token_error。

网上找到的大概都是两年前的资料，说tesla更新了token的生成方式。 很神奇，但是都两年了，难道还没更新，不应该啊。也没太多思路。 死马当活马医把， 把teslamate降级试试看。于是从当前的 `1.32.0` 直接降级到 `1.30.0` 版本也是在github上随机选的，一部署后居然token有效 能登录。很神奇。

目前为止，算是部署成功了，但是还没有数据，因为可能我的车停在地下车库的数据还没同步过来，让子弹飞一会儿，在等等看。

在总结一点儿 官方的文档有几个困惑的地方解释下。

https://docs.teslamate.org/docs/guides/traefik

进入目录后创建三个文件，这三个文件只需要**直接创建在当前的目录下就好，** 刚开始配置的时候一直不太确定文件该放在哪：

1. docker-compose.yml (用于安装配置docker 容器的文件)
2. .env文件（自定义环境变量文件，存储一些私有变量如密码等）
3. .htpasswd文件(在teslamate登录前增加一道验证，因为生成的tesla auth只需要生成一次，如果没有的话他人也可以直接通过链接访问你的应用了)

环境变量里面，几个需要和配置更改的变量：

`TM_ENCRYPTION_KEY`  提供一串随机字符即可，用来加密tesla api token

`TM_DB_PASS` 数据库的密码，

`FQDN_TM` 部署的服务器域名

剩下的诸如申请域名 备案 解析域名等照着文档走就行了，都挺通畅的。