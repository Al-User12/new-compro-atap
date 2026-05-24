// Global Vitest setup file.
//
// Runs once per test worker before any test file is evaluated. Anything mounted
// here is available to every test in the suite, so it stays small on purpose:
//   1. Register the `@testing-library/jest-dom` custom matchers
//      (e.g. `toBeInTheDocument`, `toHaveAccessibleName`) on `expect`.
//   2. Stub `window.matchMedia`, which JSDOM does not implement. Components that
//      consult `prefers-reduced-motion` (Framer Motion's `useReducedMotion`,
//      `MotionSection`, etc.) call `window.matchMedia` during render, so the
//      stub keeps those code paths from throwing in the test environment.

import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// JSDOM ships without `matchMedia`. Install a deterministic stub that always
// reports "no match" so reduced-motion / responsive code paths get a stable
// default. Individual tests can override `window.matchMedia` (or the `matches`
// return value) when they need to simulate user preferences.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // legacy API, kept for libraries that still use it
      removeListener: vi.fn(), // legacy API, kept for libraries that still use it
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
