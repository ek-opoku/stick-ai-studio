import {
  blendPoseFrames,
  getMotionPreset,
  sampleMotion,
  type MotionBlendLayer,
  type StickPose
} from "@/components/stick-figure";
import demoSceneJson from "./scenes/demo-scene.json";
import type {
  SceneCharacterDefinition,
  SceneCharacterFrame,
  SceneDefinition,
  SceneFrame,
  SceneMotionClip
} from "./types";

const idlePose: StickPose = {
  id: "scene-idle",
  name: "Scene Idle",
  body: { x: 0, y: 0 },
  head: { tilt: 0 },
  joints: {
    torso: 0,
    leftShoulder: 0,
    leftElbow: 0,
    rightShoulder: 0,
    rightElbow: 0,
    leftHip: 0,
    leftKnee: 0,
    rightHip: 0,
    rightKnee: 0
  }
};

export const sceneLibrary = {
  demo: demoSceneJson as SceneDefinition
};

export type ScenePresetName = keyof typeof sceneLibrary;

export function getScenePreset(name: ScenePresetName) {
  return sceneLibrary[name];
}

export function sampleScene(scene: SceneDefinition, rawTimeMs: number): SceneFrame {
  const timeMs = resolveSceneTime(rawTimeMs, scene.durationMs, scene.loop ?? "loop");
  const characterFrames = scene.characters.map((character) => sampleSceneCharacter(character, timeMs));
  const layers = [...scene.layers]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((layer) => ({
      layer,
      characters: characterFrames
        .filter((frame) => frame.character.layerId === layer.id)
        .sort((a, b) => (a.character.zIndex ?? 0) - (b.character.zIndex ?? 0))
    }));

  return {
    sceneId: scene.id,
    timeMs,
    durationMs: scene.durationMs,
    layers
  };
}

export function sampleSceneCharacter(
  character: SceneCharacterDefinition,
  sceneTimeMs: number
): SceneCharacterFrame {
  const activeClips = character.clips.filter((clip) => isClipActive(clip, sceneTimeMs));
  const basePose = character.restPose ?? idlePose;

  if (activeClips.length === 0) {
    return {
      character,
      pose: basePose
    };
  }

  const motionLayers: MotionBlendLayer[] = activeClips.map((clip) => {
    const motion = getMotionPreset(clip.motionId);
    const localTimeMs = (sceneTimeMs - clip.startMs + (clip.offsetMs ?? 0)) * (clip.speed ?? 1);
    const pose = sampleMotion(motion, localTimeMs);

    return {
      pose,
      weight: computeSceneClipWeight(clip, sceneTimeMs) * (clip.weight ?? 1)
    };
  });

  const totalWeight = motionLayers.reduce((sum, layer) => sum + layer.weight, 0);
  const layers =
    totalWeight < 1
      ? [{ pose: basePose, weight: 1 - totalWeight }, ...motionLayers]
      : motionLayers;

  return {
    character,
    pose: blendPoseFrames(layers, `${character.id}-scene-pose`, character.name)
  };
}

export function resolveSceneTime(rawTimeMs: number, durationMs: number, loop: SceneDefinition["loop"]) {
  const safeDuration = Math.max(1, durationMs);

  if (loop === "once") {
    return clamp(rawTimeMs, 0, safeDuration);
  }

  return positiveModulo(rawTimeMs, safeDuration);
}

export function isClipActive(clip: SceneMotionClip, timeMs: number) {
  return timeMs >= clip.startMs && timeMs <= clip.endMs;
}

export function computeSceneClipWeight(clip: SceneMotionClip, sceneTimeMs: number) {
  const durationMs = clip.endMs - clip.startMs;

  if (durationMs <= 0) {
    return 0;
  }

  const localTimeMs = sceneTimeMs - clip.startMs;
  const timeFromEndMs = clip.endMs - sceneTimeMs;
  let weight = 1;

  if ((clip.blendInMs ?? 0) > 0 && localTimeMs < (clip.blendInMs ?? 0)) {
    weight = Math.min(weight, smoothstep(localTimeMs / (clip.blendInMs ?? 1)));
  }

  if ((clip.blendOutMs ?? 0) > 0 && timeFromEndMs < (clip.blendOutMs ?? 0)) {
    weight = Math.min(weight, smoothstep(timeFromEndMs / (clip.blendOutMs ?? 1)));
  }

  return clamp(weight, 0, 1);
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
