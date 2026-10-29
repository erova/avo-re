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
  ".mp4": "video/mp4",
};

export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
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
    const headers = { "Content-Type": type, "Cache-Control": "private, no-store", "Accept-Ranges": "bytes" };
    // Safari will not play a video unless it can ask for byte ranges.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
    if (range && (range[1] || range[2])) {
      const size = data.length;
      const start = range[1] ? Number(range[1]) : Math.max(size - Number(range[2]), 0);
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start > end || start >= size) {
        return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
      }
      return new Response(new Uint8Array(data.subarray(start, end + 1)), {
        status: 206,
        headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
      });
    }
    return new Response(new Uint8Array(data), { headers: { ...headers, "Content-Length": String(data.length) } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
