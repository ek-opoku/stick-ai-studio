import type {
  MotionPresetName,
  StickFigureColorConfig,
  StickPose
} from "@/components/stick-figure";

export type SceneLoopMode = "loop" | "once";

export type SceneLayerDefinition = {
  id: string;
  name: string;
  zIndex: number;
  opacity?: number;
};

export type SceneMotionClip = {
  id: string;
  motionId: MotionPresetName;
  startMs: number;
  endMs: number;
  offsetMs?: number;
  speed?: number;
  blendInMs?: number;
  blendOutMs?: number;
  weight?: number;
};

export type SceneCharacterDefinition = {
  id: string;
  name: string;
  layerId: string;
  x: number;
  y: number;
  scale?: number;
  zIndex?: number;
  opacity?: number;
  colors?: StickFigureColorConfig;
  restPose?: StickPose;
  clips: SceneMotionClip[];
};

export type SceneDefinition = {
  id: string;
  name: string;
  width: number;
  height: number;
  durationMs: number;
  loop?: SceneLoopMode;
  layers: SceneLayerDefinition[];
  characters: SceneCharacterDefinition[];
};

export type SceneCharacterFrame = {
  character: SceneCharacterDefinition;
  pose: StickPose;
};

export type SceneLayerFrame = {
  layer: SceneLayerDefinition;
  characters: SceneCharacterFrame[];
};

export type SceneFrame = {
  sceneId: string;
  timeMs: number;
  durationMs: number;
  layers: SceneLayerFrame[];
};
