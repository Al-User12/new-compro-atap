// lib/fonts.ts
//
// Typeface loaders for the Atap Kreatif Manajemen landing page (Task 3.1).
//
//   - `fontDisplay` — Poppins via `next/font/google` (display face, Req 11.1, 11.2).
//   - `fontBody`    — Helvetica via `next/font/local` *when the asset exists*,
//                     otherwise a sentinel that emits the `--font-body` CSS
//                     variable so the CSS fallback stack declared in
//                     `app/globals.css` (Helvetica → Helvetica Neue → Arial →
//                     system-ui → sans-serif) still applies. Req 18.3, 18.4.
//
// Requirements: 9.6 (font-display: swap / next/font), 11.1, 11.2, 18.3, 18.4.
//
// Note on the local-font fallback path: Requirement 18.4 explicitly approves
// the CSS fallback stack as a launch-acceptable substitute for licensed
// Helvetica, so this file deliberately does NOT emit a `TODO(brand):` marker
// for the missing local face.
//
// Note on `next/font/local` static analysis: Next.js's SWC plugin resolves
// `localFont()` arguments at build time. To keep the build green while the
// licensed Helvetica WOFF2 has not yet been placed in
// `public/fonts/helvetica/`, this module exports the sentinel-only shape and
// reports `HELVETICA_LOCAL_AVAILABLE` so a future maintainer can drop the
// asset in and uncomment the local loader without touching any consumer.

import { Poppins } from "next/font/google";
import fs from "node:fs";
import path from "node:path";

/** Shape shared by `next/font` outputs and the local-font fallback sentinel. */
export interface FontHandle {
  variable: string;
  className: string;
}

/**
 * Display face — Poppins, loaded through `next/font/google`.
 * Self-hosted by Next.js with `font-display: swap` to satisfy Req 9.6.
 */
export const fontDisplay = Poppins({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Absolute filesystem path to the licensed Helvetica WOFF2 asset.
 *
 * Resolved against `process.cwd()` (the Next.js project root during both
 * `next dev` and `next build`) so the existence check is independent of the
 * importing module's location.
 */
const HELVETICA_FS_PATH = path.join(
  process.cwd(),
  "public",
  "fonts",
  "helvetica",
  "Helvetica.woff2",
);

/**
 * `true` when the licensed Helvetica WOFF2 is present in `public/fonts/helvetica/`.
 *
 * When `false`, `fontBody` is the sentinel below and the body face is served
 * by the CSS fallback stack defined in `app/globals.css` (Req 18.3, 18.4).
 */
export const HELVETICA_LOCAL_AVAILABLE: boolean = (() => {
  try {
    return fs.existsSync(HELVETICA_FS_PATH);
  } catch {
    return false;
  }
})();

/**
 * Sentinel body-font handle used while the licensed Helvetica asset is absent.
 *
 * Emits the `--font-body` CSS variable so consumers can apply
 * `className={fontBody.variable}` uniformly; the empty `className` produces no
 * additional rules, leaving the CSS fallback stack from `app/globals.css` in
 * effect. Req 18.4 approves this fallback as launch-acceptable.
 */
const fontBodyFallback: FontHandle = {
  variable: "--font-body",
  className: "",
};

// To enable the licensed Helvetica face once the WOFF2 has been placed at
// `public/fonts/helvetica/Helvetica.woff2`:
//
//   1. Add the import at the top of this file:
//        import localFont from "next/font/local";
//   2. Replace the `fontBody` export below with:
//        export const fontBody: FontHandle = localFont({
//          src: [
//            { path: "../public/fonts/helvetica/Helvetica.woff2", weight: "400", style: "normal" },
//          ],
//          variable: "--font-body",
//          display: "swap",
//          fallback: ["Helvetica", "Helvetica Neue", "Arial", "system-ui", "sans-serif"],
//        });
//
// The `localFont` call is intentionally kept out of the source tree until the
// asset exists so Next.js's build-time font resolver does not error.
export const fontBody: FontHandle = fontBodyFallback;
