# How to start a service in backend

[https://www.scaler.com/topics/how-to-run-process-in-background-linux/](https://www.scaler.com/topics/how-to-run-process-in-background-linux/)

we can try the screen command:

```bash
screen
```

and then back to the service  using command

```bash
screen -r
```

需要提前安装`screen` 命令

使用 `screen` 命令主要注意在主窗口和screen窗口

可以使用 `Ctrl+a` `d` 返回主窗口

在screen窗口时可以使用快捷键来切换和新建，命名窗口

> 
> 
> - `Ctrl+a` `c` Create a new window (with shell).
> - `Ctrl+a` `"` List all windows.
> - `Ctrl+a` `0` Switch to window 0 (by number).
> - `Ctrl+a` `A` Rename the current window.
> - `Ctrl+a` `S` Split current region horizontally into two regions.
> - `Ctrl+a` `|` Split current region vertically into two regions.
> - `Ctrl+a` `tab` Switch the input focus to the next region.
> - `Ctrl+a` `Ctrl+a` Toggle between the current and previous windows
> - `Ctrl+a` `Q` Close all regions but the current one.
> - `Ctrl+a` `X` Close the current region.

主窗口则可以使用 `screen -r` 等命令控制