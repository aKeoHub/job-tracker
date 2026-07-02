import { JOB_STATUSES } from "../constants/jobStatuses";

function JobCard({ job, onStatusChange, onDelete, isDeleting, isUpdating }) {
  return (
    <article className="job-card">
      <h2>{job.company}</h2>
      <p>
        <span className="job-label">Position:</span> {job.position}
      </p>
      <label className="job-status">
        <span className="job-label">Status:</span>
        <select
          value={job.status}
          onChange={(event) => onStatusChange(job.id, event.target.value)}
          disabled={isUpdating || isDeleting}
        >
          {JOB_STATUSES.map((jobStatus) => (
            <option key={jobStatus.value} value={jobStatus.value}>
              {jobStatus.label}
            </option>
          ))}
        </select>
        {isUpdating && <span>Updating...</span>}
      </label>
      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(job.id)}
        disabled={isDeleting || isUpdating}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </article>
  );
}

export default JobCard;
