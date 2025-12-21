import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";

import { getNowSlugs, getNowSource } from "@/lib/now";
import { Callout } from "@/components/mdx/Callout";
import { MetricTiles } from "@/components/mdx/MetricTiles";

export function generateStaticParams() {
  return getNowSlugs().map((slug) => ({ slug }));
}

export default async function NowExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let raw = "";
  try {
    raw = getNowSource(slug);
  } catch {
    notFound();
  }

  const { content, data } = matter(raw);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link 
      href="/now"
  className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
>
  <span aria-hidden>←</span>
  <span>Back to Now</span>
</Link>
  
      <h1 className="mt-6 text-3xl font-medium tracking-tight">
        {String(data.title ?? slug)}
      </h1>
  
      {data.summary ? (
        <p className="mt-3 text-neutral-400">
          {String(data.summary)}
        </p>
      ) : null}
      <hr className="mt-8 border-neutral-800/60" />
  
      <div className="mt-12 rounded-2xl bg-neutral-900/40 p-8 prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-p:leading-relaxed">
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