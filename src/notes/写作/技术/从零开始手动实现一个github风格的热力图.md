# 从零开始手动实现一个github风格的热力图

首先有很多成熟的heatmap封装直接调用就好，不需要重复造轮子。

但从零打造一个heatmap，可以少很多条条框框，按照自己的想法去个性化定制，同时也是对相关知识的复习。

我能想到的有三种方案可以实现这个需要

1. 纯原生html
2. svg方式
3. canvas实现

我们先采用原生纯html的方式来实现，这样的技术债务最少。也是目前最有思路的方式，后面可以考虑用别的方式重构，也可以作为学习相应技术的素材。

## 背景

首先我们知道的是heatmap就是大小相同颜色深浅不同的格子的组合，通过颜色的变化来表达数据的分布情况。 热力图根据名字最初应该是用于展示热力温度的变化情况。 比如在一张地图上，通过对不同区域进行着色，能够直观的观察到哪些区域温度更热或者更冷。 

当然延申出来的场景有很多，对于前端来说，可以通过统计网页鼠标经常滑动点击的区域，判断用户的注意力容易集中在那块，然后在热区放置重要的信息。

对github用户来说，最直观的就是github个人主页上那显眼的深深浅浅的绿色小格子了。他是基于日期的，每一天带代表一个格子，深深浅浅的绿色代表了当天的commit数量，可以很直观的观察到牛马一段时间范围类的贡献大小。

## 目标

我的目标是实现一个按年度统计每日阅读情况的热力图。

能基于现有技术栈实现一个和整体风格一致的热力图， 并且能随着网站的主题调整而色彩变化，支持响应式，比如在手机上垂直显示，在电脑端横向显示。 

本文的代码目前包含创建一个基本的github风格横向热力图。

更多的实现参考[本网站的读书统计模块](https://blog.huntx.cn/reading/stats) 有更加丰富的交互和响应式设计。

### 采用的技术方案

1. moment 用moment库来处理日历中时间日期的计算
2. tailwind 和shadcn组件库
3. 结合Flex和Grid布局

## 实现过程

1. 使用Grid布局创建一个53周(列)，7天(行)的数据格 每个格子是一个正方形的小矩阵

```jsx
export default function Heatmap() {
  return (
    <div className="grid grid-cols-[repeat(53,1fr)] gap-1 ">
      {Array.from({ length: 53 }).map((week, weekIndex) => {
        return (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {Array.from({ length: 7 }).map((day, dayIndex) => (
              <div
                key={`${weekIndex}_${dayIndex}}`}
                data-key={`${weekIndex}_${dayIndex}}`}
                className="h-4 w-4 bg-green-300"
              ></div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

得到的结果如下

![image.png](%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAgithub%E9%A3%8E%E6%A0%BC%E7%9A%84%E7%83%AD%E5%8A%9B%E5%9B%BE/image.png)

但这个grid仅仅是53*7的矩阵，并没有和日期对应起来，我们需要根据实际情况掐头去尾，将星期数据和实际的格子对应起来。

1. 将时间和日期对应起来，主要利用 `moment` 时间库来处理日期：

```bash
moment('2024').startOf("year") //获取当年的第一天
moment('2024').isLeapYear() ? 366 : 365 //获取当年有多少天
moment().getDay() //获取这是一周的第几天
```

将年度数据按照周存储成二维数组。

```jsx
 const getWeeksOfYear = (year: number) => {
    const startDate = moment(String(year)).startOf("year");
    const dayOfyear = moment(String(year)).isLeapYear() ? 366 : 365;
    const weeks = [];
    let currentWeek = [];
    let currentDate = startDate;
    const firstDayOfWeek = currentDate.day();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    for (let i = 0; i < dayOfyear; i++) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(currentDate);
      currentDate = moment(currentDate).add(1, "days");
    }
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
    return weeks;
  };
  const weeks = getWeeksOfYear(2024);
```

1. 更改第一步得到的代码 将 `Array.from()` 生成的数组替换成实际日期数组

```jsx

  const weeks = getWeeksOfYear(2024);
   <div className="mt-16 grid grid-cols-[repeat(53,1fr)] gap-1 pt-2">
      {weeks.map((week, weekIndex) => {
        return (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((day, dayIndex) => {
              if (!day) return <div key={`empty-${dayIndex}`} />;
              return (
                <div
                  key={`${weekIndex}_${dayIndex}}`}
                  data-key={`${weekIndex}_${dayIndex}}`}
                  className="h-4 w-4  bg-green-500"
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
```

![image.png](%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAgithub%E9%A3%8E%E6%A0%BC%E7%9A%84%E7%83%AD%E5%8A%9B%E5%9B%BE/image%201.png)

1. 有了这个基本的grid后，在对应的cell中渲染不同的背景颜色就好了，一般来说根据数据的值分成几个区间，每个区间对应样式。
    
    比如说我这儿根据每日阅读的时间等分成5等分，每个区间对应一个tailwind的class。 这里也可以根据数据的不同采用不同的策略来给数据分组。
    

```jsx
  const maxSeconds = summarys.reduce((acc, ac) => Math.max(acc, ac.readingSeconds), 0);
	const getGithubBGcolorClassName = (value: number, maxValue: number) => {
  const percentage = (value / maxValue) * 100;
  if (percentage === 0) return "bg-muted";
  if (percentage <= 20) return "bg-green-300";
  if (percentage <= 40) return "bg-green-500";
  if (percentage <= 60) return "bg-green-700";
  if (percentage <= 80) return "bg-green-800";
  if (percentage <= 100) return "bg-green-900";
  return "bg-muted";
};
```

> 需要注意的一点是tailwind是在构建的时候生成类名的，所以无法检测到动态生成的类名，所以
`bg-${color}-${value}` 这种写法是无效的。
> 
1. 根据实际的每日数据计算出cell中所需要的背景颜色使用 `clsx` 将className合并就好了。

代码中的summarys是一个对象数组，结构如下:

```tsx
interface Summary {
  id: string;
  readingSeconds: number;
}
```

```jsx
 <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((day, dayIndex) => {
              if (!day) return <div key={`empty-${dayIndex}`} />;
              let summary = summarys.find(s => Number(s.id) === moment(day).unix());
              if (!summary) {
                summary = { id: day, readingSeconds: 0 };
              }
              return (
                <div
                  key={summary.id}
                  data-key={`${weekIndex}_${dayIndex}}`}
                  className={clsx(
                    getGithubBGcolorClassName(summary.readingSeconds),
                    "h-4 w-4",
                  )}
                ></div>
              );
            })}
          </div>
```

![image.png](%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAgithub%E9%A3%8E%E6%A0%BC%E7%9A%84%E7%83%AD%E5%8A%9B%E5%9B%BE/image%202.png)

1. 增加tooltips

使用 `Shadcn` 的 `tooltip` 给每个cell增加tooltip.

先将cell提取成单独的组件

```tsx
const GridCell = ({ summary, classes, lastSyncTime }) => {
 
  return (
          <div key={summary.id} className={classes}></div>
  );
};
```

随后将其用tooltip包裹起来,并修改默认样式，,不要忘了处理不需要tooltip的单元格

```tsx
const GridCell = ({ summary, classes, lastSyncTime }) => {
  if (lastSyncTime < summary.id) return <div key={summary.id} className={classes}></div>;
  return (
    <TooltipProvider key={summary.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div key={summary.id} className={classes}></div>
        </TooltipTrigger>
        <TooltipContent className="bg-background text-foreground">
          <div className="space-y-1">
            <p className="font-medium">{moment.unix(summary.id).format("YYYY年MM月DD日 dddd")}</p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{(summary.readingSeconds / 60).toFixed(2)} 分钟</span>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
```

这样一个类似于github的热力图主体部分就基本完成了

![image.png](%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAgithub%E9%A3%8E%E6%A0%BC%E7%9A%84%E7%83%AD%E5%8A%9B%E5%9B%BE/image%203.png)

1. 显示星期和月份

首先在heatmap组件上方添加月份信息 使用grid布局，利用 `moment.months()` 来获取月份信息，需要注意localization

```tsx
   <div className="ml-14 grid grid-cols-[repeat(12,1fr)]">
        {moment.months().map((month, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground">
            {month}
          </div>
        ))}
      </div>
```

其次使用类似的方法加上星期数据

```tsx
 <div className="flex gap-4">
        <div className="grid w-10 grid-rows-7 gap-2 pt-2 text-xs text-muted-foreground">
          {moment.weekdays().map(day => (
            <div key={day} className="flex h-[10px] items-center justify-end">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-1 pt-2">
        {/** heatmap主体*/}
        </div>
  </div>
```

1. 还需要加上legend数据

```tsx
  <div className="mt-6 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">阅读程度：</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4, 5].map(level => (
            <TooltipProvider key={level}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={clsx("h-3 w-3", getGithubBGcolorClassName(level, 5))} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {["未阅读", "短时阅读", "适度阅读", "良好阅读", "深度阅读", "专注阅读"][level]}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
```

最终成品如下： 

![image.png](%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAgithub%E9%A3%8E%E6%A0%BC%E7%9A%84%E7%83%AD%E5%8A%9B%E5%9B%BE/image%204.png)

## 总结

从零开始实现一个heatmap虽无必要，但却也可以享受技术DIY带来的乐趣，对于掌握前端基础知识大有裨益。

在搭建过程中，不仅需要考虑实际数据的组织形式，还需要考虑日期的计算匹配，同时也是对Grid布局和tailwind的一次复习，更是对shadcn组件的一次实践。