"use client";

import Link from "next/link";

export default function EpisodeError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-950 px-4 text-center text-zinc-400" role="alert">
    <p>The episode is temporarily unavailable.</p>
    <div className="flex flex-wrap justify-center gap-4">
      <button type="button" onClick={reset} className="min-h-11 rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-black">Retry</button>
      <Link href="/episodes" className="inline-flex min-h-11 items-center rounded-lg border border-zinc-700 px-5 py-2.5 font-semibold text-teal-400">Back to episodes</Link>
    </div>
  </main>;
}
