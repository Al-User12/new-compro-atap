"use client";

// components/Showcase.tsx
//
// Showcase_Section for the Atap Kreatif Manajemen landing page (Task 7.9).
//
// Design constraints:
//   - Renders an editorial grid of portfolio tiles sourced from props
//     (Req 1.4). Each tile carries an explicit `width`/`height` `<Image>`
//     so layout is reserved up-front (Req 9.5) and an `onError` fallback
//     swaps the broken image out for a token-styled placeholder of the
//     same aspect ratio so the browser's broken-image indicator is never
//     shown and no layout shift occurs (Req 13.4, 3.8).
//   - When `entries.length === 0`, render exactly 3 placeholder tiles —
//     `aspect-[4/5] bg-primary/5 border border-primary/10 rounded-md` —
//     and emit a single `// TODO(brand): Showcase — missing brand.showcase
//     entries` marker so a downstream content-population pass can locate
//     the gap (Req 10.3, 10.5). The placeholder dimensions match the
//     populated layout so empty / populated states reserve identical
//     vertical space.
//   - Hover micro-interaction on linked tiles: the image scales
//     `1 → 1.02` inside an `overflow-hidden` wrapper, with a transform
//     transition ≤ 250 ms (Req 7.5). Unlinked tiles are static.
//   - Radii stay within the three-token scale `{sm, md, lg}` whose
//     largest value is 1 rem — only `rounded-md` is used here (Req 11.4,
//     18.11).
//   - Captions render under each image in small-caps Poppins
//     (`text-xs uppercase tracking-widest text-primary/70`) for the
//     category and `text-primary` for the title (Req 18.9).
//   - Brand-specific text and assets arrive exclusively via props — zero
//     hard-coded brand literals or color literals (Req 2.6, 11.7, 11.8).
//   - Wrapped in `<MotionSection>` so the section fades into view within
//     the 600 ms entrance budget (Req 7.3); tiles cascade via `<Stagger>`
//     (Req 7.1). Both wrappers honor Reduced_Motion_Preference (Req 7.4).
//
// This is a Client Component because each `<ShowcaseTile>` owns its own
// `imgBroken` state for the image-fallback swap.

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import MotionSection from "@/components/motion/MotionSection";
import Stagger from "@/components/motion/Stagger";
import { fadeUp } from "@/lib/motion";
import { cn, nonEmpty } from "@/lib/utils";

export interface ShowcaseImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ShowcaseEntry {
  /** Tile title rendered below the image (Req 18.9). */
  title: string;
  /** Optional eyebrow above the title (e.g. "Account handling"). */
  category?: string;
  /** Optional case-study link. When set, the tile gets the hover scale. */
  href?: string;
  image: ShowcaseImage;
}

export interface ShowcaseProps {
  /** Section heading rendered as the `<h2>` (Req 1.4). */
  heading: string;
  /** Optional intro paragraph beneath the heading. */
  intro?: string;
  /** 0+ entries — empty triggers the placeholder grid (Req 10.3). */
  entries: ShowcaseEntry[];
  className?: string;
}

const HEADING_ID = "showcase-heading";

const GRID_CLASSES = cn(
  "mt-10 grid gap-6",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
);

/**
 * Single portfolio tile. Owns the `imgBroken` state so each tile can swap
 * its `<Image>` for a token-styled placeholder independently when the
 * source asset fails to load (Req 13.4).
 */
function ShowcaseTile({ entry }: { entry: ShowcaseEntry }) {
  const [imgBroken, setImgBroken] = React.useState(false);
  const isLinked = nonEmpty(entry.href) !== null;

  // Image surface — `<Image>` while the source is loadable, token
  // placeholder once `onError` fires. The placeholder preserves the same
  // aspect ratio so the layout slot does not collapse (Req 13.4).
  const imageSurface = !imgBroken ? (
    <Image
      src={entry.image.src}
      alt={entry.image.alt}
      width={entry.image.width}
      height={entry.image.height}
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      onError={() => setImgBroken(true)}
      className={cn(
        "h-full w-full object-cover",
        // Hover scale only applies when the tile is linked. The transform
        // transition is bounded at 200 ms (≤ 250 ms per Req 7.5).
        "transition-transform duration-200",
        isLinked && "hover:scale-[1.02]",
      )}
    />
  ) : (
    <div
      role="img"
      aria-label={entry.image.alt}
      style={{ aspectRatio: `${entry.image.width} / ${entry.image.height}` }}
      className={cn(
        "flex h-full w-full items-center justify-center",
        "bg-primary/5 border border-primary/10 rounded-md",
        "font-display text-accent",
      )}
    >
      <span aria-hidden="true">{entry.title}</span>
    </div>
  );

  // The `overflow-hidden` wrapper clips the hover-scale to the tile
  // bounds and gives the image its rounded corner mask (Req 11.4).
  const imageFrame = (
    <div
      className="relative overflow-hidden rounded-md"
      style={{ aspectRatio: `${entry.image.width} / ${entry.image.height}` }}
    >
      {imageSurface}
    </div>
  );

  return (
    <motion.figure variants={fadeUp} className="flex flex-col">
      {isLinked ? (
        <a
          href={entry.href}
          className={cn(
            "block",
            "focus-visible:outline focus-visible:outline-2",
            "focus-visible:outline-offset-2 focus-visible:outline-accent",
            "rounded-md",
          )}
        >
          {imageFrame}
        </a>
      ) : (
        imageFrame
      )}

      <figcaption className="mt-3">
        {nonEmpty(entry.category) !== null && (
          <p className="text-xs uppercase tracking-widest text-primary/70">
            {entry.category}
          </p>
        )}
        <p className="mt-1 text-primary">{entry.title}</p>
      </figcaption>
    </motion.figure>
  );
}

export default function Showcase({
  heading,
  intro,
  entries,
  className,
}: ShowcaseProps) {
  const headingText = nonEmpty(heading);
  const introText = nonEmpty(intro);
  const isEmpty = entries.length === 0;

  return (
    <MotionSection
      as="section"
      id="showcase"
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
          // TODO(brand): Showcase — missing brand.showcase heading
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

        {isEmpty ? (
          // TODO(brand): Showcase — missing brand.showcase entries
          <Stagger delay={0.06} className={GRID_CLASSES}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`showcase-placeholder-${i}`}
                variants={fadeUp}
                aria-hidden="true"
                className="aspect-[4/5] bg-primary/5 border border-primary/10 rounded-md"
              />
            ))}
          </Stagger>
        ) : (
          <Stagger delay={0.06} className={GRID_CLASSES}>
            {entries.map((entry, index) => (
              <ShowcaseTile
                key={`${entry.title}-${index}`}
                entry={entry}
              />
            ))}
          </Stagger>
        )}
      </div>
    </MotionSection>
  );
}
