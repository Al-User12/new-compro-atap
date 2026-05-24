"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Curated set of HTML tags MotionSection can render as.
 *
 * The Atap Kreatif Manajemen landing page uses MotionSection to wrap
 * Section_Components and small editorial blocks; this map keeps the
 * polymorphic `as` prop type-safe (every key resolves to a real
 * `motion.<tag>` component) without leaking arbitrary `ElementType` into
 * Framer Motion's prop surface.
 */
const TAG_MAP = {
  section: motion.section,
  div: motion.div,
  article: motion.article,
  aside: motion.aside,
  header: motion.header,
  footer: motion.footer,
  main: motion.main,
  nav: motion.nav,
} as const;

export type MotionSectionTag = keyof typeof TAG_MAP;

export interface MotionSectionProps {
  children: React.ReactNode;
  /**
   * Variant set controlling the entrance animation.
   * Defaults to `fadeUp` (Requirement 7.3 — entrance ≤ 600 ms).
   */
  variants?: Variants;
  className?: string;
  /**
   * Rendered tag name. Defaults to `"section"` so the wrapper can stand in
   * directly for a Section_Component root.
   */
  as?: MotionSectionTag;
  id?: string;
  /**
   * Optional `aria-labelledby` target. Useful when the wrapper renders as
   * `"section"` and needs to reference a visible heading id (Req 1.4).
   */
  ariaLabelledBy?: string;
}

/**
 * Client wrapper that fades a Section_Component into view once it crosses
 * 25% visibility (Requirement 7.3) and honors the user's
 * Reduced_Motion_Preference by rendering children in their final visual
 * state with zero transition duration (Requirement 7.4).
 */
export default function MotionSection({
  children,
  variants = fadeUp,
  className,
  as = "section",
  id,
  ariaLabelledBy,
}: MotionSectionProps) {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const reduceMotion = useReducedMotion();

  // The TAG_MAP union resolves to a polymorphic motion component whose ref
  // type collapses to the narrowest variant (`HTMLDivElement`). Casting to a
  // representative entry whose underlying DOM interface is the shared
  // `HTMLElement` keeps the ref type compatible with every supported tag
  // without changing runtime behavior — TAG_MAP[as] is still the correct
  // motion component, and Framer Motion forwards the ref to the rendered
  // DOM node either way.
  const Tag = TAG_MAP[as] as typeof motion.section;

  if (reduceMotion) {
    // Reduced motion: render in the final visual state on first paint with
    // zero transition duration (Req 7.4). `initial={false}` skips the
    // hidden frame, and the explicit zero-duration transition overrides any
    // duration declared inside `variants.visible.transition`.
    return (
      <Tag
        ref={ref}
        id={id}
        aria-labelledby={ariaLabelledBy}
        className={cn(className)}
        variants={variants}
        initial={false}
        animate="visible"
        transition={{ duration: 0 }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(className)}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </Tag>
  );
}
