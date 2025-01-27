# NextJS and antd

- App Router vs Page Router
    
    > Next.js has two different routers: the App Router and the Pages Router. The App Router is a newer router that allows you to use React's latest features, such as Server Components and Streaming. The Pages Router is the original Next.js router, which allowed you to build server-rendered React applications and continues to be supported for older Next.js applications.
    > 

[Server Component Vs Client Component](NextJS%20and%20antd/Server%20Component%20Vs%20Client%20Component.md)

• The [`useRouter` hook imported from `next/router`](https://nextjs.org/docs/pages/api-reference/functions/use-router) is not supported in the `app` directory but can continue to be used in the `pages` directory.

server side： `import { redirect } from 'next/navigation'`  then:` redirect(`/post/${id}`)`

router.push()似乎不刷新searchParamater的变化???

[MDX解析](NextJS%20and%20antd/MDX%E8%A7%A3%E6%9E%90.md)

[antd中设置header颜色](NextJS%20and%20antd/antd%E4%B8%AD%E8%AE%BE%E7%BD%AEheader%E9%A2%9C%E8%89%B2.md)

[antd主题切换不生效原因分析](NextJS%20and%20antd/antd%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2%E4%B8%8D%E7%94%9F%E6%95%88%E5%8E%9F%E5%9B%A0%E5%88%86%E6%9E%90.md)

[Next.js Cache 策略](NextJS%20and%20antd/Next%20js%20Cache%20%E7%AD%96%E7%95%A5.md)

Next15和react19中数据请求方式

1. server function
2. common fetch api
3. form submit