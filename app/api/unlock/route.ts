import { NextResponse } from "next/server";
import { ACCESS_COOKIE, codeMatches, cookieValue } from "@/lib/access";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const attempt = typeof body.code === "string" ? body.code : "";
  const value = cookieValue();
  if (!value || !codeMatches(attempt)) {
    // Small delay slows down guessing without adding state.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
