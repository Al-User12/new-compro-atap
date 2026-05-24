"use client";

// components/Hero.tsx
//
// Hero Section_Component for the Atap Kreatif Manajemen landing page
// (Task 7.2).
//
// Design constraints:
//   - Single `<h1>` of the page (Req 3.4, 6.2, 8.2). Renders unconditionally;
//     when `headline` is empty/whitespace it falls back to a structural
//     placeholder + a `// TODO(brand):` marker (Req 1.5, 2.4, 10.4, 10.5).
//   - Editorial split: eyebrow → headline → paragraph → Primary_CTA →
//     Secondary_CTA (Req 3.1). Tab order matches DOM order so the Primary_CTA
//     precedes the Secondary_CTA after the Navbar's interactive elements
//     (Req 3.5).
//   - Brand visual (when supplied) renders via `next/image` with explicit
//     width/height + `priority` for LCP (Req 9.5). On `onError` it swaps to a
//     token-styled placeholder div with matching aspect ratio so the native
//     broken-image indicator is never shown and no layout shift occurs
//     (Req 3.8, 13.4).
//   - When no `visual` prop is supplied at all, render a typographic poster
//     fallback inspired by the brand wordmark (Req 18.10).
//   - All four conversion-critical elements (headline, paragraph, primary CTA,
//     secondary CTA) stay in-viewport from 320 px to 1920 px (Req 3.6, 5.1):
//     headline uses a responsive type ramp, the layout collapses to one
//     column on small viewports, and the visual falls back to an
//     aspect-ratio-bound placeholder rather than a fixed-pixel box.
//   - Wrapped in `<MotionSection>` (entrance ≤ 600 ms per Req 7.3) with a
//     nested `<Stagger>` so the eyebrow → headline → paragraph → CTAs
//     cascade in (Req 7.1, 7.3). Reduced motion is honored by both wrappers
//     (Req 7.4) so this component does not need its own preference check.
//   - Brand-specific text and links arrive exclusively via props — zero
//     hard-coded brand literals (Req 2.6, 11.7, 11.8). The wordmark string
//     used inside the typographic poster is consumed via `wordmark` prop.
//
// This is a Client Component because it owns the `imgBroken` state for the
// image-fallback swap.

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface HeroVisual {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface HeroProps {
  /** Single `<h1>` text (Req 3.4). Falls back to a placeholder when blank (Req 1.5). */
  headline: string;
  /** Supporting paragraph beneath the headline (Req 3.1). */
  paragraph: string;
  /** Primary_CTA — DOM-first among Hero CTAs (Req 3.5, 4.5). */
  primaryCta: { label: string; href: string };
  /** Secondary_CTA — DOM-second among Hero CTAs (Req 3.5). */
  secondaryCta: { label: string; href: string };
  /** Brand visual; omit to render the typographic poster fallback (Req 18.10). */
  visual?: HeroVisual;
  /** Editorial eyebrow shown above the headline (Req 3.1). */
  eyebrow?: string;
  /** Brand wordmark used by the typographic poster fallback (Req 18.10). */
  wordmark: string;
  className?: string;
}

const HEADING_ID = "hero-heading";

export default function Hero({
  headline,
  paragraph,
  primaryCta,
  secondaryCta,
  visual,
  eyebrow,
  wordmark,
  className,
}: HeroProps) {
  const [imgBroken, setImgBroken] = React.useState(false);

  const eyebrowText = nonEmpty(eyebrow);
  const headlineText = nonEmpty(headline);
  const paragraphText = nonEmpty(paragraph);

  return (
    <MotionSection
      as="section"
      id="hero"
      ariaLabelledBy={HEADING_ID}
      className={cn("relative w-full overflow-x-clip", className)}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Content column ----------------------------------------------- */}
          <Stagger className="lg:col-span-7" delay={0.08}>
            {eyebrowText !== null && (
              <motion.p
                variants={fadeUp}
                className="mb-4 text-xs uppercase tracking-[0.2em] text-accent"
              >
                {eyebrowText}
              </motion.p>
            )}

            {/* Headline — always exactly one <h1> per Req 3.4 / 6.2 / 8.2. */}
            <motion.div variants={fadeUp}>
              {headlineText !== null ? (
                <h1
                  id={HEADING_ID}
                  className={cn(
                    "font-display font-bold text-primary leading-[1.05]",
                    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
                  )}
                >
                  {headlineText}
                </h1>
              ) : (
                // TODO(brand): Hero — missing brand.headline
                <h1
                  id={HEADING_ID}
                  className={cn(
                    "font-display font-bold text-primary leading-[1.05]",
                    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="block h-[1em] w-3/4 rounded-md bg-primary/10"
                  />
                </h1>
              )}
            </motion.div>

            {paragraphText !== null ? (
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-prose leading-relaxed text-primary/80"
              >
                {paragraphText}
              </motion.p>
            ) : (
              // TODO(brand): Hero — missing brand.paragraph
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-prose leading-relaxed text-primary/80"
              >
                <span
                  aria-hidden="true"
                  className="block h-4 w-full rounded-md bg-primary/10"
                />
              </motion.p>
            )}

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              {/* Primary_CTA precedes Secondary_CTA in DOM tab order (Req 3.5). */}
              <Button href={primaryCta.href} variant="primary">
                {primaryCta.label}
              </Button>
              <Button href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </Button>
            </motion.div>
          </Stagger>

          {/* Visual column ------------------------------------------------ */}
          <div className="lg:col-span-5">
            {visual !== undefined && !imgBroken ? (
              <Image
                src={visual.src}
                alt={visual.alt}
                width={visual.width}
                height={visual.height}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                onError={() => setImgBroken(true)}
                className="h-auto w-full rounded-md"
              />
            ) : visual !== undefined ? (
              // Image failed to load — render token-styled placeholder with the
              // same aspect ratio so layout does not shift (Req 13.4) and the
              // browser's broken-image indicator never appears (Req 3.8).
              <div
                role="img"
                aria-label={visual.alt}
                style={{
                  aspectRatio: `${visual.width} / ${visual.height}`,
                  maxWidth: visual.width,
                }}
                className={cn(
                  "flex w-full items-center justify-center",
                  "rounded-md border border-primary/10 bg-primary/5",
                )}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-3xl tracking-tight text-accent/60 md:text-5xl"
                >
                  {wordmark}
                </span>
              </div>
            ) : (
              // Typographic poster fallback — no brand visual supplied (Req 18.10).
              <div
                aria-hidden="true"
                className={cn(
                  "flex aspect-[4/5] w-full items-center justify-center",
                  "rounded-md border border-primary/10 bg-primary/5",
                )}
              >
                <span className="font-display text-4xl tracking-tight text-accent/40 md:text-6xl">
                  {wordmark}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
