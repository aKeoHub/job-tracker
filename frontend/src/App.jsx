import { useEffect, useState } from "react";
import "./App.css";
import JobCard from "./components/JobCard";
import JobForm from "./components/JobForm";
import { createJob, getJobs, updateJobStatus, deleteJob } from "./services/jobsApi";

function App() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        setJobs(await getJobs());
      } catch (error) {
        setError(error.message);
      }
    }

    loadJobs();
  }, []);

  async function handleCreateJob(job) {
    setError("");

    try {
      const newJob = await createJob(job);
      setJobs((currentJobs) => [...currentJobs, newJob]);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function handleDeleteJob(jobId) {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) {
      return;
    }
    setError("");
    try {
      await deleteJob(jobId);
      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleStatusChange(jobId, status) {
    setError("");

    try {
      await updateJobStatus(jobId, status);
      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === jobId ? { ...job, status } : job,
        ),
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main>
      <h1>Job Tracker</h1>

      <JobForm onCreateJob={handleCreateJob} />
      {error && <p className="error-message">{error}</p>}

      <section className="job-list">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteJob}
          />
        ))}
      </section>
    </main>
  );
}

export default App;
