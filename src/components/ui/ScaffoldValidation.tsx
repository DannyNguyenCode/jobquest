import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function ScaffoldValidation() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-base-100 px-4 py-12 text-center text-base-content">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        JobQuest
      </h1>
      <p className="max-w-md text-base sm:text-lg">
        Project foundation is ready.
      </p>
      <button type="button" className="btn btn-primary gap-2">
        <CheckCircleIcon className="size-5" aria-hidden="true" />
        Scaffold ready
      </button>
    </main>
  );
}
