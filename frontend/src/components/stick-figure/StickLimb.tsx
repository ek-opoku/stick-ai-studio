import { StickJoint } from "./StickJoint";
import { StickSegment } from "./StickSegment";
import { buildAnglesFromRestPose, buildTwoBoneKinematics, distanceBetween } from "./math";
import type { LimbChainSpec } from "./types";

type StickLimbProps = LimbChainSpec & {
  stroke: string;
  strokeWidth: number;
  jointFill: string;
  jointStroke: string;
  jointRadius: number;
  showJoints: boolean;
};

export function StickLimb({
  anchor,
  upperEnd,
  lowerEnd,
  upperRotation = 0,
  lowerRotation = 0,
  stroke,
  strokeWidth,
  jointFill,
  jointStroke,
  jointRadius,
  showJoints
}: StickLimbProps) {
  const upperLength = distanceBetween(anchor, upperEnd);
  const lowerLength = distanceBetween(upperEnd, lowerEnd);
  const angles = buildAnglesFromRestPose(anchor, upperEnd, lowerEnd, upperRotation, lowerRotation);
  const kinematics = buildTwoBoneKinematics(anchor, upperLength, lowerLength, angles);

  return (
    <g transform={`translate(${anchor.x} ${anchor.y}) rotate(${kinematics.upperAngle})`}>
      <StickSegment
        color={stroke}
        from={{ x: 0, y: 0 }}
        id="upper"
        strokeWidth={strokeWidth}
        to={{ x: upperLength, y: 0 }}
      />
      {showJoints ? (
        <StickJoint
          fill={jointFill}
          radius={jointRadius}
          stroke={jointStroke}
          strokeWidth={1.5}
          x={0}
          y={0}
        />
      ) : null}

      <g transform={`translate(${upperLength} 0) rotate(${kinematics.lowerAngle})`}>
        <StickSegment
          color={stroke}
          from={{ x: 0, y: 0 }}
          id="lower"
          strokeWidth={strokeWidth}
          to={{ x: lowerLength, y: 0 }}
        />
        {showJoints ? (
          <>
            <StickJoint
              fill={jointFill}
              radius={jointRadius}
              stroke={jointStroke}
              strokeWidth={1.5}
              x={0}
              y={0}
            />
            <StickJoint
              fill={jointFill}
              radius={jointRadius}
              stroke={jointStroke}
              strokeWidth={1.5}
              x={lowerLength}
              y={0}
            />
          </>
        ) : null}
      </g>
    </g>
  );
}
