// WORK LIB v2 (no JSX allowed in this file)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type WorkPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

function resolveWorkDir(): string {
  const candidateA = path.join(process.cwd(), "content", "work");
  if (fs.existsSync(candidateA)) return candidateA;

  const candidateB = path.join(process.cwd(), "..", "content", "work");
  if (fs.existsSync(candidateB)) return candidateB;

  // Fall back to the default path; callers will throw a useful error.
  return candidateA;
}

const WORK_DIR = resolveWorkDir();

export function getWorkSlugs(): string[] {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs
    .readdirSync(WORK_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getWorkSource(slug: string): string {
  const safeSlug = decodeURIComponent(String(slug)).trim();

  const mdxPath = path.join(WORK_DIR, `${safeSlug}.mdx`);
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf8");

  const mdPath = path.join(WORK_DIR, `${safeSlug}.md`);
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf8");

  throw new Error(
    `Work file not found for slug: ${safeSlug}. Looked in: ${WORK_DIR} (cwd: ${process.cwd()})`
  );
}

export function getWorkPostMeta(slug: string): WorkPost {
  const source = getWorkSource(decodeURIComponent(String(slug)).trim());
  const { data } = matter(source);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

export function getAllWorkMeta(): WorkPost[] {
  return getWorkSlugs()
    .map(getWorkPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
