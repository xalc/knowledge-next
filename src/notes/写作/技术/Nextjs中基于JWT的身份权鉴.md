# Nextjs中基于JWT的身份权鉴

<aside>
💡

本文采用nextjs15提供的Authentication方式实现了一个简单的登陆页面，使用JWT管理用户权鉴，阻止非授权用户访问关键路由和数据。并简单对比了两种认证方式的异同。

</aside>

## 背景

在实现写博客和修改博客之前，如果还想把管理平台和博客集成部署在一套系统内，那么就必须有一个可靠的身份认证系统。经过认证后才可以管理已经发布的博客，添加/修改post以及后台的一些数据管理工作。

在调研和对比了不同的权鉴技术前提下，最基本的JWT认证就足以满足我现在的需求。

## JWT VS Session Authorization

常见的身份认证和授权主要有JWT(JSON Web Token)和 Session authorization两种方式。.

无论是哪种方式，都需要用户输入账号信息到服务器，服务器经过验证后（数据库或者第三方授权）在当前会话中保存认证信息，并向用户返回一个session_id,随后的用户请求都会附加上这个session_id，服务端通过查找session_id或者session_id中本身携带的用户信息来识别用户身份。

服务端来确认用户身份的两种方式就构成了本文的基础，也就是JWT方式(客户端请求中携带的信息)和Session Authorization方式。（根据session_id在服务器端查询用户身份）

所以两者最主要的区别如下：

**`JWT存储在客户端  Session存储在服务端。`**

当然存储在不同的环境下也可能面临不同的问题。 

比如存储在客户端，就给伪造JWT提供了机会，同时如果JWT失效，服务器也不能即时剔用户下线。

而存储在服务端，虽然集中管理提高了效率，但服务器需要维护每个用户的 Session 状态， 尤其对于多集群服务器来说，为了保证在每个服务器节点都能访问，那么又必须增加额外的数据层来管理session增加了复杂性。

基于以上对复杂性的考虑，本博客采用客户端的JWT方式来管理用户权限，对于个人站点来说自然是怎么方便怎么来。但既然是技术选型，一定得先搞明白为什么要这么做。

## 认证的过程

1. 客户端提供用户名和密码
2. 服务端向数据持久层（如数据库）去认证结果
3. 认证成功后，将用户信息加上有效期等关键信息加密生成一个JWT
4. 将JWT写入客户端，比如cookie中或者localstorage
5. 在必要的请求上带上JWT 去服务端比对JWT的签名。

## 使用的组件

1. next 15.1.2(App router)
2. [Jose](https://github.com/panva/jose)  用于JWT签名和加密
3. openssl  用于生成密钥
4. react中的form action

## 开始编码

### 1. 在app/auth/page.tsx中新建一个form,用于提交用户信息

```
//app/auth/page.tsx
import { login } from "@/actions/auth";
export default function LoginPage() {
  return (
    <div className="container m-8 mx-auto">
      <form action={login} className="space-y-8">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
        </div>
        <button type="submit">login in</button>
      </form>
    </div>
  );
}
```

### 2. 使用 server function来提交表单，并进行服务器数据验证，并在验证成功时创建session

```tsx
// app/actions/auth.ts
import { createSession } from "@/lib/session";
export async function login(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");
  const user = await prisma.user.findUnique({
    where: { email: email as string },
  });
  if (user && bcrypt.compareSync(password as string, user.password)) {
    await createSession(user.id);
    redirect("/");
  }
}
```

### 在服务端生成JWT并写入用户的cookies中

1. 生成一个密钥，并存储在环境变量中
2. 利用 `Jose` 提供的能力加密和解密session数据
3. 使用 `cookies` api管理 cookies

可以用openssl来生成一个32位随机字符作为密钥并存储在环境变量中，后面可以用该密钥来加密和解密JWT数据。

```bash
openssl rand -base64 32
```

将生成的密钥写入环境变量

```bash
//.env
SESSION_SECRET=your_secret_key

```

利用jose提供加解密算法并根据用户信息创建session

```bash
// src/libs/sessiont.ts
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
type JWTPayload = {
  userId: string;
  expiresAt: Date;
};
export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}
export async function decrypt(session: string | undefined = ""): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as JWTPayload;
  } catch (error) {
    console.log("Failed to verify session " + error);
  }
}
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}
```

### 在Data Access Layer(DAL)层验证JWT

```jsx
// app/lib/dal.ts

import 'server-only'
 import {cache} from 'react';
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: session.userId }
})
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null
 
  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })
 
    const user = data[0]
 
    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

接下来就可以在data requests, server action, router handler中调用verifySession来验证用户信息了

### 在Server component中

比如说阻止未登录用户访问adminDashboard

```jsx
// app/admin/page.tsx
import { verifySession } from '@/app/lib/dal'
 
export default function Dashboard() {
  const session = await verifySession()
  
    if (!session?.userId) {
	    redirect('/login')
	  }
    return <AdminDashboard />

}
```

### 在server action中

备注： nextjs中的server action和 react 19中的server function 应该是一回事

比如检查用户权限进行敏感数据库操作

```jsx
'use server'
import { verifySession } from '@/app/lib/dal'
 
export async function serverAction(formData: FormData) {
  const session = await verifySession()
  const userRole = session?.user?.role
 
  // Return early if user is not authorized to perform the action
 if (!session?.userId) {
	    redirect('/login')
	  }
 
  // Proceed with the action for authorized users
}
```

### 路由处理

```jsx
//app/api/route.ts

import { verifySession } from '@/app/lib/dal'
 
export async function GET() {
  // User authentication and role verification
  const session = await verifySession()
 
  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    return new Response(null, { status: 401 })
  }

  // Continue for authorized users
}
```

## 小结

以上，基本实现了用户认证系统的搭建。 从创建登录表单开始， 到使用JWT将认证信息存储在用户处的cookie中，需要时将cookie带入服务器端进行解密，从而阻止非授权用户访问登录页面或者获取敏感数据。所有的基本流程已经结束，通过此文，能够完成身份认证的大部分流程，对于我的博客系统已经基本够用了。

当然对于别的大型系统来说，面临的应用场景更加复杂，但也可以在此基础上扩展出所需要的功能。

## 参考文献

本文主要参考自nextjs官方的的文档基于nextjs15.1.2,
[https://nextjs.org/docs/app/building-your-application/authentication#authentication](https://nextjs.org/docs/app/building-your-application/authentication#authentication)

对一些关键之处结合我的个人需求做了一些更新。