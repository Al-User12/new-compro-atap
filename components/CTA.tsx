// components/CTA.tsx
//
// CTA_Section for the Atap Kreatif Manajemen landing page (Task 7.11).
//
// Design constraints:
//   - Full-bleed band with `bg-primary text-background` so the section
//     anchors the page visually before the Footer (Req 7.3, 18.8). The
//     band sits between the page background above and the Footer band
//     below; the band's vertical rhythm comes from `py-20 md:py-28`.
//   - Centered editorial layout: heading → optional body → Primary_CTA →
//     Secondary_CTA, all centered with `text-center` and constrained to
//     `max-w-4xl` so the heading reads as a single editorial gesture
//     rather than a wall of text (Req 1.4, 5.4).
//   - Primary_CTA label and href are passed through verbatim from the
//     `primaryCta` prop. Because every render site (Navbar, Hero,
//     CTA_Section) is wired to `brand.primaryCta` from `app/page.tsx`,
//     the Primary_CTA is byte-equal across all three render sites
//     (Req 2.3, 4.5, Property 4). The same byte-equality holds for
//     `secondaryCta` between Hero and CTA_Section (Req 16.8).
//   - Mobile: CTAs stack vertically; tablet+ (`sm:`): CTAs sit
//     side-by-side, centered (Req 5.4).
//   - On the `bg-primary` band the default Button `primary`/`secondary`
//     variants would either disappear (`bg-primary` on `bg-primary`) or
//     read with insufficient contrast (`text-primary` on `bg-primary`).
//     We override the Button color classes via `className` so the
//     Primary_CTA flips to `bg-background text-primary` and the
//     Secondary_CTA reads as a hairline `text-background` button. The
//     overrides resolve through `cn()` + `tailwind-merge` so the later
//     classes win (Req 11.7, 11.8). No new color tokens are introduced.
//   - When `heading` is empty/whitespace, render a structural placeholder
//     and emit a single `// TODO(brand):` marker per missing field
//     (Req 1.5, 10.4, 10.5). The optional `body` is rendered only when
//     non-empty — an absent body never produces an empty `<p>` node
//     (Req 2.4).
//   - Wrapped in `<MotionSection>` (entrance ≤ 600 ms per Req 7.3) using
//     the default `fadeUp` variant. Reduced motion is honored by the
//     wrapper (Req 7.4) so this component does not need its own
//     preference check.
//   - Brand-specific text and links arrive exclusively via props — zero
//     hard-coded brand literals (Req 2.6, 11.7, 11.8).
//
// This is a Server Component: it owns no client state, no event handlers,
// and no effects. The `MotionSection` and `Button` children either bring
// their own `"use client"` boundary (MotionSection) or are themselves
// Server Components (Button), so this file stays free of the
// `"use client"` directive.

import * as React from "react";

import MotionSection from "@/components/motion/MotionSection";
import Button from "@/components/ui/Button";
import { cn, nonEmpty } from "@/lib/utils";

export interface CtaProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** Optional supporting copy; omitted from the DOM when blank (Req 2.4). */
  body?: string;
  /**
   * Primary_CTA — byte-equal to `brand.primaryCta` and identical to the
   * Hero/Navbar instances (Req 2.3, 4.5, Property 4).
   */
  primaryCta: { label: string; href: string };
  /**
   * Secondary_CTA — byte-equal to `brand.secondaryCta` and identical to
   * the Hero instance (Req 16.8, Property 4).
   */
  secondaryCta: { label: string; href: string };
  className?: string;
}

const HEADING_ID = "cta-heading";

export default function CTA({
  heading,
  body,
  primaryCta,
  secondaryCta,
  className,
}: CtaProps) {
  const headingText = nonEmpty(heading);
  const bodyText = nonEmpty(body);

  return (
    <MotionSection
      as="section"
      id="cta"
      ariaLabelledBy={HEADING_ID}
      className={cn("bg-primary text-background", className)}
    >
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
        {headingText !== null ? (
          <h2
            id={HEADING_ID}
            className={cn(
              "font-display font-bold text-background leading-tight",
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
            )}
          >
            {headingText}
          </h2>
        ) : (
          // TODO(brand): CTA — missing brand.cta.heading
          <h2
            id={HEADING_ID}
            className={cn(
              "font-display font-bold text-background leading-tight",
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
            )}
          >
            <span
              aria-hidden="true"
              className="block h-[1em] w-2/3 rounded-md bg-background/20 mx-auto"
            />
          </h2>
        )}

        {bodyText !== null && (
          <p className="mt-4 mx-auto max-w-prose leading-relaxed text-background/80">
            {bodyText}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4 justify-center sm:flex-row">
          {/* Primary_CTA — label/href pass through byte-equal from props
              (Req 2.3, 4.5, Property 4). Color override flips the default
              `primary` variant from `bg-primary text-background` (which
              would disappear on this band) to `bg-background text-primary`
              while reusing every other Button token (hit area, focus
              ring, motion). */}
          <Button
            href={primaryCta.href}
            variant="primary"
            className="bg-background text-primary hover:bg-background/90"
          >
            {primaryCta.label}
          </Button>
          {/* Secondary_CTA — hairline button styled for the primary band. */}
          <Button
            href={secondaryCta.href}
            variant="ghost"
            className="border border-background/40 text-background hover:bg-background/10"
          >
            {secondaryCta.label}
          </Button>
        </div>
      </div>
    </MotionSection>
  );
}
