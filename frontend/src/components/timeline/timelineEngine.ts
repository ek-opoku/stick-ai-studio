import {
  blendPoseFrames,
  getMotionPreset,
  sampleMotion
} from "@/components/stick-figure";
import type { StickPose } from "@/components/stick-figure";
import type { Timeline, TimelineClip } from "./types";

const idlePose: StickPose = {
  id: "idle",
  name: "Idle",
  body: { x: 0, y: 0 },
  head: { tilt: 0 },
  joints: {
    torso: 0,
    leftShoulder: 0,
    leftElbow: 0,
    rightShoulder: 0,
    rightElbow: 0,
    leftHip: 0,
    leftKnee: 0,
    rightHip: 0,
    rightKnee: 0
  }
};

/**
 * Evaluate the timeline at a given time, producing a blended pose
 * from all active clips.
 */
export function evaluateTimeline(timeline: Timeline, rawTimeMs: number): StickPose {
  const timeMs = resolvePlaybackTime(rawTimeMs, timeline.durationMs, timeline.loop);
  const activeClips = getActiveClips(timeline.clips, timeMs);

  if (activeClips.length === 0) {
    return idlePose;
  }

  if (activeClips.length === 1) {
    const clip = activeClips[0];
    const motion = getMotionPreset(clip.motionId);
    const localTime = timeMs - clip.startMs;
    const pose = sampleMotion(motion, localTime);
    const weight = computeClipWeight(clip, timeMs);

    if (weight >= 1) {
      return pose;
    }

    // Blend with idle for partial weight (clip fading in/out at edges with no neighbor)
    return blendPoseFrames(
      [
        { pose: idlePose, weight: 1 - weight },
        { pose, weight }
      ],
      "timeline-eval",
      "Timeline Pose"
    );
  }

  // Multiple clips active — blend by weight
  const layers = activeClips.map((clip) => {
    const motion = getMotionPreset(clip.motionId);
    const localTime = timeMs - clip.startMs;
    const pose = sampleMotion(motion, localTime);
    const weight = computeClipWeight(clip, timeMs);

    return { pose, weight };
  });

  return blendPoseFrames(layers, "timeline-eval", "Timeline Pose");
}

/**
 * Resolve raw elapsed time to a position on the timeline,
 * handling looping.
 */
export function resolvePlaybackTime(
  elapsedMs: number,
  durationMs: number,
  loop: boolean
): number {
  const safeDuration = Math.max(1, durationMs);

  if (!loop) {
    return clamp(elapsedMs, 0, safeDuration);
  }

  return ((elapsedMs % safeDuration) + safeDuration) % safeDuration;
}

/**
 * Find all clips whose time range includes the given time.
 */
export function getActiveClips(clips: TimelineClip[], timeMs: number): TimelineClip[] {
  return clips.filter((clip) => timeMs >= clip.startMs && timeMs <= clip.endMs);
}

/**
 * Compute the blend weight for a clip at a given time.
 * Ramps up during blendIn, ramps down during blendOut, 1.0 in the middle.
 */
export function computeClipWeight(clip: TimelineClip, timeMs: number): number {
  const clipDuration = clip.endMs - clip.startMs;

  if (clipDuration <= 0) {
    return 0;
  }

  const localTime = timeMs - clip.startMs;
  const timeFromEnd = clip.endMs - timeMs;
  let weight = 1;

  if (clip.blendInMs > 0 && localTime < clip.blendInMs) {
    weight = Math.min(weight, smoothstep(localTime / clip.blendInMs));
  }

  if (clip.blendOutMs > 0 && timeFromEnd < clip.blendOutMs) {
    weight = Math.min(weight, smoothstep(timeFromEnd / clip.blendOutMs));
  }

  return weight;
}

function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Pre-built demo timeline: wave → walk → run → jump
 */
export function createDemoTimeline(): Timeline {
  return {
    id: "demo",
    name: "Demo Sequence",
    loop: true,
    durationMs: 6000,
    clips: [
      {
        id: "clip-1",
        motionId: "wave",
        startMs: 0,
        endMs: 1500,
        blendInMs: 0,
        blendOutMs: 250,
        label: "Wave"
      },
      {
        id: "clip-2",
        motionId: "walk",
        startMs: 1250,
        endMs: 3500,
        blendInMs: 250,
        blendOutMs: 300,
        label: "Walk"
      },
      {
        id: "clip-3",
        motionId: "run",
        startMs: 3200,
        endMs: 5000,
        blendInMs: 300,
        blendOutMs: 250,
        label: "Run"
      },
      {
        id: "clip-4",
        motionId: "jump",
        startMs: 4750,
        endMs: 6000,
        blendInMs: 250,
        blendOutMs: 0,
        label: "Jump"
      }
    ]
  };
}
