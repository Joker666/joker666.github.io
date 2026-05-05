"use client";

import { useEffect } from "react";

const readTrackerUrl = process.env.NEXT_PUBLIC_READ_TRACKER_URL;
const readerStorageKey = "joker666.readerId";
const engagementMs = 15_000;
const scrollThreshold = 0.6;

function getReaderId() {
  try {
    const existing = window.localStorage.getItem(readerStorageKey);
    if (existing) return existing;

    const id = window.crypto.randomUUID();
    window.localStorage.setItem(readerStorageKey, id);
    return id;
  } catch {
    return window.crypto.randomUUID();
  }
}

function sendTrackingEvent(slug: string, event: "start" | "read") {
  if (!readTrackerUrl) {
    console.warn("Read tracker URL not configured");
    return;
  }

  const body = JSON.stringify({
    slug,
    readerId: getReaderId(),
    event,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(readTrackerUrl, blob);
    return;
  }

  void fetch(readTrackerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  });
}

function getScrollProgress() {
  const { documentElement } = document;
  const scrollableHeight = documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) return 1;

  return window.scrollY / scrollableHeight;
}

export function ReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!readTrackerUrl) return;

    let sent = false;
    let activeMs = 0;
    let lastTick = performance.now();

    const markRead = () => {
      if (sent) return;

      sent = true;
      sendTrackingEvent(slug, "read");
    };

    const updateActiveTime = () => {
      const now = performance.now();

      if (document.visibilityState === "visible") {
        activeMs += now - lastTick;
      }

      lastTick = now;

      if (activeMs >= engagementMs) {
        markRead();
      }
    };

    const onScroll = () => {
      if (getScrollProgress() >= scrollThreshold) {
        markRead();
      }
    };

    const interval = window.setInterval(updateActiveTime, 1_000);

    sendTrackingEvent(slug, "start");
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", updateActiveTime);
    onScroll();

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", updateActiveTime);
    };
  }, [slug]);

  return null;
}
