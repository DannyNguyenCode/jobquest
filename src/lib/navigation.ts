import {
  BriefcaseIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type PrimaryNavItem = {
  href: string;
  label: string;
  icon: NavIcon;
};

export const primaryNavItems: PrimaryNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/discover/jobs", label: "Discovery", icon: MagnifyingGlassIcon },
  {
    href: "/opportunities/jobs",
    label: "Opportunities",
    icon: BriefcaseIcon,
  },
  {
    href: "/applications",
    label: "Applications",
    icon: DocumentTextIcon,
  },
];
