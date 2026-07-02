import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import {
  createJob,
  deleteJob,
  getJobs,
  updateJobStatus,
} from "./services/jobsApi";

vi.mock("./services/jobsApi", () => ({
  createJob: vi.fn(),
  deleteJob: vi.fn(),
  getJobs: vi.fn(),
  updateJobStatus: vi.fn(),
}));


const existingJob = {
  id: 1,
  company: "Acme",
  position: "Developer",
  status: "saved",
};

beforeEach(() => {
  vi.clearAllMocks();
});


describe("App", () => {
  it("shows loading followed by the empty state", async () => {
    let resolveJobs;
    getJobs.mockReturnValue(
      new Promise((resolve) => {
        resolveJobs = resolve;
      }),
    );

    render(<App />);
    expect(screen.getByText("Loading jobs...")).toBeInTheDocument();

    await act(async () => {
      resolveJobs([]);
    });

    expect(
      screen.getByText("No jobs yet. Add your first job above."),
    ).toBeInTheDocument();
  });

  it("loads and displays existing jobs", async () => {
    getJobs.mockResolvedValue([existingJob]);

    render(<App />);

    expect(
      await screen.findByRole("heading", { name: "Acme" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("creates a job and shows a success message", async () => {
    const user = userEvent.setup();
    getJobs.mockResolvedValue([]);
    createJob.mockResolvedValue(existingJob);
    render(<App />);

    await screen.findByText("No jobs yet. Add your first job above.");
    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.type(screen.getByLabelText("Position"), "Developer");
    await user.click(screen.getByRole("button", { name: "Add job" }));

    expect(createJob).toHaveBeenCalledWith({
      company: "Acme",
      position: "Developer",
      status: "saved",
    });
    expect(
      await screen.findByText("Developer at Acme was added."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Acme" })).toBeInTheDocument();
  });

  it("updates a job status", async () => {
    const user = userEvent.setup();
    getJobs.mockResolvedValue([existingJob]);
    updateJobStatus.mockResolvedValue({ id: 1, status: "applied" });
    render(<App />);

    const status = await screen.findByLabelText("Status:");
    await user.selectOptions(status, "applied");

    expect(updateJobStatus).toHaveBeenCalledWith(1, "applied");
    await waitFor(() => expect(status).toHaveValue("applied"));
    expect(
      screen.getByText("Job status updated successfully."),
    ).toBeInTheDocument();
  });

  it("deletes a confirmed job", async () => {
    const user = userEvent.setup();
    getJobs.mockResolvedValue([existingJob]);
    deleteJob.mockResolvedValue({ id: 1, deleted: true });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);

    await screen.findByRole("heading", { name: "Acme" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(window.confirm).toHaveBeenCalledWith("Delete this job?");
    expect(deleteJob).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Acme" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("Job deleted successfully.")).toBeInTheDocument();
  });

  it("does not delete when confirmation is cancelled", async () => {
    const user = userEvent.setup();
    getJobs.mockResolvedValue([existingJob]);
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<App />);

    await screen.findByRole("heading", { name: "Acme" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(deleteJob).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Acme" })).toBeInTheDocument();
  });

  it("shows an error when jobs cannot be loaded", async () => {
    getJobs.mockRejectedValue(new Error("API unavailable"));

    render(<App />);

    expect(await screen.findByText("Failed to load jobs.")).toBeInTheDocument();
  });
});
