import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "error";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "badge-neutral",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
};

const toneIcons: Record<StatusTone, ComponentType<SVGProps<SVGSVGElement>>> = {
  neutral: InformationCircleIcon,
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: ExclamationCircleIcon,
};

export function StatusBadge({
  label,
  tone = "neutral",
  className = "",
}: StatusBadgeProps) {
  const Icon = toneIcons[tone];

  return (
    <span
      className={`badge gap-1 border-2 border-transparent px-3 py-3 text-sm font-medium ${toneClasses[tone]} ${className}`.trim()}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
