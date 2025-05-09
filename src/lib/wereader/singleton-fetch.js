import { WEREAD_URL } from "./constant.js";
import { Cookie, CookieJar } from "tough-cookie";
import { getWRToken } from "./wr-db.ts";
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
    const response = await fetch(WEREAD_URL, {
      method: "get",
      headers: {
        cookie: this.cookieStr,
        "content-type": "application/json",
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`fetch URL ${WEREAD_URL} failed with : + ${response.statusText}`);
    }

    const cookieHeaders = response.headers.get("Set-Cookie");
    const resCookies = Cookie.parse(cookieHeaders);
    await this.cookieJar.setCookie(resCookies, WEREAD_URL);
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
  await fetch.syncCookies(WEREAD_URL);
  return () => fetch;
};
//When the project initial , the fetchInstance is executed,this should improve.
const Singleton = (await fetchInstance())();
// const Singleton = await fetchInstance();
export default Singleton;
