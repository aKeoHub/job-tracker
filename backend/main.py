import sqlite3
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
from fastapi import HTTPException


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


class JobCreate(BaseModel):
    company: str
    position: str
    status: str

class JobStatusUpdate(BaseModel):
    status: Literal[
        "saved",
        "applied",
        "interviewing",
        "offer",
        "rejected",
    ]

def create_database():
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company TEXT NOT NULL,
                position TEXT NOT NULL,
                status TEXT NOT NULL
            )
            """
        )


create_database()


@app.get("/jobs")
def get_jobs():
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            "SELECT id, company, position, status FROM jobs"
        ).fetchall()

    return [dict(row) for row in rows]

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    with sqlite3.connect(DATABASE_PATH) as connection:
        cursor = connection.execute(
            "DELETE FROM jobs WHERE id = ?",
            (job_id,),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Job not found")

    return {"id": job_id, "deleted": True}

@app.patch("/jobs/{job_id}")
def update_job_status(job_id: int, job: JobStatusUpdate):
    with sqlite3.connect(DATABASE_PATH) as connection:
        cursor = connection.execute(
            "UPDATE jobs SET status = ? WHERE id = ?",
            (job.status, job_id),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Job not found")

    return {"id": job_id, "status": job.status}


@app.post("/jobs", status_code=201)
def create_job(job: JobCreate):
    with sqlite3.connect(DATABASE_PATH) as connection:
        cursor = connection.execute(
            """
            INSERT INTO jobs (company, position, status)
            VALUES (?, ?, ?)
            """,
            (job.company, job.position, job.status),
        )

        new_job = {
            "id": cursor.lastrowid,
            **job.model_dump(),
        }

    return new_job