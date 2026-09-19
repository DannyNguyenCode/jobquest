import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaffoldValidation } from "./ScaffoldValidation";

describe("ScaffoldValidation", () => {
  it("renders the JobQuest scaffold confirmation", () => {
    render(<ScaffoldValidation />);

    expect(
      screen.getByRole("heading", { name: "JobQuest" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Project foundation is ready."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Scaffold ready" }),
    ).toBeInTheDocument();
  });
});
