# JS构造函数

```jsx
function Point(x,y) {
	this.x =x; 
	this.y = y
}
//
let p = new Point();
let f = Point();
```

构造函数通常大写, 内部使用 `this` 关键字构造对象实例

生成对象实例时需要使用 `new` 关键字

如果在生成实例对象的时候漏掉了new 关键字 ,则this创建的变量将是全局的.

> [https://javascript.ruanyifeng.com/oop/basic.html](https://javascript.ruanyifeng.com/oop/basic.html)
> 
1. 构造函数的返回值

```jsx
function Person(name, age) {
	this.name = name;
	this.age = age;
	
	// return 1;
	return {'hello': 'world'}
}
```

如果return的是个对象直接返回,  如果事基本类型 则ignore

1. 通过new.target判断是否是new命令调用

```jsx
function f() {
	if(!new.target){
		throw new Error('using new for constructor!!!')
	}
	
	... other 
}
```

如果当前函数是`new`命令调用，`new.target`指向当前函数，否则为`undefined`

# ES module 时代

using class

```jsx
class People {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}
}
const p = new People('hunter',12)
```

如果忘记 `new`  关键字 直接抛错