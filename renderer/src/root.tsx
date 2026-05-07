import { Composition } from "remotion";
import { MainComposition } from "./scenes/MainComposition";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="MainComposition"
        component={MainComposition}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Stick AI Studio",
          subtitle: "Local render pipeline"
        }}
      />
    </>
  );
}
