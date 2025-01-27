# container

| **Class** | **Breakpoint** | **Properties** |
| --- | --- | --- |
| **container** | *None* | width: 100%; |
|  | sm *(640px)* | max-width: 640px; |
|  | md *(768px)* | max-width: 768px; |
|  | lg *(1024px)* | max-width: 1024px; |
|  | xl *(1280px)* | max-width: 1280px; |
|  | 2xl *(1536px)* | max-width: 1536px; |

不知为何，看起来很简单直观，但是理解起来老是和预期的结果不一致，可能思维习惯不同？

因此记录一下 使用时待查

### 很简单的 定义一个div

```jsx
<div className='container mx-auto  bg-slate-600 h-[500px]'></div>
```

在不同的分割点设置不同的max-width 假如实际宽度为 `screenWidth`

1. `screenWidth`< 640  width=100%
2. 640< `screenWidth` <768  max-width=640
3. 768 < `screenWidth` < 1024 max-width =768

### 增加限定词 如 `md:container`

```jsx
<div className='md:container mx-auto bg-slate-600 h-[500px]'></div>
```

即：

1. `screenWidth` <md(768) width=100%
2. 768 < `screenWidth` < 1024 max-width =768

依次类推

### 假如需要限定在大屏幕的最大宽度

```jsx
<div className='container mx-auto lg:max-w-[1024px] bg-slate-600 h-[500px]'></div>
```

即当 `screenWidth` > 1024 时 max-width=1024

### 假如需要在小屏幕上隐藏某一项

```jsx
<div className='container mx-auto hidden md:block h-[200px] bg-gray-300'></div>
```

### 在大屏上隐藏

```jsx
<div className='container mx-auto  lg:hidden h-[200px] bg-gray-300'></div>
```