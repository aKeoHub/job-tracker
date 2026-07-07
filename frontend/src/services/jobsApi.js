const API_URL = "http://127.0.0.1:8000";

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    let message = `The request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing errors
    }
    throw new Error(message);
  }

  return response.json();
}

export function getJobs() {
  return request("/jobs");
}

export function createJob(job) {
  return request("/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });
}

export function deleteJob(jobId) {
  return request(`/jobs/${jobId}`, {
    method: "DELETE",
  });
}

export function updateJobStatus(jobId, status) {
  return request(`/jobs/${jobId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}

export function updateJobDetails(jobId, details) {
  return request(`/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
}