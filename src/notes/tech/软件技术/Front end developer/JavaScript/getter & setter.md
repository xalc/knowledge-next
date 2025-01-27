# getter & setter

以属性的方式访问定义的方法

> The **`get`** syntax binds an object property to a function that will be called when that property is looked up.
> 

```jsx
const obj = {
    _value: 0,
    get value() {
        console.log("getter")
        return this._value
    },
    set value(v) {
        console.log("setter")
        this._value=v
    },
    setValue(v ) {
        this._vaule = v;
    },
    getValue() {
        return this._value
    }
}
```

注意区分obj.value & obj.getValue() &  obj._value

<aside>
💡 通过属性访问 和通过方法访问变量 以及直接访问

</aside>