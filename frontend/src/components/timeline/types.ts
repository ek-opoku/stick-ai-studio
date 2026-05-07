import type { MotionPresetName } from "@/components/stick-figure";

export type TimelineClip = {
  id: string;
  motionId: MotionPresetName;
  startMs: number;
  endMs: number;
  blendInMs: number;
  blendOutMs: number;
  label?: string;
};

export type Timeline = {
  id: string;
  name: string;
  clips: TimelineClip[];
  durationMs: number;
  loop: boolean;
};

export type PlaybackState = {
  currentTimeMs: number;
  playing: boolean;
  speed: number;
};

export const clipColors: Record<MotionPresetName, string> = {
  walk: "#4f6f52",
  run: "#2563eb",
  jump: "#f59e0b",
  sit: "#8b5cf6",
  wave: "#ec4899",
  point: "#14b8a6",
  laugh: "#f97316",
  cry: "#6366f1"
};
