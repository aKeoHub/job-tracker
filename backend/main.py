from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

class JobCreate(BaseModel):
    company: str
    position: str
    status: str

jobs = [
    {
        "id": 1,
        "company": "Example Company",
        "position": "Junior Developer",
        "status": "applied",
    }
]


@app.get("/")
def read_root():
    return {"message": "Job Tracker API is running"}


@app.get("/jobs")
def get_jobs():
    return jobs

@app.post("/jobs", status_code=201)
def create_job(job: JobCreate):
    new_job = {
        "id": len(jobs) + 1,
        **job.model_dump(),
    }

    jobs.append(new_job)
    return new_job