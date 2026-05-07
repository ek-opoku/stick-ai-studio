import type { JointPoint } from "./types";

type StickJointProps = JointPoint & {
  fill: string;
  stroke: string;
  radius: number;
  strokeWidth: number;
};

export function StickJoint({ x, y, fill, stroke, radius, strokeWidth }: StickJointProps) {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}
