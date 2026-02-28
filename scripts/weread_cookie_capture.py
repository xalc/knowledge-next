"""
mitmproxy 脚本：自动抓取微信读书 i.weread.qq.com 的认证信息
移动端 App 使用 HTTP Headers (vid, accessToken) 而非 Cookie 认证
用法：mitmdump -s scripts/weread_cookie_capture.py
"""

import json
import os
import subprocess
from datetime import datetime
from mitmproxy import http, ctx

SCRIPT_DIR = os.path.dirname(__file__)
HEADERS_FILE = os.path.join(SCRIPT_DIR, "weread_headers.json")
COOKIE_FILE = os.path.join(SCRIPT_DIR, "weread_cookie.txt")
CAPTURED = False

# 移动端 App 认证相关的 Header 字段
AUTH_HEADERS = ["vid", "accesstoken", "skey", "wr_skey", "wr_vid", "baseapi", "appver", "osver"]


def parse_cookie_string(cookie_str: str) -> dict:
    cookie_map = {}
    if not cookie_str:
        return cookie_map

    # 同时兼容逗号和分号分隔的 cookie 串
    parts = [p.strip() for p in cookie_str.replace(",", ";").split(";") if p.strip()]
    for part in parts:
        if "=" not in part:
            continue
        key, value = part.split("=", 1)
        key = key.strip()
        value = value.strip()
        if key:
            # 后出现的值覆盖前面的值，便于去重
            cookie_map[key] = value

    return cookie_map


def build_standard_cookie(cookie_map: dict) -> str:
    # 优先按固定顺序输出关键字段
    preferred_order = ["wr_vid", "wr_skey", "wr_fp", "wr_theme"]
    ordered_pairs = []

    for key in preferred_order:
        value = cookie_map.get(key)
        if value:
            ordered_pairs.append(f"{key}={value}")

    # 其余字段按 key 排序，避免丢信息
    extra_keys = sorted([k for k in cookie_map.keys() if k not in preferred_order])
    for key in extra_keys:
        value = cookie_map.get(key)
        if value:
            ordered_pairs.append(f"{key}={value}")

    return "; ".join(ordered_pairs)


def copy_to_clipboard(text: str) -> bool:
    if not text:
        return False
    try:
        subprocess.run(["pbcopy"], input=text.encode("utf-8"), check=True)
        return True
    except Exception:
        return False


def request(flow: http.HTTPFlow) -> None:
    global CAPTURED

    if CAPTURED:
        return

    host = flow.request.pretty_host
    if "i.weread.qq.com" not in host:
        return

    # 收集所有请求头
    all_headers = dict(flow.request.headers)

    # 检查是否有认证相关的 header
    found_auth = {}
    for key, value in all_headers.items():
        if key.lower() in AUTH_HEADERS:
            found_auth[key] = value

    if not found_auth:
        return

    # 打印请求信息
    print("\n" + "=" * 70)
    print(f"🎯 捕获到 i.weread.qq.com 认证请求!")
    print(f"   URL: {flow.request.url}")
    print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"=" * 70)

    # 打印认证相关 Header
    print("\n🔑 认证 Headers:")
    for key, val in found_auth.items():
        display_val = val if len(val) < 50 else val[:47] + "..."
        print(f"   {key}: {display_val}")

    # 打印 Cookie（如有）
    cookie_header = all_headers.get("cookie", "")
    if cookie_header:
        print(f"\n🍪 Cookie: {cookie_header[:80]}{'...' if len(cookie_header) > 80 else ''}")

    # 构建可用于 API 请求的完整 header 集合
    useful_headers = {}
    lower_headers = {}
    for key, value in all_headers.items():
        lower_key = key.lower()
        lower_headers[lower_key] = value
        # 跳过 mitmproxy 内部和不需要的头
        if lower_key in ("host", "connection", "accept-encoding", "content-length"):
            continue
        useful_headers[key] = value

    # 构建标准化 Cookie：去重 + 分号分隔 + 固定关键字段顺序
    cookie_map = parse_cookie_string(cookie_header)
    vid = lower_headers.get("vid", "")
    skey = lower_headers.get("skey", "") or lower_headers.get("accesstoken", "")

    # 只有拿到 vid+skey 才认为抓包成功
    if not vid or not skey:
        print("⚠️  未检测到完整认证信息（vid/skey），继续等待...")
        return

    if vid:
        cookie_map["wr_vid"] = vid
    if skey:
        cookie_map["wr_skey"] = skey

    constructed_cookie = build_standard_cookie(cookie_map)

    # 保存完整 Headers 到 JSON
    save_data = {
        "captured_at": datetime.now().isoformat(),
        "url": flow.request.url,
        "auth_headers": found_auth,
        "all_headers": useful_headers,
        "original_cookie": cookie_header,
        "constructed_cookie": constructed_cookie,
    }

    with open(HEADERS_FILE, "w", encoding="utf-8") as f:
        json.dump(save_data, f, indent=2, ensure_ascii=False)

    # 也保存构建的 cookie 字符串
    with open(COOKIE_FILE, "w", encoding="utf-8") as f:
        f.write(constructed_cookie)

    print(f"\n✅ Headers 已保存到: {HEADERS_FILE}")
    print(f"✅ Cookie 已保存到: {COOKIE_FILE}")
    print(f"📏 标准化 Cookie: {constructed_cookie[:80]}{'...' if len(constructed_cookie) > 80 else ''}")

    copied = copy_to_clipboard(constructed_cookie)
    if copied:
        print("📋 已复制标准化 Cookie 到剪贴板")
    else:
        print("⚠️  复制到剪贴板失败，请手动从 weread_cookie.txt 复制")

    if not CAPTURED:
        CAPTURED = True
        print("\n" + "=" * 70)
        print("🎉 首次成功捕获认证信息！已自动复制并准备退出抓包")
        print("=" * 70)
        ctx.master.shutdown()
