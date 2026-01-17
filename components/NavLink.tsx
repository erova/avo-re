"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, className, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  const combinedClassName = [
    className,
    isActive ? "text-neutral-100 underline" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      data-nav
      href={href}
      className={combinedClassName}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
