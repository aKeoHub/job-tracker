import sqlite3

import pytest
from fastapi.testclient import TestClient

from backend import main
from backend.repositories.job_repository import JobRepository


@pytest.fixture
def repository(tmp_path):
    repository = JobRepository(tmp_path / "test_jobs.db")
    repository.create_database()
    return repository


@pytest.fixture
def client(repository):
    main.app.dependency_overrides[main.get_job_repository] = (
        lambda: repository
    )

    with TestClient(main.app) as test_client:
        yield test_client

    main.app.dependency_overrides.clear()


def create_job(client, **overrides):
    job = {
        "company": "Example Company",
        "position": "Software Developer",
        "status": "saved",
        **overrides,
    }
    return client.post("/jobs", json=job)


def test_jobs_are_empty_initially(client):
    response = client.get("/jobs")

    assert response.status_code == 200
    assert response.json() == []


def test_create_and_list_job(client):
    create_response = create_job(client)

    assert create_response.status_code == 201
    assert create_response.json() == {
        "id": 1,
        "company": "Example Company",
        "position": "Software Developer",
        "status": "saved",
    }

    list_response = client.get("/jobs")

    assert list_response.status_code == 200
    assert list_response.json() == [create_response.json()]


def test_create_job_requires_all_fields(client):
    response = client.post(
        "/jobs",
        json={"company": "Example Company", "status": "applied"},
    )

    assert response.status_code == 422


def test_create_job_rejects_invalid_status(client):
    response = create_job(client, status="waiting forever")

    assert response.status_code == 422


def test_update_job_status(client):
    job_id = create_job(client).json()["id"]

    response = client.patch(
        f"/jobs/{job_id}",
        json={"status": "interviewing"},
    )

    assert response.status_code == 200
    assert response.json() == {"id": job_id, "status": "interviewing"}
    assert client.get("/jobs").json()[0]["status"] == "interviewing"


def test_update_job_rejects_invalid_status(client):
    job_id = create_job(client).json()["id"]

    response = client.patch(
        f"/jobs/{job_id}",
        json={"status": "unknown"},
    )

    assert response.status_code == 422


def test_update_missing_job_returns_404(client):
    response = client.patch("/jobs/999", json={"status": "applied"})

    assert response.status_code == 404
    assert response.json() == {"detail": "Job not found"}


def test_delete_job(client):
    job_id = create_job(client).json()["id"]

    response = client.delete(f"/jobs/{job_id}")

    assert response.status_code == 200
    assert response.json() == {"id": job_id, "deleted": True}
    assert client.get("/jobs").json() == []


def test_delete_missing_job_returns_404(client):
    response = client.delete("/jobs/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Job not found"}


def test_tests_use_an_isolated_database(client, repository):
    create_job(client)

    with sqlite3.connect(repository.database_path) as connection:
        count = connection.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]

    assert count == 1
    assert repository.database_path.name == "test_jobs.db"
