from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
import subprocess
from uuid import uuid4

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models import CreateProjectRequest, CreateRenderRequest, HealthResponse, ProjectSummary, RenderJob
from .storage import storage


@asynccontextmanager
async def lifespan(_: FastAPI):
    storage.ensure()
    yield


app = FastAPI(title="Stick AI Studio API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="online", storageRoot=str(storage.root))


@app.get("/projects", response_model=list[ProjectSummary])
def list_projects() -> list[ProjectSummary]:
    projects = storage.read_json(storage.scenes / "projects.json", [])
    return [ProjectSummary(**project) for project in projects]


@app.post("/projects", response_model=ProjectSummary)
def create_project(payload: CreateProjectRequest) -> ProjectSummary:
    now = datetime.now(timezone.utc).isoformat()
    project = ProjectSummary(
        id=uuid4().hex,
        name=payload.name,
        sceneCount=0,
        updatedAt=now,
    )
    projects = storage.read_json(storage.scenes / "projects.json", [])
    projects.append(project.model_dump())
    storage.write_json(storage.scenes / "projects.json", projects)
    storage.write_json(storage.scenes / f"{project.id}.json", {"projectId": project.id, "scenes": []})
    (storage.assets / project.id).mkdir(parents=True, exist_ok=True)
    (storage.exports / project.id).mkdir(parents=True, exist_ok=True)
    return project


@app.post("/projects/{project_id}/assets")
async def upload_asset(project_id: str, file: UploadFile) -> dict[str, str]:
    target_dir = storage.assets / project_id
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / Path(file.filename or f"{uuid4().hex}.bin").name

    with target_path.open("wb") as handle:
        handle.write(await file.read())

    return {"path": str(target_path), "name": target_path.name}


@app.get("/renders", response_model=list[RenderJob])
def list_render_jobs() -> list[RenderJob]:
    jobs = storage.read_json(storage.exports / "render-jobs.json", [])
    return [RenderJob(**job) for job in jobs]


@app.post("/renders", response_model=RenderJob)
def queue_render(payload: CreateRenderRequest) -> RenderJob:
    now = datetime.now(timezone.utc)
    job = RenderJob(
        id=uuid4().hex,
        projectId=payload.projectId,
        compositionId=payload.compositionId,
        status="queued",
        createdAt=now,
        updatedAt=now,
    )
    jobs = storage.read_json(storage.exports / "render-jobs.json", [])
    jobs.append(job.model_dump(mode="json"))
    storage.write_json(storage.exports / "render-jobs.json", jobs)
    return job


@app.post("/renders/{job_id}/run", response_model=RenderJob)
def run_render(job_id: str) -> RenderJob:
    jobs = storage.read_json(storage.exports / "render-jobs.json", [])
    job_index = next((index for index, item in enumerate(jobs) if item["id"] == job_id), None)

    if job_index is None:
        raise HTTPException(status_code=404, detail="Render job not found")

    job = RenderJob(**jobs[job_index])
    job.status = "rendering"
    job.updatedAt = datetime.now(timezone.utc)
    jobs[job_index] = job.model_dump(mode="json")
    storage.write_json(storage.exports / "render-jobs.json", jobs)

    result = subprocess.run(
        settings.renderer_command,
        cwd=storage.root,
        shell=True,
        capture_output=True,
        text=True,
        check=False,
    )

    job.status = "completed" if result.returncode == 0 else "failed"
    job.updatedAt = datetime.now(timezone.utc)
    if result.returncode == 0:
        job.outputPath = str(storage.exports / "scene.mp4")

    jobs[job_index] = job.model_dump(mode="json")
    storage.write_json(storage.exports / "render-jobs.json", jobs)
    return job
