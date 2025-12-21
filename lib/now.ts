import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type NowExperiment = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

const NOW_DIR = path.join(process.cwd(), "content", "now");

export function getNowSlugs(): string[] {
  if (!fs.existsSync(NOW_DIR)) return [];
  return fs
    .readdirSync(NOW_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getNowSource(slug: string): string {
  const fullPath = path.join(NOW_DIR, `${slug}.mdx`);
  return fs.readFileSync(fullPath, "utf8");
}

export function getNowMeta(slug: string): NowExperiment {
  const raw = getNowSource(slug);
  const { data } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

export function getAllNowMeta(): NowExperiment[] {
  return getNowSlugs()
    .map(getNowMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}