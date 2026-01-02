function formatFrontmatterDate(value: unknown): string {
  if (!value) return "";

  // If gray-matter parsed an unquoted YAML date, it may be a Date object.
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = value.getUTCMonth();
    const d = value.getUTCDate();
    const local = new Date(y, m, d);
    return local.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const s = String(value).trim();

  // Handle date-only strings without timezone shifting.
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const local = new Date(y, mo, d);
    return local.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Fallback: attempt to parse any other string.
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return s;

  return new Date(t).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";

import { getWritingSlugs, getWritingSource } from "@/lib/writing";
import { Callout } from "@/components/mdx/Callout";
import { MetricTiles } from "@/components/mdx/MetricTiles";

export function generateStaticParams() {
  return getWritingSlugs().map((slug) => ({ slug }));
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let source = "";
  try {
    source = getWritingSource(slug);
  } catch {
    notFound();
  }

  const { content, data } = matter(source);

  const title = String(data.title ?? slug);
  const dateRaw = data.date;
  const date = formatFrontmatterDate(dateRaw);
  const summary = String(data.summary ?? "");
  const category = String(data.category ?? "");
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="mt-8 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-8 shadow-sm">
        <Link
          href="/writing"
          className="mb-3 inline-block text-sm text-neutral-400 hover:text-neutral-200"
        >
          ← Writing
        </Link>

        {category ? (
          <p className="mt-2 text-xs uppercase tracking-wider text-neutral-500">
            {category}
          </p>
        ) : null}

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-wider text-neutral-500">
          {date ? <span>{date}</span> : null}
        </div>

        {tags.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs rounded-full border border-neutral-800 px-3 py-1 text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {summary ? (
          <p className="mt-4 max-w-2xl text-neutral-300">{summary}</p>
        ) : null}
      </header>

      <div className="mt-12 prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-p:leading-relaxed">
        <MDXRemote
          source={content}
          components={{
            Callout: (props) => <Callout {...props} />,
            MetricTiles: (props) => <MetricTiles {...props} />,
          }}
        />
      </div>
    </article>
  );
}