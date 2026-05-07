import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const rendererRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(rendererRoot, "..");
const mode = process.argv[2] ?? "mp4";
const passthroughArgs = process.argv.slice(3);
const remotionBin = process.platform === "win32"
  ? join(workspaceRoot, "node_modules", ".bin", "remotion.cmd")
  : join(workspaceRoot, "node_modules", ".bin", "remotion");

const outputPath = mode === "frames"
  ? join(workspaceRoot, "exports", "frames")
  : join(workspaceRoot, "exports", "scene.mp4");

mkdirSync(mode === "frames" ? outputPath : dirname(outputPath), { recursive: true });

const args = [
  "render",
  "src/index.ts",
  "SceneComposition",
  outputPath,
  "--overwrite",
  ...passthroughArgs
];

if (mode === "frames") {
  args.push("--sequence");
} else {
  args.push("--codec", "h264");
}

const result = spawnSync(remotionBin, args, {
  cwd: rendererRoot,
  shell: process.platform === "win32",
  stdio: "inherit"
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
