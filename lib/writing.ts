import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type WritingPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category?: string;
  /** For case studies written after the fact: the year the work happened. `date` stays the year it was written. */
  workYear?: string;
  /** Lead image: shown on the home page panel and at the top of the article. */
  image?: { src: string; width: number; height: number; alt: string };
};

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

export function getWritingSlugs(): string[] {
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getWritingPostMeta(slug: string): WritingPost {
  const fullPath = path.join(WRITING_DIR, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(source);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: data.category ? String(data.category) : undefined,
    workYear: data.workYear ? String(data.workYear) : undefined,
    image: data.image?.src ? { src: String(data.image.src), width: Number(data.image.width), height: Number(data.image.height), alt: String(data.image.alt ?? "") } : undefined,
  };
}

export function getAllWritingMeta(): WritingPost[] {
  return getWritingSlugs()
    .map(getWritingPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWritingSource(slug: string): string {
  const fullPath = path.join(WRITING_DIR, `${slug}.mdx`);
  return fs.readFileSync(fullPath, "utf8");
}