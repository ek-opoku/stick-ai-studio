import type { StickPose } from "./types";

export type WalkCycleEasing = "linear" | "sine" | "smoothstep";

export type WalkCycleConfig = {
  speed?: number;
  stride?: number;
  armSwing?: number;
  elbowBend?: number;
  hipSwing?: number;
  kneeBend?: number;
  hipBounce?: number;
  headBob?: number;
  easing?: WalkCycleEasing;
};

const defaultWalkConfig: Required<WalkCycleConfig> = {
  speed: 1,
  stride: 24,
  armSwing: 28,
  elbowBend: 18,
  hipSwing: 22,
  kneeBend: 34,
  hipBounce: 7,
  headBob: 3,
  easing: "sine"
};

export function createWalkCyclePose(elapsedMs: number, config: WalkCycleConfig = {}): StickPose {
  const options = { ...defaultWalkConfig, ...config };
  const seconds = elapsedMs / 1000;
  const phase = (seconds * options.speed) % 1;
  const strideScale = Math.max(0, options.stride) / defaultWalkConfig.stride;
  const armSwing = options.armSwing * (0.65 + strideScale * 0.35);
  const hipSwing = options.hipSwing * strideScale;
  const kneeBend = options.kneeBend * (0.7 + strideScale * 0.3);
  const strideWave = easedSine(phase, options.easing);
  const counterStrideWave = -strideWave;
  const contactWave = Math.sin(phase * Math.PI * 2);
  const bounceWave = Math.abs(Math.sin(phase * Math.PI * 2));
  const swayWave = Math.sin(phase * Math.PI * 4);

  return {
    id: "procedural-walk",
    name: "Procedural Walk",
    body: {
      x: swayWave * options.stride * 0.04,
      y: -bounceWave * options.hipBounce
    },
    head: {
      tilt: counterStrideWave * options.headBob
    },
    joints: {
      torso: strideWave * 2,
      leftShoulder: counterStrideWave * armSwing,
      rightShoulder: strideWave * armSwing,
      leftElbow: elbowAngle(contactWave, counterStrideWave, options.elbowBend),
      rightElbow: elbowAngle(-contactWave, strideWave, options.elbowBend),
      leftHip: strideWave * hipSwing,
      rightHip: counterStrideWave * hipSwing,
      leftKnee: kneeAngle(contactWave, kneeBend),
      rightKnee: kneeAngle(-contactWave, kneeBend)
    }
  };
}

function elbowAngle(contactWave: number, swingWave: number, bend: number) {
  return bend * 0.35 + Math.max(0, contactWave) * bend * 0.65 - swingWave * 6;
}

function kneeAngle(contactWave: number, bend: number) {
  return Math.max(0.15, Math.max(0, -contactWave)) * bend;
}

function easedSine(phase: number, easing: WalkCycleEasing) {
  const wavePhase = phase < 0.5 ? phase * 2 : 2 - phase * 2;
  const direction = phase < 0.5 ? 1 : -1;
  const eased = ease(wavePhase, easing);

  return direction * eased;
}

function ease(value: number, easing: WalkCycleEasing) {
  if (easing === "linear") {
    return value;
  }

  if (easing === "smoothstep") {
    return value * value * (3 - 2 * value);
  }

  return Math.sin(value * Math.PI * 0.5);
}
