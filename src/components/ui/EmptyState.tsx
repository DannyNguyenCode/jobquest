import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 py-2">
      <h3 className="text-base font-semibold text-base-content">{title}</h3>
      <p className="max-w-prose text-sm text-base-content/80">{description}</p>
      {action}
    </div>
  );
}
