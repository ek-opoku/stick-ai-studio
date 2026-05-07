import cryMotionJson from "./motions/cry.json";
import jumpMotionJson from "./motions/jump.json";
import laughMotionJson from "./motions/laugh.json";
import pointMotionJson from "./motions/point.json";
import runMotionJson from "./motions/run.json";
import sitMotionJson from "./motions/sit.json";
import walkMotionJson from "./motions/walk.json";
import waveMotionJson from "./motions/wave.json";
import type {
  MotionBlendLayer,
  MotionDefinition,
  MotionEasing,
  MotionKeyframe,
  StickBodyOffset,
  StickHeadPose,
  StickJointAngles,
  StickPose,
  StickPoseFrame
} from "./types";

const jointKeys = [
  "torso",
  "leftShoulder",
  "leftElbow",
  "rightShoulder",
  "rightElbow",
  "leftHip",
  "leftKnee",
  "rightHip",
  "rightKnee"
] as const satisfies readonly (keyof StickJointAngles)[];

export const motionLibrary = {
  walk: walkMotionJson as MotionDefinition,
  run: runMotionJson as MotionDefinition,
  jump: jumpMotionJson as MotionDefinition,
  sit: sitMotionJson as MotionDefinition,
  wave: waveMotionJson as MotionDefinition,
  point: pointMotionJson as MotionDefinition,
  laugh: laughMotionJson as MotionDefinition,
  cry: cryMotionJson as MotionDefinition
};

export type MotionPresetName = keyof typeof motionLibrary;

export function getMotionPreset(name: MotionPresetName) {
  return motionLibrary[name];
}

export function sampleMotion(motion: MotionDefinition, elapsedMs: number): StickPose {
  const keyframes = [...motion.keyframes].sort((a, b) => a.timeMs - b.timeMs);

  if (keyframes.length === 0) {
    return frameToPose(motion.id, motion.name, {});
  }

  if (keyframes.length === 1) {
    return frameToPose(motion.id, motion.name, keyframes[0].pose);
  }

  const timeMs = resolveTimelineTime(elapsedMs, motion.durationMs, motion.loop ?? "loop");
  const [from, to, segmentProgress] = findKeyframeSegment(keyframes, timeMs, motion.durationMs);
  const easedProgress = applyMotionEasing(segmentProgress, from.easing ?? "linear");

  return interpolatePoseFrames(from.pose, to.pose, easedProgress, {
    id: motion.id,
    name: motion.name
  });
}

export function blendMotions(
  layers: Array<{ motion: MotionDefinition; elapsedMs: number; weight: number }>,
  id = "blended-motion",
  name = "Blended Motion"
) {
  return blendPoseFrames(
    layers.map((layer) => ({
      pose: sampleMotion(layer.motion, layer.elapsedMs),
      weight: layer.weight
    })),
    id,
    name
  );
}

export function blendPoseFrames(
  layers: MotionBlendLayer[],
  id = "blended-pose",
  name = "Blended Pose"
): StickPose {
  const activeLayers = layers.filter((layer) => layer.weight > 0);
  const totalWeight = activeLayers.reduce((sum, layer) => sum + layer.weight, 0);

  if (activeLayers.length === 0 || totalWeight === 0) {
    return frameToPose(id, name, {});
  }

  const weighted = activeLayers.map((layer) => ({
    frame: poseToFrame(layer.pose),
    weight: layer.weight / totalWeight
  }));

  return {
    id,
    name,
    body: {
      x: weighted.reduce((sum, layer) => sum + (layer.frame.body?.x ?? 0) * layer.weight, 0),
      y: weighted.reduce((sum, layer) => sum + (layer.frame.body?.y ?? 0) * layer.weight, 0)
    },
    head: {
      tilt: weighted.reduce((sum, layer) => sum + (layer.frame.head?.tilt ?? 0) * layer.weight, 0)
    },
    joints: Object.fromEntries(
      jointKeys.map((key) => [
        key,
        weighted.reduce((sum, layer) => sum + (layer.frame.joints?.[key] ?? 0) * layer.weight, 0)
      ])
    ) as StickJointAngles
  };
}

export function interpolatePoseFrames(
  from: StickPoseFrame,
  to: StickPoseFrame,
  progress: number,
  metadata = { id: "interpolated-pose", name: "Interpolated Pose" }
): StickPose {
  const t = clamp01(progress);

  return {
    id: metadata.id,
    name: metadata.name,
    body: interpolateBody(from.body, to.body, t),
    head: interpolateHead(from.head, to.head, t),
    joints: Object.fromEntries(
      jointKeys.map((key) => [key, lerp(from.joints?.[key] ?? 0, to.joints?.[key] ?? 0, t)])
    ) as StickJointAngles
  };
}

export function resolveTimelineTime(elapsedMs: number, durationMs: number, loop: MotionDefinition["loop"]) {
  const safeDuration = Math.max(1, durationMs);

  if (loop === "once") {
    return clamp(elapsedMs, 0, safeDuration);
  }

  if (loop === "pingpong") {
    const cycle = positiveModulo(elapsedMs, safeDuration * 2);
    return cycle <= safeDuration ? cycle : safeDuration * 2 - cycle;
  }

  return positiveModulo(elapsedMs, safeDuration);
}

export function applyMotionEasing(progress: number, easing: MotionEasing) {
  const t = clamp01(progress);

  if (easing === "sine") {
    return Math.sin(t * Math.PI * 0.5);
  }

  if (easing === "smoothstep") {
    return t * t * (3 - 2 * t);
  }

  if (easing === "easeInOut") {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  return t;
}

function findKeyframeSegment(
  keyframes: MotionKeyframe[],
  timeMs: number,
  durationMs: number
): [MotionKeyframe, MotionKeyframe, number] {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];

  if (timeMs <= first.timeMs) {
    return [first, first, 0];
  }

  for (let index = 0; index < keyframes.length - 1; index += 1) {
    const from = keyframes[index];
    const to = keyframes[index + 1];

    if (timeMs >= from.timeMs && timeMs <= to.timeMs) {
      return [from, to, segmentProgress(timeMs, from.timeMs, to.timeMs)];
    }
  }

  if (timeMs <= durationMs && last.timeMs < durationMs) {
    return [last, first, segmentProgress(timeMs, last.timeMs, durationMs)];
  }

  return [last, last, 0];
}

function frameToPose(id: string, name: string, frame: StickPoseFrame): StickPose {
  return {
    id,
    name,
    body: {
      x: frame.body?.x ?? 0,
      y: frame.body?.y ?? 0
    },
    head: {
      tilt: frame.head?.tilt ?? 0
    },
    joints: Object.fromEntries(jointKeys.map((key) => [key, frame.joints?.[key] ?? 0])) as StickJointAngles
  };
}

function poseToFrame(pose: StickPose | StickPoseFrame): StickPoseFrame {
  return {
    body: pose.body,
    head: pose.head,
    joints: pose.joints
  };
}

function interpolateBody(from: StickBodyOffset | undefined, to: StickBodyOffset | undefined, progress: number) {
  return {
    x: lerp(from?.x ?? 0, to?.x ?? 0, progress),
    y: lerp(from?.y ?? 0, to?.y ?? 0, progress)
  };
}

function interpolateHead(from: StickHeadPose | undefined, to: StickHeadPose | undefined, progress: number) {
  return {
    tilt: lerp(from?.tilt ?? 0, to?.tilt ?? 0, progress)
  };
}

function segmentProgress(value: number, start: number, end: number) {
  if (end === start) {
    return 0;
  }

  return clamp01((value - start) / (end - start));
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function clamp01(value: number) {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
