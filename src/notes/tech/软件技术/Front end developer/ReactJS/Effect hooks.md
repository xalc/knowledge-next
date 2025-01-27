# Effect hooks

effects可以让组件和外部系统异步交互，如：网络请求，操作DOM，动画，别的UI组件甚至是非react代码。

### 避免使用Effect的场景

https://react.dev/learn/you-might-not-need-an-effect

如果不需要和外部系统交互，那么就不需要Effect。

两种常见的不需要Effects的场景:

1. 不需要在Effect中进行数据转换

比如在过滤列表内容的时候，当列表数据变化时在effect中更新state

```jsx
//不推荐
import { useState, useEffect } from 'react';
const DonotUseEffectComponet = ({ list }) => {
    const [filtered, setFilted] = useState(list);
    useEffect(() => {
        setFilted(list.filter((l) => l === 'needed'))
    }, [list])
    return <>{filtered}</>
}
export default DonotUseEffectComponet;
```

首先数据变化时，react先执行组件方法返回list数据（useState初始化时赋的值）

其次将变化提交到DOM，更新树结构

最后调用Effect执行filter更新。 之后在重新执行上述过程。

```jsx
//推荐写法
const RecommandComponet = ({ list }) => {
    const filtered = list.filter((l) => l === 'needed');
    return <>{filtered}</>
}
```

当list变化时，react执行组件方法，直接返回filter后的列表，在提交到DOM执行更新操作。

1. 不需要Effect处理用户事件

比如对于有多个button处理点击是件，只需要在对应的是件中相应操作， 如果移到effect中处理，则需要更多的判断来确定button是件来自何处

（maybe need some example）

```jsx
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

1. 没必要在Effect中同步外部系统，如请求数据

```jsx
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

### 正确使用

组件生命周期  Mount → update → unmount

Effect在更细的粒度上（对变量）管理周期执行函数体（Mount），

函数返回值（Unmount）函数依赖(Update)

`useLayoutEffect` 在浏览器重新渲染前触发， 在这里可以处理Layout问题

`useInsertionEffection` 在浏览器和DOM交互前触发。常用于动态插入CSS