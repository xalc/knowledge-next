"use client";

import { useEffect } from "react";

/**
 * 在有未保存内容时拦截页面离开。
 *
 * Next 15 App Router 没有 router.events，无法用传统方式拦截客户端导航。
 * 此 hook 采用两层防护：
 * 1. beforeunload — 拦截浏览器级离开（刷新、关闭标签页、地址栏跳转）
 * 2. patch history.pushState/replaceState + popstate — 拦截客户端软导航
 *
 * 注意：history patching 是 App Router 下的妥协方案，仅在 dirty 时生效，
 * 卸载时恢复原始方法。
 */
export function useLeaveGuard(dirty: boolean, message = "有未保存的草稿，确定离开？") {
  // Layer 1: browser-level navigation (refresh, close, URL bar)
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Layer 2: client-side soft navigation (Link clicks, router.push)
  useEffect(() => {
    if (!dirty) return;

    const pushState = history.pushState;
    const replaceState = history.replaceState;

    const intercept =
      (original: typeof history.pushState) =>
      (...args: Parameters<typeof history.pushState>) => {
        if (!window.confirm(message)) return;
        return original.apply(history, args);
      };

    history.pushState = intercept(pushState);
    history.replaceState = intercept(replaceState);

    const onPopState = () => {
      if (!window.confirm(message)) {
        // 用户取消，推回当前 URL 阻止后退
        history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      history.pushState = pushState;
      history.replaceState = replaceState;
      window.removeEventListener("popstate", onPopState);
    };
  }, [dirty, message]);
}
