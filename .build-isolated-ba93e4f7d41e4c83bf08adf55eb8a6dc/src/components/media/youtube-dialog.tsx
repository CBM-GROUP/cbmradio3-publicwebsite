"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { YouTubeMedia } from "@/lib/youtube";

export default function YouTubeDialog({ title, media, returnFocus, onClose }: {
  title: string;
  media: YouTubeMedia;
  returnFocus: HTMLButtonElement | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      returnFocus?.focus();
    };
  }, [returnFocus]);

  return (
    <dialog ref={dialogRef} aria-labelledby="youtube-dialog-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={onClose} className="m-auto w-[calc(100%-2rem)] max-w-5xl rounded-2xl border border-zinc-700 bg-zinc-950 p-0 text-white backdrop:bg-black/85">
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="youtube-dialog-title" className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-zinc-800 focus-visible:ring-2 focus-visible:ring-teal-300" aria-label="Close video player"><X aria-hidden="true" /></button>
        </div>
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe src={media.embedUrl} title={title + " video"} className="h-full w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        <a href={media.watchUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-teal-400 underline">Watch on YouTube</a>
      </div>
    </dialog>
  );
}
