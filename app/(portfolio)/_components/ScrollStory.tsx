"use client";

import { useEffect, useRef } from "react";
import { Pic } from "./GatedStage";

type Img = { src: string; width: number; height: number; alt: string };

/** A screenshot taller than this (width over height) is shown at full width and panned, not shrunk to fit. */
const TALL = 0.95;
/** How much of each step is spent cross-fading into the next screenshot. */
const BLEND = 0.22;

/**
 * Screenshots that play in order as the page scrolls: one is pinned in view and the next
 * rises over it. No captions; the pictures carry it. Tall screens pan top to bottom while
 * they hold. Without JS, or with reduced motion, it is a plain stack of images.
 */
export function ScrollStory({ label, images }: { label: string; images: Img[] }) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    function paint() {
      raf = 0;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const n = images.length;
      const p = travel > 0 ? Math.min(Math.max(-r.top / travel, 0), 1) * n : 0; // 0..n
      if (bar.current) bar.current.style.transform = `scaleX(${p / n})`;
      items.current.forEach((node, i) => {
        if (!node) return;
        const t = p - i; // <0 not yet, 0..1 holding, >1 gone
        const into = Math.min(Math.max(t / BLEND, 0), 1);
        const out = i < n - 1 ? Math.min(Math.max((t - (1 - BLEND)) / BLEND, 0), 1) : 0;
        const ease = (x: number) => 1 - Math.pow(1 - x, 3);
        const opacity = i === 0 ? 1 - ease(out) : ease(into) * (1 - ease(out));
        const rise = (1 - ease(into)) * 56 - ease(out) * 28;
        const scale = 0.965 + 0.035 * ease(into) - 0.02 * ease(out);
        node.style.opacity = String(opacity);
        node.style.transform = `translate3d(0, ${i === 0 ? -ease(out) * 28 : rise}px, 0) scale(${i === 0 ? 1 - 0.02 * ease(out) : scale})`;
        node.style.visibility = opacity > 0.01 ? "visible" : "hidden";
        const img = node.querySelector<HTMLElement>("img");
        if (img && node.dataset.tall) {
          const room = Math.max(img.offsetHeight - node.clientHeight, 0);
          const hold = Math.min(Math.max((t - BLEND * 0.5) / (1 - BLEND * 1.5), 0), 1);
          img.style.transform = `translate3d(0, ${-room * hold}px, 0)`;
        }
      });
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    function arm() {
      if (mq.matches) {
        el!.removeAttribute("data-live");
        items.current.forEach((n) => n && n.removeAttribute("style"));
        return;
      }
      el!.setAttribute("data-live", "");
      queue();
    }
    arm();
    mq.addEventListener("change", arm);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      mq.removeEventListener("change", arm);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [images.length]);

  return (
    <div className="story" ref={root} style={{ "--n": images.length } as React.CSSProperties} role="group" aria-label={label}>
      <div className="story-pin">
        <div className="story-frame">
          {images.map((im, i) => (
            <div
              key={im.src}
              className="story-item"
              data-tall={im.width / im.height < TALL ? "" : undefined}
              ref={(n) => {
                items.current[i] = n;
              }}
            >
              <Pic src={im.src} width={im.width} height={im.height} alt={im.alt} decoding="async" loading={i < 2 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>
        <span className="story-progress" aria-hidden="true">
          <span ref={bar} />
        </span>
      </div>
    </div>
  );
}
