"use client";

import { motionLibrary } from "./motionSystem";
import { StickFigure } from "./StickFigure";
import { useMotionPlayer } from "./useMotionPlayer";
import type { MotionPresetName } from "./motionSystem";
import type { StickFigureColorConfig } from "./types";

type StickFigureMotionPreviewProps = {
  colors?: StickFigureColorConfig;
  motion?: MotionPresetName;
  playbackSpeed?: number;
  size?: number;
};

export function StickFigureMotionPreview({
  colors,
  motion = "walk",
  playbackSpeed = 1,
  size = 220
}: StickFigureMotionPreviewProps) {
  const pose = useMotionPlayer(motionLibrary[motion], { speed: playbackSpeed });

  return <StickFigure colors={colors} pose={pose} size={size} />;
}
