"use client";

import axios from "axios";
import { useEffect, useId, useRef, useState } from "react";

import { commentService } from "@/services/comment.service";
import type { PublicComment } from "@/types/comment";

type Fields = { name: string; email: string; body: string };
type Errors = Partial<Record<keyof Fields, string>>;
const emptyFields: Fields = { name: "", email: "", body: "" };

export default function EpisodeComments({ episodeId }: { episodeId: number }) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [listState, setListState] = useState<"loading" | "ready" | "error">("loading");
  const [moreState, setMoreState] = useState<"idle" | "loading" | "error">("idle");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => { if (mounted) setListState("loading"); });
    commentService.getEpisodeComments(episodeId, 1).then((response) => {
      if (!mounted) return;
      setComments(response.results);
      setHasMore(Boolean(response.next));
      setPage(1);
      setListState("ready");
    }).catch(() => { if (mounted) setListState("error"); });
    return () => { mounted = false; };
  }, [episodeId, retry]);

  const loadMore = async () => {
    if (!hasMore || moreState === "loading") return;
    setMoreState("loading");
    try {
      const response = await commentService.getEpisodeComments(episodeId, page + 1);
      setComments((current) => mergeComments(current, response.results));
      setPage((current) => current + 1);
      setHasMore(Boolean(response.next));
      setMoreState("idle");
    } catch {
      setMoreState("error");
    }
  };

  return (
    <section aria-labelledby="comments-heading" className="mx-auto mt-16 max-w-4xl border-t border-zinc-800 pt-12">
      <h2 id="comments-heading" className="text-2xl font-bold sm:text-3xl">Listener comments</h2>
      <div className="mt-6">
        {listState === "loading" && <p className="text-zinc-400" aria-live="polite">Loading comments...</p>}
        {listState === "error" && <StateError message="Comments are temporarily unavailable." retry={() => setRetry((value) => value + 1)} />}
        {listState === "ready" && comments.length === 0 && <p className="text-zinc-400">No comments have been published yet. Be the first to submit one.</p>}
        {listState === "ready" && comments.length > 0 && (
          <ol className="space-y-5">
            {comments.map((comment) => <li key={comment.id}><CommentItem comment={comment} /></li>)}
          </ol>
        )}
        {listState === "ready" && (hasMore || moreState === "error") && (
          <div className="mt-6">
            {moreState === "error" && <p className="mb-3 text-sm text-amber-200" role="alert">More comments could not be loaded. Previously loaded comments are still shown.</p>}
            <button type="button" onClick={() => void loadMore()} disabled={moreState === "loading"} className="min-h-11 rounded-lg border border-teal-600 px-5 py-2.5 font-semibold text-teal-300 disabled:opacity-60">
              {moreState === "loading" ? "Loading more..." : moreState === "error" ? "Try loading more again" : "Load more comments"}
            </button>
          </div>
        )}
      </div>
      <CommentForm episodeId={episodeId} />
    </section>
  );
}

function CommentItem({ comment }: { comment: PublicComment }) {
  const date = formatDate(comment.created_at);
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-5 break-words">
      <header className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-bold text-zinc-100">{comment.name}</h3>{date && <time dateTime={comment.created_at} className="text-sm text-zinc-500">{date}</time>}</header>
      <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-300">{comment.body}</p>
      {comment.admin_reply && <section className="mt-5 border-l-2 border-teal-500 pl-4"><h4 className="text-sm font-bold text-teal-300">CBM Radio reply</h4><p className="mt-2 whitespace-pre-wrap leading-7 text-zinc-300">{comment.admin_reply}</p></section>}
    </article>
  );
}

function CommentForm({ episodeId }: { episodeId: number }) {
  const prefix = useId();
  const statusRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const validation = validate(fields);
    setErrors(validation);
    setStatus(null);
    if (Object.keys(validation).length) return;
    setSubmitting(true);
    try {
      await commentService.submitEpisodeComment({ ...fields, name: fields.name.trim(), email: fields.email.trim(), body: fields.body.trim(), episode: episodeId });
      setFields(emptyFields);
      setStatus({ kind: "success", message: "Thank you. Your comment was submitted and will be reviewed before it appears publicly." });
    } catch (error) {
      const mapped = mapBackendErrors(error);
      setErrors(mapped.fields);
      setStatus({ kind: "error", message: mapped.message });
    } finally {
      setSubmitting(false);
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  return (
    <form onSubmit={submit} noValidate className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
      <h2 className="text-2xl font-bold">Leave a comment</h2>
      <p className="mt-2 text-sm text-zinc-400">Your comment will be reviewed before it appears publicly. All fields are required.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={`${prefix}-name`} label="Name" value={fields.name} error={errors.name} disabled={submitting} onChange={(name) => setFields((current) => ({ ...current, name }))} />
        <Field id={`${prefix}-email`} label="Email" type="email" value={fields.email} error={errors.email} disabled={submitting} onChange={(email) => setFields((current) => ({ ...current, email }))} />
      </div>
      <div className="mt-5"><Field id={`${prefix}-body`} label="Comment" multiline value={fields.body} error={errors.body} disabled={submitting} onChange={(body) => setFields((current) => ({ ...current, body }))} /></div>
      {status && <div ref={statusRef} tabIndex={-1} role={status.kind === "error" ? "alert" : "status"} className={`mt-5 rounded-lg border p-3 text-sm ${status.kind === "success" ? "border-teal-700 bg-teal-950/30 text-teal-200" : "border-red-800 bg-red-950/30 text-red-200"}`}>{status.message}</div>}
      <button type="submit" disabled={submitting} className="mt-6 min-h-11 rounded-lg bg-teal-500 px-6 py-2.5 font-bold text-black disabled:cursor-wait disabled:opacity-60">{submitting ? "Submitting..." : "Submit comment"}</button>
    </form>
  );
}

function Field({ id, label, value, error, disabled, onChange, type = "text", multiline = false }: { id: string; label: string; value: string; error?: string; disabled: boolean; onChange: (value: string) => void; type?: string; multiline?: boolean }) {
  const classes = "mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-60";
  const props = { id, value, disabled, required: true, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), className: classes };
  return <div><label htmlFor={id} className="font-semibold">{label} <span aria-hidden="true" className="text-teal-400">*</span></label>{multiline ? <textarea {...props} rows={6} /> : <input {...props} type={type} />}{error && <p id={`${id}-error`} className="mt-2 text-sm text-red-300">{error}</p>}</div>;
}

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Enter your name.";
  if (!fields.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Enter a valid email address.";
  if (fields.body.trim().length < 3) errors.body = "Enter at least 3 characters.";
  return errors;
}

function mapBackendErrors(error: unknown) {
  const fields: Errors = {};
  if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === "object") {
    for (const field of ["name", "email", "body"] as const) {
      const value = (error.response.data as Record<string, unknown>)[field];
      if (Array.isArray(value) && typeof value[0] === "string") fields[field] = value[0];
    }
    if (error.response.status === 429) return { fields, message: "Too many comments have been submitted from this connection. Please try again later." };
  }
  return { fields, message: "Your comment could not be submitted. Check the fields and try again." };
}

function StateError({ message, retry }: { message: string; retry: () => void }) { return <div role="alert" className="text-zinc-400"><p>{message}</p><button type="button" onClick={retry} className="mt-3 min-h-11 font-semibold text-teal-400 underline">Retry</button></div>; }
function mergeComments(current: PublicComment[], incoming: PublicComment[]) { const ids = new Set(current.map(({ id }) => id)); return [...current, ...incoming.filter(({ id }) => !ids.has(id) && ids.add(id))]; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat("en-UG", { dateStyle: "medium", timeZone: "Africa/Kampala" }).format(date); }
