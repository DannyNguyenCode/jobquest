import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

export function Panel({
  children,
  className = "",
  as: Component = "section",
  ...rest
}: PanelProps) {
  return (
    <Component
      className={`jq-panel flex h-full min-w-0 flex-col border-base-300 bg-base-100 ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}

type PanelHeaderProps = {
  title: string;
  titleId?: string;
  description?: string;
  badge?: ReactNode;
  action?: ReactNode;
};

export function PanelHeader({
  title,
  titleId,
  description,
  badge,
  action,
}: PanelHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b-2 border-base-300 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id={titleId}
              className="text-lg font-semibold leading-snug text-base-content sm:text-xl"
            >
              {title}
            </h2>
            {badge}
          </div>
          {description ? (
            <p className="text-sm text-base-content/80">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

type PanelBodyProps = {
  children: ReactNode;
  className?: string;
};

export function PanelBody({ children, className = "" }: PanelBodyProps) {
  return (
    <div className={`flex-1 px-4 py-4 lg:px-6 ${className}`.trim()}>
      {children}
    </div>
  );
}

type PanelFooterProps = {
  children: ReactNode;
  className?: string;
};

export function PanelFooter({ children, className = "" }: PanelFooterProps) {
  return (
    <div
      className={`border-t-2 border-base-300 px-4 py-3 lg:px-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
