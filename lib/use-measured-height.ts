import { useLayoutEffect, useRef, useState } from "react";

/**
 * Tracks the rendered height of an element so a wrapper can animate
 * `transition-[height]` between content changes. Attach the returned ref to the
 * content, and apply the height to its overflow-hidden parent.
 *
 * Height is measured synchronously after every render, so a content change from the
 * caller's own state is picked up before paint. The observer covers resizes that do
 * not go through React, such as the window width changing. Height is null until the
 * first measurement, which lets the wrapper render at its natural size on the server.
 */
export function useMeasuredHeight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element) setHeight(element.offsetHeight);
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, height] as const;
}
