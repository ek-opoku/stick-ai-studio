import type { JointPoint, LimbKinematics, TwoBoneAngles } from "./types";

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

export function distanceBetween(from: JointPoint, to: JointPoint) {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

export function angleBetween(from: JointPoint, to: JointPoint) {
  return radiansToDegrees(Math.atan2(to.y - from.y, to.x - from.x));
}

export function pointFromAngle(origin: JointPoint, angleDegrees: number, length: number): JointPoint {
  const radians = degreesToRadians(angleDegrees);

  return {
    x: origin.x + Math.cos(radians) * length,
    y: origin.y + Math.sin(radians) * length
  };
}

export function buildTwoBoneKinematics(
  anchor: JointPoint,
  upperLength: number,
  lowerLength: number,
  angles: TwoBoneAngles
): LimbKinematics {
  const joint = pointFromAngle(anchor, angles.upper, upperLength);
  const end = pointFromAngle(joint, angles.upper + angles.lower, lowerLength);

  return {
    anchor,
    joint,
    end,
    upperLength,
    lowerLength,
    upperAngle: angles.upper,
    lowerAngle: angles.lower
  };
}

export function buildAnglesFromRestPose(
  anchor: JointPoint,
  joint: JointPoint,
  end: JointPoint,
  upperRotation = 0,
  lowerRotation = 0
): TwoBoneAngles {
  const upperRestAngle = angleBetween(anchor, joint);
  const lowerRestAngle = angleBetween(joint, end);

  return {
    upper: upperRestAngle + upperRotation,
    lower: lowerRestAngle - upperRestAngle + lowerRotation
  };
}
