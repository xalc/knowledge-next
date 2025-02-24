# Linux

[常用系统监测命令](Linux/%E5%B8%B8%E7%94%A8%E7%B3%BB%E7%BB%9F%E7%9B%91%E6%B5%8B%E5%91%BD%E4%BB%A4.md)

后台运行应用，防止应用被terminal

如：在pull 大模型时候

```jsx
nohup ollama pull deepseek-r1:32b > ~/ollama_pull.log 2>&1 &
```

查看日志:

`tail -f ~/ollama_pull.log`

## ssh隧道

将本地的端口映射到公网

```jsx
autossh -M 50000 -N -R 6399:localhost:6399 -i ~/.ssh/id_ed25519 [root@8.137.115.86](mailto:root@8.137.115.86)
```

```jsx
nohup autossh -M 50000 -N -R 6399:localhost:6399 -i ~/.ssh/id_ed25519 [root@8.137.115.86](mailto:root@8.137.115.86) > output.log &
```

root -> Hunter@alibaba

## 查看显存信息

```bash
nvidia-smi
```

ncdu linux 命令行清理文档工具

wsl 磁盘压缩
[https://www.cnblogs.com/enrio/p/14222648.html](https://www.cnblogs.com/enrio/p/14222648.html)

[https://juejin.cn/post/7148427154194169892](https://juejin.cn/post/7148427154194169892)

[WSL](Linux/WSL.md)