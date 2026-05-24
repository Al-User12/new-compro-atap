"use client";

// components/Services.tsx
//
// Services_Section for the Atap Kreatif Manajemen landing page (Task 7.6).
//
// Design constraints:
//   - Render the six Atap Kreatif service families in canonical order
//     ("Buzzer Distribution", "Content Clipping", "Talent Management",
//     "Digital Advertising", "Development", "Creative Production") sourced
//     from props (Req 16.4). Order is preserved by iterating `services`
//     in array order — the canonical order lives in Brand_Config and is
//     enforced upstream.
//   - Each card carries a numerical marker `01`–`06` in `text-accent`
//     (oversized Poppins display), the service title, the 80–280 character
//     summary, and a bullet list of 3–8 deliverable items rendered as
//     `<ul role="list">` (Req 16.5).
//   - Layout is `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` so the bento
//     collapses to one column on mobile, two on tablet, and the canonical
//     3 × 2 grid on desktop (Req 5.6).
//   - Cards use `bg-background border border-primary/15 rounded-md` with a
//     subtle hover lift (`hover:-translate-y-0.5`, ≤ 200 ms — Req 7.5).
//     Radii stay within the three-token scale `{sm, md, lg}` (Req 11.4,
//     18.11) — only `rounded-md` is used here.
//   - Cards stagger into view with the `fadeUp` variant, sequenced by
//     `<Stagger delay={0.05}>` (50 ms per child) so six cards finish
//     entering well within the 600 ms entrance budget (Req 7.3). The
//     wrappers honor Reduced_Motion_Preference (Req 7.4).
//   - Brand-specific text arrives exclusively via props — zero hard-coded
//     brand literals or color literals (Req 2.6, 11.7, 11.8).
//   - When a service entry has a missing/blank `summary` or fewer than 3
//     `items`, the card renders a structural placeholder for that field
//     that preserves the layout slot dimensions, and the source emits a
//     single `// TODO(brand):` marker per missing field (Req 1.5, 10.4,
//     10.5). Other fields on the same card still render normally so the
//     card never disappears entirely.
//
// This is a Client Component because each card is a `motion.div` that
// participates in the parent `<Stagger>` via `variants={fadeUp}`.

import * as React from "react";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface ServiceEntry {
  /** Stable slug used for `key` and as the identifier in TODO markers. */
  id: string;
  /** Service title (1–60 chars recommended). */
  title: string;
  /** Service summary (80–280 chars per Req 16.5). */
  summary: string;
  /** 3–8 deliverable bullets per Req 16.5. */
  items: string[];
  /** Optional Lucide icon. Currently unused — markers carry the rhythm. */
  icon?: React.ReactNode;
}

export interface ServicesProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** Optional intro paragraph beneath the heading. */
  intro?: string;
  /** Exactly six services in canonical order (Req 16.4). */
  services: ServiceEntry[];
  className?: string;
}

const HEADING_ID = "services-heading";

const CARD_CLASSES = cn(
  "bg-background border border-primary/15 rounded-md p-6 lg:p-8",
  "transition-transform duration-200 hover:-translate-y-0.5",
  "flex flex-col",
);

/** Format a 1-based index as a two-digit numerical marker (`01`–`06`). */
function formatMarker(index: number): string {
  return (index + 1).toString().padStart(2, "0");
}

export default function Services({
  heading,
  intro,
  services,
  className,
}: ServicesProps) {
  const headingText = nonEmpty(heading);
  const introText = nonEmpty(intro);

  return (
    <MotionSection
      as="section"
      id="services"
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
          // TODO(brand): Services — missing brand.services heading
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

        {introText !== null && (
          <p className="mt-4 max-w-prose leading-relaxed text-primary/80">
            {introText}
          </p>
        )}

        <Stagger
          delay={0.05}
          className={cn(
            "mt-10 grid gap-6",
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {services.map((service, index) => {
            const summaryText = nonEmpty(service.summary);
            const hasEnoughItems = service.items.length >= 3;

            return (
              <motion.div
                key={service.id}
                variants={fadeUp}
                className={CARD_CLASSES}
              >
                {/* Numerical marker — `01`–`06` in oversized Poppins
                    accent color, leading-none so it sits flush against
                    the title below (Req 16.4 numbering, 18.8 accent role). */}
                <span
                  className="font-display text-5xl text-accent leading-none"
                  aria-hidden="true"
                >
                  {formatMarker(index)}
                </span>

                <h3 className="mt-4 font-display font-semibold text-xl text-primary">
                  {service.title}
                </h3>

                {summaryText !== null ? (
                  <p className="mt-2 text-primary/80 leading-relaxed text-sm">
                    {summaryText}
                  </p>
                ) : (
                  <>
                    {/* TODO(brand): Services — missing brand.services[${service.id}].summary */}
                    <p className="mt-2 text-primary/80 leading-relaxed text-sm">
                      <span
                        aria-hidden="true"
                        className="block h-4 w-full rounded-md bg-primary/10"
                      />
                    </p>
                  </>
                )}

                {hasEnoughItems ? (
                  <ul
                    role="list"
                    className="mt-4 space-y-1 text-sm text-primary/80"
                  >
                    {service.items.map((item, itemIndex) => (
                      <li
                        key={`${service.id}-item-${itemIndex}`}
                        className="flex items-start gap-2"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 inline-block h-1 w-1 rounded-sm bg-accent"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    {/* TODO(brand): Services — missing brand.services[${service.id}].items */}
                    <ul
                      role="list"
                      className="mt-4 space-y-1 text-sm text-primary/80"
                    >
                      {[0, 1, 2].map((slot) => (
                        <li
                          key={`${service.id}-placeholder-${slot}`}
                          className="flex items-start gap-2"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 inline-block h-1 w-1 rounded-sm bg-accent"
                          />
                          <span
                            aria-hidden="true"
                            className="block h-3 w-3/4 rounded-md bg-primary/10"
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </MotionSection>
  );
}
