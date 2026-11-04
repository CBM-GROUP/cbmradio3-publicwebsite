"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

interface ArticleShareBarProps {
  title: string;
  slug: string;
}

export function ArticleShareBar({ title, slug }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://cbmradio.com/news/${slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => undefined);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px] text-zinc-400">
        <Share2 className="h-3.5 w-3.5 text-[#04b093]" />
        Share:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${title} - Read more on CBM Radio: ${currentUrl}`
        )}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 transition-colors hover:bg-emerald-500/20"
        title="Share via WhatsApp"
      >
        <FaWhatsapp className="h-3.5 w-3.5" />
        <span>WhatsApp</span>
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:bg-zinc-800"
        title="Share on X"
      >
        <FaXTwitter className="h-3.5 w-3.5" />
        <span>Post</span>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded border border-[#04b093]/40 bg-[#04b093]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#04b093] transition-colors hover:bg-[#04b093]/20"
        title="Share on Facebook"
      >
        <FaFacebook className="h-3.5 w-3.5" />
        <span>Share</span>
      </a>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:bg-zinc-800"
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
