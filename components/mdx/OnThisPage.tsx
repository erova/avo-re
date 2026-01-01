"use client";

import * as React from "react";

type TocItem = { id: string; title: string };

type OnThisPageProps = {
  toc: TocItem[];
  /** Optional: offset in px to account for sticky headers */
  rootMarginTop?: number;
  /** Optional: title shown above the list */
  label?: string;
};

export function OnThisPage({
  toc,
  rootMarginTop = 120,
  label = "On this page",
}: OnThisPageProps) {
  const [activeId, setActiveId] = React.useState<string>(toc[0]?.id ?? "");

  React.useEffect(() => {
    if (!toc.length) return;

    const initialHash = window.location.hash?.slice(1) ?? "";
    if (initialHash) setActiveId(initialHash);

    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0)
          );

        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        rootMargin: `-${rootMarginTop}px 0px -70% 0px`,
        threshold: [0, 1],
      }
    );

    headings.forEach((h) => observer.observe(h));

    const onHashChange = () => {
      const id = window.location.hash?.slice(1);
      if (id) setActiveId(id);
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      observer.disconnect();
    };
  }, [toc, rootMarginTop]);

  if (!toc.length) return null;

  return (
    <>
      <div className="text-xs font-semibold tracking-wide opacity-70">{label}</div>
      <nav className="mt-3" aria-label={label}>
        <ul className="space-y-2 text-sm">
          {toc.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={
                    "block transition " +
                    (isActive ? "opacity-100" : "opacity-70 hover:opacity-100")
                  }
                  aria-current={isActive ? "location" : undefined}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
