"use client";

import { useEffect, useRef } from "react";

type AnimationFrameCallback = (state: {
  elapsedMs: number;
  deltaMs: number;
  timestampMs: number;
}) => void;

export function useAnimationFrame(callback: AnimationFrameCallback, enabled = true) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const previousRef = useRef<number | null>(null);

  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function tick(timestampMs: number) {
      startRef.current ??= timestampMs;
      previousRef.current ??= timestampMs;

      const elapsedMs = timestampMs - startRef.current;
      const deltaMs = timestampMs - previousRef.current;
      previousRef.current = timestampMs;

      callbackRef.current({ elapsedMs, deltaMs, timestampMs });
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = null;
      startRef.current = null;
      previousRef.current = null;
    };
  }, [enabled]);
}
