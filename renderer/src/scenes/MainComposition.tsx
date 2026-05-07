import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type MainCompositionProps = {
  title: string;
  subtitle: string;
};

export function MainComposition({ title, subtitle }: MainCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const opacity = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fbfaf7",
        color: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
      <div
        style={{
          transform: `translateY(${(1 - enter) * 80}px)`,
          opacity,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800 }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 42, color: "#4f6f52" }}>{subtitle}</div>
      </div>
    </div>
  );
}
