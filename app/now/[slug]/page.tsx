import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { extractToc, slugify } from "@/lib/toc";

import { getNowSlugs, getNowSource } from "@/lib/now";
import { Callout } from "@/components/mdx/Callout";
import { MetricTiles } from "@/components/mdx/MetricTiles.client";
import { PrimaryCta, OutlineSection } from "@/components/now/patterns";
import { OnThisPage } from "@/components/mdx/OnThisPage";
import PromptBoxExperiment, { PromptBoxExperimentTabs } from "@/components/now/PromptBoxExperiment";

function headingText(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children
      .map((c) => (typeof c === "string" ? c : ""))
      .join(" ")
      .trim();
  }
  return "";
}

const mdxComponents = {
  PrimaryCta,
  OutlineSection,
  Callout,
  MetricTiles,
  PromptBoxExperiment,
  PromptBoxExperimentA: (props: any) => (
    <PromptBoxExperiment
      variant="A"
      title="Variant A — Starters only"
      description="Baseline: a prompt box with suggested prompts, but no explicit scope or previews."
      {...props}
    />
  ),
  PromptBoxExperimentB: (props: any) => (
    <PromptBoxExperiment
      variant="B"
      title="Variant B — Starters + visible sources"
      description="Make available data sources explicit so users understand what’s in-scope before they type."
      {...props}
    />
  ),
  PromptBoxExperimentC: (props: any) => (
    <PromptBoxExperiment
      variant="C"
      title="Variant C — Guardrails + previews"
      description="Add inline scope checks and a ‘what you’ll get’ preview to reduce failures and increase confidence."
      {...props}
    />
  ),
  PromptBoxExperimentD: (props: any) => (
    <PromptBoxExperiment
      variant="D"
      title="Variant D — File-first checklist"
      description="Recognition over recall: after a file is attached, show what can be run and generate the prompt automatically."
      {...props}
    />
  ),
  PromptBoxExperimentTabs,
  h2: (props: any) => {
    const text = headingText(props.children);
    const id = props.id ?? (text ? slugify(text) : undefined);
    return <h2 id={id} {...props} />;
  },
  h3: (props: any) => {
    const text = headingText(props.children);
    const id = props.id ?? (text ? slugify(text) : undefined);
    return <h3 id={id} {...props} />;
  },
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

  const extracted = extractToc(content).map((item: any) => ({
    id: item.id,
    title: item.title ?? item.text ?? "",
  }));

  const toc = extracted;

  const formattedDate = (() => {
    const rawDate = String((data as any).date ?? "");
    const d = rawDate ? new Date(rawDate) : null;
    if (!d || Number.isNaN(d.getTime())) return "";
    return d
      .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      .toUpperCase();
  })();

  return (
    <article className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[220px,minmax(0,1fr)]">
          {/* Left rail (starts at the top like Work) */}
          <aside className="hidden lg:block lg:col-start-1 lg:row-start-1">
            <div className="sticky top-52">
              <OnThisPage toc={toc} />
            </div>
          </aside>
  
          {/* Center column */}
          <div className="lg:col-start-2 lg:row-start-1 w-full">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-6">
              <Link
                href="/now"
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
              >
                <span aria-hidden>←</span>
                <span>Back to Scratchpad</span>
              </Link>

              <div className="hidden lg:block text-xs uppercase tracking-wide text-neutral-500">
                {formattedDate || null}
              </div>
            </div>
  
            <div className="mt-10">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                Scratchpad
              </div>
  
              <h1 className="page-title">
                {String(data.title ?? slug)}
              </h1>
  
              {data.summary ? (
                <p className="mt-4 text-neutral-300">
                  {String(data.summary)}
                </p>
              ) : null}
            </div>
  
            {/* Mobile TOC (inline, like Work still has a left rail only on desktop) */}
            <div className="mt-10 lg:hidden">
              <OnThisPage toc={toc} />
            </div>
  
            <div className="prose-now mt-12 [&>*+*]:mt-16">
              <MDXRemote source={content} options={{ blockJS: false }} components={mdxComponents} />
            </div>
          </div>
  
        </div>
      </div>
    </article>
  );
}