// components/Footer.tsx
//
// Footer Section_Component for the Atap Kreatif Manajemen landing page
// (Task 7.12).
//
// Design constraints:
//   - Renders the page's footer content. The parent `app/page.tsx` wraps
//     this component in the page-level `<footer>` landmark (Req 1.2), so
//     the root of this component is a plain `<div>`. Rendering an
//     additional `<footer>` here would produce two nested footer
//     landmarks, violating "exactly one `<footer>`" (Req 1.3).
//   - 4-column editorial grid on desktop (`brand · nav · contact ·
//     social`); single-column stack on mobile (Req 5.4, 5.6).
//   - Surface: `bg-primary text-background` so the footer band echoes the
//     CTA band immediately above it (Req 18.7, 18.8).
//   - Email rendered as `<a href="mailto:…">` with a non-empty
//     `aria-label` (Req 15.3). WhatsApp rendered as
//     `<a href={buildWhatsAppHref(contact.whatsapp)}>` with the explicit
//     accessible name "Chat Atap Kreatif on WhatsApp" (Req 15.4) using
//     the shared `buildWhatsAppHref` helper so the wa.me URL is byte-
//     equal to `brand.primaryCta.href` (Req 4.5).
//   - Copyright year = `formatYear(yearOverride)` so callers can pin the
//     year deterministically in tests while production renders the
//     current calendar year at request time on the server (Req 15.5,
//     15.6). Server-only `Date.now()` keeps the year stable across hydration.
//   - Social block: when `social.length === 0` the entire group (heading +
//     list) is omitted from the DOM rather than rendering an empty
//     container (Req 15.7). When `social.length ≥ 1`, every social link
//     carries a non-empty Accessible_Name via `aria-label` (Req 15.8).
//     The group remains in the DOM regardless of whether individual icon
//     assets load — the visible text label is the primary accessible name.
//   - Logo fallback identical to Navbar: when `logoSrc` is undefined, the
//     wordmark renders as Poppins Bold with a case-sensitive
//     `// TODO(brand): Footer — missing brand.assets.logoSvg` marker
//     immediately above the JSX (Req 10.1, 10.5, 18.6).
//   - All brand-specific text and links arrive exclusively via props —
//     zero hard-coded brand literals (Req 2.6, 11.7, 11.8). Token
//     utilities only — no hex/rgb/hsl literals in this file.
//
// This is a Server Component: no client state, no event handlers, no
// effects. Computing the year on the server avoids a hydration flash and
// keeps the rendered HTML deterministic for server snapshots.

import * as React from "react";
import { Mail, MessageCircle, MapPin } from "lucide-react";

import { buildWhatsAppHref, cn, formatYear, nonEmpty } from "@/lib/utils";

export interface FooterProps {
  brandName: string;
  shortName: string;
  wordmark: string;
  logoSrc?: string;
  description: string;
  contact: { email: string; whatsapp: string; address: string };
  social: { platform: string; href: string; label: string }[];
  /**
   * Footer navigation entries. Mirrors the primary nav slice of
   * Brand_Config so the footer can echo the page's anchor map.
   */
  nav: { label: string; href: string }[];
  /** Optional pinned year for deterministic snapshots (Req 15.5). */
  yearOverride?: number;
  className?: string;
}

const linkClasses =
  "inline-flex items-center gap-2 rounded-sm text-background/80 " +
  "transition-colors duration-200 hover:text-background " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const headingClasses =
  "mb-4 font-display text-xs uppercase tracking-[0.2em] text-accent";

export default function Footer({
  brandName,
  shortName: _shortName,
  wordmark,
  logoSrc,
  description,
  contact,
  social,
  nav,
  yearOverride,
  className,
}: FooterProps) {
  const year = formatYear(yearOverride);
  const descriptionText = nonEmpty(description);
  const addressText = nonEmpty(contact.address);
  const emailText = nonEmpty(contact.email);
  const whatsappText = nonEmpty(contact.whatsapp);
  const hasSocial = social.length > 0;

  // The `shortName` prop is accepted for API parity with `NavbarProps`
  // (mobile-viewport wordmark swap) but the footer always renders the
  // full wordmark, so we discard it explicitly to keep the prop on the
  // typed surface without triggering `noUnusedParameters`.
  void _shortName;

  return (
    <div className={cn("bg-primary text-background", className)}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand block --------------------------------------------------- */}
          <div>
            {logoSrc !== undefined ? (
              <img
                src={logoSrc}
                alt={brandName}
                className="h-9 w-auto"
              />
            ) : (
              // TODO(brand): Footer — missing brand.assets.logoSvg
              <span className="font-display font-bold tracking-tight text-background">
                {wordmark}
              </span>
            )}
            {descriptionText !== null && (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/80">
                {descriptionText}
              </p>
            )}
          </div>

          {/* Nav block ----------------------------------------------------- */}
          <nav aria-label="Footer">
            <h2 className={headingClasses}>Sitemap</h2>
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClasses}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact block ------------------------------------------------- */}
          <div>
            <h2 className={headingClasses}>Contact</h2>
            <ul className="space-y-3 text-sm">
              {emailText !== null && (
                <li>
                  <a
                    href={`mailto:${emailText}`}
                    aria-label={`Email ${brandName} at ${emailText}`}
                    className={linkClasses}
                  >
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>{emailText}</span>
                  </a>
                </li>
              )}
              {whatsappText !== null && (
                <li>
                  <a
                    href={buildWhatsAppHref(whatsappText)}
                    aria-label="Chat Atap Kreatif on WhatsApp"
                    className={linkClasses}
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>{whatsappText}</span>
                  </a>
                </li>
              )}
              {addressText !== null && (
                <li className="flex items-start gap-2 leading-relaxed text-background/70">
                  <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{addressText}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social block — omitted entirely when social.length === 0 (Req 15.7). */}
          {hasSocial && (
            <div>
              <h2 className={headingClasses}>Social</h2>
              <ul className="space-y-2 text-sm">
                {social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className={linkClasses}
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Copyright line ---------------------------------------------------- */}
        <div className="mt-12 border-t border-background/15 pt-6 text-sm text-background/70">
          © {year} {brandName}. All rights reserved.
        </div>
      </div>
    </div>
  );
}
