import { StickFigure } from "../../../frontend/src/components/stick-figure/StickFigure";
import type { RenderSceneFrame } from "../lib/sceneTypes";

type RenderSceneStageProps = {
  frame: RenderSceneFrame;
  width: number;
  height: number;
};

export function RenderSceneStage({ frame, width, height }: RenderSceneStageProps) {
  return (
    <svg
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#fbfaf7" height={height} width={width} x={0} y={0} />
      <line
        stroke="#d7d0c4"
        strokeDasharray="8 8"
        strokeWidth={2}
        x1={56}
        x2={width - 56}
        y1={height - 58}
        y2={height - 58}
      />

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
