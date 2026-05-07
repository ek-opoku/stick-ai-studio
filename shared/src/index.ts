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

export const renderJobSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  compositionId: z.string(),
  status: z.enum(["queued", "rendering", "completed", "failed"]),
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
