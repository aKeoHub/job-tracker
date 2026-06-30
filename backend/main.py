from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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