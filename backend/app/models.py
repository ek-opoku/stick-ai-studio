from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    storageRoot: str


class ProjectSummary(BaseModel):
    id: str
    name: str
    sceneCount: int = 0
    updatedAt: str


class CreateProjectRequest(BaseModel):
    name: str = Field(min_length=1, max_length=80)


class Subtitle(BaseModel):
    text: str
    startMs: int
    endMs: int


class ExportConfig(BaseModel):
    format: Literal["mp4", "webm"] = "mp4"
    resolution: Literal["720p", "1080p", "4k"] = "1080p"
    aspectRatio: Literal["16:9", "9:16", "1:1"] = "16:9"
    includeAudio: bool = True
    audioUrl: str | None = None
    burnInSubtitles: bool = False
    subtitles: list[Subtitle] = []


class CreateRenderRequest(BaseModel):
    projectId: str = Field(min_length=1)
    compositionId: str = "SceneComposition"
    exportConfig: ExportConfig = Field(default_factory=ExportConfig)


class RenderJob(BaseModel):
    id: str
    projectId: str
    compositionId: str
    status: Literal["queued", "rendering", "completed", "failed"]
    exportConfig: ExportConfig | None = None
    outputPath: str | None = None
    createdAt: datetime
    updatedAt: datetime
