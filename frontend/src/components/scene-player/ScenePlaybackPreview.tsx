"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { sceneLibrary } from "./sceneEngine";
import { SceneStage } from "./SceneStage";
import { useScenePlayer } from "./useScenePlayer";
import type { ScenePresetName } from "./sceneEngine";

type ScenePlaybackPreviewProps = {
  scene?: ScenePresetName;
};

export function ScenePlaybackPreview({ scene = "demo" }: ScenePlaybackPreviewProps) {
  const definition = sceneLibrary[scene];
  const player = useScenePlayer(definition, true);

  return (
    <div className="grid gap-3">
      <SceneStage frame={player.frame} height={definition.height} width={definition.width} />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white hover:border-action"
            onClick={player.playing ? player.pause : player.play}
            title={player.playing ? "Pause scene" : "Play scene"}
            type="button"
          >
            {player.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white hover:border-action"
            onClick={player.stop}
            title="Restart scene"
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <select
            className="h-9 rounded-md border border-line bg-white px-2"
            onChange={(event) => player.setSpeed(Number(event.target.value))}
            title="Scene playback speed"
            value={player.speed}
          >
            {[0.5, 1, 1.5, 2].map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
        <span className="text-gray-500">
          {(player.currentTimeMs / 1000).toFixed(1)}s / {(player.durationMs / 1000).toFixed(1)}s
        </span>
      </div>
    </div>
  );
}
