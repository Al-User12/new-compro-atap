// components/Problem.tsx
//
// Problem_Section for the Atap Kreatif Manajemen landing page (Task 7.4).
//
// Design constraints:
//   - Two-column editorial split on desktop: oversized pull-quote-style
//     heading on the left, body paragraph + optional accent image on the
//     right. Single column on mobile (Req 5.4, 5.6).
//   - Heading is the section's only `<h2>`, referenced via `aria-labelledby`
//     from the parent `<section>` (Req 1.4).
//   - All brand-specific copy arrives via props (Req 2.6, 11.7, 11.8); the
//     component renders no hard-coded competitor names, client names, or
//     fabricated claims (Req 16.2, 16.9).
//   - Wrapped in `<MotionSection>` so the editorial block fades into view
//     within the 600 ms entrance budget (Req 7.3). Reduced-motion is
//     honored by the wrapper (Req 7.4).
//   - When `body` (or `heading`) is empty/whitespace, render a structural
//     placeholder that preserves layout slot dimensions and emit a single
//     `// TODO(brand):` marker per missing field (Req 1.5, 10.4, 10.5).
//   - `next/image` renders the optional accent image with explicit width and
//     height for CLS = 0 (Req 9.5). No `onError` fallback is required for
//     this purely decorative slot — when the asset is omitted the column
//     simply collapses to body-only.
//
// This is a Server Component — it owns no interactive state. The only
// client work happens inside `<MotionSection>` (which carries `"use client"`).

import * as React from "react";
import Image from "next/image";

import MotionSection from "@/components/motion/MotionSection";
import { cn, nonEmpty } from "@/lib/utils";

export interface ProblemAccentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProblemProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** Body paragraph (1–400 chars per Brand_Config invariant). */
  body: string;
  /** Optional editorial eyebrow shown above the heading. */
  eyebrow?: string;
  /** Optional editorial accent image rendered alongside the body on desktop. */
  accentImage?: ProblemAccentImage;
  className?: string;
}

const HEADING_ID = "problem-heading";

export default function Problem({
  heading,
  body,
  eyebrow,
  accentImage,
  className,
}: ProblemProps) {
  const eyebrowText = nonEmpty(eyebrow);
  const headingText = nonEmpty(heading);
  const bodyText = nonEmpty(body);

  return (
    <MotionSection
      as="section"
      id="problem"
      ariaLabelledBy={HEADING_ID}
      className={cn("relative w-full", className)}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column — eyebrow + heading ----------------------------- */}
          <div className="lg:col-span-5">
            {eyebrowText !== null && (
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">
                {eyebrowText}
              </p>
            )}

            {headingText !== null ? (
              <h2
                id={HEADING_ID}
                className={cn(
                  "font-display font-bold text-primary leading-tight",
                  "text-3xl sm:text-4xl md:text-5xl",
                )}
              >
                {headingText}
              </h2>
            ) : (
              // TODO(brand): Problem — missing brand.problem.heading
              <h2
                id={HEADING_ID}
                className={cn(
                  "font-display font-bold text-primary leading-tight",
                  "text-3xl sm:text-4xl md:text-5xl",
                )}
              >
                <span
                  aria-hidden="true"
                  className="block h-[1em] w-2/3 rounded-md bg-primary/10"
                />
              </h2>
            )}
          </div>

          {/* Right column — body + accent image -------------------------- */}
          <div className="lg:col-span-7">
            {/* Mobile-only accent rule between heading and body — keeps the
                editorial rhythm when the columns collapse to one (design.md
                "Brand color usage": accent rule on mobile). */}
            <hr
              aria-hidden="true"
              className="mb-6 border-0 border-t border-accent lg:hidden"
            />

            {bodyText !== null ? (
              <p className="max-w-prose leading-relaxed text-primary/80">
                {bodyText}
              </p>
            ) : (
              // TODO(brand): Problem — missing brand.problem.body
              <p className="max-w-prose leading-relaxed text-primary/80">
                <span
                  aria-hidden="true"
                  className="block h-4 w-full rounded-md bg-primary/10"
                />
              </p>
            )}

            {accentImage !== undefined && (
              <div className="mt-8">
                <Image
                  src={accentImage.src}
                  alt={accentImage.alt}
                  width={accentImage.width}
                  height={accentImage.height}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-auto w-full rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
