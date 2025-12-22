import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAboutSource, getAboutMeta } from "@/lib/about";

import fs from "node:fs";
import matter from "gray-matter";

export function loadMdx(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);

  return {
    meta: {
      title: data.title ?? "",
      summary: data.summary ?? "",
    },
    source: content, // ✅ front-matter removed
  };
}

export default async function ResumePage() {
  let meta;
  let source;

  try {
    meta = getAboutMeta("resume");
    source = getAboutSource("resume");
  } catch {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="mt-8 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-8 shadow-sm">
      <a
    href="/about"
    className="mb-3 inline-block text-sm text-neutral-400 hover:text-neutral-200"
  >
    ← About
  </a>
        
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {meta.title}
        </h1>
        {meta.summary ? (
          <p className="mt-3 max-w-2xl text-neutral-300">
            {meta.summary}
          </p>
        ) : null}
      </header>

      <div className="mt-12 prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-p:leading-relaxed resume-prose">

  <MDXRemote source={source} />
</div>
    </article>
  );
}