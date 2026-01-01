"use client";
import * as React from "react";

export type ExperienceOutcomesItem =
  | { title: string; desc: string; why?: string }
  | { label: string; value: string; detail?: string };

export type ExperienceOutcomesProps = {
  /** Optional preset so MDX can avoid inline JS */
  variant?: "field" | "tenets";
  /** Section title shown above the grid */
  title?: string;
  /** Optional supporting line under the title */
  subtitle?: string;
  /** Items to render (supports either {title, desc, why?} or {label, value, detail?}) */
  items?: ExperienceOutcomesItem[];
};

const DEFAULT_TITLE = "Experience Outcomes Enabled by the Field Experience Blueprint";
const DEFAULT_SUBTITLE =
  "These outcomes guided prioritization and tradeoffs independent of any specific feature or UI.";

const DEFAULT_ITEMS: Array<{ title: string; desc: string; why?: string }> = [
  {
    title: "Early Confidence",
    desc: "Advisors feel oriented and supported from day one.",
    why: "Early uncertainty was a leading indicator of attrition.",
  },
  {
    title: "Learning in Context",
    desc: "Training and guidance show up inside real work, not separate systems.",
    why: "Disconnected learning increased cognitive load.",
  },
  {
    title: "Focus on What Matters Now",
    desc: "Advisors are guided toward the right actions at the right time.",
    why: "Too much choice early reduced confidence.",
  },
  {
    title: "Momentum Through Feedback",
    desc: "Effort and progress are visible—not just outcomes.",
    why: "Grinding without feedback led to disengagement.",
  },
  {
    title: "Sustained Effort Without Burnout",
    desc: "Advisors can maintain pace as repetition becomes routine.",
    why: "The work doesn’t get easier—resilience must be designed.",
  },
  {
    title: "Integrated View of the Business",
    desc: "Information is consistent and connected across tools and channels.",
    why: "Fragmentation eroded trust and created rework.",
  },
  {
    title: "Visible Growth Trajectory",
    desc: "Advisors can see how today’s effort connects to future opportunity.",
    why: "Retention improves when the future feels tangible.",
  },
];

const TENETS_ITEMS: Array<{ title: string; desc: string; why?: string }> = [
  {
    title: "Culture",
    desc: "Curiosity + accountability elevate teams into great organizations",
  },
  {
    title: "Scale",
    desc: "Org design that enables quality and consistent execution",
  },
  {
    title: "Execution",
    desc: "Predictable process creates space for better outcomes",
  },
  {
    title: "Proximity",
    desc: "Stay close to the work to maintain judgment and direction",
  },
];

const TENETS_TITLE = "What I optimize for";
const TENETS_SUBTITLE = "";

function normalizeOutcomeItem(
  item: ExperienceOutcomesItem
): { title: string; desc: string; why?: string } {
  if ("title" in item) return item;
  return { title: item.label, desc: item.value, why: item.detail };
}

export function ExperienceOutcomes({
  variant = "field",
  title,
  subtitle,
  items,
}: ExperienceOutcomesProps) {
  const resolvedTitle =
    title ?? (variant === "tenets" ? TENETS_TITLE : DEFAULT_TITLE);
  const resolvedSubtitle =
    subtitle ?? (variant === "tenets" ? TENETS_SUBTITLE : DEFAULT_SUBTITLE);

  const fallback = variant === "tenets" ? TENETS_ITEMS : DEFAULT_ITEMS;
  const data = (items?.length ? items : fallback).map(normalizeOutcomeItem);

  return (
    <section className="my-10">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">{resolvedTitle}</h2>
        {resolvedSubtitle ? (
          <p className="mt-2 text-sm opacity-80">{resolvedSubtitle}</p>
        ) : null}
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm opacity-90">{item.desc}</p>
            {item.why ? (
              <p className="mt-3 text-xs opacity-75">
                <span className="font-medium">Why it mattered:</span> {item.why}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

type TocItem = { id: string; title: string };

type OnThisPageProps = {
  toc: TocItem[];
  /** Optional: offset in px to account for sticky headers */
  rootMarginTop?: number;
};

export function OnThisPageNav({ toc, rootMarginTop = 120 }: OnThisPageProps) {
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
      <div className="text-xs font-semibold tracking-wide opacity-70">On this page</div>
      <nav className="mt-3">
        <ul className="space-y-2 text-sm">
          {toc.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={
                    "block transition " +
                    (isActive
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100")
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
