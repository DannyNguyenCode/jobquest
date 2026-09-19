import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, ReactNode, SVGProps } from "react";

export type PanelAlertTone = "info" | "warning" | "error";

type PanelAlertProps = {
  title: string;
  children: ReactNode;
  tone?: PanelAlertTone;
  action?: ReactNode;
};

const toneClasses: Record<PanelAlertTone, string> = {
  info: "alert-info",
  warning: "alert-warning",
  error: "alert-error",
};

const toneIcons: Record<
  PanelAlertTone,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  error: ExclamationCircleIcon,
};

export function PanelAlert({
  title,
  children,
  tone = "info",
  action,
}: PanelAlertProps) {
  const Icon = toneIcons[tone];

  return (
    <div
      role="status"
      className={`alert ${toneClasses[tone]} items-start border-2`}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        <p className="font-semibold">{title}</p>
        <div className="text-sm">{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
