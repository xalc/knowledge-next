# Github action 踩坑记

## 前提

主要是买的ECS内存太小了，如果直接在ecs跑nextjs应用的build脚本，毫无商量直接就卡死给你看，不得已使用Github的action来执行CI/CD过程。 不过随着使用，觉得真香

1. 如果需要支持手动在github网页或者API触发 则需要配置

```yaml
on:
	workflow_dispatch:
```

1. 对于GitHub环境变量的访问

需要指定environment 这样才能读取到对应环境下的环境变量， 常见的环境比如说 production， test， stage… 部署在不同的环境下 环境变量有可能不同，如果不指定所有的变量都读不出来

```yaml
deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment || 'production' }}
```

比如在repostory/settings/environment下面 `new environment` 可以自定义部署环境

1. 根据环境变量不同访问方式也不同
    1. 最简单的env上下文
    2.  使用vars访问工作流中配置的环境变量。如在存储库、环境或组织级别设置的配置变量（例如在github settings下面设置的变量）
    3. 使用secrets访问工作流中设置的secrets

在上述（step2）自定义的环境下面可以添加 **`Environment secrets`**和 **`Environment variables`** 

分别可以用var. 和secrets.访问

1. 生成私钥/上传私钥 访问ecs
2. 从github action上使用pm2 restart service报错

```yaml
/usr/bin/env: ‘node’: No such file or directory
Error: Process completed with exit code 127.
```

参考ChatGPT解法 确实厉害

```yaml
          export NVM_DIR="$HOME/.nvm" && \
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
            [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
          nvm use 20
          node --version
```

原因是action在连接ecs时，由于 **NVM 管理的 Node.js** 在执行 SSH 登录时没有正确加载， 导致无法识别 node和 nvm

但奇怪的时手动load  `source ~/.bashrc` 并未生效。

上述重新导入MVM后问题解决。

详情请参考https://github.com/xalc/knowledeg-center/blob/master/.github/workflows/deployecs.yml

最起码GPT给的解决思路很对，好评！！！