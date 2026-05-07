"use client";

import { useCallback, useRef, useState } from "react";
import { clipColors } from "./types";
import type { Timeline, TimelineClip } from "./types";

type TimelineTrackProps = {
  timeline: Timeline;
  currentTimeMs: number;
  playing: boolean;
  onSeek: (timeMs: number) => void;
};

export function TimelineTrack({
  timeline,
  currentTimeMs,
  playing,
  onSeek
}: TimelineTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const timeToPercent = useCallback(
    (timeMs: number) => {
      return (timeMs / timeline.durationMs) * 100;
    },
    [timeline.durationMs]
  );

  const positionToTime = useCallback(
    (clientX: number) => {
      const track = trackRef.current;

      if (!track) {
        return 0;
      }

      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

      return ratio * timeline.durationMs;
    },
    [timeline.durationMs]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (dragging) {
        return;
      }

      onSeek(positionToTime(e.clientX));
    },
    [dragging, onSeek, positionToTime]
  );

  const handleCursorDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDragging(true);

      const handleMove = (moveEvent: MouseEvent) => {
        onSeek(positionToTime(moveEvent.clientX));
      };

      const handleUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [onSeek, positionToTime]
  );

  // Build ruler ticks — one per second + half-second minor ticks
  const totalSeconds = Math.ceil(timeline.durationMs / 1000);
  const ticks: Array<{ timeMs: number; major: boolean }> = [];

  for (let s = 0; s <= totalSeconds; s++) {
    ticks.push({ timeMs: s * 1000, major: true });

    if (s < totalSeconds) {
      ticks.push({ timeMs: s * 1000 + 500, major: false });
    }
  }

  const cursorPercent = timeToPercent(currentTimeMs);

  return (
    <div className="timeline-track-container">
      {/* Ruler */}
      <div className="timeline-ruler">
        {ticks.map((tick) => {
          const left = timeToPercent(tick.timeMs);

          return (
            <span key={tick.timeMs}>
              <span
                className={`ruler-tick ${tick.major ? "major" : ""}`}
                style={{ left: `${left}%` }}
              />
              {tick.major ? (
                <span className="ruler-label" style={{ left: `${left}%` }}>
                  {tick.timeMs / 1000}s
                </span>
              ) : null}
            </span>
          );
        })}
      </div>

      {/* Track */}
      <div
        className="timeline-track"
        id="timeline-track"
        onClick={handleTrackClick}
        ref={trackRef}
        role="slider"
        aria-label="Timeline scrubber"
        aria-valuemin={0}
        aria-valuemax={timeline.durationMs}
        aria-valuenow={Math.round(currentTimeMs)}
        tabIndex={0}
      >
        {/* Clip blocks */}
        {timeline.clips.map((clip) => (
          <ClipBlock
            clip={clip}
            durationMs={timeline.durationMs}
            key={clip.id}
          />
        ))}

        {/* Cursor / Playhead */}
        <div
          className={`timeline-cursor ${dragging ? "dragging" : ""}`}
          style={{ left: `${cursorPercent}%` }}
        >
          <div
            className="cursor-handle"
            onMouseDown={handleCursorDown}
            role="slider"
            aria-label="Playhead"
            aria-valuemin={0}
            aria-valuemax={timeline.durationMs}
            aria-valuenow={Math.round(currentTimeMs)}
            tabIndex={0}
          />
        </div>
      </div>
    </div>
  );
}

function ClipBlock({
  clip,
  durationMs
}: {
  clip: TimelineClip;
  durationMs: number;
}) {
  const clipDuration = clip.endMs - clip.startMs;
  const leftPercent = (clip.startMs / durationMs) * 100;
  const widthPercent = (clipDuration / durationMs) * 100;
  const color = clipColors[clip.motionId] ?? "#6b7280";

  const blendInPercent =
    clipDuration > 0 ? (clip.blendInMs / clipDuration) * 100 : 0;
  const blendOutPercent =
    clipDuration > 0 ? (clip.blendOutMs / clipDuration) * 100 : 0;

  return (
    <div
      className="timeline-clip"
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: color
      }}
      title={`${clip.label ?? clip.motionId} (${(clip.startMs / 1000).toFixed(1)}s – ${(clip.endMs / 1000).toFixed(1)}s)`}
    >
      {blendInPercent > 0 ? (
        <div className="clip-blend-in" style={{ width: `${blendInPercent}%` }} />
      ) : null}

      {blendOutPercent > 0 ? (
        <div
          className="clip-blend-out"
          style={{ width: `${blendOutPercent}%` }}
        />
      ) : null}

      <span className="clip-label">{clip.label ?? clip.motionId}</span>
    </div>
  );
}
