// lib/toc.ts
export type TocItem = {
    level: 2 | 3;
    text: string;
    id: string;
  };
  
  /**
   * Extracts H2/H3 headings from MDX source.
   * Supports:
   *   ## Heading
   *   ### Heading
   * Ignores headings inside fenced code blocks.
   */
  export function extractToc(mdx: string): TocItem[] {
    const lines = mdx.split("\n");
  
    let inFence = false;
    const items: TocItem[] = [];
  
    for (const rawLine of lines) {
      const line = rawLine.trim();
  
      // toggle fenced code blocks
      if (line.startsWith("```")) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
  
      // match ## / ###
      const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (!m) continue;
  
      const level = m[1].length as 2 | 3;
      const text = stripMdx(m[2]);
      const id = slugify(text);
  
      items.push({ level, text, id });
    }
  
    return items;
  }
  
  function stripMdx(s: string) {
    return s
      .replace(/`([^`]+)`/g, "$1")          // inline code
      .replace(/\*\*([^*]+)\*\*/g, "$1")   // bold
      .replace(/\*([^*]+)\*/g, "$1")       // italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
      .replace(/<[^>]+>/g, "")             // JSX/HTML tags
      .trim();
  }
  
  export function slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }