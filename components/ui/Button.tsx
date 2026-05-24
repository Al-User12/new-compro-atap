// components/ui/Button.tsx
//
// Shared Button primitive used by Hero, CTA_Section, Navbar, and Footer.
// Renders an `<a>` when `href` is supplied, otherwise a `<button type="button">`.
//
// Design constraints (Task 5.1):
//   - Hit target: min 44×44 CSS px at every viewport (Req 4.1–4.4, 5.8)
//     enforced via `min-h-11 min-w-11 px-5 py-3`.
//   - Focus ring: visible 2px offset outline using the brand accent token (Req 6.5).
//   - Motion: hover/focus transitions ≤ 250ms (`duration-200`) (Req 7.5).
//   - Visual tokens only — no hex literals; colors resolve through Tailwind
//     theme keys defined in tailwind.config.ts (Req 11.7, 11.8).
//
// This component is intentionally a Server Component (no "use client",
// no hooks, no event handlers). Navigation happens through the anchor's
// `href` and the native button activation behaviour.

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 " +
  "min-h-11 min-w-11 px-5 py-3 " +
  "rounded-md font-medium text-base leading-none " +
  "transition-colors duration-200 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-background hover:bg-primary/90",
  secondary: "border border-primary text-primary hover:bg-primary/10",
  ghost: "text-primary hover:bg-primary/5",
};

export default function Button({
  variant = "primary",
  href,
  ariaLabel,
  children,
  className,
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href !== undefined) {
    return (
      <a href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );
}
