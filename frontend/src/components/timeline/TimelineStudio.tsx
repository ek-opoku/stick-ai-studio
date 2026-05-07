"use client";

import { useMemo } from "react";
import { StickFigure } from "@/components/stick-figure";
import { useTimelinePlayer } from "@/hooks/useTimelinePlayer";
import { createDemoTimeline } from "./timelineEngine";
import { PlaybackControls } from "./PlaybackControls";
import { TimelineTrack } from "./TimelineTrack";
import "./timeline.css";

export function TimelineStudio() {
  const timeline = useMemo(() => createDemoTimeline(), []);
  const player = useTimelinePlayer(timeline);

  return (
    <div className="timeline-studio">
      <div className="timeline-preview">
        <StickFigure pose={player.pose} size={220} />
      </div>

      <PlaybackControls
        currentTimeMs={player.currentTimeMs}
        durationMs={player.durationMs}
        onPause={player.pause}
        onPlay={player.play}
        onSpeedChange={player.setSpeed}
        onStop={player.stop}
        playing={player.playing}
        speed={player.speed}
      />

      <TimelineTrack
        currentTimeMs={player.currentTimeMs}
        onSeek={player.seek}
        playing={player.playing}
        timeline={timeline}
      />
    </div>
  );
}
