# This指向

## this的指向只有在调用时候才能确定

1. 指向全局 
2. 指向调用者
3. 构造函数, 指向对象

## call apply bind

```jsx
**var** name = 'global'
function Test(a, b) {
    console.log(this.name, a, b)
}

Test(1, 2);

Test.call({ name: 'call' }, 1, 2)
Test.apply({ name: 'apply' }, [1, 2])
const t = Test.bind({ name: "bind" });
t(1, 2)
```

### output

<aside>
💡 global1 2
call 1 2
apply 1 2
bind 1 2

</aside>

### 箭头函数无this