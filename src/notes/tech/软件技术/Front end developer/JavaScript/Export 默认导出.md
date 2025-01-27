# Export 默认导出

### 对于箭头函数

```jsx
//匿名导出
export defulat () => {//function body}

//先定义在导出
const func = () => {};
export default func;
```

### 传统函数

```jsx
export default function Func(){};
export default function(){}
```

default导出的内容在顶层 import的时候不用包裹起来