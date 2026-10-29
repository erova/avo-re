"use client";

import { useEffect } from "react";

// Hairlines below the fold draw in once, the first time their section scrolls into view.
// Elements are only hidden after this runs, so without JS (or with reduced motion) every line is simply there.
const TARGETS =
  ".glance-row, .feature .case-head, .feature .case-facts, .feature .case-row, .rows details, .prose h2, .prose hr, .stats, .disclaimer, .usage";

export function Rules() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(
      (el) => !el.closest(".article-head, .hero"),
    );
    // The header's lines have their own load animation; everything else, including
    // lines already in view at load, is armed and drawn by the observer.
    const pending = els;
    pending.forEach((el) => el.setAttribute("data-rule", ""));

    // A `display: contents` row has no box to intersect, so its first child stands in for it.
    const owner = new Map<Element, Element>();
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = (owner.get(e.target) ?? e.target) as HTMLElement;
          el.style.setProperty("--d", `${n++ * 110}ms`);
          el.setAttribute("data-in", "");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    pending.forEach((el) => {
      const watched = getComputedStyle(el).display === "contents" && el.firstElementChild ? el.firstElementChild : el;
      if (watched !== el) owner.set(watched, el);
      io.observe(watched);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
