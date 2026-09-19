import type { ReactNode } from "react";

type LoadingStateProps = {
  label?: string;
  children?: ReactNode;
};

export function LoadingState({
  label = "Loading",
  children,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-start gap-3"
    >
      <div className="flex items-center gap-3 text-base-content">
        <span
          className="loading loading-spinner loading-md"
          aria-hidden="true"
        />
        <span className="font-medium">{label}</span>
      </div>
      {children}
    </div>
  );
}
