export type StickFigureColorConfig = {
  stroke?: string;
  headFill?: string;
  jointFill?: string;
  jointStroke?: string;
};

export type StickFigurePose = {
  torso?: number;
  head?: number;
  bodyX?: number;
  bodyY?: number;
  leftShoulder?: number;
  leftElbow?: number;
  rightShoulder?: number;
  rightElbow?: number;
  leftHip?: number;
  leftKnee?: number;
  rightHip?: number;
  rightKnee?: number;
  leftUpperArm?: number;
  leftLowerArm?: number;
  rightUpperArm?: number;
  rightLowerArm?: number;
  leftUpperLeg?: number;
  leftLowerLeg?: number;
  rightUpperLeg?: number;
  rightLowerLeg?: number;
};

export type StickJointAngles = {
  torso?: number;
  leftShoulder?: number;
  leftElbow?: number;
  rightShoulder?: number;
  rightElbow?: number;
  leftHip?: number;
  leftKnee?: number;
  rightHip?: number;
  rightKnee?: number;
};

export type StickBodyOffset = {
  x?: number;
  y?: number;
};

export type StickHeadPose = {
  tilt?: number;
};

export type StickPose = {
  id: string;
  name: string;
  joints: StickJointAngles;
  body?: StickBodyOffset;
  head?: StickHeadPose;
};

export type StickPoseFrame = {
  joints?: StickJointAngles;
  body?: StickBodyOffset;
  head?: StickHeadPose;
};

export type MotionEasing = "linear" | "sine" | "smoothstep" | "easeInOut";

export type MotionLoopMode = "loop" | "once" | "pingpong";

export type MotionKeyframe = {
  timeMs: number;
  label?: string;
  easing?: MotionEasing;
  pose: StickPoseFrame;
};

export type MotionDefinition = {
  id: string;
  name: string;
  durationMs: number;
  loop?: MotionLoopMode;
  keyframes: MotionKeyframe[];
};

export type MotionBlendLayer = {
  pose: StickPose | StickPoseFrame;
  weight: number;
};

export type JointPoint = {
  x: number;
  y: number;
};

export type SegmentSpec = {
  id: string;
  from: JointPoint;
  to: JointPoint;
  rotation?: number;
};

export type LimbChainSpec = {
  id: string;
  anchor: JointPoint;
  upperEnd: JointPoint;
  lowerEnd: JointPoint;
  upperRotation?: number;
  lowerRotation?: number;
};

export type TwoBoneAngles = {
  upper: number;
  lower: number;
};

export type LimbKinematics = {
  anchor: JointPoint;
  joint: JointPoint;
  end: JointPoint;
  upperLength: number;
  lowerLength: number;
  upperAngle: number;
  lowerAngle: number;
};
