"use client";

import { useCallback, useRef, useState } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { sampleScene } from "./sceneEngine";
import type { SceneDefinition, SceneFrame } from "./types";

export type ScenePlayerControls = {
  frame: SceneFrame;
  currentTimeMs: number;
  durationMs: number;
  playing: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (timeMs: number) => void;
  setSpeed: (speed: number) => void;
};

export function useScenePlayer(scene: SceneDefinition, autoplay = true): ScenePlayerControls {
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [speed, setSpeedState] = useState(1);
  const [frame, setFrame] = useState(() => sampleScene(scene, 0));
  const elapsedRef = useRef(0);

  useAnimationFrame(({ deltaMs }) => {
    const nextTimeMs = elapsedRef.current + deltaMs * speed;
    elapsedRef.current = nextTimeMs;
    const nextFrame = sampleScene(scene, nextTimeMs);

    setCurrentTimeMs(nextFrame.timeMs);
    setFrame(nextFrame);

    if (scene.loop === "once" && nextFrame.timeMs >= scene.durationMs) {
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
    elapsedRef.current = 0;
    setCurrentTimeMs(0);
    setFrame(sampleScene(scene, 0));
    setPlaying(false);
  }, [scene]);

  const seek = useCallback(
    (timeMs: number) => {
      elapsedRef.current = Math.max(0, Math.min(timeMs, scene.durationMs));
      const nextFrame = sampleScene(scene, elapsedRef.current);

      setCurrentTimeMs(nextFrame.timeMs);
      setFrame(nextFrame);
    },
    [scene]
  );

  const setSpeed = useCallback((nextSpeed: number) => {
    setSpeedState(nextSpeed);
  }, []);

  return {
    frame,
    currentTimeMs,
    durationMs: scene.durationMs,
    playing,
    speed,
    play,
    pause,
    stop,
    seek,
    setSpeed
  };
}
