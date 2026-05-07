export const defaultRenderFps = 30;
export type ResolutionPreset = "720p" | "1080p" | "4k";
export type AspectRatio = "16:9" | "9:16" | "1:1";

export function getResolution(preset: ResolutionPreset, aspectRatio: AspectRatio) {
  const baseHeights = {
    "720p": 720,
    "1080p": 1080,
    "4k": 2160
  };

  const h = baseHeights[preset];

  if (aspectRatio === "9:16") {
    // Vertical: width is height * (9/16)
    return { width: Math.round(h * (9 / 16)), height: h };
  }

  if (aspectRatio === "1:1") {
    return { width: h, height: h };
  }

  // Horizontal: width is height * (16/9)
  return { width: Math.round(h * (16 / 9)), height: h };
}

export function frameToMilliseconds(frame: number, fps: number) {
  return (frame / fps) * 1000;
}

export function millisecondsToFrames(milliseconds: number, fps: number) {
  return Math.ceil((milliseconds / 1000) * fps);
}
