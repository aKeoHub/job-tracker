import { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch("http://127.0.0.1:8000/jobs");

        if (!response.ok) {
          throw new Error("Could not load jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h1>Job Tracker</h1>

      {jobs.map((job) => (
        <article key={job.id}>
          <h2>{job.position}</h2>
          <p>{job.company}</p>
          <p>Status: {job.status}</p>
        </article>
      ))}
    </main>
  );
}

export default App;