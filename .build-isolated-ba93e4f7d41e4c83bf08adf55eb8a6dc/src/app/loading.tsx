import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <LoaderCircle className="h-5 w-5 animate-spin text-teal-400" aria-hidden="true" />
        <span>Loading page...</span>
      </div>
    </main>
  );
}
