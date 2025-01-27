# NextJS& antd

- App Router vs Page Router
    
    > Next.js has two different routers: the App Router and the Pages Router. The App Router is a newer router that allows you to use React's latest features, such as Server Components and Streaming. The Pages Router is the original Next.js router, which allowed you to build server-rendered React applications and continues to be supported for older Next.js applications.
    > 

[Server Component Vs Client Component](notes/tech/%E8%BD%AF%E4%BB%B6%E6%8A%80%E6%9C%AF/Front%20end%20developer/NextJS&%20antd/Server%20Component%20Vs%20Client%20Component.md)

• The [`useRouter` hook imported from `next/router`](https://nextjs.org/docs/pages/api-reference/functions/use-router) is not supported in the `app` directory but can continue to be used in the `pages` directory.

server side： `import { redirect } from 'next/navigation'`  then:` redirect(`/post/${id}`)`

router.push()似乎不刷新searchParamater的变化???

[antd中设置header颜色](notes/tech/%E8%BD%AF%E4%BB%B6%E6%8A%80%E6%9C%AF/Front%20end%20developer/NextJS&%20antd/antd%E4%B8%AD%E8%AE%BE%E7%BD%AEheader%E9%A2%9C%E8%89%B2.md)