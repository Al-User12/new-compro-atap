"use client";

// components/Process.tsx
//
// Process_Section for the Atap Kreatif Manajemen landing page (Task 7.8).
//
// Design constraints (design.md → Section: Process):
//   - Renders the four-step Atap Kreatif Manajemen workflow in canonical
//     order: Initial → Preparation → Execution → Reporting (Req 16.7,
//     Property 15). The component is theme-agnostic and renders whatever
//     `steps` props supply; the canonical title contract is enforced by
//     Brand_Config (`brand.workflow`) and the Property 15 test that
//     consumes it.
//   - Layout (Req 5.4, 5.6):
//       * Mobile (< md): single-column vertical stack.
//       * Tablet (md–lg): 2 × 2 grid.
//       * Desktop (lg+): horizontal 4-column timeline with a thin
//         `bg-accent` connector running across the row of cards.
//   - Each card shows the step number ("01"–"04") in `font-display
//     text-7xl text-primary/15` as a faded backdrop, followed by the
//     title (`<h3>`) and description.
//   - Decorative accent dot (`bg-accent`) at the start of each card and
//     the connector both render in `text-accent` / `bg-accent` for the
//     visual continuity called out in the design (Req 18.8, 11.7, 11.8).
//   - Motion treatment (Req 7.3, 7.4):
//       * Connector animates `scaleX 0 → 1` from `transform-origin: left`
//         over 600 ms once the section is in view, satisfying the 600 ms
//         entrance budget (Requirement 7.3 — entrance ≤ 600 ms).
//       * Step cards fade + slide up via `fadeUp`, sequenced 100 ms apart
//         by `<Stagger delay={0.1}>`. Four cards × 100 ms = 400 ms total,
//         comfortably inside the entrance budget.
//       * Reduced motion: connector renders fully drawn (`scaleX: 1`)
//         with `transition.duration = 0`, and `<Stagger>` / `<MotionSection>`
//         collapse cards to their final state instantly (Requirement 7.4).
//   - Brand-specific text arrives exclusively via props — zero hard-coded
//     brand literals or color literals (Req 2.6, 11.7, 11.8).
//
// This is a Client Component: the connector calls `useReducedMotion()`
// directly so it can switch its `initial` state and zero out its
// transition duration when the user prefers reduced motion. The
// `<MotionSection>` and `<Stagger>` wrappers honor reduced motion
// independently for the heading/cards.

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface ProcessStep {
  /** 1..4 in canonical order. */
  step: number;
  /** One of "Initial", "Preparation", "Execution", "Reporting". */
  title: string;
  /** Step description (1–280 chars recommended). */
  description: string;
}

export interface ProcessProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** Exactly four steps in canonical order (Req 16.7). */
  steps: ProcessStep[];
  className?: string;
}

const HEADING_ID = "process-heading";

export default function Process({
  heading,
  steps,
  className,
}: ProcessProps) {
  const reduceMotion = useReducedMotion();
  const headingText = nonEmpty(heading);

  return (
    <MotionSection
      as="section"
      id="process"
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
          // TODO(brand): Process — missing brand.process.heading
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

        <div className="relative mt-12">
          {/* Desktop-only connector — thin horizontal `bg-accent` rule that
              draws in left-to-right once the section is in view. Hidden on
              mobile / tablet, where the layout becomes vertical or 2 × 2
              and a single connector would no longer be meaningful. */}
          <motion.div
            aria-hidden="true"
            data-testid="process-connector"
            className={cn(
              "hidden lg:block",
              // Position the rule at ~card-number height so it visually
              // threads through the "01"–"04" backdrop numerals.
              "lg:absolute lg:left-0 lg:right-0 lg:top-12 lg:h-px lg:bg-accent",
              "lg:z-0",
            )}
            style={{ transformOrigin: "left" }}
            initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              ease: "easeOut",
            }}
          />

          <Stagger
            delay={0.1}
            className={cn(
              "relative z-10 grid gap-8",
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            )}
          >
            {steps.map((stepItem) => {
              const descriptionText = nonEmpty(stepItem.description);
              const numeral = stepItem.step.toString().padStart(2, "0");

              return (
                <motion.div
                  key={stepItem.step}
                  variants={fadeUp}
                  className="relative flex flex-col"
                >
                  {/* Decorative accent dot anchoring the card to the
                      connector visually (and to the left rail in the
                      single-column / 2 × 2 layouts). */}
                  <span
                    aria-hidden="true"
                    className="mb-4 block h-2 w-2 rounded-sm bg-accent"
                  />

                  {/* Backdrop numeral. Decorative — the visible step
                      semantics live in the title and order, so this is
                      hidden from assistive tech (Req 6.x). */}
                  <span
                    aria-hidden="true"
                    className="font-display text-7xl leading-none text-primary/15"
                  >
                    {numeral}
                  </span>

                  <h3 className="mt-4 font-display text-xl font-semibold text-primary">
                    {stepItem.title}
                  </h3>

                  {descriptionText !== null ? (
                    <p className="mt-2 text-sm leading-relaxed text-primary/80">
                      {descriptionText}
                    </p>
                  ) : (
                    // TODO(brand): Process — missing description for {stepItem.title}
                    <p
                      aria-hidden="true"
                      className="mt-2 h-4 w-2/3 rounded-md bg-primary/10"
                    />
                  )}
                </motion.div>
              );
            })}
          </Stagger>
        </div>
      </div>
    </MotionSection>
  );
}
