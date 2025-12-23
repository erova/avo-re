import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";

import { getNowSlugs, getNowSource } from "@/lib/now";
import { Callout } from "@/components/mdx/Callout";
import { MetricTiles } from "@/components/mdx/MetricTiles";

import { PrimaryCta, OutlineSection } from "@/components/now/patterns";

const components = {
  PrimaryCta,
  OutlineSection,
  // keep your existing ones
};


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
  
<header className="mt-8 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-8 shadow-sm">
  <p className="text-sm text-neutral-400">Now</p>

  <h1 className="mt-3 text-4xl font-semibold tracking-tight">
    {String(data.title ?? slug)}
  </h1>

  {data.summary ? (
    <p className="mt-3 max-w-2xl text-neutral-300">
      {String(data.summary)}
    </p>
  ) : null}
</header>
      <hr className="mt-8 border-neutral-800/60" />
      <div className="mt-12 flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-500">
  <span className="h-px flex-1 bg-neutral-800" />
  <span>Overview</span>
  <span className="h-px flex-1 bg-neutral-800" />
</div>
      <div className="mt-10 prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-p:leading-relaxed">
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