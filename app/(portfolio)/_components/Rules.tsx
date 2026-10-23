"use client";

import { useEffect } from "react";

// Hairlines below the fold draw in once, the first time their section scrolls into view.
// Elements are only hidden after this runs, so without JS (or with reduced motion) every line is simply there.
const TARGETS =
  ".glance-row, .feature .case-head, .feature .case-facts, .feature .case-row, .rows details, .prose h2";

export function Rules() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(
      (el) => !el.closest(".article-head"),
    );
    // Anything already on screen at load is handled by the load animation, not hidden.
    const vh = window.innerHeight;
    const pending = els.filter((el) => el.getBoundingClientRect().top > vh * 0.9);
    pending.forEach((el) => el.setAttribute("data-rule", ""));

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--d", `${n++ * 110}ms`);
          el.setAttribute("data-in", "");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
