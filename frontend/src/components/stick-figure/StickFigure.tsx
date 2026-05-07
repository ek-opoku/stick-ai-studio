import type { SVGProps } from "react";
import { normalizePose } from "./poseSystem";
import { StickJoint } from "./StickJoint";
import { StickLimb } from "./StickLimb";
import { StickSegment } from "./StickSegment";
import type { JointPoint, StickFigureColorConfig, StickFigurePose, StickPose } from "./types";

export type StickFigureProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  size?: number | string;
  colors?: StickFigureColorConfig;
  pose?: StickFigurePose | StickPose;
  strokeWidth?: number;
  jointRadius?: number;
  showJoints?: boolean;
};

const joints = {
  neck: { x: 100, y: 60 },
  chest: { x: 100, y: 95 },
  pelvis: { x: 100, y: 135 },
  leftShoulder: { x: 78, y: 82 },
  leftElbow: { x: 55, y: 112 },
  leftWrist: { x: 42, y: 148 },
  rightShoulder: { x: 122, y: 82 },
  rightElbow: { x: 145, y: 112 },
  rightWrist: { x: 158, y: 148 },
  leftHip: { x: 86, y: 135 },
  leftKnee: { x: 72, y: 178 },
  leftAnkle: { x: 60, y: 220 },
  rightHip: { x: 114, y: 135 },
  rightKnee: { x: 128, y: 178 },
  rightAnkle: { x: 140, y: 220 }
} satisfies Record<string, JointPoint>;

const defaultColors: Required<StickFigureColorConfig> = {
  stroke: "#111827",
  headFill: "#111827",
  jointFill: "#111827",
  jointStroke: "#111827"
};

export function StickFigure({
  size = 280,
  colors,
  pose = {},
  strokeWidth = 12,
  jointRadius = 5,
  showJoints = false,
  className,
  ...svgProps
}: StickFigureProps) {
  const palette = { ...defaultColors, ...colors };
  const normalizedPose = normalizePose(pose);
  const bodyTransform = `translate(${normalizedPose.bodyX ?? 0} ${normalizedPose.bodyY ?? 0})`;
  const torsoTransform = `rotate(${normalizedPose.torso ?? 0} ${joints.pelvis.x} ${joints.pelvis.y})`;
  const headTransform = `rotate(${normalizedPose.head ?? 0} ${joints.neck.x} ${joints.neck.y})`;
  const limbs = [
    {
      id: "leftArm",
      anchor: joints.leftShoulder,
      upperEnd: joints.leftElbow,
      lowerEnd: joints.leftWrist,
      upperRotation: normalizedPose.leftShoulder ?? normalizedPose.leftUpperArm,
      lowerRotation: normalizedPose.leftElbow ?? normalizedPose.leftLowerArm
    },
    {
      id: "rightArm",
      anchor: joints.rightShoulder,
      upperEnd: joints.rightElbow,
      lowerEnd: joints.rightWrist,
      upperRotation: normalizedPose.rightShoulder ?? normalizedPose.rightUpperArm,
      lowerRotation: normalizedPose.rightElbow ?? normalizedPose.rightLowerArm
    },
    {
      id: "leftLeg",
      anchor: joints.leftHip,
      upperEnd: joints.leftKnee,
      lowerEnd: joints.leftAnkle,
      upperRotation: normalizedPose.leftHip ?? normalizedPose.leftUpperLeg,
      lowerRotation: normalizedPose.leftKnee ?? normalizedPose.leftLowerLeg
    },
    {
      id: "rightLeg",
      anchor: joints.rightHip,
      upperEnd: joints.rightKnee,
      lowerEnd: joints.rightAnkle,
      upperRotation: normalizedPose.rightHip ?? normalizedPose.rightUpperLeg,
      lowerRotation: normalizedPose.rightKnee ?? normalizedPose.rightLowerLeg
    }
  ];

  const bodyJoints = [
    joints.neck,
    joints.pelvis
  ];

  return (
    <svg
      aria-label="Modular stick figure"
      className={className}
      height={size}
      role="img"
      viewBox="0 0 200 240"
      width={size}
      {...svgProps}
    >
      <g transform={bodyTransform}>
        <g transform={torsoTransform}>
          <StickSegment
            color={palette.stroke}
            from={joints.neck}
            id="torso"
            rotation={0}
            strokeWidth={strokeWidth}
            to={joints.pelvis}
          />
          <StickSegment
            color={palette.stroke}
            from={joints.leftShoulder}
            id="shoulders"
            strokeWidth={strokeWidth}
            to={joints.rightShoulder}
          />

          {limbs.map((limb) => (
            <StickLimb
              jointFill={palette.jointFill}
              jointRadius={jointRadius}
              jointStroke={palette.jointStroke}
              key={limb.id}
              showJoints={showJoints}
              stroke={palette.stroke}
              strokeWidth={strokeWidth}
              {...limb}
            />
          ))}

          {showJoints
            ? bodyJoints.map((joint) => (
                <StickJoint
                  fill={palette.jointFill}
                  key={`${joint.x}-${joint.y}`}
                  radius={jointRadius}
                  stroke={palette.jointStroke}
                  strokeWidth={1.5}
                  x={joint.x}
                  y={joint.y}
                />
              ))
            : null}

          <g transform={headTransform}>
            <circle
              cx={100}
              cy={35}
              fill={palette.headFill}
              r={24}
              stroke={palette.stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
