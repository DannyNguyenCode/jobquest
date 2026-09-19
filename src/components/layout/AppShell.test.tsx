import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
    "aria-current"?: "page";
  }) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

describe("AppShell", () => {
  it("exposes a main landmark and skip link", () => {
    render(
      <AppShell>
        <h1>Dashboard</h1>
      </AppShell>,
    );

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("renders primary navigation labels", () => {
    render(
      <AppShell>
        <h1>Dashboard</h1>
      </AppShell>,
    );

    const desktopNav = screen.getByRole("navigation", {
      name: "Primary",
    });

    for (const label of [
      "Dashboard",
      "Profile",
      "Discovery",
      "Opportunities",
      "Applications",
    ]) {
      expect(
        within(desktopNav).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("provides an accessible mobile menu control that toggles expanded state", async () => {
    const user = userEvent.setup();

    render(
      <AppShell>
        <h1>Dashboard</h1>
      </AppShell>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);

    const closeToggle = screen.getByRole("button", {
      name: "Close navigation menu",
    });
    expect(closeToggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Mobile primary" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile navigation after a keyboard-activated selection", async () => {
    const user = userEvent.setup();

    render(
      <AppShell>
        <h1>Dashboard</h1>
      </AppShell>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const mobileNav = screen.getByRole("navigation", {
      name: "Mobile primary",
    });
    await user.click(within(mobileNav).getByRole("link", { name: "Profile" }));

    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("names icon-only placeholder controls", () => {
    render(
      <AppShell>
        <h1>Dashboard</h1>
      </AppShell>,
    );

    expect(
      screen.getByRole("button", { name: "Notifications (placeholder)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Account menu (placeholder)" }),
    ).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  it("exposes status text without relying on color alone", () => {
    render(<StatusBadge tone="warning" label="Needs Attention" />);

    expect(screen.getByText("Needs Attention")).toBeInTheDocument();
  });
});
