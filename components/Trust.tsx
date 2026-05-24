"use client";

// components/Trust.tsx
//
// Trust_Section for the Atap Kreatif Manajemen landing page (Task 7.3).
//
// Design constraints:
//   - Single `<h2>` for the section, two stacked sub-groups under `<h3>`s
//     ("Distribution Network", "KOL Database"), labelled-by referenced from
//     the parent `<section>` (Req 1.4).
//   - Six distribution stat cards + four-or-five KOL stat cards, sourced
//     from props (Req 14.1, 14.2).
//   - For any KOL entry whose `count === "menyusul"`, render the tier label
//     and the italic literal "menyusul" in `text-accent`. The DOM subtree
//     for that card MUST NOT contain any digit `0-9` (Req 10.6, Property 10).
//   - All card classes use only token utilities — `bg-primary/5`,
//     `border-primary/10`, `text-primary`, `text-accent` — no hex literals
//     (Req 11.7, 11.8).
//   - Each card group is wrapped in `<Stagger delay={0.04}>` so cards
//     fade-in sequentially (Req 7.3). Reduced motion is honored by the
//     wrapper (Req 7.4).
//   - Mobile single column collapses to two columns minimum on tablet+
//     (Req 5.4, 5.6); the responsive grid follows the design intent.
//
// This is a Client Component because each card is a `motion.div` that
// participates in the parent `Stagger` via `variants={fadeUp}`.

import * as React from "react";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface DistributionStat {
  platform: string;
  accounts: number;
}

export interface KolStat {
  tier: string;
  count: number | "menyusul";
}

export interface TrustProps {
  heading: string;
  intro?: string;
  /** Six distribution rows (Req 14.1). */
  distribution: DistributionStat[];
  /** Four or five KOL tier rows (Req 14.2). */
  kol: KolStat[];
  /** Sub-heading for the distribution group. Defaults to "Distribution Network". */
  distributionLabel?: string;
  /** Sub-heading for the KOL group. Defaults to "KOL Database". */
  kolLabel?: string;
  className?: string;
}

const HEADING_ID = "trust-heading";
const DISTRIBUTION_HEADING_ID = "trust-distribution-heading";
const KOL_HEADING_ID = "trust-kol-heading";

const CARD_CLASSES =
  "bg-primary/5 border border-primary/10 rounded-md p-6 text-primary";

export default function Trust({
  heading,
  intro,
  distribution,
  kol,
  distributionLabel = "Distribution Network",
  kolLabel = "KOL Database",
  className,
}: TrustProps) {
  const introText = nonEmpty(intro);

  return (
    <MotionSection
      as="section"
      id="trust"
      ariaLabelledBy={HEADING_ID}
      className={cn("relative w-full", className)}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <h2
          id={HEADING_ID}
          className={cn(
            "font-display font-bold text-primary leading-[1.1]",
            "text-3xl sm:text-4xl md:text-5xl",
          )}
        >
          {heading}
        </h2>

        {introText !== null && (
          <p className="mt-4 max-w-prose leading-relaxed text-primary/80">
            {introText}
          </p>
        )}

        {/* Distribution Network -------------------------------------------- */}
        <section aria-labelledby={DISTRIBUTION_HEADING_ID} className="mt-12">
          <h3
            id={DISTRIBUTION_HEADING_ID}
            className="font-display text-xs uppercase tracking-[0.2em] text-accent"
          >
            {distributionLabel}
          </h3>

          <Stagger
            delay={0.04}
            className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
          >
            {distribution.map((entry) => (
              <motion.div
                key={entry.platform}
                variants={fadeUp}
                className={CARD_CLASSES}
              >
                <div className="font-display text-4xl font-bold leading-none md:text-5xl">
                  {entry.accounts}
                </div>
                <div className="mt-2 text-sm uppercase tracking-wide text-primary/70">
                  {entry.platform}
                </div>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* KOL Database ---------------------------------------------------- */}
        <section aria-labelledby={KOL_HEADING_ID} className="mt-12">
          <h3
            id={KOL_HEADING_ID}
            className="font-display text-xs uppercase tracking-[0.2em] text-accent"
          >
            {kolLabel}
          </h3>

          <Stagger
            delay={0.04}
            className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
          >
            {kol.map((entry) =>
              entry.count === "menyusul" ? (
                // "menyusul" card — render the tier label and the italic
                // literal "menyusul" in text-accent. No digit `0-9` is
                // rendered anywhere inside this card's DOM subtree
                // (Req 10.6, Property 10).
                <motion.div
                  key={entry.tier}
                  variants={fadeUp}
                  className={CARD_CLASSES}
                >
                  <div className="font-display text-2xl italic text-accent leading-none">
                    menyusul
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-wide text-primary/70">
                    {entry.tier}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={entry.tier}
                  variants={fadeUp}
                  className={CARD_CLASSES}
                >
                  <div className="font-display text-4xl font-bold leading-none md:text-5xl">
                    {entry.count}
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-wide text-primary/70">
                    {entry.tier}
                  </div>
                </motion.div>
              ),
            )}
          </Stagger>
        </section>
      </div>
    </MotionSection>
  );
}
