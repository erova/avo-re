"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type ContextMode = "default" | "diligent";

function resolveContext(params: URLSearchParams, defaultContext?: ContextMode) {
  const qp = (params.get("context") || "").toLowerCase();
  if (qp === "diligent") return "diligent";
  if (defaultContext === "diligent") return "diligent";
  return "default";
}

export function ContextNav({
  defaultContext = "default",
  children,
}: {
  defaultContext?: ContextMode;
  children: React.ReactNode; // your normal nav
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = resolveContext(searchParams, defaultContext);

  if (mode !== "diligent") return <>{children}</>;

  // “Back to avo.re” should drop the context param (and any other params)
  const backHref = pathname || "/";

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        <div className="text-sm font-semibold text-slate-900">
          Diligent · Product Design Exploration
        </div>

        <Link
          href={backHref}
          className="text-sm text-slate-700 hover:text-slate-900 underline decoration-slate-300 underline-offset-4"
        >
          Back to avo.re
        </Link>
      </div>
    </div>
  );
}