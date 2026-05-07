import idlePoseJson from "./poses/idle.json";
import jumpPoseJson from "./poses/jump.json";
import walkPoseJson from "./poses/walk.json";
import type { StickFigurePose, StickJointAngles, StickPose } from "./types";

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

export const posePresets = {
  idle: idlePoseJson,
  walk: walkPoseJson,
  jump: jumpPoseJson
} satisfies Record<string, StickPose>;

export type PosePresetName = keyof typeof posePresets;

export function isStructuredPose(pose: StickFigurePose | StickPose): pose is StickPose {
  return "joints" in pose;
}

export function normalizePose(pose: StickFigurePose | StickPose = {}): StickFigurePose {
  if (!isStructuredPose(pose)) {
    return pose;
  }

  return {
    bodyX: pose.body?.x ?? 0,
    bodyY: pose.body?.y ?? 0,
    head: pose.head?.tilt ?? 0,
    torso: pose.joints.torso ?? 0,
    leftShoulder: pose.joints.leftShoulder ?? 0,
    leftElbow: pose.joints.leftElbow ?? 0,
    rightShoulder: pose.joints.rightShoulder ?? 0,
    rightElbow: pose.joints.rightElbow ?? 0,
    leftHip: pose.joints.leftHip ?? 0,
    leftKnee: pose.joints.leftKnee ?? 0,
    rightHip: pose.joints.rightHip ?? 0,
    rightKnee: pose.joints.rightKnee ?? 0
  };
}

export function interpolatePose(from: StickPose, to: StickPose, progress: number): StickPose {
  const t = clamp(progress, 0, 1);

  return {
    id: `${from.id}-to-${to.id}-${t.toFixed(3)}`,
    name: `${from.name} to ${to.name}`,
    body: {
      x: lerp(from.body?.x ?? 0, to.body?.x ?? 0, t),
      y: lerp(from.body?.y ?? 0, to.body?.y ?? 0, t)
    },
    head: {
      tilt: lerp(from.head?.tilt ?? 0, to.head?.tilt ?? 0, t)
    },
    joints: Object.fromEntries(
      jointKeys.map((key) => [key, lerp(from.joints[key] ?? 0, to.joints[key] ?? 0, t)])
    ) as StickJointAngles
  };
}

export function getPosePreset(name: PosePresetName) {
  return posePresets[name];
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
