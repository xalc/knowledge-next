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


def log(level: str, message: str, **meta) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    prefix = f"[weread-cookie-capture] [{level}] [{now}]"
    if meta:
        print(f"{prefix} {message} {json.dumps(meta, ensure_ascii=False)}")
    else:
        print(f"{prefix} {message}")


def mask_value(value: str) -> str:
    if not value:
        return ""
    if len(value) <= 8:
        return "***"
    return f"{value[:4]}***{value[-4:]}"


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

    log("INFO", "Captured candidate auth request.", host=host, url=flow.request.url)
    log(
        "INFO",
        "Detected auth headers.",
        headerKeys=sorted(found_auth.keys()),
        headerPreview={k: mask_value(v) for k, v in found_auth.items()},
    )

    cookie_header = all_headers.get("cookie", "")
    log("INFO", "Cookie header inspected.", hasCookie=bool(cookie_header), cookieLength=len(cookie_header))

    lower_headers = {}
    for key, value in all_headers.items():
        lower_key = key.lower()
        lower_headers[lower_key] = value

    # 构建标准化 Cookie：去重 + 分号分隔 + 固定关键字段顺序
    cookie_map = parse_cookie_string(cookie_header)
    vid = lower_headers.get("vid", "")
    skey = lower_headers.get("skey", "") or lower_headers.get("accesstoken", "")

    # 只有拿到 vid+skey 才认为抓包成功
    if not vid or not skey:
        log("WARN", "Incomplete mobile auth headers, waiting for next request.", hasVid=bool(vid), hasSkey=bool(skey))
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
        "auth_header_keys": sorted(found_auth.keys()),
        "auth_headers_masked": {k: mask_value(v) for k, v in found_auth.items()},
        "cookie_length": len(cookie_header),
        "constructed_cookie_length": len(constructed_cookie),
        "constructed_cookie_preview": mask_value(constructed_cookie),
    }

    with open(HEADERS_FILE, "w", encoding="utf-8") as f:
        json.dump(save_data, f, indent=2, ensure_ascii=False)

    # 也保存构建的 cookie 字符串
    with open(COOKIE_FILE, "w", encoding="utf-8") as f:
        f.write(constructed_cookie)

    log("INFO", "Capture metadata written.", file=HEADERS_FILE)
    log("INFO", "Standardized cookie written.", file=COOKIE_FILE, cookieLength=len(constructed_cookie))

    copied = copy_to_clipboard(constructed_cookie)
    if copied:
        log("INFO", "Standardized cookie copied to clipboard.")
    else:
        log("WARN", "Clipboard copy failed. Use weread_cookie.txt instead.")

    if not CAPTURED:
        CAPTURED = True
        log("INFO", "First successful capture completed. Shutting down mitmproxy.")
        ctx.master.shutdown()
