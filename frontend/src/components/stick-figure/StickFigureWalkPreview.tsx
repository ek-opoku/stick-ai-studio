"use client";

import { StickFigure } from "./StickFigure";
import { useWalkCycle } from "./useWalkCycle";
import type { StickFigureColorConfig } from "./types";
import type { WalkCycleConfig } from "./walkCycle";

const defaultPreviewConfig: WalkCycleConfig = {
  speed: 1.15,
  easing: "smoothstep",
  hipBounce: 6,
  armSwing: 30
};

type StickFigureWalkPreviewProps = {
  colors?: StickFigureColorConfig;
  config?: WalkCycleConfig;
  size?: number;
};

export function StickFigureWalkPreview({
  colors,
  config = defaultPreviewConfig,
  size = 220
}: StickFigureWalkPreviewProps) {
  const pose = useWalkCycle(config);

  return <StickFigure colors={colors} pose={pose} size={size} />;
}
