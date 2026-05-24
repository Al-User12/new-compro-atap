"use client";

// components/WhyChooseUs.tsx
//
// Why_Choose_Us_Section for the Atap Kreatif Manajemen landing page (Task 7.7).
//
// Design constraints (design.md → Section: WhyChooseUs):
//   - Vertical numbered list. Each row is `grid-cols-[auto_1fr] gap-8` on
//     desktop; collapses to a single column on mobile so the numeral stacks
//     above the heading (Req 5.4, 5.6).
//   - Numerals rendered in Poppins (`font-display`) with `text-accent`,
//     two-digit zero-padded ("01", "02", …) and `aria-hidden` so screen
//     readers consume the row as title + description, not "01 …" (Req 1.4,
//     6.x). The numeral occupies a fixed-width slot (`w-24`) so titles
//     align across rows.
//   - Each row except the first carries a hairline `border-t border-primary/10`
//     rule, giving the list editorial rhythm without introducing a new hue
//     (Req 11.7, 11.8, 18.8).
//   - Reasons collectively include the four canonical themes (case-insensitive
//     substring): `integrated digital ecosystem`, `community-based activation`,
//     `adaptive campaign strategies`, `measurable workflows` (Req 16.6,
//     Property 15). The component itself is theme-agnostic — it renders
//     whatever props supply, so the canonical coverage is enforced by the
//     Brand_Config that feeds it (`brand.whyChooseUs`).
//   - Wrapped in `<MotionSection>` + `<Stagger delay={0.06}>` so each row
//     enters with a fade + slide-up via `fadeUp`, sequenced 60 ms apart and
//     each ≤ 400 ms (Req 7.3). Reduced motion is honored by the wrappers
//     (Req 7.4).
//   - Brand-specific text arrives exclusively via props — zero hard-coded
//     brand literals or color literals (Req 2.6, 11.7, 11.8).
//   - When a row's `description` is empty/whitespace, the row still renders
//     and emits a single `// TODO(brand):` marker comment per Req 10.5.

import * as React from "react";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface WhyChooseUsReason {
  title: string;
  description: string;
}

export interface WhyChooseUsProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** Three to five reason rows (Req 16.6). */
  reasons: WhyChooseUsReason[];
  className?: string;
}

const HEADING_ID = "why-choose-us-heading";

export default function WhyChooseUs({
  heading,
  reasons,
  className,
}: WhyChooseUsProps) {
  return (
    <MotionSection
      as="section"
      id="why-choose-us"
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

        <Stagger delay={0.06} className="mt-12">
          {reasons.map((reason, index) => {
            const descriptionText = nonEmpty(reason.description);
            const isFirst = index === 0;
            const numeral = (index + 1).toString().padStart(2, "0");

            return (
              <motion.div
                key={reason.title}
                variants={fadeUp}
                className={cn(
                  // Mobile: single column, numeral stacks above title.
                  // Desktop: `auto | 1fr` two-column row.
                  "grid grid-cols-1 items-start gap-4 py-6 md:grid-cols-[auto_1fr] md:gap-8",
                  !isFirst && "border-t border-primary/10",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-display text-accent leading-none",
                    "text-5xl md:text-6xl md:w-24",
                  )}
                >
                  {numeral}
                </span>

                <div>
                  <h3 className="font-display font-semibold text-xl text-primary">
                    {reason.title}
                  </h3>
                  {descriptionText !== null ? (
                    <p className="mt-2 text-primary/80 leading-relaxed max-w-prose">
                      {descriptionText}
                    </p>
                  ) : (
                    // TODO(brand): WhyChooseUs — missing description for {reason.title}
                    <p
                      aria-hidden="true"
                      className="mt-2 h-4 w-2/3 max-w-prose rounded-md bg-primary/10"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </MotionSection>
  );
}
