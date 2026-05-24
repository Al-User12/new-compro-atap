"use client";

// components/Navbar.tsx
//
// Top navigation Section_Component for the Atap Kreatif Manajemen landing
// page (Task 7.1).
//
// Design constraints:
//   - Sticky top bar (`h-16 md:h-20`, `bg-background/80 backdrop-blur`)
//     anchored to the page-level `<header>` rendered by `app/page.tsx`
//     (Req 1.2, 5.3).
//   - Desktop ≥ 768 px: inline nav links + Primary_CTA; mobile trigger
//     hidden (Req 5.3).
//   - Mobile ≤ 767 px: 44×44 burger trigger opens `<Sheet>` containing the
//     nav links + Primary_CTA (Req 4.2, 5.2, 5.7).
//   - Brand-specific text comes from props only — zero hard-coded brand
//     literals (Req 2.6, 11.7, 11.8).
//   - Logo: `<img>` if `logoSrc` provided; otherwise a typographic
//     wordmark fallback preceded by a case-sensitive brand-todo marker
//     (literal prefix in lower JSX) so a project-wide grep surfaces the
//     missing asset (Req 10.1, 10.5, 18.5, 18.6).
//
// This is a Client Component because the mobile menu owns `open` state and
// passes it down to the Sheet primitive.

import * as React from "react";
import { Menu } from "lucide-react";

import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  brandName: string;
  shortName: string;
  wordmark: string;
  logoSrc?: string;
  nav: { label: string; href: string }[];
  primaryCta: { label: string; href: string };
}

const linkClasses =
  "text-primary transition-colors duration-200 hover:text-primary/80 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-sm";

export default function Navbar({
  brandName,
  shortName,
  wordmark,
  logoSrc,
  nav,
  primaryCta,
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const closeMenu = React.useCallback(() => setOpen(false), []);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "sticky top-0 z-40 w-full",
        "h-16 md:h-20",
        "bg-background/80 backdrop-blur",
        "border-b border-primary/5",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-6">
        {/* Logo / wordmark */}
        <a
          href="#"
          aria-label={brandName}
          className={cn(
            "inline-flex items-center rounded-sm",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          {logoSrc !== undefined ? (
            <img
              src={logoSrc}
              alt={brandName}
              className="h-8 w-auto md:h-10"
            />
          ) : (
            // TODO(brand): Navbar — missing brand.assets.logoSvg
            <span className="font-display font-bold tracking-tight text-primary">
              <span className="md:hidden">{shortName}</span>
              <span className="hidden md:inline">{wordmark}</span>
            </span>
          )}
        </a>

        {/* Desktop nav (≥ md) */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClasses}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={primaryCta.href} variant="primary">
            {primaryCta.label}
          </Button>
        </div>

        {/* Mobile trigger (< md) */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex items-center justify-center md:hidden",
            "min-h-11 min-w-11 rounded-md",
            "text-primary transition-colors duration-200 hover:bg-primary/5",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          <Menu aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sheet */}
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={brandName}
        closeLabel="Close menu"
      >
        <nav aria-label="Mobile primary">
          <ul className="flex flex-col gap-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    linkClasses,
                    "block py-2 text-lg font-display",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button
              href={primaryCta.href}
              variant="primary"
              className="w-full"
            >
              {primaryCta.label}
            </Button>
          </div>
        </nav>
      </Sheet>
    </nav>
  );
}
