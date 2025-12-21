import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type WritingPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
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