"use client";

import React, {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type ContextMode = "default" | "diligent";

type NavCtx = {
  pageMode: ContextMode;
  setPageMode: (m: ContextMode) => void;
};

const Ctx = createContext<NavCtx | null>(null);

function useNavCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("SetNavContext must be used within <ContextNav>.");
  return ctx;
}

/**
 * Option 1: Page-level flag.
 * Drop <SetNavContext mode="diligent" /> anywhere inside a page component
 * to default that route to the Diligent nav (unless overridden by query string).
 */
export function SetNavContext({ mode }: { mode: ContextMode }) {
  const { setPageMode } = useNavCtx();
  useEffect(() => {
    setPageMode(mode);
    return () => setPageMode("default");
  }, [mode, setPageMode]);
  return null;
}

function resolveQueryMode(searchParams: URLSearchParams): ContextMode | null {
  const qp = (searchParams.get("context") || "").toLowerCase();
  if (qp === "diligent") return "diligent";
  if (qp === "default") return "default";
  return null;
}

function ContextNavInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pageMode, setPageMode] = useState<ContextMode>("default");
  const queryMode = useMemo(() => resolveQueryMode(searchParams), [searchParams]);
  const effectiveMode: ContextMode = queryMode ?? pageMode;

  // Back link strips query params by using pathname only
  const backHref = pathname || "/";

  return (
    <Ctx.Provider value={{ pageMode, setPageMode }}>
      {effectiveMode === "diligent" ? (
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-sm tracking-tight font-medium text-neutral-100">
            Diligent · Product Design Exploration
          </div>
          <Link
            href={backHref}
            className="text-sm text-neutral-300 hover:text-neutral-100 transition hover:underline underline-offset-4"
          >
            Back to avo.re
          </Link>
        </div>
      ) : (
        <>{children}</>
      )}
    </Ctx.Provider>
  );
}

export function ContextNav({ children }: { children: React.ReactNode }) {
  // Critical: ensure anything that uses useSearchParams is under Suspense.
  // Fallback renders the normal nav so SSR/prerender never fails.
  return (
    <Suspense fallback={<>{children}</>}>
      <ContextNavInner>{children}</ContextNavInner>
    </Suspense>
  );
}