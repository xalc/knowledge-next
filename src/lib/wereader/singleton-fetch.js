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
    this.cookieStr = cookieStr || "";
    if (!this.cookieStr) {
      return;
    }
    cookieStr
      .split(";")
      .map(c => c.trim())
      .filter(Boolean)
      .forEach(async c => {
        const cookie = Cookie.parse(c);
        if (cookie) {
          await this.cookieJar.setCookie(cookie, WEREAD_URL);
        }
      });
  }

  async syncCookies() {
    if (!this.cookieJar) {
      await this.init();
    }
    const initialCookiesForSync = await this.cookieJar.getCookies(WEREAD_URL);
    const initialCookieStringForSync = initialCookiesForSync.map(c => c.cookieString()).join("; ");
    if (!initialCookieStringForSync) {
      throw new Error("WeRead cookie is missing. Update cookie token first.");
    }

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
      // 支持多个 Set-Cookie 头（Node Fetch 会用逗号拼接）
      const cookiesToSet = Array.isArray(cookieHeaders)
        ? cookieHeaders
        : cookieHeaders
            .split(/,(?=[^;]+=[^;]+)/)
            .map(header => header.trim())
            .filter(Boolean);
      for (const cookieHeader of cookiesToSet) {
        try {
          const resCookie = Cookie.parse(cookieHeader);
          if (resCookie) {
            await this.cookieJar.setCookie(resCookie, WEREAD_URL);
          }
        } catch (e) {
          console.error("Failed to parse or set cookie from Set-Cookie header:", cookieHeader, e);
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
  /**
   * Parse vid/skey from cookie string for mobile API auth (i.weread.qq.com)
   */
  _parseMobileAuth() {
    const cookieMap = {};
    if (this.cookieStr) {
      this.cookieStr.split(";").forEach(pair => {
        const [key, ...vals] = pair.trim().split("=");
        if (key) cookieMap[key.trim()] = vals.join("=").trim();
      });
    }
    return {
      vid: cookieMap["wr_vid"] || "",
      skey: cookieMap["wr_skey"] || "",
    };
  }

  async request(url) {
    if (!this.cookieJar) {
      await this.init();
    }

    const isMobileApi = url.includes("i.weread.qq.com");
    const headers = { "Content-type": "application/json" };

    if (isMobileApi) {
      // Mobile API: use vid/skey HTTP headers
      const { vid, skey } = this._parseMobileAuth();
      if (!vid || !skey) {
        throw new Error("WeRead mobile auth missing. Set wr_vid and wr_skey in cookie token.");
      }
      headers.vid = vid;
      headers.skey = skey;
      headers["User-Agent"] = "WeRead/10.0.3 (iPhone; iOS 26.3; Scale/3.00)";
      if (this.cookieStr) {
        headers.cookie = this.cookieStr;
      }
    } else {
      // Web API: use cookie-based auth
      try {
        await this.syncCookies();
      } catch (error) {
        console.error("syncCookies failed:", error);
      }
      const cookies = await this.cookieJar.getCookies(WEREAD_URL);
      const updatedCookie = cookies.map(c => c.cookieString()).join(";");
      if (!updatedCookie) {
        throw new Error("WeRead cookie is missing. Update cookie token first.");
      }
      headers.cookie = updatedCookie;
      headers["User-Agent"] =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
    }

    const response = await fetch(url, {
      headers,
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

let singletonPromise = null;

const getSingleton = async () => {
  if (!singletonPromise) {
    singletonPromise = (async () => {
      const fetchClient = new MyFetch();
      await fetchClient.init();
      return fetchClient;
    })();
  }
  return singletonPromise;
};

const Singleton = {
  async request(url) {
    const fetchClient = await getSingleton();
    return await fetchClient.request(url);
  },
};

export default Singleton;
