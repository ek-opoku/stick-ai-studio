import type { MotionPresetName } from "../../../frontend/src/components/stick-figure/motionSystem";
import type {
  StickFigureColorConfig,
  StickPose
} from "../../../frontend/src/components/stick-figure/types";

export type RenderSceneLoopMode = "loop" | "once";

export type RenderSceneLayer = {
  id: string;
  name: string;
  zIndex: number;
  opacity?: number;
};

export type RenderSceneMotionClip = {
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

export type RenderSceneCharacter = {
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
  clips: RenderSceneMotionClip[];
};

export type RenderSceneDefinition = {
  id: string;
  name: string;
  width: number;
  height: number;
  durationMs: number;
  loop?: RenderSceneLoopMode;
  layers: RenderSceneLayer[];
  characters: RenderSceneCharacter[];
};

export type RenderSceneCharacterFrame = {
  character: RenderSceneCharacter;
  pose: StickPose;
};

export type RenderSceneLayerFrame = {
  layer: RenderSceneLayer;
  characters: RenderSceneCharacterFrame[];
};

export type RenderSceneFrame = {
  sceneId: string;
  timeMs: number;
  durationMs: number;
  layers: RenderSceneLayerFrame[];
};
