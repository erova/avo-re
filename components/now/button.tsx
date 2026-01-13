"use client";

import * as React from "react";

export type NowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
};

export function NowButton({
  variant = "default",
  size = "default",
  className = "",
  disabled,
  ...props
}: NowButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<NonNullable<NowButtonProps["variant"]>, string> = {
    default: "bg-foreground text-background hover:opacity-90",
    outline:
      "border border-border bg-background text-foreground hover:bg-muted/40",
    ghost: "bg-transparent text-foreground hover:bg-muted/40",
  };
  const sizes: Record<NonNullable<NowButtonProps["size"]>, string> = {
    default: "h-10 px-4",
    sm: "h-9 px-3 text-xs rounded-lg",
    icon: "h-9 w-9 p-0 rounded-lg",
  };

  return (
    <button
      className={[base, variants[variant], sizes[size], className].join(" ")}
      disabled={disabled}
      {...props}
    />
  );
}