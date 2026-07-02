import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import JobForm from "./JobForm";


describe("JobForm", () => {
  it("submits the entered job and clears the form", async () => {
    const user = userEvent.setup();
    const onCreateJob = vi.fn().mockResolvedValue(undefined);
    render(<JobForm onCreateJob={onCreateJob} isSaving={false} />);

    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.type(screen.getByLabelText("Position"), "Developer");
    await user.selectOptions(screen.getByLabelText("Status"), "applied");
    await user.click(screen.getByRole("button", { name: "Add job" }));

    expect(onCreateJob).toHaveBeenCalledWith({
      company: "Acme",
      position: "Developer",
      status: "applied",
    });
    await waitFor(() => {
      expect(screen.getByLabelText("Company")).toHaveValue("");
    });
    expect(screen.getByLabelText("Position")).toHaveValue("");
    expect(screen.getByLabelText("Status")).toHaveValue("saved");
  });

  it("disables every control while saving", () => {
    render(<JobForm onCreateJob={vi.fn()} isSaving />);

    expect(screen.getByLabelText("Company")).toBeDisabled();
    expect(screen.getByLabelText("Position")).toBeDisabled();
    expect(screen.getByLabelText("Status")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });

  it("keeps the entered values when saving fails", async () => {
    const user = userEvent.setup();
    const onCreateJob = vi.fn().mockRejectedValue(new Error("API unavailable"));
    render(<JobForm onCreateJob={onCreateJob} isSaving={false} />);

    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.type(screen.getByLabelText("Position"), "Developer");
    await user.click(screen.getByRole("button", { name: "Add job" }));

    await waitFor(() => expect(onCreateJob).toHaveBeenCalledOnce());
    expect(screen.getByLabelText("Company")).toHaveValue("Acme");
    expect(screen.getByLabelText("Position")).toHaveValue("Developer");
  });
});
