import { useEffect, useState } from "react";
import "./App.css";
import JobCard from "./components/JobCard";
import JobForm from "./components/JobForm";
import { createJob, getJobs, updateJobStatus, deleteJob } from "./services/jobsApi";

function App() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        setJobs(await getJobs());
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, []);

  async function handleCreateJob(job) {
    setError("");
    setIsSaving(true);

    try {
      const newJob = await createJob(job);
      setJobs((currentJobs) => [...currentJobs, newJob]);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm("Delete this job?")) return;

    setError("");
    setDeletingJobId(jobId);

    try {
      await deleteJob(jobId);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== jobId)
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingJobId(null);
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

      <JobForm onCreateJob={handleCreateJob} isSaving={isSaving} />
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <section className="job-list">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteJob}
              isDeleting={deletingJobId === job.id}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
