"use client";

// components/ui/Sheet.tsx
//
// Mobile-menu overlay primitive used by the Navbar (Task 5.2).
//
// Design constraints (Task 5.2):
//   - Controlled component: `open` + `onOpenChange` props (Req 5.7).
//   - Open/close animation completes in ≤ 300 ms via Framer Motion
//     `<AnimatePresence>` (fade + translate-y). Collapses to instant
//     transitions when `useReducedMotion()` reports a reduced-motion
//     preference (Req 7.4).
//   - Focus management: focus moves to the close button when the sheet
//     opens (within one tick), focus is trapped via Tab / Shift+Tab,
//     `Escape` closes the sheet, and focus is restored to whatever
//     element was focused before opening (Req 6.8 — no keyboard traps).
//   - Hit target: close button is min 44×44 CSS px and shows the brand
//     accent focus ring, matching the shared Button primitive
//     (Req 4.1–4.4, 5.8, 6.5).
//   - Visual tokens only — no hex literals; colors resolve through the
//     Tailwind theme keys defined in tailwind.config.ts (Req 11.7, 11.8).

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** Accessible name for the dialog (announced to assistive tech). */
  title?: string;
  /** Accessible name for the close button. Defaults to "Close menu". */
  closeLabel?: string;
  className?: string;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (root === null) {
    return [];
  }
  const nodes = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter((el) => {
    if (el.hasAttribute("disabled")) {
      return false;
    }
    if (el.getAttribute("aria-hidden") === "true") {
      return false;
    }
    return true;
  });
}

export default function Sheet({
  open,
  onOpenChange,
  children,
  title,
  closeLabel = "Close menu",
  className,
}: SheetProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  // Capture the element that had focus before we opened so we can restore it
  // on close (Req 6.8).
  React.useEffect(() => {
    if (open) {
      const active = document.activeElement;
      previouslyFocusedRef.current =
        active instanceof HTMLElement ? active : null;
    }
  }, [open]);

  // Move focus to the close button on open (within one tick).
  React.useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  // Restore focus to the previously focused element when the sheet closes.
  React.useEffect(() => {
    if (!open && previouslyFocusedRef.current !== null) {
      const target = previouslyFocusedRef.current;
      previouslyFocusedRef.current = null;
      target.focus();
    }
  }, [open]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusable(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onOpenChange],
  );

  const overlayDuration = reduceMotion ? 0 : 0.2;
  const panelDuration = reduceMotion ? 0 : 0.25;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sheet-overlay"
          className="fixed inset-0 z-50 bg-primary/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: overlayDuration, ease: "easeOut" }}
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        >
          <motion.div
            key="sheet-panel"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title !== undefined ? titleId : undefined}
            aria-label={title === undefined ? closeLabel : undefined}
            className={cn(
              "fixed inset-x-0 top-0 z-50",
              "bg-background text-primary",
              "border-b border-primary/10 shadow-lg",
              "px-6 pt-4 pb-8",
              className,
            )}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: panelDuration, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-start justify-between gap-4">
              {title !== undefined ? (
                <h2
                  id={titleId}
                  className="font-display text-lg font-semibold text-primary"
                >
                  {title}
                </h2>
              ) : (
                <span className="sr-only" id={titleId}>
                  {closeLabel}
                </span>
              )}
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={closeLabel}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "inline-flex items-center justify-center",
                  "min-h-11 min-w-11 rounded-md",
                  "text-primary transition-colors duration-200 hover:bg-primary/5",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                )}
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
