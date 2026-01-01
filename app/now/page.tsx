import Link from "next/link";
import { getAllNowMeta } from "@/lib/now";

function formatNowDate(input: unknown): string {
  if (!input) return "";

  // If it's already short YYYY-MM-DD, keep it.
  const s = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Try to parse into a readable, compact form.
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    // Example: Dec 21, 2025
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  // Fallback: avoid huge strings
  return s.length > 18 ? s.slice(0, 18) + "…" : s;
}

export default function NowPage() {
  const experiments = getAllNowMeta();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="mt-8 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-8 shadow-sm">
        <Link
          href="/"
          className="mb-3 inline-block text-sm text-neutral-400 hover:text-neutral-200"
        >
          ← Home
        </Link>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Now</h1>
        <p className="mt-3 max-w-2xl text-neutral-300">
          What I’m building and exploring right now.
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {experiments.map((e: any) => {
          const date = formatNowDate(e.date);

          return (
            <div
              key={e.slug}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight">
                    <Link
                      href={`/now/${e.slug}`}
                      className="hover:underline underline-offset-4"
                    >
                      {e.title}
                    </Link>
                  </h2>

                  {e.summary ? (
                    <p className="mt-2 text-sm text-neutral-300">{e.summary}</p>
                  ) : null}
                </div>

                {date ? (
                  <div className="shrink-0 text-xs uppercase tracking-wider text-neutral-500 whitespace-nowrap pt-1">
                    {date}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {!experiments.length ? (
          <p className="text-sm text-neutral-400">No Now posts yet.</p>
        ) : null}
      </div>
    </article>
  );
}