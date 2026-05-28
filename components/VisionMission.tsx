"use client";

// components/VisionMission.tsx
//
// Vision & Mission section for the Atap Kreatif Manajemen landing page.
//
// Design constraints:
//   - Single `<h2>` for the section, referenced from the parent `<section>`
//     via `aria-labelledby` (Req 1.4).
//   - Two-column layout on desktop: vision card on the left and mission card
//     on the right. Single column on mobile (Req 5.4, 5.6).
//   - Both cards use token-only classes: `bg-background`, `border-primary/15`,
//     `text-primary`, `text-accent`, `rounded-md` — no hex literals
//     (Req 11.7, 11.8).
//   - Wrapped in `<MotionSection>` + `<Stagger>` so the cards fade into view
//     within the 600 ms entrance budget (Req 7.3). Reduced motion is honored
//     by the wrappers (Req 7.4).
//   - When `heading`, `vision`, or `mission` items are empty/whitespace,
//     structural placeholders preserve layout and emit `TODO(brand):`
//     markers (Req 1.5, 10.4, 10.5).

import * as React from "react";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface VisionMissionProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  className?: string;
}

const HEADING_ID = "vision-mission-heading";

const visionStatement =
  "To become a trusted creative digital agency capable of creating a strong, innovative, and highly competitive talent and brand ecosystem in the digital era.";

const missionItems: string[] = [
  "Develop and manage digital talent professionally and sustainably",
  "Provide creative, effective, and measurable digital strategy solutions",
  "Help brands build strong digital identities and communications",
  "Follow and adapt to digital media trends for optimal results",
];

const CARD_CLASSES = cn(
  "bg-background border border-primary/15 text-primary rounded-md p-6 lg:p-8",
);

export default function VisionMission({
  heading,
  className,
}: VisionMissionProps) {
  const headingText = nonEmpty(heading);

  return (
    <MotionSection
      as="section"
      id="vision-mission"
      ariaLabelledBy={HEADING_ID}
      className={cn("relative w-full", className)}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {headingText !== null ? (
          <h2
            id={HEADING_ID}
            className={cn(
              "font-display font-bold text-primary leading-[1.1]",
              "text-3xl sm:text-4xl md:text-5xl",
            )}
          >
            {headingText}
          </h2>
        ) : (
          // TODO(brand): VisionMission — missing heading
          <h2
            id={HEADING_ID}
            className={cn(
              "font-display font-bold text-primary leading-[1.1]",
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
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <motion.div
            variants={fadeUp}
            className={cn(
              CARD_CLASSES,
              "border-t-4 border-accent",
            )}
          >
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-accent">
              Vision
            </h3>

            <p className="mt-4 font-body text-lg italic leading-relaxed text-primary/90 md:text-xl">
              {nonEmpty(visionStatement) ?? (
                // TODO(brand): VisionMission — missing vision statement
                <span
                  aria-hidden="true"
                  className="block h-5 w-11/12 rounded-md bg-primary/10"
                />
              )}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className={cn(
              CARD_CLASSES,
              "border-t-4 border-accent",
            )}
          >
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-accent">
              Mission
            </h3>

            <ol className="mt-4 space-y-3 font-body text-primary/90">
              {missionItems.map((item, index) => {
                const itemText = nonEmpty(item);

                return (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary"
                    >
                      {index + 1}
                    </span>

                    {itemText !== null ? (
                      <span className="leading-relaxed">{itemText}</span>
                    ) : (
                      // TODO(brand): VisionMission — missing mission item
                      <span
                        aria-hidden="true"
                        className="block h-4 w-full rounded-md bg-primary/10"
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </motion.div>
        </Stagger>
      </div>
    </MotionSection>
  );
}
