import type { ReactNode } from "react";

type SkipLinkProps = {
  href?: string;
  children?: ReactNode;
};

export function SkipLink({
  href = "#main-content",
  children = "Skip to content",
}: SkipLinkProps) {
  return (
    <a href={href} className="jq-skip-link btn btn-primary btn-sm">
      {children}
    </a>
  );
}
