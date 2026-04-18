"""
mitmproxy 脚本：自动抓取微信读书 i.weread.qq.com 的认证信息
移动端 App 使用 HTTP Headers (vid, accessToken) 而非 Cookie 认证
用法：mitmdump -s scripts/weread_cookie_capture.py
"""

import json
import os
import signal
import subprocess
from datetime import datetime
from mitmproxy import http, ctx

SCRIPT_DIR = os.path.dirname(__file__)
HEADERS_FILE = os.path.join(SCRIPT_DIR, "weread_headers.json")
COOKIE_FILE = os.path.join(SCRIPT_DIR, "weread_cookie.txt")
SUMMARY_PROBE_FILE = os.path.join(SCRIPT_DIR, "weread_summary_probe.jsonl")
ENDPOINT_PROBE_FILE = os.path.join(SCRIPT_DIR, "weread_endpoint_probe.jsonl")
CAPTURED = False
REQUEST_COUNT = 0
TARGET_HOST_HIT_COUNT = 0
FIRST_CLIENT_LOGGED = False
NON_TARGET_LOG_LIMIT = 8
CAPTURE_COUNT = 0
LAST_CAPTURED_COOKIE = ""
PENDING_AUTH_FLOWS = {}

# 默认开启：避免误触 Ctrl+C 立即中断。可通过 WEREAD_IGNORE_SIGINT=0 关闭。
IGNORE_SIGINT = os.getenv("WEREAD_IGNORE_SIGINT", "1").lower() in {"1", "true", "yes", "on"}
# 默认关闭自动终止，持续抓包。可通过 WEREAD_CAPTURE_AUTO_SHUTDOWN=1 开启。
AUTO_SHUTDOWN = os.getenv("WEREAD_CAPTURE_AUTO_SHUTDOWN", "0").lower() in {
    "1",
    "true",
    "yes",
    "on",
}
MAX_CAPTURES = int(os.getenv("WEREAD_MAX_CAPTURES", "1" if AUTO_SHUTDOWN else "0"))
# 避免重复写入同一组 token 造成“看起来在抓包、其实没变化”的误判
REQUIRE_COOKIE_CHANGE = os.getenv("WEREAD_REQUIRE_COOKIE_CHANGE", "1").lower() in {
    "1",
    "true",
    "yes",
    "on",
}

# 移动端 App 认证相关的 Header 字段
AUTH_HEADERS = ["vid", "accesstoken", "skey", "wr_skey", "wr_vid", "baseapi", "appver", "osver", "basever", "channelid", "v"]


def mask_header_value(key: str, value: str) -> str:
    if not value:
        return ""
    if key.lower() in {"cookie", "skey", "accesstoken", "authorization"}:
        return mask_value(value)
    return value


def append_summary_probe(flow: http.HTTPFlow, status: int, errcode, parsed) -> None:
    if "i.weread.qq.com/readdata/summary" not in flow.request.url:
        return

    headers = dict(flow.request.headers)
    masked_headers = {k: mask_header_value(k, v) for k, v in headers.items()}
    payload = {
        "captured_at": datetime.now().isoformat(),
        "url": flow.request.url,
        "method": flow.request.method,
        "status": status,
        "errcode": errcode,
        "response_ok": status is not None and 200 <= int(status) < 300,
        "request_headers_masked": masked_headers,
        "response_keys": sorted(list(parsed.keys()))[:20] if isinstance(parsed, dict) else [],
    }

    with open(SUMMARY_PROBE_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(payload, ensure_ascii=False) + "\n")

    log("INFO", "Summary probe recorded.", file=SUMMARY_PROBE_FILE, status=status, errcode=errcode)


def append_endpoint_probe(flow: http.HTTPFlow, status: int, errcode, parsed) -> None:
    if "i.weread.qq.com" not in flow.request.url:
        return
    if status is None or int(status) < 200 or int(status) >= 300:
        return

    payload = {
        "captured_at": datetime.now().isoformat(),
        "method": flow.request.method,
        "url": flow.request.url,
        "host": flow.request.pretty_host,
        "path": flow.request.path,
        "status": status,
        "errcode": errcode,
        "response_keys": sorted(list(parsed.keys()))[:20] if isinstance(parsed, dict) else [],
    }

    with open(ENDPOINT_PROBE_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(payload, ensure_ascii=False) + "\n")


def parse_json_safe(text: str):
    if not text:
        return None
    try:
        return json.loads(text)
    except Exception:
        return None


def persist_capture(flow: http.HTTPFlow, found_auth: dict, cookie_header: str, cookie_map: dict, vid: str, skey: str) -> bool:
    global CAPTURED, CAPTURE_COUNT, LAST_CAPTURED_COOKIE

    lower_headers = {k.lower(): v for k, v in found_auth.items()}

    if vid:
        cookie_map["wr_vid"] = vid
    if skey:
        cookie_map["wr_skey"] = skey
        cookie_map["wr_access_token"] = skey
    if lower_headers.get("basever"):
        cookie_map["wr_basever"] = lower_headers.get("basever")
    if lower_headers.get("channelid"):
        cookie_map["wr_channelid"] = lower_headers.get("channelid")
    if lower_headers.get("v"):
        cookie_map["wr_appver"] = lower_headers.get("v")

    constructed_cookie = build_standard_cookie(cookie_map)

    if REQUIRE_COOKIE_CHANGE and LAST_CAPTURED_COOKIE and constructed_cookie == LAST_CAPTURED_COOKIE:
        log("INFO", "Same cookie captured again, skip duplicate write.")
        return False

    save_data = {
        "captured_at": datetime.now().isoformat(),
        "url": flow.request.url,
        "auth_header_keys": sorted(found_auth.keys()),
        "auth_headers_masked": {k: mask_value(v) for k, v in found_auth.items()},
        "normalized_auth_fields": {
            "vid": mask_value(vid),
            "skey": mask_value(skey),
            "accessToken": mask_value(lower_headers.get("accesstoken", "")),
            "basever": lower_headers.get("basever", ""),
            "channelid": lower_headers.get("channelid", ""),
            "v": lower_headers.get("v", ""),
        },
        "cookie_length": len(cookie_header),
        "constructed_cookie_length": len(constructed_cookie),
        "constructed_cookie_preview": mask_value(constructed_cookie),
    }

    with open(HEADERS_FILE, "w", encoding="utf-8") as f:
        json.dump(save_data, f, indent=2, ensure_ascii=False)

    with open(COOKIE_FILE, "w", encoding="utf-8") as f:
        f.write(constructed_cookie)

    log("INFO", "Capture metadata written.", file=HEADERS_FILE)
    log("INFO", "Standardized cookie written.", file=COOKIE_FILE, cookieLength=len(constructed_cookie))

    copied = copy_to_clipboard(constructed_cookie)
    if copied:
        log("INFO", "Standardized cookie copied to clipboard.")
    else:
        log("WARN", "Clipboard copy failed. Use weread_cookie.txt instead.")

    CAPTURED = True
    CAPTURE_COUNT += 1
    LAST_CAPTURED_COOKIE = constructed_cookie
    log("INFO", "Successful capture completed.", captureCount=CAPTURE_COUNT)

    if AUTO_SHUTDOWN and MAX_CAPTURES > 0 and CAPTURE_COUNT >= MAX_CAPTURES:
        log("INFO", "Auto shutdown condition reached. Shutting down mitmproxy.")
        ctx.master.shutdown()

    return True


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


def get_client_addr(flow: http.HTTPFlow) -> str:
    client_conn = getattr(flow, "client_conn", None)
    if not client_conn:
        return "unknown"

    peername = getattr(client_conn, "peername", None)
    if not peername:
        return "unknown"

    try:
        ip, port = peername[0], peername[1]
        return f"{ip}:{port}"
    except Exception:
        return str(peername)


def load(loader):
    if IGNORE_SIGINT:
        try:
            signal.signal(signal.SIGINT, signal.SIG_IGN)
            log("INFO", "SIGINT shield enabled. Accidental Ctrl+C will be ignored.")
        except Exception as error:
            log("WARN", "Failed to enable SIGINT shield.", error=str(error))

    log("INFO", "Mitm capture script loaded.")
    log("INFO", "Waiting for mobile traffic via proxy 0.0.0.0:8080 ...")
    log("INFO", "If no traffic appears, check iPhone Wi-Fi proxy + certificate trust.")


def running():
    log("INFO", "Proxy is running. Open WeRead App on your phone now.")
    log(
        "INFO",
        "Capture mode configured.",
        autoShutdown=AUTO_SHUTDOWN,
        maxCaptures=MAX_CAPTURES,
        requireCookieChange=REQUIRE_COOKIE_CHANGE,
        ignoreSigint=IGNORE_SIGINT,
    )


def request(flow: http.HTTPFlow) -> None:
    global CAPTURED, REQUEST_COUNT, TARGET_HOST_HIT_COUNT, FIRST_CLIENT_LOGGED

    REQUEST_COUNT += 1
    host = flow.request.pretty_host
    client_addr = get_client_addr(flow)

    if not FIRST_CLIENT_LOGGED:
        FIRST_CLIENT_LOGGED = True
        log(
            "INFO",
            "First proxied request received. Your phone traffic has reached mitmproxy.",
            client=client_addr,
            host=host,
            method=flow.request.method,
            path=flow.request.path,
        )

    if REQUEST_COUNT <= NON_TARGET_LOG_LIMIT and "i.weread.qq.com" not in host:
        log(
            "INFO",
            "Non-target request observed (proxy connectivity OK).",
            seq=REQUEST_COUNT,
            client=client_addr,
            host=host,
            method=flow.request.method,
        )

    if REQUEST_COUNT % 20 == 0:
        log(
            "INFO",
            "Traffic heartbeat.",
            totalRequests=REQUEST_COUNT,
            targetHostHits=TARGET_HOST_HIT_COUNT,
            captured=CAPTURED,
        )

    if "i.weread.qq.com" not in host:
        return

    TARGET_HOST_HIT_COUNT += 1

    log(
        "INFO",
        "Target host request observed.",
        seq=REQUEST_COUNT,
        targetHits=TARGET_HOST_HIT_COUNT,
        client=client_addr,
        method=flow.request.method,
        path=flow.request.path,
    )

    # 收集所有请求头
    all_headers = dict(flow.request.headers)

    # 检查是否有认证相关的 header
    found_auth = {}
    for key, value in all_headers.items():
        if key.lower() in AUTH_HEADERS:
            found_auth[key] = value

    if not found_auth:
        return

    log(
        "INFO",
        "Captured candidate auth request.",
        host=host,
        url=flow.request.url,
        client=client_addr,
    )
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
    skey = lower_headers.get("accesstoken", "") or lower_headers.get("skey", "")

    # 只有拿到 vid+skey 才认为抓包成功
    if not vid or not skey:
        log("WARN", "Incomplete mobile auth headers, waiting for next request.", hasVid=bool(vid), hasSkey=bool(skey))
        return

    PENDING_AUTH_FLOWS[flow.id] = {
        "found_auth": found_auth,
        "cookie_header": cookie_header,
        "cookie_map": cookie_map,
        "vid": vid,
        "skey": skey,
        "url": flow.request.url,
    }
    log("INFO", "Auth candidate cached. Waiting response validation.", flowId=flow.id)


def response(flow: http.HTTPFlow) -> None:
    candidate = PENDING_AUTH_FLOWS.pop(flow.id, None)
    if not candidate:
        return

    status = flow.response.status_code if flow.response else None
    body_text = ""
    try:
        body_text = flow.response.get_text(strict=False) if flow.response else ""
    except Exception:
        body_text = ""

    parsed = parse_json_safe(body_text)
    errcode = parsed.get("errcode") if isinstance(parsed, dict) else None

    append_summary_probe(flow, status, errcode, parsed)
    append_endpoint_probe(flow, status, errcode, parsed)

    if status == 401 or (errcode is not None and int(errcode) == -2012):
        log(
            "WARN",
            "Skip expired auth candidate based on response.",
            flowId=flow.id,
            status=status,
            errcode=errcode,
            url=candidate.get("url", ""),
        )
        return

    persist_capture(
        flow,
        candidate["found_auth"],
        candidate["cookie_header"],
        candidate["cookie_map"],
        candidate["vid"],
        candidate["skey"],
    )
