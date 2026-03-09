"use client";

import { useEffect } from "react";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

export default function LocalServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!LOCAL_HOSTS.has(window.location.hostname)) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then(registrations =>
          Promise.all(registrations.map(registration => registration.unregister())),
        )
        .catch(error => {
          console.warn("[pwa] failed to unregister local service workers", error);
        });
    }

    if ("caches" in window) {
      caches
        .keys()
        .then(keys => Promise.all(keys.map(key => caches.delete(key))))
        .catch(error => {
          console.warn("[pwa] failed to clear local caches", error);
        });
    }
  }, []);

  return null;
}
