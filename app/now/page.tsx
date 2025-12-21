import Link from "next/link";
import { getAllNowMeta } from "@/lib/now";

export default function NowPage() {
  const experiments = getAllNowMeta();

  return (
    <div className="py-10">
      <h1 className="text-3xl font-medium tracking-tight">Now</h1>
      <p className="mt-3 text-neutral-400">
        What I’m building and exploring right now.
      </p>

      <div className="mt-8 space-y-4">
        {experiments.map((e) => (
          <Link
            key={e.slug}
            href={`/now/${e.slug}`}
            className="block rounded-lg border border-white/10 p-4 hover:border-white/20"
          >
            <div className="font-medium">{e.title}</div>
            {e.summary && (
              <div className="text-sm text-neutral-400">{e.summary}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}