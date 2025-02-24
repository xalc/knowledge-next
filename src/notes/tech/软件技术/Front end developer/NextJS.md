# NextJS

[Vercel related](NextJS/Vercel%20related.md)

- App Router vs Page Router
    
    > Next.js has two different routers: the App Router and the Pages Router. The App Router is a newer router that allows you to use React's latest features, such as Server Components and Streaming. The Pages Router is the original Next.js router, which allowed you to build server-rendered React applications and continues to be supported for older Next.js applications.
    > 

[Server Component Vs Client Component](NextJS/Server%20Component%20Vs%20Client%20Component.md)

• The [`useRouter` hook imported from `next/router`](https://nextjs.org/docs/pages/api-reference/functions/use-router) is not supported in the `app` directory but can continue to be used in the `pages` directory.

server side： `import { redirect } from 'next/navigation'`  then:` redirect(`/post/${id}`)`

router.push()似乎不刷新searchParamater的变化???

[MDX解析](NextJS/MDX%E8%A7%A3%E6%9E%90.md)

[antd中设置header颜色](NextJS/antd%E4%B8%AD%E8%AE%BE%E7%BD%AEheader%E9%A2%9C%E8%89%B2.md)

[antd主题切换不生效原因分析](NextJS/antd%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2%E4%B8%8D%E7%94%9F%E6%95%88%E5%8E%9F%E5%9B%A0%E5%88%86%E6%9E%90.md)

[Next.js Cache 策略](NextJS/Next%20js%20Cache%20%E7%AD%96%E7%95%A5.md)

Next15和react19中数据请求方式

1. server function
2. common fetch api
3. form submit

Nextjs

generateMetadata

generateStaticParams

getStaticProps(用于page router)
getServerSideProps(page router)

Nextjs中cache的方式

unstable_cache

export const dynamic = "force-dynamic" || "force-static";

use cache

需要搞清楚ISR算是dynamic更新还是static更新

瀑布流总结：
1使用column实现时 由于是正常分列，所以排序是按照列一次实现的
如果需要按行来排序可能需要需要js数据重排

踩坑：
`cookies` is an **async** function that allows you to read the HTTP incoming request cookies in [Server Component](https://nextjs.org/docs/app/building-your-application/rendering/server-components), and read/write outgoing request cookies in [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) or [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

nextjs cookies只能在server compoent读取， 在server action 或者route handlers中读写