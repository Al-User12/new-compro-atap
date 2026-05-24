// tests/generators.test.ts
//
// Smoke checks for the fast-check arbitrary catalogue declared in
// `tests/generators.ts`. The "Done when" line for Task 10.3 in tasks.md is:
//
//   fc.sample(arbBrand, 5).every(b => b.services.length === 6)
//
// We verify that exact assertion plus a handful of related cardinality
// invariants so future regressions in the generator wiring fail loudly.

import { describe, expect, it } from "vitest";
import * as fc from "fast-check";

import {
  BRAND_FIELD_PATHS,
  arbBrand,
  arbBrandWithCleared,
  arbFailingImageSrc,
  arbLocale,
  arbReducedMotion,
  arbViewportWidth,
} from "./generators";

describe("tests/generators.ts — arbBrand", () => {
  it("samples brands whose services length is always 6", () => {
    const samples = fc.sample(arbBrand, 5);
    expect(samples).toHaveLength(5);
    expect(samples.every((b) => b.services.length === 6)).toBe(true);
  });

  it("respects every cardinality and shape constraint declared in Task 10.3", () => {
    fc.assert(
      fc.property(arbBrand, (b) => {
        expect(b.services).toHaveLength(6);
        expect(b.workflow).toHaveLength(4);
        expect(b.distributionDatabase).toHaveLength(6);
        expect(b.kolDatabase.length).toBeGreaterThanOrEqual(4);
        expect(b.kolDatabase.length).toBeLessThanOrEqual(5);
        expect(["id-ID", "en"]).toContain(b.locale);
        expect(b.colors.primary).toMatch(/^#[0-9A-F]{6}$/i);
        expect(b.colors.accent).toMatch(/^#[0-9A-F]{6}$/i);
        expect(b.colors.background).toMatch(/^#[0-9A-F]{6}$/i);
        expect(b.colors.foreground).toMatch(/^#[0-9A-F]{6}$/i);
        // Email + WhatsApp display formatting
        expect(b.contact.email).toContain("@");
        expect(b.contact.whatsapp).toMatch(/^08\d{2}-\d{4}-\d{4}$/);
        // Workflow steps are 1..4 in order
        expect(b.workflow.map((w) => w.step)).toEqual([1, 2, 3, 4]);
      }),
      { numRuns: 25 },
    );
  });
});

describe("tests/generators.ts — arbBrandWithCleared", () => {
  it("returns the canonical shape when given an empty path list", () => {
    const samples = fc.sample(arbBrandWithCleared([]), 3);
    expect(samples.every((b) => b.services.length === 6)).toBe(true);
  });

  it("clears every requested field deterministically", () => {
    const samples = fc.sample(
      arbBrandWithCleared([
        "tagline",
        "social",
        "testimonials",
        "assets.heroVisual",
        "seo.siteUrl",
      ]),
      3,
    );
    for (const b of samples) {
      expect(b.tagline).toBe("");
      expect(b.social).toEqual([]);
      expect(b.testimonials).toEqual([]);
      expect(b.assets.heroVisual).toBeUndefined();
      expect(b.seo.siteUrl).toBeUndefined();
    }
  });

  it("exposes a stable BRAND_FIELD_PATHS catalogue", () => {
    expect(BRAND_FIELD_PATHS).toContain("tagline");
    expect(BRAND_FIELD_PATHS).toContain("primaryCta");
    expect(BRAND_FIELD_PATHS).toContain("assets.heroVisual");
    expect(BRAND_FIELD_PATHS.length).toBeGreaterThan(15);
  });
});

describe("tests/generators.ts — viewport / motion / locale arbitraries", () => {
  it("samples viewport widths within [320, 1920]", () => {
    const samples = fc.sample(arbViewportWidth, 30);
    for (const w of samples) {
      expect(w).toBeGreaterThanOrEqual(320);
      expect(w).toBeLessThanOrEqual(1920);
    }
  });

  it("samples reduced-motion booleans", () => {
    const samples = fc.sample(arbReducedMotion, 10);
    expect(samples.every((v) => typeof v === "boolean")).toBe(true);
  });

  it("samples locales from the Brand_Config locale union", () => {
    const samples = fc.sample(arbLocale, 10);
    expect(samples.every((l) => l === "id-ID" || l === "en")).toBe(true);
  });

  it("emits the intentionally-missing image source constant", () => {
    expect(fc.sample(arbFailingImageSrc, 3)).toEqual([
      "/intentionally-missing.jpg",
      "/intentionally-missing.jpg",
      "/intentionally-missing.jpg",
    ]);
  });
});
