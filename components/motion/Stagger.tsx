"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface StaggerProps {
  children: React.ReactNode;
  /**
   * Per-child stagger delay in seconds. Defaults to 0.06 s.
   *
   * Keep `delay × childCount` ≤ 0.6 s so the whole group satisfies the
   * 600 ms entrance budget (Requirement 7.3). With the default delay,
   * ten children stagger over exactly 0.6 s.
   */
  delay?: number;
  className?: string;
  id?: string;
}

/**
 * Client wrapper that staggers its direct children into view once the
 * group crosses 25% visibility.
 *
 * - Applies the parent variant from `stagger(delay)` so child motion
 *   variants (e.g. `fadeUp`) are sequenced via `staggerChildren` (Req 7.1).
 * - Honors the user's Reduced_Motion_Preference by rendering in the final
 *   visual state with zero stagger and zero transition duration (Req 7.4).
 */
export default function Stagger({
  children,
  delay = 0.06,
  className,
  id,
}: StaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    // Reduced motion: collapse to instant. Zero stagger between children
    // and skip the hidden frame so the group renders in its final state on
    // first paint (Req 7.4).
    return (
      <motion.div
        id={id}
        className={cn(className)}
        variants={stagger(0)}
        initial={false}
        animate="visible"
        transition={{ duration: 0 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      id={id}
      className={cn(className)}
      variants={stagger(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.25, once: true }}
    >
      {children}
    </motion.div>
  );
}
