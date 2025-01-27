# JavaWeb (spring boot)

使用Gradle作为自动化构建工具 管理依赖

1. 使用[https://start.spring.io/](https://start.spring.io/)提供的配置初始工程
2. 下载本地解压后在vscode中打开
3. 执行 `gradlew build` 命令编译项目(注意代理问题)
    1. 更改 `gradle-wrapper.properties` 中 `distributionUrl` 为腾讯代理源

```bash
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.7-bin.zip
```

1. 执行 `gradlew bootRun` 启动 spring boot项目
2.