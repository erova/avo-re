import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Article } from "../../_components/Article";
import { getWritingSlugs, getWritingSource } from "@/lib/writing";
import { formatArticleDate, parseArticle, readingMinutes } from "@/lib/article";

export function generateStaticParams() {
  return getWritingSlugs().map((slug) => ({ slug }));
}

function load(slug: string) {
  try {
    return parseArticle(getWritingSource(slug));
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
    alternates: { canonical: `/writing/${slug}` },
  };
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = load(slug);
  if (!post) notFound();
  const { data, content } = post;
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];

  const facts = [
    data.workYear && { label: "Work from", value: String(data.workYear) },
    data.date && { label: data.workYear ? "Written" : "Published", value: formatArticleDate(data.date) },
    { label: "Reading time", value: `${readingMinutes(content)} min` },
    tags.length > 0 && { label: "Topics", value: tags.join(" · ") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Article
      tone="green"
      kicker={data.category ? String(data.category) : "Essay"}
      title={String(data.title ?? slug)}
      standfirst={data.summary ? String(data.summary) : undefined}
      facts={facts}
      back={{ label: "← Essays", href: "/#essays" }}
      body={content}
      image={data.image?.src ? { src: String(data.image.src), width: Number(data.image.width), height: Number(data.image.height), alt: String(data.image.alt ?? "") } : undefined}
    />
  );
}
