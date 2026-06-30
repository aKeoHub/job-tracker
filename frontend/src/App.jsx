import { useEffect, useState } from "react";
import "./App.css";
import JobCard from "./components/JobCard";
import JobForm from "./components/JobForm";
import { createJob, getJobs, updateJobStatus, deleteJob } from "./services/jobsApi";

function App() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [updatingJobIds, setUpdatingJobIds] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        setJobs(await getJobs());
      } catch {
        setMessage({
          type: "error",
          text: `Failed to load jobs.`,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, []);

  async function handleCreateJob(job) {
    setMessage("");
    setIsSaving(true);

    try {
      const newJob = await createJob(job);
      setJobs((currentJobs) => [...currentJobs, newJob]);

      setMessage({
        type: "success",
        text: `${newJob.position} at ${newJob.company} was added.`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to add ${job.position} at ${job.company}.`,
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm("Delete this job?")) return;

    setMessage("");
    setDeletingJobId(jobId);

    try {
      await deleteJob(jobId);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== jobId)
      );
      setMessage({
        type: "success",
        text: `Job deleted successfully.`,
      });
    } catch {
      setMessage({
        type: "error",
        text: `Failed to delete job.`,
      });
    } finally {
      setDeletingJobId(null);
    }
  }

  async function handleStatusChange(jobId, status) {
    setMessage("");
    setUpdatingJobIds((currentIds) => [...currentIds, jobId]);

    try {
      await updateJobStatus(jobId, status);
      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === jobId ? { ...job, status } : job,
        ),
      );
      setMessage({
        type: "success",
        text: `Job status updated successfully.`,
      });
    } catch {
      setMessage({
        type: "error",
        text: `Failed to update job status.`,
      });
    } finally {
      setUpdatingJobIds((currentIds) => currentIds.filter((id) => id !== jobId));
    }
  }

  return (
    <main>
      <h1>Job Tracker</h1>

      <JobForm onCreateJob={handleCreateJob} isSaving={isSaving} />
      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs yet. Add your first job above.</p>
      ) : (
        <section className="job-list">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteJob}
              isDeleting={deletingJobId === job.id}
              isUpdating={updatingJobIds.includes(job.id)}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
