import { useState } from "react";
import { JOB_STATUSES } from "../constants/jobStatuses";

function JobForm({ onCreateJob, isSaving }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("saved");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await onCreateJob({ company, position, status });
      setCompany("");
      setPosition("");
      setStatus("saved");
    } catch {
      // App displays API errors; keep the form values so the user can retry.
    }
  }

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <label>
        <span>Company</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
        />
      </label>

      <label>
        <span>Position</span>
        <input
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          required
        />
      </label>

      <label>
        <span>Status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {JOB_STATUSES.map((jobStatus) => (
            <option key={jobStatus.value} value={jobStatus.value}>
              {jobStatus.label}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Add job"}
      </button>
    </form>
  );
}

export default JobForm;
