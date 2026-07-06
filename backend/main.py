from pathlib import Path
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from backend.repositories import JobRepository
except ModuleNotFoundError:
    from repositories import JobRepository

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_PATH = Path(__file__).with_name("jobs.db")
JobStatus = Literal["saved", "applied", "interviewing", "offer", "rejected"]


class JobCreate(BaseModel):
    company: str
    position: str
    status: JobStatus


class JobStatusUpdate(BaseModel):
    status: JobStatus

class JobDetailsUpdate(BaseModel):
    company: str
    position: str
    


def get_job_repository() -> JobRepository:
    return JobRepository(DATABASE_PATH)


def create_database() -> None:
    get_job_repository().create_database()


create_database()


@app.get("/jobs")
def get_jobs(repo: JobRepository = Depends(get_job_repository)):
    return repo.get_all()

@app.put("/jobs/{job_id}")
def update_job_details(job_id: int, job: JobDetailsUpdate, repo: JobRepository = Depends(get_job_repository)):
    if not repo.update_details(job_id, job.company, job.position):
        raise HTTPException(status_code=404, detail="Job not found")

    return {"id": job_id, "company": job.company, "position": job.position}


@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, repo: JobRepository = Depends(get_job_repository)):
    if not repo.delete(job_id):
        raise HTTPException(status_code=404, detail="Job not found")

    return {"id": job_id, "deleted": True}


@app.patch("/jobs/{job_id}")
def update_job_status(job_id: int, job: JobStatusUpdate, repo: JobRepository = Depends(get_job_repository)):
    if not repo.update_status(job_id, job.status):
        raise HTTPException(status_code=404, detail="Job not found")

    return {"id": job_id, "status": job.status}


@app.post("/jobs", status_code=201)
def create_job(job: JobCreate, repo: JobRepository = Depends(get_job_repository)):
    return repo.create(
        company=job.company,
        position=job.position,
        status=job.status,
    )
