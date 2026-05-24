import type { Metadata, Viewport } from "next";

import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import { brand } from "@/lib/brand";
import { fontBody, fontDisplay } from "@/lib/fonts";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

/**
 * Page metadata derived entirely from Brand_Config (Requirement 8). Exporting
 * the result of `buildMetadata()` from the root layout means every route
 * inherits the same title/description/openGraph/twitter shape until a route
 * explicitly overrides it.
 */
export const metadata: Metadata = buildMetadata();

/**
 * Next.js App Router viewport export (Req 8.5). Kept separate from
 * `metadata` per the App Router contract introduced in Next 14.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout for the Atap Kreatif Manajemen landing page.
 *
 *   - `<html lang>` is derived from `brand.locale` so `id-ID` collapses to
 *     `"id"` and `en` stays `"en"` (Requirements 6.1, 17.4).
 *   - The skip-link is the first focusable child of `<body>` so keyboard
 *     users can jump straight to `<main id="main-content">` (Requirement 6.3).
 *   - Font CSS variables from `lib/fonts.ts` are applied at the body level so
 *     every descendant inherits Poppins (display) and the Helvetica fallback
 *     stack (body) without additional class plumbing (Requirements 11.1, 11.2,
 *     18.3, 18.4).
 *   - `MotionProvider` wraps `{children}` so Framer Motion's
 *     `reducedMotion="user"` setting flows globally without forcing the
 *     layout itself to become a Client Component (Requirements 6.7, 7.4).
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = brand.locale.split("-")[0];

  return (
    <html lang={lang}>
      <body
        className={cn(
          fontDisplay.variable,
          fontBody.variable,
          "bg-background text-foreground font-body antialiased",
        )}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
