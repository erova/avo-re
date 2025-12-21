import Link from "next/link";
import { getAllWritingMeta } from "@/lib/writing";

export default function WritingPage() {
  const posts = getAllWritingMeta();

  return (
    <div className="py-10">
      <h1 className="text-3xl font-medium tracking-tight">Writing</h1>
      <p className="mt-3 text-neutral-400">
        Notes, essays, and system thinking. Built in MDX so posts can evolve into interactive docs.
      </p>

      <div className="mt-8 grid gap-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/writing/${p.slug}`}
            className="group rounded-3xl border border-neutral-800/70 bg-neutral-900/30 p-6 hover:border-neutral-700 transition"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-lg font-medium tracking-tight text-neutral-100">
                  {p.title}
                </div>
                <div className="mt-2 text-sm text-neutral-400">{p.summary}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border border-neutral-800 px-3 py-1 text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-neutral-500 whitespace-nowrap">
                {p.date}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}