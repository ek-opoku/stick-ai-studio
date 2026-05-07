import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.string(),
  storageRoot: z.string()
});

export const projectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  sceneCount: z.number(),
  updatedAt: z.string()
});

export const exportConfigSchema = z.object({
  format: z.enum(["mp4", "webm"]).default("mp4"),
  resolution: z.enum(["720p", "1080p", "4k"]).default("1080p"),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
  includeAudio: z.boolean().default(true),
  audioUrl: z.string().optional(),
  burnInSubtitles: z.boolean().default(false),
  subtitles: z.array(z.object({
    text: z.string(),
    startMs: z.number(),
    endMs: z.number()
  })).optional()
});

export const renderJobSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  compositionId: z.string(),
  status: z.enum(["queued", "rendering", "completed", "failed"]),
  exportConfig: exportConfigSchema.optional(),
  outputPath: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type ProjectSummary = z.infer<typeof projectSummarySchema>;
export type RenderJob = z.infer<typeof renderJobSchema>;

export const localFolders = {
  assets: "assets",
  scenes: "scenes",
  motions: "motions",
  exports: "exports"
} as const;

export function projectAssetPath(projectId: string, filename: string) {
  return `${localFolders.assets}/${projectId}/${filename}`;
}
