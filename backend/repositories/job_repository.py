import sqlite3
from pathlib import Path


class JobRepository:
    """Store and retrieve jobs from a SQLite database."""

    def __init__(self, database_path: Path):
        self.database_path = database_path

    def create_database(self) -> None:
        with sqlite3.connect(self.database_path) as connection:
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

    def get_all(self) -> list[dict]:
        with sqlite3.connect(self.database_path) as connection:
            connection.row_factory = sqlite3.Row
            rows = connection.execute(
                "SELECT id, company, position, status FROM jobs"
            ).fetchall()

        return [dict(row) for row in rows]

    def create(self, company: str, position: str, status: str) -> dict:
        with sqlite3.connect(self.database_path) as connection:
            cursor = connection.execute(
                """
                INSERT INTO jobs (company, position, status)
                VALUES (?, ?, ?)
                """,
                (company, position, status),
            )

        return {
            "id": cursor.lastrowid,
            "company": company,
            "position": position,
            "status": status,
        }

    def update_status(self, job_id: int, status: str) -> bool:
        with sqlite3.connect(self.database_path) as connection:
            cursor = connection.execute(
                "UPDATE jobs SET status = ? WHERE id = ?",
                (status, job_id),
            )

        return cursor.rowcount > 0
    
    def update_details(self, job_id: int, company: str, position: str) -> bool:
        with sqlite3.connect(self.database_path) as connection:
            cursor = connection.execute(
                "UPDATE jobs SET company = ?, position = ? WHERE id = ?",
                (company, position, job_id),
            )

        return cursor.rowcount > 0

    def delete(self, job_id: int) -> bool:
        with sqlite3.connect(self.database_path) as connection:
            cursor = connection.execute(
                "DELETE FROM jobs WHERE id = ?",
                (job_id,),
            )

        return cursor.rowcount > 0
