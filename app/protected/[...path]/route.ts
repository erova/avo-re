import fs from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, cookieIsValid } from "@/lib/access";

const ROOT = path.join(process.cwd(), "private");
const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
};

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const jar = await cookies();
  if (!cookieIsValid(jar.get(ACCESS_COOKIE)?.value)) {
    return new Response("Locked", { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const { path: parts } = await ctx.params;
  const file = path.resolve(ROOT, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(ROOT + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "private, no-store" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
