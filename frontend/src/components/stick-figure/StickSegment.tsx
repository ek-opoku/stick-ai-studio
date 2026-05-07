import type { SegmentSpec } from "./types";

type StickSegmentProps = SegmentSpec & {
  color: string;
  strokeWidth: number;
};

export function StickSegment({ from, to, rotation = 0, color, strokeWidth }: StickSegmentProps) {
  return (
    <g transform={`rotate(${rotation} ${from.x} ${from.y})`}>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </g>
  );
}
