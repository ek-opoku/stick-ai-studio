# Stick AI Studio

Local-first AI animation workstation architecture for personal use.

This workspace is intentionally small: no authentication, billing, teams, tenants, or remote asset storage. The backend reads and writes local files, the frontend is a local control surface, and Remotion renders videos on the same machine.

## Folder Structure

```text
stick-ai-studio/
  frontend/          Next.js + TypeScript + Tailwind workstation UI
  backend/           FastAPI API for local projects, assets, jobs, and renders
  renderer/          Remotion compositions and local render entrypoints
  shared/            Shared TypeScript schemas and helpers
  assets/            Local imported/generated media
  scenes/            Scene JSON documents
  motions/           Motion presets and animation metadata
  exports/           Rendered videos and image sequences
```

## Prerequisites

- Node.js 20+
- Python 3.11+
- npm 10+

## Setup

Install JavaScript dependencies:

```bash
npm install
```

Create a Python virtual environment and install the backend dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

Copy backend environment defaults:

```bash
copy backend\.env.example backend\.env
```

## Development

Run everything in local development mode:

```bash
npm run dev
```

Or run each surface separately:

```bash
npm run dev:frontend
npm run dev:backend
npm run dev:renderer
```

Default local URLs:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Remotion Studio: http://localhost:3001

## Rendering

Render the default local composition:

```bash
npm run render
```

Rendered files are written to `exports/`.

The renderer workspace exposes the render pipeline directly:

```bash
npm run render:mp4
npm run render:frames
npm run dev:renderer
```

- `render:mp4` exports `exports/scene.mp4`.
- `render:frames` exports an image sequence into `exports/frames/`.
- `dev:renderer` opens Remotion Studio on http://localhost:3001.
- `SceneComposition` is the reusable Remotion composition for scene playback.

The Remotion pipeline uses `useCurrentFrame()` and the composition FPS to convert frames into scene milliseconds, then samples the same JSON scene and motion definitions used by the app.

The backend can also queue and run a local render job:

```bash
curl -X POST http://localhost:8000/renders ^
  -H "Content-Type: application/json" ^
  -d "{\"projectId\":\"demo\",\"compositionId\":\"MainComposition\"}"
```

Then run the returned job id:

```bash
curl -X POST http://localhost:8000/renders/{jobId}/run
```

## Stick Figure Rig

The frontend includes a modular SVG stick figure renderer at `frontend/src/components/stick-figure`.

- Limbs are two-bone transform chains driven by shoulder, elbow, hip, and knee angles.
- Poses can be flat objects or structured JSON with `joints`, `body`, and `head`.
- Presets live in `frontend/src/components/stick-figure/poses`.
- Motion timelines live in `frontend/src/components/stick-figure/motions`.
- `sampleMotion` evaluates JSON keyframes into poses, and `blendPoseFrames` / `blendMotions` combine motions by weight.
- `useWalkCycle` runs a looping procedural walk using `requestAnimationFrame`.
- `useMotionPlayer` plays any JSON motion preset using `requestAnimationFrame`.

Example:

```tsx
<StickFigureMotionPreview motion="wave" playbackSpeed={1.1} />
```

Motion definitions use this JSON shape:

```json
{
  "id": "walk",
  "name": "Walk",
  "durationMs": 900,
  "loop": "loop",
  "keyframes": [
    {
      "timeMs": 0,
      "easing": "smoothstep",
      "pose": {
        "body": { "x": 0, "y": 0 },
        "head": { "tilt": 2 },
        "joints": { "leftShoulder": 24, "rightHip": 22 }
      }
    }
  ]
}
```

## Scene Playback

The frontend includes a scene playback engine at `frontend/src/components/scene-player`.

- Scenes define `durationMs`, layers, characters, and per-character motion clips.
- Characters share one scene clock, so walk/run/gesture motions stay synchronized.
- Each character can have its own layer, z-index, transform, colors, opacity, and clips.
- `sampleScene` is pure and can be reused in UI, tests, or Remotion rendering.
- `useScenePlayer` drives interactive playback with `requestAnimationFrame`.

Example scene character:

```json
{
  "id": "walker",
  "layerId": "front-actors",
  "x": 165,
  "y": 92,
  "scale": 1,
  "clips": [
    {
      "id": "walker-walk",
      "motionId": "walk",
      "startMs": 0,
      "endMs": 4200,
      "blendOutMs": 350
    }
  ]
}
```

## Local-First Data Model

- Projects are local JSON records created by the backend.
- Assets live under `assets/{projectId}/`.
- Scene documents live under `scenes/{projectId}.json`.
- Motion presets live under `motions/`.
- Rendered outputs live under `exports/{projectId}/`.

This makes backup and migration simple: copy the workspace folder.
