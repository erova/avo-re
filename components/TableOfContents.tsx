// components/TableOfContents.tsx
import type { TocItem } from "@/lib/toc";

export function TableOfContents({ items }: { items: TocItem[] }) {
  // only show when it’s actually useful
  if (!items || items.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <div className="text-xs uppercase tracking-wide text-neutral-500">
        On this page
      </div>

      <ul className="mt-4 space-y-2 border-l border-neutral-800 pl-4">
        {items.map((it) => (
          <li
            key={`${it.level}-${it.id}`}
            className={it.level === 3 ? "ml-3" : ""}
          >
            <a
              href={`#${it.id}`}
              className="text-neutral-400 hover:text-neutral-200 transition"
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}