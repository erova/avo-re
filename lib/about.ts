import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

function aboutPath(slug: string) {
  return path.join(process.cwd(), "content/about", `${slug}.mdx`);
}

export function getAboutMeta(slug: string) {
  const raw = fs.readFileSync(aboutPath(slug), "utf8");
  const { data } = matter(raw);
  return { title: data.title ?? "", summary: data.summary ?? "" };
}

export function getAboutSource(slug: string) {
  const raw = fs.readFileSync(aboutPath(slug), "utf8");
  const { content } = matter(raw);
  return content; // ✅ no front-matter
}