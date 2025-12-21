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
  const date = String(data.date ?? "");
  const summary = String(data.summary ?? "");

  return (
    <div className="py-10">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/writing"
            className="text-sm text-neutral-400 hover:text-neutral-100 transition"
          >
            ← Back to Writing
          </Link>

          {date ? (
            <div className="text-xs uppercase tracking-wider text-neutral-500">
              {date}
            </div>
          ) : null}
        </div>

        <h1 className="mt-6 text-4xl md:text-5xl leading-[1.05] font-medium tracking-tight">
          {title}
        </h1>

        {summary ? (
          <p className="mt-4 text-base text-neutral-400">{summary}</p>
        ) : null}




        <div className="mt-10 prose prose-invert prose-neutral max-w-none">
          <MDXRemote
            source={content}
            components={{
              Callout: (props) => <Callout {...props} />,
              MetricTiles: (props) => <MetricTiles {...props} />,
            }}
          />
        </div>
      </div>
    </div>
  );
}