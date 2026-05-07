import { useCurrentFrame, useVideoConfig } from "remotion";
import { frameToMilliseconds } from "../lib/remotionTime";

export type Subtitle = {
  text: string;
  startMs: number;
  endMs: number;
};

export function SubtitleRenderer({
  subtitles,
  fontSize = 48,
  bottom = 100
}: {
  subtitles: Subtitle[];
  fontSize?: number;
  bottom?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = frameToMilliseconds(frame, fps);

  const activeSubtitle = subtitles.find(
    (s) => currentMs >= s.startMs && currentMs <= s.endMs
  );

  if (!activeSubtitle) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottom,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none"
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: fontSize,
          fontWeight: "bold",
          textAlign: "center",
          maxWidth: "80%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
        }}
      >
        {activeSubtitle.text}
      </div>
    </div>
  );
}
