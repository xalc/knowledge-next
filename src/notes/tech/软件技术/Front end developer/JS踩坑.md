# JS踩坑

当使用fill函数填充时

```jsx
new Array(3).fill(new Array(2).fill(0));
```

当填充的值为引用类型时, 所有填充的元素指向同一地址, 导致对某一个值修改后 所有的值都被修改.

![Untitled](JS%E8%B8%A9%E5%9D%91/Untitled.png)

### Solution

```jsx
let arr=new Array(3).fill(0).map(item=>new Array(3).fill(0))
```

or 

```jsx
let dp1 = Array.from(new Array(3).fill(0), () => new Array(3).fill(0))
```