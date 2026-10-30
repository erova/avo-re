"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  id: string; // YouTube video id
  title: string; // full title, for assistive tech and the iframe
  heading: string; // short line shown on the poster when there is no thumbnail
  caption: string;
  thumb?: string; // a still saved on this site, so nothing is requested from YouTube until play
};

/**
 * Click-to-play in a lightbox. Nothing from YouTube loads until the reader asks for it:
 * no thumbnail request, no iframe, no cookies (youtube-nocookie). The dialog closes on Esc,
 * the Close button, or a click outside the player, and focus returns to the card.
 */
export function VideoFacade({ id, title, heading, caption, thumb }: Props) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <div className="video">
      <button
        ref={opener}
        type="button"
        className={thumb ? "video-poster has-thumb" : "video-poster"}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Play video: ${title}. ${caption}`}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} width={1280} height={720} alt="" decoding="async" loading="lazy" />
        ) : (
          <span className="video-title">{heading}</span>
        )}
        <span className="video-caption">{caption}</span>
        <span className="video-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M8.5 5.5v13l10-6.5z" fill="currentColor" />
          </svg>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={title}
        onClose={() => {
          setOpen(false);
          opener.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="lightbox-inner">
          <button type="button" className="lightbox-close" onClick={() => setOpen(false)}>
            Close
          </button>
          {open && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      </dialog>
      <noscript>
        <a className="video-fallback" href={`https://www.youtube.com/watch?v=${id}`}>
          Watch on YouTube: {title}
        </a>
      </noscript>
    </div>
  );
}
