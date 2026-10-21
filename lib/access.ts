import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE = "avo_images";

// The cookie is an HMAC keyed by the access code, so changing the code in the
// environment signs everyone out. No code configured means nothing unlocks.
function token(code: string) {
  return createHmac("sha256", code).update("avo-re-private-images-v1").digest("hex");
}

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function codeMatches(attempt: string) {
  const code = process.env.ACCESS_CODE;
  if (!code) return false;
  return same(token(attempt.trim()), token(code));
}

export function cookieValue() {
  const code = process.env.ACCESS_CODE;
  return code ? token(code) : null;
}

export function cookieIsValid(value: string | undefined) {
  const expected = cookieValue();
  return Boolean(expected && value && same(value, expected));
}
