import { Composition } from "remotion";
import { SceneComposition, type SceneCompositionProps } from "./compositions/SceneComposition";
import { defaultScene } from "./lib/defaultScene";
import {
  defaultRenderFps,
  getResolution,
  millisecondsToFrames,
  type AspectRatio,
  type ResolutionPreset
} from "./lib/remotionTime";
import { MainComposition } from "./scenes/MainComposition";

type ExportConfig = {
  resolution: ResolutionPreset;
  aspectRatio: AspectRatio;
  includeAudio: boolean;
  audioUrl?: string;
  burnInSubtitles: boolean;
  subtitles?: any[];
};

export function RemotionRoot() {
  const sceneDurationInFrames = millisecondsToFrames(defaultScene.durationMs, defaultRenderFps);

  return (
    <>
      <Composition
        component={SceneComposition}
        id="SceneComposition"
        fps={defaultRenderFps}
        durationInFrames={sceneDurationInFrames}
        width={1920}
        height={1080}
        schema={null}
        calculateMetadata={({ props }) => {
          const config = (props as any).exportConfig as ExportConfig | undefined;
          const { width, height } = getResolution(
            config?.resolution ?? "1080p",
            config?.aspectRatio ?? "16:9"
          );

          return {
            width,
            height,
            props: {
              ...props,
              audioUrl: config?.includeAudio ? config.audioUrl : undefined,
              subtitles: config?.burnInSubtitles ? config.subtitles : []
            }
          };
        }}
        defaultProps={{
          scene: defaultScene,
          showDebugOverlay: false
        } as SceneCompositionProps}
      />
      <Composition
        component={MainComposition}
        id="MainComposition"
        fps={defaultRenderFps}
        durationInFrames={sceneDurationInFrames}
        width={1920}
        height={1080}
        defaultProps={{
          scene: defaultScene,
          showDebugOverlay: false
        }}
      />
    </>
  );
}
