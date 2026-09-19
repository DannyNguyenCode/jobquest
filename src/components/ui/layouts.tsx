import { Children, type ReactNode } from "react";

const gridBase = "grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-6";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

function wrapColumns(
  children: ReactNode,
  spanClass: string | ((index: number) => string),
) {
  return Children.map(children, (child, index) => {
    if (child == null) {
      return null;
    }

    const span = typeof spanClass === "function" ? spanClass(index) : spanClass;

    return <div className={`min-w-0 ${span}`}>{child}</div>;
  });
}

export function FocusLayout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`${gridBase} ${className}`.trim()}>
      {wrapColumns(children, (index) =>
        index === 0 ? "lg:col-span-8" : "lg:col-span-4",
      )}
    </div>
  );
}

export function OverviewLayout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`${gridBase} ${className}`.trim()}>
      {wrapColumns(children, "lg:col-span-4")}
    </div>
  );
}

export function QueueLayout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`${gridBase} ${className}`.trim()}>
      {wrapColumns(children, (index) =>
        index === 0 ? "lg:col-span-9" : "lg:col-span-3",
      )}
    </div>
  );
}

export function ComparisonLayout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`${gridBase} ${className}`.trim()}>
      {wrapColumns(children, "lg:col-span-6")}
    </div>
  );
}

export function FullCanvasLayout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`${gridBase} ${className}`.trim()}>
      {wrapColumns(children, "lg:col-span-12")}
    </div>
  );
}
