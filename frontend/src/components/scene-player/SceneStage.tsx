"use client";

import { StickFigure } from "@/components/stick-figure";
import type { SceneFrame } from "./types";

type SceneStageProps = {
  frame: SceneFrame;
  width: number;
  height: number;
};

export function SceneStage({ frame, width, height }: SceneStageProps) {
  return (
    <svg
      aria-label="Scene playback stage"
      className="h-auto w-full rounded-md border border-line bg-[#fbfaf7]"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      <rect fill="#fbfaf7" height={height} width={width} x={0} y={0} />
      <line stroke="#d7d0c4" strokeDasharray="8 8" strokeWidth={2} x1={56} x2={width - 56} y1={height - 58} y2={height - 58} />

      {frame.layers.map((layerFrame) => (
        <g
          data-layer={layerFrame.layer.id}
          key={layerFrame.layer.id}
          opacity={layerFrame.layer.opacity ?? 1}
        >
          {layerFrame.characters.map(({ character, pose }) => (
            <g
              data-character={character.id}
              key={character.id}
              opacity={character.opacity ?? 1}
              transform={`translate(${character.x} ${character.y}) scale(${character.scale ?? 1})`}
            >
              <StickFigure
                colors={character.colors}
                pose={pose}
                size={200}
                style={{ overflow: "visible" }}
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
