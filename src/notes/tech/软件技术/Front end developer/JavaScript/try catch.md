# try catch

### JS try catch 练习

## 先看`error`对象

throw出去的error会被外面最近的try catch捕获

```jsx
const simplest = () => {
    try {
        throw new Error("Whoops!");
    } catch (e) {
        console.error(`${e.name}: ${e.message}`);
    }
}

```

- *如果外面没有catch的话 就会直接中断程序执行 如

```jsx
const simplest = () => {
        throw new Error("Whoops!");
}
simplest();

```

并且直接会抛出错误

```
xalc@Hunter:~/Documents/coding/nodejs/knowledge-backend$ node index.js
file:///home/xalc/Documents/coding/nodejs/knowledge-backend/Quiztime/tryquiz.js:32
        throw new Error("Whoops!");
              ^

Error: Whoops!
    at simplest (file:///home/xalc/Documents/coding/nodejs/knowledge-
    ...
    ...

Node.js v20.18.0

```

在setTimeout中如果直接throw的话那么就会中断程序，猜测可能的原因时在宏任务中处理func并没有catch任何错误，因此如果需要在setTimeout中throw必须要包裹在try catch中，即便时在catch中在throw出去。

```jsx
setTimeout(() => {
	//do something
	throw new Error('something error!')
},microseconds)

```

在promise中 `reject` 的对象会被catch捕获
如果结合await使用的话：

```jsx
const myPromise =() =>  new Promise((resolve,reject) => {
	const randomValue = Math.random();
            console.log(`random value ${randomValue}`)
            if(randomValue> 0.77) {
                resolve({ value : randomValue })
            } else
            reject({ error: randomValue})
})
const entry = async() => {
	try {
		const result = await myPromise()
		.catch(error){
				// if no inner catch, the out catch will triggered
				console.log('inner catch: first trigger ');
				// if throw the out catch will trigger or out catch will not execute
				throw error;
			}
	} catch (error) {
		console.log('out catch triggered);
	}

}

```

如果在promise中throw会发生什么呢？

1. 在reject或者resolve后面的throw 会无视掉，但是reject和resolve后面的代码会执行

```jsx
const simulatorFetch = () => new Promise((resolve, reject) => {

            const randomValue = Math.random();
            console.log(`random value ${randomValue}`)
            if(randomValue> 0.07) {
                resolve({ value : randomValue })
                console.log('after resolve')
                throw new Error('inside simulate fetch error');
            } else if(randomValue>0.05) {
                reject({error: randomValue})
                console.log('after reject')
                throw new Error('inside simulate fetch error');
            }

})

```

1. 在reject或resolve前面抛出的话会直接被外面的catch捕获到

### Throw的编译器warning

在调试上述代码是 webstorm抛出一个错误：
`'throw' of exception caught locally`
![[Pasted image 20241108143522.png]]
stackoverflow上解释了这个问题

> https://stackoverflow.com/questions/47015693/how-to-fix-throw-of-exception-caught-locally
> 

大意的意思是：throw用来捕获外部错误（不可控错误）如果知道这是个错误，直接条件处理就好，
如上述例子，直接处理就好了，不需要在catch语句中处理了，否则throw就编程“goto”语句了。
而只需要在外部不可控，比如访问一个别的函数时才需要catch住别的函数可能抛出的异常。
这是一个设计理念的问题。
非较真理解就是非必要不throw