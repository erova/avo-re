"use client";

import { useEffect, useRef } from "react";
import { Pic } from "./GatedStage";

type Img = {
  src: string;
  width: number;
  height: number;
  alt: string;
  base?: boolean;
  swap?: number;
  at?: number;
  x?: number;
  w?: number;
  y?: number;
  speed?: number;
};

/** Scroll distance per step, in screens of height. */
const STEP = 0.85;
/** How far from its step (in steps) a floating screen is fully visible, and where it has faded out. */
const HOLD = 0.5;
const GONE = 0.95;

const clamp = (n: number, lo = 0, hi = 1) => Math.min(Math.max(n, lo), hi);
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * One screen pinned in view and panning slowly, with the others floating over it at different
 * depths: each rises into place, holds, and drifts up and away as the page scrolls. No captions.
 * Without JS, on a narrow screen, or with reduced motion, it is a plain stack of images.
 */
export function ScrollStory({ label, images }: { label: string; images: Img[] }) {
  const root = useRef<HTMLDivElement>(null);
  const baseFrame = useRef<HTMLDivElement>(null);
  const floats = useRef<(HTMLDivElement | null)[]>([]);

  const base = images.find((i) => i.base) ?? images[0];
  const swap = images.find((i) => i !== base && i.swap !== undefined);
  const over = images.filter((i) => i !== base && i !== swap);
  const last = Math.max(...over.map((i) => i.at ?? 1), 1);
  const steps = last + 0.9;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 760px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;

    function paint() {
      raf = 0;
      if (!el) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const travel = r.height - vh;
      const t = travel > 0 ? clamp(-r.top / travel) : 0;
      const p = t * steps; // 0..steps

      const frame = baseFrame.current;
      if (frame) {
        frame.querySelectorAll<HTMLElement>("img").forEach((bi, n) => {
          const room = Math.max(bi.offsetHeight - frame.clientHeight, 0);
          bi.style.transform = `translate3d(0, ${-room * clamp(p / steps)}px, 0)`;
          if (n === 1 && swap) bi.style.opacity = String(smooth(clamp((p - (swap.swap ?? 0) + 0.3) / 0.6)));
        });
      }


      over.forEach((im, i) => {
        const node = floats.current[i];
        if (!node) return;
        const at = im.at ?? 1;
        const isLast = at === last;
        const d = isLast ? Math.min(p - at, 0) : p - at; // the last screen stays where it lands
        const a = Math.abs(d);
        const vis = a <= HOLD ? 1 : a >= GONE ? 0 : 1 - smooth((a - HOLD) / (GONE - HOLD));
        const speed = im.speed ?? 1.1;
        const y = (im.y ?? 0.5) * vh - d * vh * STEP * speed - node.offsetHeight / 2;
        const scale = 1 - 0.04 * clamp(a);
        node.style.opacity = String(vis);
        node.style.visibility = vis > 0.01 ? "visible" : "hidden";
        node.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
      });
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    function arm() {
      if (!el) return;
      if (mq.matches) {
        el.setAttribute("data-live", "");
        queue();
      } else {
        el.removeAttribute("data-live");
        floats.current.forEach((n) => n?.removeAttribute("style"));
        baseFrame.current?.querySelectorAll("img").forEach((i) => i.removeAttribute("style"));
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, steps]);

  return (
    <div
      className="story"
      ref={root}
      style={{ "--len": `${Math.round(steps * STEP * 100)}svh` } as React.CSSProperties}
      role="group"
      aria-label={label}
    >
      <div className="story-pin">
        <div className="story-stage">
          <div className="story-base" ref={baseFrame} style={{ aspectRatio: `${base.width} / ${base.height}`, "--bw": `${base.w ?? 50}%` } as React.CSSProperties}>
            <Pic src={base.src} width={base.width} height={base.height} alt={base.alt} decoding="async" />
            {swap && <Pic className="story-swap" src={swap.src} width={swap.width} height={swap.height} alt="" aria-hidden="true" decoding="async" loading="lazy" />}
          </div>
          {over.map((im, i) => (
            <div
              key={im.src}
              className="story-float"
              style={{ "--x": `${im.x ?? 30}%`, "--w": `${im.w ?? 56}%`, "--d": ((im.speed ?? 1.1) - 0.7) * 2, zIndex: i + 2 } as React.CSSProperties}
              ref={(n) => {
                floats.current[i] = n;
              }}
            >
              <Pic src={im.src} width={im.width} height={im.height} alt={im.alt} decoding="async" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
