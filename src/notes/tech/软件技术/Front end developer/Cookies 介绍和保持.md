# Cookies 介绍和保持

## 踩坑

Http 响应头中 设置headers参数时
在request端 需要设置 `cookie`
在response端需要设置  `Set-Cookie`

**用途**：`Set-Cookie` 是由服务器发送给客户端的响应头部，用于设置客户端的 cookie。

### Set-Cookie

- **用途**：`Set-Cookie` 是由服务器发送给客户端的响应头部，用于设置客户端的 cookie。
- **格式**：`Set-Cookie: key=value; [attribute]`
- **属性**：
    - `Expires=DATE`：指定 cookie 的过期时间。
    - `Max-Age=seconds`：指定 cookie 的最大生存时间（以秒为单位）。
    - `Domain=domain`：指定 cookie 的有效域名。
    - `Path=path`：指定 cookie 的有效路径。
    - `Secure`：指示 cookie 只应在 HTTPS 连接中发送。
    - `HttpOnly`：指示 cookie 不可通过 JavaScript 访问，增加安全性。
    - `SameSite=Strict|Lax|None`：控制 cookie 在跨站请求中的发送行为

### Cookie

- **用途**：`Cookie` 是由客户端发送给服务器的请求头部，用于将之前设置的 cookie 信息发送回服务器。
- **格式**：`Cookie: key1=value1; key2=value2`

### 通过API请求服务时如何保持cookies

当通过restapi请求服务端API时需要验证cookies， 如果每次都从浏览器里拷贝并替换最新的cookies，那么对自动化的爬取数据来说是一项挑战。所以需要在和服务器确认连接的时候更新cookies，重新同步过期时间以及cookies数据。 以免cookies失效杯服务器拒绝服务。

在javascript中可以使用 `tough-cookie` 来解决上述问题。

```jsx
import { Cookie, CookieJar } from 'tough-cookie'
let cookieJar = new CookieJar();
let cookieStr = '' //从浏览器拷贝的cookies，可以存在数据库中，或者别的地方，可多次利用

cookieStr.split(';')
    .forEach(async (c) => {
        let cookie = Cookie.parse(c)
        cookieJar.setCookie(cookie, URL)
    });
// shi用cookieStr去fetch服务端数据，得到返回的cookieheader并解析
const cookieHeaders = response.headers.get('Set-Cookie');
const resCookies = Cookie.parse(cookieHeaders);
cookieJar.setCookie(resCookies, URL)

//在接下来数据请求时，将cookie解析成str传递到header中
 const cookies = await cookieJar.getCookies(URL)；
 const newCookieStr = cookies.map(c => c.cookieString()).join(';');
//在将用新的cookie去配置请求头，去请求服务端数据。
//切记 需要添加 credentials 头
const response = await fetch(url, {
            headers: {

                "cookie": newCookieStr ,
                'Content-type': 'application/json'
            },
            credentials: 'include',
        });
```