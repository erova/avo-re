import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type AboutDocMeta = {
  slug: string;
  title: string;
  summary: string;
};

const ABOUT_DIR = path.join(process.cwd(), "content", "about");

export function getAboutSource(slug: string): string {
  const fullPath = path.join(ABOUT_DIR, `${slug}.mdx`);
  return fs.readFileSync(fullPath, "utf8");
}

export function getAboutMeta(slug: string): AboutDocMeta {
  const source = getAboutSource(slug);
  const { data } = matter(source);

  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
  };
}