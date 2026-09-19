type SkeletonStateProps = {
  label?: string;
  rows?: number;
};

export function SkeletonState({
  label = "Loading placeholder",
  rows = 3,
}: SkeletonStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="space-y-3"
    >
      <p className="text-sm font-medium text-base-content">{label}</p>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="skeleton h-4 w-full rounded-md bg-base-300"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
