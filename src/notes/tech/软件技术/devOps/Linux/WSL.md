# WSL

## 查看wsl虚拟机IP地址

```jsx
ip addr
```

例如 `172.x.x.x` 或 `192.168.x.x`

## 移除Zone.Identifier

使用find命令

```jsx
find . -name "*:Zone.Identifier" -type f -delete
```

## 避免生成Zone.Identifier

使用命令行工具复制

```jsx
wslpath 'C:\test.txt'
// /mnt/c/test.txt

scp /mnt/c/test.txt /home/
```