import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Article } from "../../_components/Article";
import { getWorkSlugs, getWorkSource } from "@/lib/work";
import { formatArticleDate, parseArticle, readingMinutes } from "@/lib/article";

export function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }));
}

function load(slug: string) {
  try {
    return parseArticle(getWorkSource(slug));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = load(slug);
  if (!post) return {};
  return {
    title: `${post.data.title} | Chris Avore`,
    description: post.data.summary ? String(post.data.summary) : undefined,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = load(slug);
  if (!post) notFound();
  const { data, content } = post;

  const facts = [
    data.company && { label: "Organization", value: String(data.company) },
    data.date && { label: "Published", value: formatArticleDate(data.date) },
    { label: "Reading time", value: `${readingMinutes(content)} min` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Article
      tone="rose"
      kicker="Case study"
      title={String(data.title ?? slug)}
      standfirst={data.summary ? String(data.summary) : undefined}
      facts={facts}
      back={{ label: "← Selected work", href: "/#work" }}
      body={content}
    />
  );
}
