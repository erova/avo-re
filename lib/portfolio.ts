import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CASES_DIR = path.join(process.cwd(), "content", "cases");
const QUOTES_DIR = path.join(process.cwd(), "content", "quotes");

export type StageImage = { src: string; width: number; height: number; alt: string };
export type Stage = { main: StageImage; panels: StageImage[] };

export type Case = {
  slug: string;
  title: string;
  company: string;
  years: string;
  rail: string;
  tags: string[];
  order: number;
  deepDive: boolean;
  situation: string;
  did: string;
  outcomes: string[];
  asking: string;
  media: string;
  link?: string;
  linkLabel?: string;
  stage?: Stage;
};

export type Quote = {
  quote: string;
  name: string;
  title: string;
  relationship: string;
  order: number;
};

// Some Markdown editors (Ulysses) turn frontmatter indentation into tabs and escape block markers (\>-), which YAML rejects.
function parse(raw: string) {
  return matter(raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, (fm) => fm.replace(/^\t+/gm, (t) => "    ".repeat(t.length)).replace(/:\s+\\([>|][-+]?)\s*$/gm, ": $1")));
}

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export function getCases(): Case[] {
  return readDir(CASES_DIR)
    .map((file) => {
      const { data: d } = parse(fs.readFileSync(path.join(CASES_DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(d.title ?? ""),
        company: String(d.company ?? ""),
        years: String(d.years ?? ""),
        rail: String(d.rail ?? d.title ?? ""),
        tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
        order: Number(d.order ?? 99),
        deepDive: d.deepDive === true,
        situation: String(d.situation ?? "").trim(),
        did: String(d.did ?? "").trim(),
        outcomes: Array.isArray(d.outcomes) ? d.outcomes.map(String) : [],
        asking: String(d.asking ?? "").trim(),
        media: String(d.media ?? ""),
        link: d.link ? String(d.link) : undefined,
        linkLabel: d.linkLabel ? String(d.linkLabel) : undefined,
        stage: d.stage ? (d.stage as Stage) : undefined,
      } satisfies Case;
    })
    .filter((c) => c.title)
    .sort((a, b) => a.order - b.order);
}

export function getQuotes(): Quote[] {
  return readDir(QUOTES_DIR)
    .map((file) => {
      const { data: d } = parse(fs.readFileSync(path.join(QUOTES_DIR, file), "utf8"));
      return {
        quote: String(d.quote ?? "").trim(),
        name: String(d.name ?? ""),
        title: String(d.title ?? ""),
        relationship: String(d.relationship ?? ""),
        order: Number(d.order ?? 99),
      } satisfies Quote;
    })
    .filter((q) => q.quote)
    .sort((a, b) => a.order - b.order);
}

export function formatMonthYear(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

// ───── Home page prose: content/portfolio/*.md ─────
const PORTFOLIO_DIR = path.join(process.cwd(), "content", "portfolio");

/** Read one file from content/portfolio. Frontmatter is `data`, the markdown below it is `body`. */
export function readPortfolio<T = Record<string, any>>(name: string): { data: T; body: string } {
  const raw = fs.readFileSync(path.join(PORTFOLIO_DIR, `${name}.md`), "utf8");
  const { data, content } = parse(raw);
  return { data: data as T, body: content.trim() };
}

/** Split markdown on its "##" headings: each heading becomes a title, the text under it a body. */
export function splitSections(body: string): { title: string; body: string }[] {
  const out: { title: string; lines: string[] }[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) out.push({ title: m[1], lines: [] });
    else if (out.length) out[out.length - 1].lines.push(line);
  }
  return out.map((o) => ({ title: o.title, body: o.lines.join("\n").trim() }));
}

export type EarlierJob = { title: string; order: number; body: string };

export function getEarlier(): EarlierJob[] {
  const dir = path.join(PORTFOLIO_DIR, "earlier");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = parse(fs.readFileSync(path.join(dir, f), "utf8"));
      return { title: String(data.title ?? f), order: Number(data.order ?? 99), body: content.trim() };
    })
    .sort((a, b) => a.order - b.order);
}
