import { WEREAD_URL } from "./constant.js";
import { Cookie, CookieJar } from "tough-cookie";
import { getWRToken, updateWRToken } from "./wr-db.ts"; // 确保导入 updateWRToken
class MyFetch {
  constructor() {
    this.cookieJar = null;
    this.cookieStr = null;
  }

  async init() {
    this.cookieJar = new CookieJar();
    let cookieStr = await getWRToken();

    this.cookieStr = cookieStr;
    cookieStr.split(";").forEach(async c => {
      let cookie = Cookie.parse(c);
      await this.cookieJar.setCookie(cookie, WEREAD_URL);
    });
  }

  async syncCookies() {
    const initialCookiesForSync = await this.cookieJar.getCookies(WEREAD_URL);
    const initialCookieStringForSync = initialCookiesForSync.map(c => c.cookieString()).join("; ");

    const response = await fetch(WEREAD_URL, {
      method: "get",
      headers: {
        // 使用 cookieJar 中的当前 cookie 发送请求，而不是固定的 this.cookieStr
        // 或者，如果设计上 syncCookies 总是基于最初加载的 cookieStr 进行同步，则保留 this.cookieStr
        // cookie: this.cookieStr, // 原有方式
        cookie: initialCookieStringForSync, // 建议方式：使用 cookieJar 中的最新 cookie
        "content-type": "application/json",
        // "Content-type": "application/json", // 重复了，可以移除一个
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`fetch URL ${WEREAD_URL} failed with : + ${response.statusText}`);
    }

    const cookieHeaders = response.headers.get("Set-Cookie");
    if (cookieHeaders) {
      // 检查 cookieHeaders 是否存在
      // tough-cookie 的 Cookie.parse 在输入为 null 或 undefined 时可能会出问题
      // 并且 Set-Cookie 可能是一个数组，需要正确处理
      const cookiesToSet = Array.isArray(cookieHeaders) ? cookieHeaders : [cookieHeaders];
      for (const cookieHeader of cookiesToSet) {
        if (cookieHeader) {
          try {
            const resCookie = Cookie.parse(cookieHeader);
            if (resCookie) {
              await this.cookieJar.setCookie(resCookie, WEREAD_URL);
            }
          } catch (e) {
            console.error("Failed to parse or set cookie from Set-Cookie header:", cookieHeader, e);
          }
        }
      }

      // 获取更新后的完整 cookie 字符串
      const updatedCookies = await this.cookieJar.getCookies(WEREAD_URL);
      const newCookieString = updatedCookies.map(c => c.cookieString()).join("; ");

      // 更新 this.cookieStr (可选，取决于您是否希望 syncCookies 自身也使用最新 cookie)
      this.cookieStr = newCookieString;

      // 将新的 cookie 字符串同步回数据库
      try {
        await updateWRToken(newCookieString);
        console.log("Successfully updated cookies in the database.");
      } catch (dbError) {
        console.error("Failed to update cookies in the database:", dbError);
        // 根据需要处理数据库更新失败的情况
      }
    } else {
      console.log("No Set-Cookie header received from server during syncCookies.");
    }
  }
  async request(url) {
    const cookies = await this.cookieJar.getCookies(WEREAD_URL);
    const updatedCookie = cookies.map(c => c.cookieString()).join(";");
    const response = await fetch(url, {
      headers: {
        cookie: updatedCookie,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Content-type": "application/json",
      },
      credentials: "include",
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error(`fetch URL ${url} failed with : + ${response.statusText}`);
    }
    console.log(`fetch URL ${url} succeed`);

    return await response.json();
  }
}
const fetchInstance = async () => {
  const fetch = new MyFetch();

  await fetch.init();
  // await fetch.syncCookies(WEREAD_URL);
  return () => fetch;
};
//When the project initial , the fetchInstance is executed,this should improve.
const Singleton = (await fetchInstance())();
// const Singleton = await fetchInstance();
export default Singleton;
