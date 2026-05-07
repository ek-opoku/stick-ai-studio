"use client";

import { useState } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { createWalkCyclePose, type WalkCycleConfig } from "./walkCycle";

export function useWalkCycle(config: WalkCycleConfig = {}, enabled = true) {
  const [pose, setPose] = useState(() => createWalkCyclePose(0, config));

  useAnimationFrame(({ elapsedMs }) => {
    setPose(createWalkCyclePose(elapsedMs, config));
  }, enabled);

  return pose;
}
