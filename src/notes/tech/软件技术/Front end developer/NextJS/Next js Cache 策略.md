# Next.js Cache 策略

## 前言

nextjs14和15采用完全相反的策略，让我在升使用过程中困惑不已。

网站的上一版使用的是next14，默认的缓存策略就是fource-cache后生成static content，导致我经常更新不到新的数据，明明数据库已经更新了，但是应用中始终显示的是部署时候的数据。

但是15采用默认不cache，导致在该cache的时候每次都重新请求数据。

## 强调下概念

在执行 `next build` 后，编译完成后对于不同的router会有不同的策略， 先说下面最常见的两种。

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

`Static` 在构建时生成被预渲染成HTML，无需额外的服务器数据请求

`Dynamic`  页面在每次请求时从服务器动态生成

对比14和15 build生成的结果， 14大部分是static的而15大部分都是dynamic的

## Cache 策略的变化

NextJS14：

- 默认采用Static generation
- cache使用的是 `force-cache`

Nextjs15：

- 默认采用Dynimic Rendering
- 默认采用 `no-store`

## Next15中配置的方式

### dynamic配置

> Change the dynamic behavior of a layout or page to fully static or fully dynamic.
> 

用于在路由级别配置整个页面的动态属性，通过 `export const dynamic`的方式配置实现

```jsx
export const dynamic = "force-dynamic" || "force-static";
```

在Next 15的APP router中可以理解为所有页面默认都是动态渲染的 ,其核心思想是在保证动态渲染的时候尽可能多的进缓存，原文如下，高度概括，有点儿含糊不清。

> The default option to cache as much as possible without preventing any components from opting into dynamic behavior.
> 

个人的理解如果是明确需要静态渲染的内容，比如万年不变的内容，直接 `force-static` 其他使用默认值在API级别配置cache策略就好了。

所以如果配置了 `force-static` 页面被强制标记成静态内容。因此在页面中配置的cache机制会失效，因为其仅在build的时候执行一次生成静态页面，但在构建(build)阶段cache依旧有效，生成静态页面后不在使用cache。

### 使用fetch

用于在API级别控制cache策略。

根据（v15.1.4的描述）：

> Next.js fetches the resource from the remote server on every request in development, but will fetch once during `next build` because the route will be statically prerendered. If [Dynamic APIs](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering) are detected on the route, Next.js will fetch the resource on every request.
> 

默认情况下 在dev环境下每次都会fetch，但如果没有使用Dynamic API的情况下在build时候就fetch以后就静态预渲染。

```jsx
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })

//or
fetch(`https://...`, { next: { revalidate: false | 0 | number } })
```

`no-store`  不缓存数据每次都从数据源获取新的数据

`force-cache` 缓存数据，数据在构建时或者首次请求时缓存

`next.revalidate` 在指定时间间隔后重新验证和获取数据

当然也可以使用React19中系统的API

`use cache`

## 总结

在next.js 15中采用了完全不同的cache策略，使得cache的管理变得更加主动，这避免了14激进的cache策略，但对开发者的提出了更高的要求，需要仔细斟酌哪些类型可以被永久cache（SSG），哪些需要增量更新（ISR）哪些是Dynimic Rendering.