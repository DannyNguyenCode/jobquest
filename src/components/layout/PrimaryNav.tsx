"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavItems } from "@/lib/navigation";

type PrimaryNavProps = {
  id?: string;
  ariaLabel?: string;
  onNavigate?: () => void;
};

export function PrimaryNav({
  id = "primary-navigation",
  ariaLabel = "Primary",
  onNavigate,
}: PrimaryNavProps) {
  const pathname = usePathname();

  return (
    <nav id={id} aria-label={ariaLabel} className="flex h-full flex-col">
      <ul className="menu menu-lg w-full gap-1 p-2">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "active font-semibold" : undefined}
                onClick={onNavigate}
              >
                <Icon className="size-6 shrink-0" aria-hidden="true" />
                <span className="whitespace-normal break-words">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
