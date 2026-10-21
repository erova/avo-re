"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string };
type Tick = Item & { y: number };

/**
 * Margin rail: a miniature map of the page. Each tick sits where its section
 * sits in the document; the block shows what is on screen right now.
 * Ticks are real links, so it works as navigation for keyboard users too.
 */
export function Rail({ items }: { items: Item[] }) {
  const railRef = useRef<HTMLElement>(null);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let docH = 1;
    let tickY: Tick[] = [];

    const measure = () => {
      docH = document.documentElement.scrollHeight;
      tickY = items.flatMap((i) => {
        const el = document.getElementById(i.id);
        if (!el) return [];
        const top = el.getBoundingClientRect().top + window.scrollY;
        return [{ ...i, y: Math.min(top / docH, 0.995) }];
      });
      setTicks(tickY);
      update();
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = window.scrollY / docH;
      const h = window.innerHeight / docH;
      rail.style.setProperty("--view-top", `${top * 100}%`);
      rail.style.setProperty("--view-h", `${Math.max(h * 100, 1.5)}%`);
      const probe = (window.scrollY + window.innerHeight * 0.35) / docH;
      let current: string | null = null;
      for (const t of tickY) if (t.y <= probe) current = t.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className="rail" ref={railRef} aria-label="Page sections">
      <div className="rail-view" aria-hidden="true" />
      <ul>
        {ticks.map((t) => (
          <li key={t.id} style={{ top: `${t.y * 100}%` }}>
            <a href={`#${t.id}`} aria-current={active === t.id ? "location" : undefined}>
              <span className="rail-label">{t.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
