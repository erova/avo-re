import matter from "gray-matter";

export type TocItem = { id: string; title: string };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** `##` headings in a markdown/MDX body, in order, de-duplicated. */
export function tocFromBody(body: string): TocItem[] {
  const seen = new Set<string>();
  const toc: TocItem[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (!m) continue;
    const title = m[1].replace(/\s*\{#.+\}\s*$/, "").trim();
    const id = slugifyHeading(title);
    if (title && id && !seen.has(id)) {
      seen.add(id);
      toc.push({ id, title });
    }
  }
  return toc;
}

export function readingMinutes(body: string): number {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/** Frontmatter dates arrive as Dates ("2026-01-01") or free text ("January 3 2026", "2023"). */
export function formatArticleDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  }
  const s = String(value).trim();
  if (/^\d{4}$/.test(s)) return s;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const t = iso ? Date.UTC(+iso[1], +iso[2] - 1, +iso[3]) : Date.parse(s);
  if (!Number.isFinite(t)) return s;
  return new Date(t).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

// Same tab tolerance as lib/portfolio.ts: some editors indent YAML with tabs.
export function parseArticle(raw: string) {
  return matter(raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, (fm) => fm.replace(/^\t+/gm, (t) => "    ".repeat(t.length)).replace(/:\s+\\([>|][-+]?)\s*$/gm, ": $1")));
}
