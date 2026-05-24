"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Client wrapper around Framer Motion's `MotionConfig` so the root layout
 * (a Server Component) can declare a global motion configuration without
 * importing client-only Framer Motion APIs.
 *
 * `reducedMotion="user"` lets every descendant `motion.*` element honor the
 * `prefers-reduced-motion: reduce` media query automatically, giving the
 * Atap Kreatif Manajemen landing page consistent reduced-motion behavior
 * (Requirements 6.7 and 7.4).
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
