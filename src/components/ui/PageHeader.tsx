import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  purpose: string;
  breadcrumbs?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  purpose,
  breadcrumbs,
  badges,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-6 space-y-3">
      {breadcrumbs ? (
        <div className="text-sm text-base-content/80">{breadcrumbs}</div>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-base-content sm:text-[1.75rem] lg:text-[2rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-base text-base-content/90">{purpose}</p>
          {badges ? (
            <div className="flex flex-wrap items-center gap-2">{badges}</div>
          ) : null}
        </div>
        {actions ? (
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end [&_.btn]:w-full sm:[&_.btn]:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
