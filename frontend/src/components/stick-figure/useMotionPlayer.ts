"use client";

import { useState } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { sampleMotion } from "./motionSystem";
import type { MotionDefinition } from "./types";

export type MotionPlayerOptions = {
  speed?: number;
  enabled?: boolean;
};

export function useMotionPlayer(
  motion: MotionDefinition,
  { speed = 1, enabled = true }: MotionPlayerOptions = {}
) {
  const [pose, setPose] = useState(() => sampleMotion(motion, 0));

  useAnimationFrame(({ elapsedMs }) => {
    setPose(sampleMotion(motion, elapsedMs * speed));
  }, enabled);

  return pose;
}
