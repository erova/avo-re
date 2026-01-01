import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAboutMeta, getAboutSource } from "@/lib/about";
import { ExperienceOutcomes } from "@/components/work/ExperienceOutcomes";
import matter from "gray-matter";

export default async function TenetsPage() {
  let meta;
  let source;

  try {
    meta = getAboutMeta("tenets");
    source = getAboutSource("tenets");
  } catch {
    notFound();
  }

  const { content } = matter(source);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="mt-8 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-8 shadow-sm">
      <a
    href="/about"
    className="mb-3 inline-block text-sm text-neutral-400 hover:text-neutral-200"
  >
    ← About
  </a>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{meta.title}</h1>
        {meta.summary ? (
          <p className="mt-3 max-w-2xl text-neutral-300">{meta.summary}</p>
        ) : null}
      </header>

      <div className="mt-12 prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-p:leading-relaxed">
        <MDXRemote
          source={content}
          components={{
            ExperienceOutcomes,
          }}
        />
      </div>
    </article>
  );
}