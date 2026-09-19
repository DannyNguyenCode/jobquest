"use client";

import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type TopBarProps = {
  menuButtonId: string;
  menuExpanded: boolean;
  menuControlsId: string;
  onMenuToggle: () => void;
};

export function TopBar({
  menuButtonId,
  menuExpanded,
  menuControlsId,
  onMenuToggle,
}: TopBarProps) {
  return (
    <header className="navbar min-h-14 border-b-2 border-base-300 bg-base-100 px-2 sm:px-4">
      <div className="navbar-start gap-1">
        <button
          id={menuButtonId}
          type="button"
          className="jq-touch-target btn btn-ghost btn-square lg:hidden"
          aria-label={
            menuExpanded ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuExpanded}
          aria-controls={menuControlsId}
          onClick={onMenuToggle}
        >
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>
        <Link
          href="/dashboard"
          className="btn btn-ghost px-2 text-lg font-bold normal-case tracking-tight"
        >
          JobQuest
        </Link>
      </div>

      <div className="navbar-end gap-1">
        <button
          type="button"
          className="jq-touch-target btn btn-ghost btn-square"
          aria-label="Notifications (placeholder)"
        >
          <BellIcon className="size-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="jq-touch-target btn btn-ghost btn-square"
          aria-label="Account menu (placeholder)"
        >
          <UserCircleIcon className="size-6" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
