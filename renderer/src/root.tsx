import { Composition } from "remotion";
import { SceneComposition } from "./compositions/SceneComposition";
import { defaultScene } from "./lib/defaultScene";
import {
  defaultRenderFps,
  defaultRenderHeight,
  defaultRenderWidth,
  millisecondsToFrames
} from "./lib/remotionTime";
import { MainComposition } from "./scenes/MainComposition";

const sceneDurationInFrames = millisecondsToFrames(defaultScene.durationMs, defaultRenderFps);

export function RemotionRoot() {
  return (
    <>
      <Composition
        component={SceneComposition}
        defaultProps={{
          scene: defaultScene,
          showDebugOverlay: false
        }}
        durationInFrames={sceneDurationInFrames}
        fps={defaultRenderFps}
        height={defaultRenderHeight}
        id="SceneComposition"
        width={defaultRenderWidth}
      />
      <Composition
        component={MainComposition}
        defaultProps={{
          scene: defaultScene,
          showDebugOverlay: false
        }}
        durationInFrames={sceneDurationInFrames}
        fps={defaultRenderFps}
        height={defaultRenderHeight}
        id="MainComposition"
        width={defaultRenderWidth}
      />
    </>
  );
}
