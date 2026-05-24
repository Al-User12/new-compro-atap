"use client";

// components/Solution.tsx
//
// Solution_Section for the Atap Kreatif Manajemen landing page (Task 7.5).
//
// Design constraints:
//   - Asymmetric 6-column bento grid on desktop: one large hero card
//     (cols 1–4, rows 1–2) carrying the brand promise sentence in the
//     wordmark color, plus 4–6 smaller pillar cards each occupying a
//     2-column slot. Tablet collapses to a 2-column grid (hero spans
//     both); mobile collapses to a single column (Req 5.4, 5.6).
//   - Hero card uses `bg-primary text-background` so the brand promise
//     reads as the page's anchor moment. Smaller cards sit on the page
//     background with a hairline `border border-primary/15` rule, with
//     decorative accents in `text-accent` / `bg-accent` to give the grid
//     rhythm without introducing a new hue (Req 18.8).
//   - All cards use `rounded-md` only — never `rounded-xl` or higher —
//     so radii stay within the three-token scale `{sm, md, lg}` whose
//     largest value is 1 rem (Req 11.4, 18.11).
//   - Cards stagger into view with the `scaleIn` variant (fade + subtle
//     0.985 → 1 scale, ≤ 0.4 s each, sequenced via `<Stagger>`). The
//     wrappers honor Reduced_Motion_Preference (Req 7.3, 7.4).
//   - Source_Doc traceability: the body prop carries the integrated-
//     digital-ecosystem promise sentence; the pillar copy describes the
//     six service families combined into one accountable workflow
//     (Req 16.3). The component renders that copy verbatim from props
//     and never fabricates any claim (Req 16.9).
//   - Brand-specific text arrives exclusively via props — zero hard-coded
//     brand literals or color literals (Req 2.6, 11.7, 11.8).
//   - When `heading` or `body` is empty/whitespace, render a structural
//     placeholder that preserves the layout slot dimensions and emit a
//     single `// TODO(brand):` marker per missing field (Req 1.5, 10.4,
//     10.5). The pillars list is treated as required data — empty pillars
//     leave the grid with only the hero card, which still satisfies the
//     "≥ 1 hero + 0 pillars" structural skeleton.
//
// This is a Client Component because each card is a `motion.div` that
// participates in the parent `<Stagger>` via `variants={scaleIn}`.

import * as React from "react";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { scaleIn } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface SolutionPillar {
  /** Pillar headline (1–60 chars recommended). */
  title: string;
  /** Pillar supporting copy (paraphrased from Source_Doc). */
  description: string;
  /**
   * Optional Lucide icon name. Reserved for future iconography; the current
   * implementation renders a token-styled accent bar in lieu of a glyph so
   * the grid avoids dynamic icon imports.
   */
  icon?: string;
}

export interface SolutionProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** Brand promise sentence shown inside the hero card (Req 16.3). */
  body: string;
  /** Four to six pillar cards (Req 5.6). */
  pillars: SolutionPillar[];
  className?: string;
}

const HEADING_ID = "solution-heading";

const HERO_CARD_CLASSES = cn(
  "bg-primary text-background rounded-md p-8 md:p-10",
  // Bento placement — collapses to a single column on mobile, spans the
  // full 2-column tablet grid, and occupies cols 1–4 / rows 1–2 of the
  // 6-column desktop grid.
  "md:col-span-2 lg:col-span-4 lg:row-span-2",
  // Centered content with a comfortable minimum so the card always reads
  // as the anchor of the bento, even when the brand promise is short.
  "flex min-h-[12rem] flex-col justify-center",
);

const PILLAR_CARD_CLASSES = cn(
  "bg-background border border-primary/15 text-primary rounded-md p-6",
  // Bento placement — single column on mobile, half-width on tablet,
  // 2-of-6 columns on desktop.
  "md:col-span-1 lg:col-span-2",
  "flex flex-col",
);

export default function Solution({
  heading,
  body,
  pillars,
  className,
}: SolutionProps) {
  const headingText = nonEmpty(heading);
  const bodyText = nonEmpty(body);

  return (
    <MotionSection
      as="section"
      id="solution"
      ariaLabelledBy={HEADING_ID}
      className={cn("relative w-full", className)}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
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
          // TODO(brand): Solution — missing brand.solution.heading
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

        <Stagger
          delay={0.06}
          className={cn(
            "mt-10 grid gap-6",
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-4",
          )}
        >
          {/* Hero card — brand promise sentence ----------------------------- */}
          <motion.div variants={scaleIn} className={HERO_CARD_CLASSES}>
            {bodyText !== null ? (
              <p
                className={cn(
                  "font-display leading-snug",
                  "text-2xl md:text-3xl lg:text-4xl",
                )}
              >
                {bodyText}
              </p>
            ) : (
              // TODO(brand): Solution — missing brand.solution.body
              <span
                aria-hidden="true"
                className="block h-6 w-3/4 rounded-md bg-background/20"
              />
            )}
          </motion.div>

          {/* Pillar cards --------------------------------------------------- */}
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={scaleIn}
              className={PILLAR_CARD_CLASSES}
            >
              {/* Decorative accent bar in lieu of a Lucide glyph. The bar
                  carries the role of the pillar "icon" (Req 18.8) without
                  introducing a dynamic icon import. */}
              <div
                aria-hidden="true"
                className="mb-4 h-1 w-8 rounded-sm bg-accent"
              />
              <h3 className="font-display text-lg font-semibold text-primary">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary/80">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </MotionSection>
  );
}
