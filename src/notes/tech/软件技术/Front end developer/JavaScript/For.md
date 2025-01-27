# For

### for in

主要用于遍历对象 返回对象的key 如果是数组 则返回数组的下标

会返回继承的属性(__**proto__**上的)

```jsx
let Point = function (x, y) {
    this.x = x;
    this.y = y;
}
let p = new Point(1, 2);
let ThreeDPoint = function (z) {

    this.z = z
}
ThreeDPoint.prototype = p;
let threeD = new ThreeDPoint(3);
for (let prop in threeD) {
    console.log(`p.${prop} = ${threeD[prop]}`)
}
//output 
//p.z = 3
//p.x = 1
//p.y = 2
```

### for of

> The **`for...of`** statement executes a loop that operates on a sequence of values
> 

主要用于便利数组, 字符串或者list

```jsx

let str = 'hello world'
for (let val of str) {
    console.log(val)
}

```