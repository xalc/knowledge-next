# MediaQuery（响应式基础）

css方法

或者直接用 windon.innerWidth

```jsx
   const mql = window.matchMedia(`(max-width: ${WIDTH_CONSTANT}px)`);
        mql.addEventListener("change", (event) => {
            if (event.matches) {
                setSmallDevice(true)
            } else {
                setSmallDevice(false)
            }
        });
```

or: 

```bash
 middleScreen = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
```

在构建本项目过程中，打算用antd来实现响应式布局的，结果发现即便是antd 官网的例子也无法容易实现，加上antd关于layout这一块的文档着实没太多东西，即便是查看了源代码，也挺不容易达到官网上的效果。

在折腾了数个小时后，决定还不如自己实现一个header的响应式。本身的原理并不复杂。

要么利用windows对象提供的检测屏幕宽度方法

`window.innerWidth`

或者利用mediaQuery的API。

ps： 着实觉得Grid布局的实用性不强，即便是把整个屏幕宽度划分成12还是24等分，划分的越多实际上边界条件也越复杂，越有可能出现类容越界的现象。

同时需要注意在nextjs中使用windows对象的时机