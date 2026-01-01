import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import styles from "./work.module.css";

import { getWorkSlugs, getWorkSource } from "@/lib/work";
import { Callout } from "@/components/mdx/Callout";
import { MetricTiles } from "@/components/mdx/MetricTiles";
import { OnThisPage } from "@/components/mdx/OnThisPage";
import { ExperienceOutcomes } from "@/components/work/ExperienceOutcomes";

type TocItem = { id: string; title: string };

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildTocFromMdx(mdx: string): TocItem[] {
  const lines = mdx.split(/\r?\n/);
  const toc: TocItem[] = [];

  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (!m) continue;

    const raw = m[1].trim();
    const title = raw.replace(/\s*\{#.+\}\s*$/, "").trim();
    const id = slugifyHeading(title);
    if (title && id) toc.push({ id, title });
  }

  const seen = new Set<string>();
  return toc.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function flattenText(node: any): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  return flattenText(node.props?.children);
}

export function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }));
}

export default async function WorkPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let source = "";
  try {
    source = getWorkSource(slug);
  } catch {
    notFound();
  }

  const { content, data } = matter(source);
  const toc = buildTocFromMdx(content);

  const title = String(data.title ?? slug);
  const company = String(data.company ?? "");
  const date = String(data.date ?? "");
  const summary = String(data.summary ?? "");

  return (
    <div className="py-10">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 mt-16">
              <OnThisPage toc={toc} />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="flex items-center justify-between gap-6">
              <Link
                href="/work"
                className="text-sm text-neutral-400 hover:text-neutral-100 transition"
              >
                ← Back to Case Studies
              </Link>

              {date ? (
                <div className="text-xs uppercase tracking-wider text-neutral-500">
                  {date}
                </div>
              ) : null}
            </div>
            {company ? <p className={styles.caseSubtitle}>{company}</p> : null}
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
                  ExperienceOutcomes: (props) => <ExperienceOutcomes {...props} />,
                  Disclaimer: ({ children }) => (
                    <footer className={styles.caseDisclaimer}>
                      <strong>Disclaimer</strong>
                      <br />
                      {children}
                    </footer>
                  ),
                  h2: (props) => {
                    const t = flattenText(props.children);
                    const id = slugifyHeading(t);
                    return <h2 id={id} {...props} />;
                  },
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}