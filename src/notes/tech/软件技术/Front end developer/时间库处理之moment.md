# 时间库处理之moment

官方文档链接：

[https://momentjs.com/docs/#/-project-status/](https://momentjs.com/docs/#/-project-status/)

moment库挺好用的 在ES6中也可以直接使用， 尺寸稍微有点儿大（gz压缩包18.4k），不过提供的功能全面而且多啊。周下载量1200W，相当成功的工具类了。

## 简单使用

直接导入

```bash
import moment from 'moment';
```

获取当前的时间

```bash
let now = moment()
```

按照特定样式显示

```bash
now.format("dddd, MMMM Do YYYY, h:mm:ss a")
```

但是如果在nextjs的client component中使用， 那么在render方法中需要加入 `suppressHydrationWarning`  否则会报错， 因为可能造成服务端和客户端数据不一致

如：

```jsx
<h1 suppressHydrationWarning >现在是 {now.format("dddd, MMMM Do YYYY, h:mm:ss a")}</h1>
```

一些有趣的函数

```jsx
now.second()
now.minute()
now.hour()
now.day() //本周第几天， 从周日算起 第一天是0
now.date() //本月的第几天
now.dayOfYear() // 今年的第几天
now.week()  //今年的第几周
now.month() //今年的第几月 一月为0
now.quarter() 
```

结果如下：

![image.png](%E6%97%B6%E9%97%B4%E5%BA%93%E5%A4%84%E7%90%86%E4%B9%8Bmoment/image.png)

## Matability

令新人诟病的一点是在计算后原始值是可变（Mutable）的.

官方的例子

```jsx
var a = moment('2016-01-01'); 
var b = a.add(1, 'week'); 
a.format();
"2016-01-08T00:00:00-06:00"
```

避免的话在计算前先调用clone方法

```jsx
var a = moment('2016-01-01'); 
var b = a.clone().add(1, 'week'); 
a.format();
"2016-01-01T00:00:00-06:00"
```

当然还可以时间日期计算，比较，国际化，能够实现很全面的功能。