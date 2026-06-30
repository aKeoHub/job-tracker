import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("saved");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch(`${API_URL}/jobs`);

        if (!response.ok) {
          throw new Error("Could not load jobs");
        }

        setJobs(await response.json());
      } catch (error) {
        setError(error.message);
      }
    }

    loadJobs();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          position,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create job");
      }

      const newJob = await response.json();
      setJobs((currentJobs) => [...currentJobs, newJob]);

      setCompany("");
      setPosition("");
      setStatus("saved");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main>
      <h1>Job Tracker</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />
        </label>

        <label>
          Position
          <input
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            required
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <button type="submit">Add job</button>
      </form>

      {error && <p>{error}</p>}

      <section>
        {jobs.map((job) => (
          <article key={job.id}>
            <h2>{job.position}</h2>
            <p>{job.company}</p>
            <p>Status: {job.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;