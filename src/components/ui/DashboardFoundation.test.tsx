import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardFoundationPage from "@/app/(app)/dashboard/page";
import { AppShell } from "@/components/layout/AppShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    "aria-current"?: "page";
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Dashboard foundation page", () => {
  it("uses a correct page-heading hierarchy and foundation preview copy", () => {
    render(
      <AppShell>
        <DashboardFoundationPage />
      </AppShell>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Needs attention" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Profile readiness" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Skeleton demonstration",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Foundation preview of the shared application shell/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not show live JobQuest data/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Foundation preview — not live JobQuest data"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Component demonstration: skeleton loading state"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "No attention items yet",
      }),
    ).toBeInTheDocument();
  });
});
