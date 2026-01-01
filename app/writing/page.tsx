import Link from "next/link";
import { getAllWritingMeta } from "@/lib/writing";

export default function WritingPage() {
  const posts = getAllWritingMeta();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="mt-8 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-8 shadow-sm">
        <Link
          href="/"
          className="mb-3 inline-block text-sm text-neutral-400 hover:text-neutral-200"
        >
          ← Home
        </Link>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Writing</h1>
        <p className="mt-3 max-w-2xl text-neutral-300">
          Notes, essays, and systems thinking. Built in MDX so posts can evolve into
          interactive docs.
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {posts.map((p) => (
          <div
            key={p.slug}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">
                  <Link
                    href={`/writing/${p.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {p.title}
                  </Link>
                </h2>

                {p.summary ? (
                  <p className="mt-2 text-sm text-neutral-300">{p.summary}</p>
                ) : null}

                {p.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs rounded-full border border-neutral-800 px-3 py-1 text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {p.date ? (
                <div className="shrink-0 text-xs uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                  {p.date}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {!posts.length ? (
          <p className="text-sm text-neutral-400">No writing posts yet.</p>
        ) : null}
      </div>
    </article>
  );
}