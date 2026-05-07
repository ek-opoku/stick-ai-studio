import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RenderSceneStage } from "../components/RenderSceneStage";
import { defaultScene } from "../lib/defaultScene";
import { frameToMilliseconds } from "../lib/remotionTime";
import { sampleRenderScene } from "../lib/renderSceneEngine";
import type { RenderSceneDefinition } from "../lib/sceneTypes";

export type SceneCompositionProps = {
  scene?: RenderSceneDefinition;
  backgroundColor?: string;
  showDebugOverlay?: boolean;
};

export function SceneComposition({
  scene = defaultScene,
  backgroundColor = "#111827",
  showDebugOverlay = false
}: SceneCompositionProps) {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const timeMs = frameToMilliseconds(frame, fps);
  const sceneFrame = sampleRenderScene(scene, timeMs);
  const scale = Math.min(width / scene.width, height / scene.height);
  const stageWidth = scene.width * scale;
  const stageHeight = scene.height * scale;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor,
        color: "#111827",
        display: "flex",
        fontFamily: "Inter, Arial, sans-serif",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          height: stageHeight,
          position: "relative",
          width: stageWidth
        }}
      >
        <div
          style={{
            height: scene.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: scene.width
          }}
        >
          <RenderSceneStage frame={sceneFrame} height={scene.height} width={scene.width} />
        </div>
      </div>

      {showDebugOverlay ? (
        <div
          style={{
            background: "rgba(17, 24, 39, 0.76)",
            borderRadius: 6,
            bottom: 28,
            color: "white",
            fontSize: 28,
            left: 28,
            padding: "10px 14px",
            position: "absolute"
          }}
        >
          frame {frame} / {(sceneFrame.timeMs / 1000).toFixed(2)}s
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
