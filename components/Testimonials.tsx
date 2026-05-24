"use client";

// components/Testimonials.tsx
//
// Testimonials_Section for the Atap Kreatif Manajemen landing page (Task 7.10).
//
// Design constraints (design.md → Section: Testimonials):
//   - Two-column editorial grid on desktop, single column on mobile. Each
//     populated card shows an oversized opening-quote glyph (decorative,
//     `aria-hidden`), the quote in italic body face, and attribution
//     `— Name, Role` (Req 14.3, 14.4).
//   - Cards: `bg-primary/5 border border-primary/10 rounded-md p-8` so the
//     section reuses only token utilities — no hex literals (Req 11.7,
//     11.8, 14.6).
//   - Filter rule: any entry missing `quote`, `name`, *or* `role` is omitted
//     entirely (Req 14.5, Property 15). Partial cards never render. The
//     count of rendered cards therefore equals the count of complete
//     entries (no padding to a layout slot count).
//   - Empty state: when `entries.length === 0` *or* every entry is filtered
//     out, render exactly 3 placeholder cards whose dimensions and spacing
//     match the populated layout. Skeleton lines use `bg-primary/10`. Emit
//     a single `// TODO(brand): Testimonials — missing brand.testimonials
//     entries` marker so a downstream content-population pass can locate
//     the gap (Req 10.2, 10.5). No fabricated names, quotes, or companies
//     are rendered (Req 14.7, 16.9, Property 19).
//   - Wrapped in `<MotionSection>` so the section fades into view within
//     the 600 ms entrance budget (Req 7.3); cards cascade via `<Stagger>`
//     at 60 ms per card (Req 7.1). Both wrappers honor
//     Reduced_Motion_Preference (Req 7.4).
//   - Brand-specific text arrives exclusively via props — zero hard-coded
//     brand literals or color literals (Req 2.6, 11.7, 11.8).
//
// This is a Client Component because each card is a `motion.figure` that
// participates in the parent `Stagger` via `variants={fadeUp}`.

import * as React from "react";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface TestimonialEntry {
  /** 1–280 chars (validated at content-population time, not at type level). */
  quote: string;
  /** 1–60 chars. */
  name: string;
  /** 1–80 chars (role or company). */
  role: string;
}

export interface TestimonialsProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** 0+ entries — empty (or all-filtered-out) triggers the placeholder grid (Req 10.2). */
  entries: TestimonialEntry[];
  className?: string;
}

const HEADING_ID = "testimonials-heading";

const GRID_CLASSES = "mt-10 grid grid-cols-1 md:grid-cols-2 gap-6";

const CARD_CLASSES =
  "bg-primary/5 border border-primary/10 rounded-md p-8";

/**
 * Decide whether a Brand_Config testimonial entry is *complete* — i.e. has
 * non-empty `quote`, `name`, *and* `role`. Partial entries are dropped per
 * Req 14.5 / Property 15: the rendered card count must equal the count of
 * complete entries, never padded with fabricated content.
 */
function isComplete(entry: TestimonialEntry): boolean {
  return (
    nonEmpty(entry.quote) !== null &&
    nonEmpty(entry.name) !== null &&
    nonEmpty(entry.role) !== null
  );
}

export default function Testimonials({
  heading,
  entries,
  className,
}: TestimonialsProps) {
  const filtered = entries.filter(isComplete);
  const isEmpty = filtered.length === 0;

  return (
    <MotionSection
      as="section"
      id="testimonials"
      ariaLabelledBy={HEADING_ID}
      className={cn("relative w-full", className)}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <h2
          id={HEADING_ID}
          className={cn(
            "font-display font-bold text-primary leading-tight",
            "text-3xl sm:text-4xl md:text-5xl",
          )}
        >
          {heading}
        </h2>

        {isEmpty ? (
          // TODO(brand): Testimonials — missing brand.testimonials entries
          <Stagger delay={0.06} className={GRID_CLASSES}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`testimonials-placeholder-${i}`}
                variants={fadeUp}
                aria-hidden="true"
                className={CARD_CLASSES}
              >
                {/* Skeleton lines stand in for the quote body so the
                    placeholder reserves the same vertical rhythm as a
                    populated card without rendering any fabricated text
                    (Req 10.2, 14.7, 16.9, Property 19). */}
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-md bg-primary/10" />
                  <div className="h-3 w-5/6 rounded-md bg-primary/10" />
                  <div className="h-3 w-2/3 rounded-md bg-primary/10" />
                </div>
                {/* Attribution line skeleton. */}
                <div className="mt-6 h-3 w-1/3 rounded-md bg-primary/10" />
              </motion.div>
            ))}
          </Stagger>
        ) : (
          <Stagger delay={0.06} className={GRID_CLASSES}>
            {filtered.map((entry, idx) => (
              <motion.figure
                key={`${entry.name}-${idx}`}
                variants={fadeUp}
                className={cn(CARD_CLASSES, "flex flex-col")}
              >
                {/* Decorative oversized opening-quote glyph — `aria-hidden`
                    so screen readers don't announce it. The character is
                    a Unicode left double quotation mark (U+201C) for the
                    editorial typography target (Req 18.9). */}
                <span
                  aria-hidden="true"
                  className="font-display text-5xl text-accent leading-none"
                >
                  {"\u201C"}
                </span>
                <blockquote className="mt-4 text-primary italic leading-relaxed">
                  {entry.quote}
                </blockquote>
                <figcaption className="mt-6 text-sm text-primary/80">
                  {"\u2014 "}
                  {entry.name}
                  {", "}
                  {entry.role}
                </figcaption>
              </motion.figure>
            ))}
          </Stagger>
        )}
      </div>
    </MotionSection>
  );
}
