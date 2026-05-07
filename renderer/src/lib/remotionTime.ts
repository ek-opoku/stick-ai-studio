export const defaultRenderFps = 30;
export const defaultRenderWidth = 1920;
export const defaultRenderHeight = 1080;

export function frameToMilliseconds(frame: number, fps: number) {
  return (frame / fps) * 1000;
}

export function millisecondsToFrames(milliseconds: number, fps: number) {
  return Math.ceil((milliseconds / 1000) * fps);
}
