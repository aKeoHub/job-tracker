import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import JobCard from "./JobCard";


const job = {
  id: 7,
  company: "Acme",
  position: "Developer",
  status: "saved",
};

function renderCard(overrides = {}) {
  const props = {
    job,
    onStatusChange: vi.fn(),
    onDelete: vi.fn(),
    isDeleting: false,
    isUpdating: false,
    ...overrides,
  };

  render(<JobCard {...props} />);
  return props;
}


describe("JobCard", () => {
  it("displays the job details", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: "Acme" })).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByLabelText("Status:")).toHaveValue("saved");
  });

  it("reports a status change", async () => {
    const user = userEvent.setup();
    const props = renderCard();

    await user.selectOptions(screen.getByLabelText("Status:"), "applied");

    expect(props.onStatusChange).toHaveBeenCalledWith(7, "applied");
  });

  it("reports a delete click", async () => {
    const user = userEvent.setup();
    const props = renderCard();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(props.onDelete).toHaveBeenCalledWith(7);
  });

  it("disables card actions while updating", () => {
    renderCard({ isUpdating: true });

    expect(
      screen.getByRole("combobox", { name: /Status/ }),
    ).toBeDisabled();
    expect(screen.getByText("Updating...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  it("disables card actions while deleting", () => {
    renderCard({ isDeleting: true });

    expect(screen.getByLabelText("Status:")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();
  });
});
