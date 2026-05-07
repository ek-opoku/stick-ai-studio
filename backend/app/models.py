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


class CreateRenderRequest(BaseModel):
    projectId: str = Field(min_length=1)
    compositionId: str = "MainComposition"


class RenderJob(BaseModel):
    id: str
    projectId: str
    compositionId: str
    status: Literal["queued", "rendering", "completed", "failed"]
    outputPath: str | None = None
    createdAt: datetime
    updatedAt: datetime
