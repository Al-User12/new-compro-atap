import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class name inputs and resolve Tailwind class conflicts.
 *
 * Combines the conditional-class ergonomics of `clsx` with the
 * conflict-resolution of `tailwind-merge` so callers can pass any mix of
 * strings, arrays, and conditional objects and get a deduplicated class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Normalize a possibly-blank string to a non-empty value or `null`.
 *
 * Returns `null` when `value` is `undefined`, `null`, or contains only
 * whitespace. Otherwise returns the original (untrimmed) string. Callers can
 * use the result to decide whether a Brand_Config field has real content
 * before rendering it.
 */
export function nonEmpty(value: string | undefined | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (value.trim() === "") {
    return null;
  }
  return value;
}

/**
 * Convert a human-formatted phone number into a `wa.me` deep-link URL.
 *
 * Strips every non-digit character first. If the resulting digit sequence
 * begins with `0` it is treated as an Indonesian local number and the leading
 * `0` is replaced with the country code `62`. If the digits already begin
 * with `62` they are left as-is. The returned URL is always
 * `https://wa.me/${digits}`.
 *
 * @example
 * buildWhatsAppHref("0812-5892-2216") === "https://wa.me/6281258922216"
 */
export function buildWhatsAppHref(displayNumber: string): string {
  const digits = displayNumber.replace(/\D+/g, "");
  let e164: string;
  if (digits.startsWith("0")) {
    e164 = "62" + digits.slice(1);
  } else {
    e164 = digits;
  }
  return `https://wa.me/${e164}`;
}

/**
 * Resolve the year to display in the Footer copyright.
 *
 * Returns the explicit `override` when provided so deterministic tests and
 * server snapshots can pin a year; otherwise falls back to the current year
 * read from `new Date().getFullYear()`.
 */
export function formatYear(override?: number): number {
  return override ?? new Date().getFullYear();
}
