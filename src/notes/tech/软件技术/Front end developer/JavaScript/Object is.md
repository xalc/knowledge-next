# Object.is

该方法比较两个值是否相等

```jsx
Object.is(v1, v2)
```

普通对象直接比较 值相同则相等

对于对象 如果引用的 `地址` 一致，则相等

```jsx
let a = {};
let b = {};
let c = a;
let d = a;

Object.is(c, d) //true
Object.is(a, b) //false
```

对于字符串，值相等则true

```jsx
Object.is('abc', 'abc') //true
```

重点对比

`===` 将+0， -0视为相等 NaN视为不等

[`Object.is`](http://Object.is) 将 +0， -0视为不相等 但 NaN视为相等

```jsx
Object.is(+0, -0)  //false
+0 === -0  //true
Object.is(NaN, NaN) //true
NaN === NaN //false

```

`==` 则会先将两个操作数据进行类型转化后判断

```jsx
null == undefined // true
false == '' //true

```

### 判断字符串是否为空

```jsx
!!str === true
!!('') === false
!!(' ') === true
```