"use client";

import { useRef, useState } from "react";

type Props = {
  id: string; // YouTube video id
  title: string; // full title, for assistive tech and the iframe
  heading: string; // short line shown on the poster
  caption: string;
};

/**
 * Click-to-play. Nothing from YouTube loads until the reader asks for it:
 * no thumbnail request, no iframe, no cookies (youtube-nocookie).
 */
export function VideoFacade({ id, title, heading, caption }: Props) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  return (
    <div className="video">
      {playing ? (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="video-poster"
          onClick={() => {
            setPlaying(true);
            requestAnimationFrame(() => frame.current?.focus());
          }}
          aria-label={`Play video: ${title}. ${caption}`}
        >
          <span className="video-title">{heading}</span>
          <span className="video-caption">{caption}</span>
          <span className="video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
      <noscript>
        <a className="video-fallback" href={`https://www.youtube.com/watch?v=${id}`}>
          Watch on YouTube: {title}
        </a>
      </noscript>
    </div>
  );
}
