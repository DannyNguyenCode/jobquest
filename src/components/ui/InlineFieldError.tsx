type InlineFieldErrorProps = {
  id?: string;
  children: string;
};

export function InlineFieldError({ id, children }: InlineFieldErrorProps) {
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-error">
      {children}
    </p>
  );
}
