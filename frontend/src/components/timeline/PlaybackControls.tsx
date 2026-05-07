"use client";

import { Pause, Play, Square } from "lucide-react";

type PlaybackControlsProps = {
  playing: boolean;
  speed: number;
  currentTimeMs: number;
  durationMs: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSpeedChange: (speed: number) => void;
};

const speedOptions = [0.25, 0.5, 1, 1.5, 2];

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const fraction = Math.floor((ms % 1000) / 100);
  return `${totalSeconds}.${fraction}s`;
}

export function PlaybackControls({
  playing,
  speed,
  currentTimeMs,
  durationMs,
  onPlay,
  onPause,
  onStop,
  onSpeedChange
}: PlaybackControlsProps) {
  return (
    <div className="playback-controls">
      <button
        className={`playback-btn ${playing ? "active" : ""}`}
        id="timeline-play-pause"
        onClick={playing ? onPause : onPlay}
        title={playing ? "Pause" : "Play"}
        type="button"
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <button
        className="playback-btn"
        id="timeline-stop"
        onClick={onStop}
        title="Stop"
        type="button"
      >
        <Square size={14} />
      </button>

      <select
        className="speed-select"
        id="timeline-speed"
        onChange={(e) => onSpeedChange(Number(e.target.value))}
        title="Playback speed"
        value={speed}
      >
        {speedOptions.map((s) => (
          <option key={s} value={s}>
            {s}×
          </option>
        ))}
      </select>

      <div className="time-display">
        <span>{formatTime(currentTimeMs)}</span>
        <span className="separator">/</span>
        <span>{formatTime(durationMs)}</span>
      </div>
    </div>
  );
}
