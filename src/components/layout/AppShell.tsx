"use client";

import {
  useCallback,
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { MainCanvas } from "@/components/layout/MainCanvas";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { SkipLink } from "@/components/layout/SkipLink";
import { TopBar } from "@/components/layout/TopBar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const reactId = useId();
  const menuButtonId = `${reactId}-menu-button`;
  const mobileNavId = `${reactId}-mobile-nav`;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  const onDrawerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setMobileNavOpen(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-base-100">
      <SkipLink />
      <TopBar
        menuButtonId={menuButtonId}
        menuExpanded={mobileNavOpen}
        menuControlsId={mobileNavId}
        onMenuToggle={toggleMobileNav}
      />

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-64 shrink-0 border-r-2 border-base-300 bg-base-100 lg:block"
          aria-label="Primary navigation rail"
        >
          <div className="sticky top-0 max-h-screen overflow-y-auto py-2">
            <PrimaryNav id="desktop-primary-navigation" />
          </div>
        </aside>

        <div
          className={[
            "fixed inset-0 z-40 lg:hidden",
            mobileNavOpen ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
          onKeyDown={onDrawerKeyDown}
        >
          <button
            type="button"
            tabIndex={mobileNavOpen ? 0 : -1}
            className={[
              "absolute inset-0 bg-neutral/40 transition-opacity",
              mobileNavOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-label="Dismiss navigation menu"
            hidden={!mobileNavOpen}
            onClick={closeMobileNav}
          />
          <aside
            id={mobileNavId}
            className={[
              "absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r-2 border-base-300 bg-base-100 shadow-sm transition-transform",
              mobileNavOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
            aria-label="Mobile navigation drawer"
            aria-hidden={!mobileNavOpen}
          >
            <div className="border-b-2 border-base-300 px-4 py-3">
              <p className="text-sm font-semibold text-base-content">
                Navigation
              </p>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <PrimaryNav
                id="mobile-primary-navigation"
                ariaLabel="Mobile primary"
                onNavigate={closeMobileNav}
              />
            </div>
          </aside>
        </div>

        <MainCanvas>{children}</MainCanvas>
      </div>
    </div>
  );
}
