"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Tab = { id: string; label: string; content: ReactNode };

/**
 * A row of pills that switches between views of one product. Nothing advances on its own.
 * Panels share a single grid cell, so the area keeps the height of the tallest one
 * and switching never moves the page.
 */
export function ShowcaseTabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const base = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  }

  return (
    <div className="showcase">
      <div className="pills" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="showcase-panels">
        {tabs.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`${base}-panel-${t.id}`}
            aria-labelledby={`${base}-tab-${t.id}`}
            className="showcase-panel"
            data-active={active === t.id ? "" : undefined}
            inert={active !== t.id}
          >
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
