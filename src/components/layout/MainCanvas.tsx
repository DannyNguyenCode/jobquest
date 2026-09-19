import type { ReactNode } from "react";

type MainCanvasProps = {
  children: ReactNode;
  id?: string;
};

export function MainCanvas({ children, id = "main-content" }: MainCanvasProps) {
  return (
    <main
      id={id}
      tabIndex={-1}
      className="min-w-0 flex-1 bg-base-100 outline-none"
    >
      <div
        className="mx-auto w-full px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6"
        style={{ maxWidth: "var(--jq-content-max-width)" }}
      >
        {children}
      </div>
    </main>
  );
}
