import { useState } from "react";
import { JOB_STATUSES } from "../constants/jobStatuses";

function JobCard({
  job,
  onStatusChange,
  onUpdateDetails,
  onDelete,
  isDeleting,
  isUpdating,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(job.company);
  const [position, setPosition] = useState(job.position);

  async function handleSave(event) {
    event.preventDefault();

    await onUpdateDetails(job.id, {
      company,
      position,
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setCompany(job.company);
    setPosition(job.position);
    setIsEditing(false);
  }

  return (
    <article className="job-card">

      {isEditing ? (
        <form className="job-edit-form" onSubmit={handleSave}>
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

          <div className="job-edit-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2>{job.company}</h2>
          <p>
            <span className="job-label">Position:</span> {job.position}
          </p>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      )}

      <label className="job-status">
        <span className="job-label">Status:</span>
        <select
          value={job.status}
          onChange={(event) =>
            onStatusChange(job.id, event.target.value)
          }
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