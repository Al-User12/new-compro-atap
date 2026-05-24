import { defineConfig } from "vitest/config";
import path from "node:path";

// Vitest configuration for the compro-fix-landing-page project.
//
// This baseline wires up:
//   - JSDOM as the DOM environment so React Testing Library can render components
//     in a Node process without a browser.
//   - Global test APIs (`describe`, `it`, `expect`, etc.) so test files don't have to
//     import them everywhere.
//   - A shared setup file that pulls in `@testing-library/jest-dom` matchers and
//     stubs browser-only globals like `window.matchMedia`.
//   - The v8 coverage provider so `vitest run --coverage` works without extra config
//     once a coverage package is installed.
//
// The `@/` path alias mirrors `tsconfig.json` so test imports keep working as the
// suite grows (e.g. `import { brand } from "@/lib/brand"`).
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    // Treat an empty suite as success so the baseline `npx vitest run` exits 0
    // before any tests have been authored. Once tests start landing, this flag
    // simply has no effect.
    passWithNoTests: true,
    coverage: {
      provider: "v8",
    },
  },
});
