"use client";

import { useCallback, useRef, useState } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { evaluateTimeline } from "@/components/timeline/timelineEngine";
import type { StickPose } from "@/components/stick-figure";
import type { Timeline } from "@/components/timeline/types";

export type TimelinePlayerControls = {
  pose: StickPose;
  currentTimeMs: number;
  playing: boolean;
  speed: number;
  durationMs: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (timeMs: number) => void;
  setSpeed: (speed: number) => void;
};

export function useTimelinePlayer(timeline: Timeline): TimelinePlayerControls {
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [pose, setPose] = useState(() => evaluateTimeline(timeline, 0));

  // Track accumulated time separately from render cycles
  const accumulatedRef = useRef(0);
  const seekingRef = useRef(false);

  useAnimationFrame(({ deltaMs }) => {
    if (seekingRef.current) {
      seekingRef.current = false;
      return;
    }

    const newTime = accumulatedRef.current + deltaMs * speed;
    const resolvedTime = timeline.loop
      ? ((newTime % timeline.durationMs) + timeline.durationMs) % timeline.durationMs
      : Math.min(newTime, timeline.durationMs);

    accumulatedRef.current = resolvedTime;
    setCurrentTimeMs(resolvedTime);
    setPose(evaluateTimeline(timeline, resolvedTime));

    // Stop at end if not looping
    if (!timeline.loop && resolvedTime >= timeline.durationMs) {
      setPlaying(false);
    }
  }, playing);

  const play = useCallback(() => {
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setPlaying(false);
    accumulatedRef.current = 0;
    setCurrentTimeMs(0);
    setPose(evaluateTimeline(timeline, 0));
  }, [timeline]);

  const seek = useCallback(
    (timeMs: number) => {
      const clamped = Math.max(0, Math.min(timeMs, timeline.durationMs));
      seekingRef.current = true;
      accumulatedRef.current = clamped;
      setCurrentTimeMs(clamped);
      setPose(evaluateTimeline(timeline, clamped));
    },
    [timeline]
  );

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
  }, []);

  return {
    pose,
    currentTimeMs,
    playing,
    speed,
    durationMs: timeline.durationMs,
    play,
    pause,
    stop,
    seek,
    setSpeed
  };
}
