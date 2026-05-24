import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion timing constants.
 *
 * - `ENTRANCE_TRANSITION_MS` caps the time an entering Section_Component
 *   may take to reach its final visual state once it crosses 25% visibility
 *   (Requirement 7.3 — entrance ≤ 600 ms).
 * - `MICRO_TRANSITION_MS` caps the time a hover/focus micro-interaction
 *   (color, scale, translate) may take to settle (Requirement 7.5 — ≤ 250 ms).
 *
 * Property 14 imports these constants directly so the runtime values stay
 * the single source of truth for motion budgets.
 */
export const ENTRANCE_TRANSITION_MS = 600;
export const MICRO_TRANSITION_MS = 250;

const ENTRANCE_DURATION_S = 0.4;
const FADE_DURATION_S = 0.35;
const DEFAULT_STAGGER_S = 0.06;

/**
 * Fade-in + slide-up entrance for editorial sections and cards.
 * Total visible duration: 0.4 s (≤ 0.6 s per Req 7.3).
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ENTRANCE_DURATION_S, ease: "easeOut" },
  },
};

/**
 * Plain fade-in entrance for atmospheric content (e.g. Hero paragraph,
 * decorative blocks). Total visible duration: 0.35 s.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: FADE_DURATION_S, ease: "easeOut" },
  },
};

/**
 * Subtle scale-in entrance for bento/grid card families
 * (`scale 0.985 → 1` + fade). Total visible duration: 0.4 s.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: ENTRANCE_DURATION_S, ease: "easeOut" },
  },
};

/**
 * Parent variant factory that staggers child entrances.
 *
 * @param delay - per-child delay in seconds (defaults to 0.06 s).
 *                Keep the product `delay × childCount` ≤ 0.6 s to satisfy
 *                Requirement 7.3 for the host section as a whole.
 */
export function stagger(delay: number = DEFAULT_STAGGER_S): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: delay },
    },
  };
}
