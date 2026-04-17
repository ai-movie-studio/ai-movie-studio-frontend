import { useEffect, useRef } from "react";

/**
 * Poll a callback at a fixed interval. Automatically stops
 * when `enabled` becomes false (e.g. all jobs are terminal).
 */
export function usePolling(
  callback: () => void,
  intervalMs: number,
  enabled = true,
) {
  const saved = useRef(callback);
  useEffect(() => { saved.current = callback; }, [callback]);

  useEffect(() => {
    if (!enabled) return;
    saved.current();                      // fire immediately
    const id = setInterval(() => saved.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
