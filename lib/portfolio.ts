import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CASES_DIR = path.join(process.cwd(), "content", "cases");
const QUOTES_DIR = path.join(process.cwd(), "content", "quotes");

export type Case = {
  slug: string;
  title: string;
  company: string;
  years: string;
  order: number;
  deepDive: boolean;
  situation: string;
  did: string;
  outcomes: string[];
  asking: string;
  media: string;
  link?: string;
  linkLabel?: string;
};

export type Quote = {
  quote: string;
  name: string;
  title: string;
  relationship: string;
  order: number;
};

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

export function getCases(): Case[] {
  return readDir(CASES_DIR)
    .map((file) => {
      const { data: d } = matter(fs.readFileSync(path.join(CASES_DIR, file), "utf8"));
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: String(d.title ?? ""),
        company: String(d.company ?? ""),
        years: String(d.years ?? ""),
        order: Number(d.order ?? 99),
        deepDive: d.deepDive === true,
        situation: String(d.situation ?? "").trim(),
        did: String(d.did ?? "").trim(),
        outcomes: Array.isArray(d.outcomes) ? d.outcomes.map(String) : [],
        asking: String(d.asking ?? "").trim(),
        media: String(d.media ?? ""),
        link: d.link ? String(d.link) : undefined,
        linkLabel: d.linkLabel ? String(d.linkLabel) : undefined,
      } satisfies Case;
    })
    .filter((c) => c.title)
    .sort((a, b) => a.order - b.order);
}

export function getQuotes(): Quote[] {
  return readDir(QUOTES_DIR)
    .map((file) => {
      const { data: d } = matter(fs.readFileSync(path.join(QUOTES_DIR, file), "utf8"));
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
