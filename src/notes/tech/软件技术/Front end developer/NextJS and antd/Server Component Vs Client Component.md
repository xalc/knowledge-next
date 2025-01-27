# Server Component Vs Client Component

最近在学习nextjs中，发现很多地方特意的区分server component和client component。为了搞清楚两者具体的区别和使用场景，故深入的研究了下。

首先Server component在React中是引入的实验性质的功能（至少在React18.3.1中如此）。

借用Nextjs中给的定义

> React Server Components allow you to write UI that can be rendered and optionally cached on the server.
> 

RSC（ React Server Components）允许你将UI渲染和缓存在服务器中。

而React官网对于RSC的定义。

> Server Components are a new type of Component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server.
> 

RSC是一种能够新型的组件，这种组件能够在除ssr server和client app之外的环境中在打包前渲染。 我的理解时这种组件甚至可以在开发完成的时候，在用户的CommandLine里就能完成打包和渲染。

在之前的React开发中，我们定义组件，使用state管理状态，处理组件生命周期和用户进行交互， 通过RestAPI的方式向后端系统通信，获取数据，提交表单。这些事情主要都是在浏览器间进行的。但对于某些组件来说，可能并不需要频繁的数据交换和用户交互，自然而然的如果能够向SSR那样，把这些事情交给服务器，或者提前预先生成成实际的HTML，直接插入到DOM结构中，是否能提高效率，加快客户端的渲染呢？所以RSC应运而生，它将一些不变的东西（比如纯组件，暂时不变的数据）渲染成实际的HTML片段缓存在服务器中。

它的一些好处如下（翻译自nextjs文档）：

数据获取：在服务端获取数据，能够更接近数据源。通过减少获取数据时间以及减少客户端请求次数的方式来改善性能。

安全：保证敏感数据和逻辑在服务器中，比如token和API key，无数据暴露在客户端的风险。

缓存： 缓存在服务端的数据能够缓存并被不同用户和不同请求复用。

性能: RSC在基线之上提供了额外的工具来优化性能。 比如说将不交互的片段移动到服务器端处理，这有利于使用慢速网络和低性能设备的用户有好处，因为这意味着更少的客户端JS下载解析和执行。

还有优化首屏加载时间和首次内容渲染时间（FCP）等， 搜索引擎优化，流式处理等等。

### 和SSR（server side render）的区别

SSR 主要解决的是首屏加载白屏问题。 最开始，在浏览器访问react项目时，首先浏览器返回一个空的html元素，然后在将js代码已bundle的形式内嵌到<script></script>标签中。 这样由于bundle本身体积过大，或者执行逻辑复杂，常常导致请求的网页会出现白屏，即浏览器等待最终的html生成时间。 为了解决这个问题，服务器将渲染应用并提前生成实际的HTML并通过React.`hydrate`的方式将实际的内容注入到html元素中去。 ***在18以后使用HydrateRootAPI来执行。***

两者的区别主要在于负责的范围不同。 SSR解决的是初始渲染解决的是首屏加载的问题。 而RSC主要是组件级别的，用于不同于client component的业务逻辑解决方案。比如敏感数据和敏感逻辑。

### 例子

下面通过一个例子来具体阐述：完整的代码如下。

https://github.com/xalc/next-andt-demo/tree/RSC-demo

先看看最终效果：

![compare.gif](Server%20Component%20Vs%20Client%20Component/compare.gif)

可以明显的看到RSC的渲染更快一下

### 具体看代码

这是使用 `create-next-app` 并引入antd（和本文无关）创建的一个get started案例。

通过Server component和Client component的方式来获取存储在项目下的markdown文档的例子。

项目初始化完成后，参考[Nextjs官方文档](https://nextjs.org/docs/app/building-your-application/configuring/mdx)来配置MDX用于解析markdown。

需要注意的是在配置 `next.config.js` 时候，采用es6的写法，这样能避免无法解析commonjs而报错的情况。可以参考 `https://github.com/xalc/next-andt-demo/blob/RSC-demo/next.config.mjs` 中的写法。

文档结构是标准的nextjs结构  采用APP router，如下所示。

![image.png](Server%20Component%20Vs%20Client%20Component/image.png)

1. 在 `app/resource` 下为要展示的mdx文档。例子中文件名为 `page.mdx` 内容如下:

```markdown
 
# Welcome to my MDX page!
 
This is some **bold** and _italics_ text.
 
This is a list in markdown:
 
- One
- Two
- Three
 
Checkout my React component:

***A demo page!!!***
```

1. 在  `app/libs` 下新建 `mdxreader.js`  用于读取mdx文档的内容。代码如下:

```jsx
import path from 'path';
import { promises as fs } from 'fs';
const getMDXContent = async () => {
    const absPath = path.resolve(process.cwd(), 'src/resource', 'page.mdx');
    let mdxContent = '';
    try {
        mdxContent = await fs.readFile(absPath, 'utf-8');
    } catch (err) {
        console.error(`${err}`);
    }
    return mdxContent;
}

export default getMDXContent;

```

通过调用nodejs的fs函数读取page.mdx的内容

1. 在app下新建 `servermdx/page.js` 用于route到server component。 内容如下：

```jsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Suspense } from 'react'
import getMDXContent from '@/libs/mdxreader';
export default async function ServerMDX() {
    const content = await getMDXContent();
    return (

        <Suspense fallback={<p>Loading feed...</p>}>
            <MDXRemote source={content} />
        </Suspense>
    );
}
```

可见RSC的代码相当简单，直接在组件内访问后端提供的API，直接调用nodejs函数。初次看见这种前后端混装的代码，表示怀疑。

1. 创建Client组件
    1. 首先我们需要定义API入口，根据nextjs的文档结构，我们需要创建文件 `/app/api/mdx/route.js` 
        
        ```jsx
        import getMDXContent from "@/libs/mdxreader";
        export async function GET(request) {
            const data = await getMDXContent();
            return new Response(data, {
                headers: { 'Content-Type': 'text/plain' }
            })
        }
        ```
        
    2. 在  `/app/clientmdx/page.js` 中添加Client component组件：
        
        ```jsx
        
        'use client'
        
        import { Suspense, useState, useEffect } from 'react';
        import { MDXRemote } from 'next-mdx-remote/rsc'
        export default function ClientMDX() {
            const [content, setContent] = useState();
            useEffect(() => {
                fetch(`/api/mdx`)
                    .then(res => res.text())
                    .then(content => setContent(content))
            }, [])
        // 后面才发现MDXRemote本身就是一个server component。直接在client中调用会抛错
            return (<Suspense fallback={<p>Loading feed...</p>}>
                <MDXRemote source={content} />
          
            </Suspense>
            );
        }
        
        ```
        

可以看出对于同样的功能（不变的内容），RSC要简化的多。

server component 和client component就像过去（17-20年）流行的container和component一样（单纯在写法上于逻辑组织方面，原理却大相径庭）， 大约是container（serve component）负责数据，component（client component）负责交互和展示。

## 组合使用

这里需要强调的是无法在Client Component中使用Server Component。原文如下： [**Unsupported Pattern: Importing Server Components into Client Components**](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#unsupported-pattern-importing-server-components-into-client-components) 。

但可以使用组合模式

```jsx
import ClientComponent from './client-component'
import ServerComponent from './server-component'
 
// Pages in Next.js are Server Components by default
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  )
}
```

先看效果图

![compose.gif](Server%20Component%20Vs%20Client%20Component/compose.gif)

在上述例子中新建一个页面 `/app/compose/page.js` 

```jsx

import { MDXRemote } from 'next-mdx-remote/rsc'
import { Suspense } from 'react'
import getMDXContent from '@/libs/mdxreader';
import Expandable from './expandable';

const ServerComponent = ({ content }) => {
    return (<Suspense fallback={<p>Loading feed...</p>}>
        <MDXRemote source={content} />
    </Suspense>);
}
export default async function ServerMDX() {
    const content = await getMDXContent();
    return (
        <Expandable>
            <ServerComponent content={content} />
        </Expandable>
        // <Expandable1 render={<ServerComponent content={content} />} />
    );
}

```

在创建一个client component `/app/compose/expandable.js` 

```jsx
'use client'
import { useState } from 'react';
import { Button } from 'antd';
const Expandable = ({ children }) => {
    const [isOpen, setOpen] = useState(false);
    return (<>
        {<Button onClick={() => setOpen(!isOpen)}>Toggle Server component</Button>}
        {isOpen && children}

    </>)
}
export default Expandable;
```

`Expandable`是一个client component，用于控制server component的渲染。ServerComponent作为Expandable组件的子组件以 `children` 的方式访问。

当然也可以以传递props的方式来渲染。修改 `/app/compose/expandable.js` 

```jsx
'use client'
import { useState } from 'react';
import { Button } from 'antd';
const Expandable1 = (props) => {
    const [isOpen, setOpen] = useState(false);
    return (<>
        {<Button onClick={() => setOpen(!isOpen)}>Toggle Server component</Button>}
        {isOpen && props.render}

    </>)
}
export default Expandable1;
```

使用 `/app/compose/page.js` 中ServerMDX的return语句内注释的内容也可以达到同样的效果。

### 参考文献

[https://react.dev/reference/rsc/server-components#async-components-with-server-components](https://react.dev/reference/rsc/server-components#async-components-with-server-components)

[https://www.joshwcomeau.com/react/server-components/](https://www.joshwcomeau.com/react/server-components/)

[https://nextjs.org/docs/app/building-your-application/rendering/server-components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

[https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)