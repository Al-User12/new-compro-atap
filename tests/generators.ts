// tests/generators.ts
//
// fast-check arbitraries for the compro-fix-landing-page property-based test
// suite. This file is the single source of generators consumed by every
// `tests/properties/*.test.ts` file (Properties 1–20) so each property test
// shares a consistent input space.
//
// Authoritative sources:
//   - tasks.md → Task 10.3 (this task) defines the public API.
//   - design.md → "Generator catalogue" + "Property 9: Missing-input fallback
//     discipline" defines the clearable-field semantics consumed by
//     `arbBrandWithCleared`.
//   - lib/brand.ts → defines the canonical `Brand` type.
//
// Conventions:
//   - No `any`. Type-level coverage comes from `Brand` and a discriminated
//     `BrandFieldPath` string-literal union of paths that Section_Components
//     can fall back on per Requirement 1.5 / 10.4.
//   - Generators produce *valid shapes* only: services length 6, workflow
//     length 4, distribution length 6, KOL length 4–5, hex colors matching
//     `/^#[0-9A-F]{6}$/i`, locale ∈ {"id-ID","en"}. Property tests layer
//     stronger semantic constraints on top via additional `.filter(...)` /
//     `.map(...)` chains as needed.

import * as fc from "fast-check";

import type {
  Brand,
  BrandAssets,
  BrandColors,
  BrandFonts,
  ContactInfo,
  CtaConfig,
  DistributionStat,
  KolStat,
  Locale,
  NavItem,
  SeoConfig,
  ServiceConfig,
  ShowcaseEntry,
  SocialLink,
  TestimonialEntry,
  WorkflowStep,
} from "@/lib/brand";

// ---------------------------------------------------------------------------
// Public field-path catalogue (used by `arbBrandWithCleared` and Property 9).
//
// Each entry names a field whose Section_Component consumer is required to
// render a structural placeholder + emit a `// TODO(brand):` comment when the
// field is cleared (Requirement 1.5, 10.4, 10.5).
// ---------------------------------------------------------------------------

export const BRAND_FIELD_PATHS = [
  "tagline",
  "description",
  "nav",
  "primaryCta",
  "secondaryCta",
  "services",
  "workflow",
  "distributionDatabase",
  "kolDatabase",
  "contact.email",
  "contact.whatsapp",
  "contact.address",
  "social",
  "testimonials",
  "showcase",
  "whyChooseUs",
  "assets.logoSvg",
  "assets.ogImage",
  "assets.heroVisual",
  "seo.title",
  "seo.description",
  "seo.siteUrl",
] as const;

export type BrandFieldPath = (typeof BRAND_FIELD_PATHS)[number];

// ---------------------------------------------------------------------------
// Hex color generator — exactly `#[0-9A-F]{6}` per the task acceptance criteria.
// ---------------------------------------------------------------------------

const arbHexColor: fc.Arbitrary<string> = fc
  .hexaString({ minLength: 6, maxLength: 6 })
  .map((s) => `#${s.toUpperCase()}`);

// ---------------------------------------------------------------------------
// Small string helpers. Bounded length so we don't burn iterations on giant
// strings. `nonEmptyString` is used wherever Brand_Config consumers reject
// trim-empty values per Requirement 2.4.
// ---------------------------------------------------------------------------

const nonEmptyString = (max = 80): fc.Arbitrary<string> =>
  fc
    .string({ minLength: 1, maxLength: max })
    .map((s) => s.trim())
    .filter((s) => s.length >= 1);

const sentence = (min: number, max: number): fc.Arbitrary<string> =>
  fc
    .string({ minLength: min, maxLength: max })
    .map((s) => s.trim())
    .filter((s) => s.length >= min && s.length <= max);

// ---------------------------------------------------------------------------
// Sub-shape arbitraries — one per Brand_Config field group.
// ---------------------------------------------------------------------------

const arbNavItem: fc.Arbitrary<NavItem> = fc.record({
  label: nonEmptyString(20),
  href: fc.constantFrom(
    "#services",
    "#process",
    "#showcase",
    "#cta",
    "#testimonials",
    "#trust",
    "#why-choose-us",
  ),
});

const arbCtaConfig: fc.Arbitrary<CtaConfig> = fc.record({
  label: nonEmptyString(30),
  href: fc.oneof(
    fc.constant("https://wa.me/6281258922216"),
    fc.constant("mailto:atapkreatifmanagement@gmail.com"),
    fc.constantFrom("#services", "#cta"),
  ),
});

const arbServiceConfig: fc.Arbitrary<ServiceConfig> = fc.record({
  id: nonEmptyString(24),
  title: nonEmptyString(40),
  // Requirement 16.5 lower-bound is 80; widen so generators land in-range.
  summary: sentence(80, 280),
  items: fc.array(nonEmptyString(60), { minLength: 3, maxLength: 8 }),
});

const arbWorkflowStep = (step: number): fc.Arbitrary<WorkflowStep> =>
  fc.record({
    step: fc.constant(step),
    title: nonEmptyString(40),
    description: sentence(1, 200),
  });

const arbDistributionStat: fc.Arbitrary<DistributionStat> = fc.record({
  platform: nonEmptyString(20),
  accounts: fc.integer({ min: 0, max: 10_000 }),
});

const arbKolStat: fc.Arbitrary<KolStat> = fc.record({
  tier: nonEmptyString(20),
  count: fc.oneof(
    fc.integer({ min: 0, max: 10_000 }),
    fc.constant("menyusul" as const),
  ),
});

// Indonesian-style WhatsApp display number, e.g. "0812-5892-2216".
// Format: `08XX-XXXX-XXXX` — two digits after the "08" prefix, then two
// four-digit groups separated by ASCII hyphens.
const arbWhatsAppDisplay: fc.Arbitrary<string> = fc
  .tuple(
    fc.integer({ min: 10, max: 99 }),
    fc.integer({ min: 1000, max: 9999 }),
    fc.integer({ min: 1000, max: 9999 }),
  )
  .map(([a, b, c]) => `08${a}-${b}-${c}`);

const arbContactInfo: fc.Arbitrary<ContactInfo> = fc
  .record({
    email: fc.emailAddress(),
    whatsapp: arbWhatsAppDisplay,
    address: sentence(1, 160),
  })
  .map((c) => ({
    ...c,
    whatsappE164: `62${c.whatsapp.replace(/\D/g, "").replace(/^0/, "")}`,
  }));

const arbSocialLink: fc.Arbitrary<SocialLink> = fc.record({
  platform: nonEmptyString(16),
  href: fc.webUrl(),
  label: nonEmptyString(40),
});

const arbTestimonialEntry: fc.Arbitrary<TestimonialEntry> = fc.record({
  quote: sentence(1, 280),
  name: nonEmptyString(60),
  role: nonEmptyString(80),
});

const arbShowcaseEntry: fc.Arbitrary<ShowcaseEntry> = fc.record(
  {
    title: nonEmptyString(60),
    category: nonEmptyString(40),
    href: fc.webUrl(),
    image: fc.record({
      src: fc.constantFrom("/showcase/1.jpg", "/showcase/2.jpg", "/showcase/3.jpg"),
      alt: sentence(1, 120),
      width: fc.integer({ min: 200, max: 2000 }),
      height: fc.integer({ min: 200, max: 2000 }),
    }),
  },
  { requiredKeys: ["title", "image"] },
);

const arbWhyChooseUsEntry: fc.Arbitrary<{ title: string; description: string }> =
  fc.record({
    title: nonEmptyString(60),
    description: sentence(1, 240),
  });

const arbBrandColors: fc.Arbitrary<BrandColors> = fc.record({
  primary: arbHexColor,
  accent: arbHexColor,
  background: arbHexColor,
  foreground: arbHexColor,
  // `muted` is documented as an opacity-derived utility, not a free hex.
  // Use the canonical token-style value to mirror the canonical brand.
  muted: fc.constant("rgb(220 215 212 / 0.6)"),
});

const arbBrandFonts: fc.Arbitrary<BrandFonts> = fc.record({
  display: fc.constant("var(--font-display)"),
  body: fc.constant("var(--font-body)"),
  fallbackBody: fc.constant(
    'Helvetica, "Helvetica Neue", Arial, system-ui, sans-serif',
  ),
});

const arbBrandAssets: fc.Arbitrary<BrandAssets> = fc.record(
  {
    logoSvg: fc.constantFrom("/brand/logo.svg"),
    ogImage: fc.constantFrom("/brand/og-default.jpg"),
    heroVisual: fc.record({
      src: fc.constantFrom("/brand/hero.jpg"),
      alt: sentence(1, 120),
      width: fc.integer({ min: 320, max: 2000 }),
      height: fc.integer({ min: 320, max: 2000 }),
    }),
  },
  { requiredKeys: [] },
);

const arbSeoConfig: fc.Arbitrary<SeoConfig> = fc.record(
  {
    title: sentence(10, 60),
    description: sentence(50, 160),
    siteUrl: fc.webUrl(),
    twitterHandle: nonEmptyString(20),
  },
  { requiredKeys: ["title", "description"] },
);

// ---------------------------------------------------------------------------
// Public top-level arbitraries.
// ---------------------------------------------------------------------------

export const arbLocale: fc.Arbitrary<Locale> = fc.constantFrom("id-ID", "en");

export const arbReducedMotion: fc.Arbitrary<boolean> = fc.boolean();

// Common breakpoints sampled alongside a uniform width so property tests get
// both boundary coverage and broad-spectrum coverage.
export const arbViewportWidth: fc.Arbitrary<number> = fc.oneof(
  fc.constantFrom(320, 374, 768, 1024, 1280, 1920),
  fc.integer({ min: 320, max: 1920 }),
);

export const arbFailingImageSrc: fc.Arbitrary<string> = fc.constant(
  "/intentionally-missing.jpg",
);

/**
 * Canonical-shape `Brand` arbitrary.
 *
 * Honors all cardinality and format constraints called out in the task
 * acceptance criteria:
 *   - `services.length === 6`
 *   - `workflow.length === 4` with `step` 1..4 in order
 *   - `distributionDatabase.length === 6`
 *   - `kolDatabase.length` ∈ {4, 5}
 *   - `locale` ∈ {"id-ID", "en"}
 *   - hex colors match `/^#[0-9A-F]{6}$/i`
 *   - contact strings parse as valid email and Indonesian phone display.
 */
export const arbBrand: fc.Arbitrary<Brand> = fc
  .record({
    name: nonEmptyString(50),
    shortName: nonEmptyString(20),
    wordmark: nonEmptyString(20),
    locale: arbLocale,
    tagline: sentence(1, 150),
    description: sentence(1, 400),
    nav: fc.array(arbNavItem, { minLength: 4, maxLength: 7 }),
    primaryCta: arbCtaConfig,
    secondaryCta: arbCtaConfig,
    services: fc.tuple(
      arbServiceConfig,
      arbServiceConfig,
      arbServiceConfig,
      arbServiceConfig,
      arbServiceConfig,
      arbServiceConfig,
    ),
    workflow: fc.tuple(
      arbWorkflowStep(1),
      arbWorkflowStep(2),
      arbWorkflowStep(3),
      arbWorkflowStep(4),
    ),
    distributionDatabase: fc.tuple(
      arbDistributionStat,
      arbDistributionStat,
      arbDistributionStat,
      arbDistributionStat,
      arbDistributionStat,
      arbDistributionStat,
    ),
    kolDatabase: fc.array(arbKolStat, { minLength: 4, maxLength: 5 }),
    contact: arbContactInfo,
    social: fc.array(arbSocialLink, { minLength: 0, maxLength: 8 }),
    testimonials: fc.array(arbTestimonialEntry, { minLength: 0, maxLength: 6 }),
    showcase: fc.array(arbShowcaseEntry, { minLength: 0, maxLength: 6 }),
    whyChooseUs: fc.array(arbWhyChooseUsEntry, { minLength: 3, maxLength: 5 }),
    colors: arbBrandColors,
    fonts: arbBrandFonts,
    assets: arbBrandAssets,
    seo: arbSeoConfig,
  })
  .map((b): Brand => ({
    ...b,
    // `fc.tuple` returns a typed tuple; widen to the array type Brand expects.
    services: [...b.services],
    workflow: [...b.workflow],
    distributionDatabase: [...b.distributionDatabase],
  }));

// ---------------------------------------------------------------------------
// `arbBrandWithCleared` — derives `arbBrand` and clears a caller-specified
// subset of fields per Property 9 (Missing-input fallback discipline).
//
// Clearing semantics chosen to exercise every clearing form documented in
// design.md Property 9 (`undefined`, `""`, empty array, asset-URL fail). For
// each path we pick the most idiomatic clearing form for that field's type so
// Section_Component fallback paths fire deterministically.
// ---------------------------------------------------------------------------

const clearField = (brand: Brand, path: BrandFieldPath): Brand => {
  switch (path) {
    case "tagline":
      return { ...brand, tagline: "" };
    case "description":
      return { ...brand, description: "" };
    case "nav":
      return { ...brand, nav: [] };
    case "primaryCta":
      return { ...brand, primaryCta: { label: "", href: "" } };
    case "secondaryCta":
      return { ...brand, secondaryCta: { label: "", href: "" } };
    case "services":
      return { ...brand, services: [] };
    case "workflow":
      return { ...brand, workflow: [] };
    case "distributionDatabase":
      return { ...brand, distributionDatabase: [] };
    case "kolDatabase":
      return { ...brand, kolDatabase: [] };
    case "contact.email":
      return { ...brand, contact: { ...brand.contact, email: "" } };
    case "contact.whatsapp":
      return {
        ...brand,
        contact: { ...brand.contact, whatsapp: "", whatsappE164: undefined },
      };
    case "contact.address":
      return { ...brand, contact: { ...brand.contact, address: "" } };
    case "social":
      return { ...brand, social: [] };
    case "testimonials":
      return { ...brand, testimonials: [] };
    case "showcase":
      return { ...brand, showcase: [] };
    case "whyChooseUs":
      return { ...brand, whyChooseUs: [] };
    case "assets.logoSvg":
      return { ...brand, assets: { ...brand.assets, logoSvg: undefined } };
    case "assets.ogImage":
      return { ...brand, assets: { ...brand.assets, ogImage: undefined } };
    case "assets.heroVisual":
      return { ...brand, assets: { ...brand.assets, heroVisual: undefined } };
    case "seo.title":
      return { ...brand, seo: { ...brand.seo, title: "" } };
    case "seo.description":
      return { ...brand, seo: { ...brand.seo, description: "" } };
    case "seo.siteUrl":
      return { ...brand, seo: { ...brand.seo, siteUrl: undefined } };
    default: {
      // Exhaustiveness guard — TypeScript ensures every BrandFieldPath has a
      // case above. If the union grows, the unused-locals rule will flag this.
      const _exhaustive: never = path;
      return _exhaustive;
    }
  }
};

/**
 * Returns an arbitrary that produces a `Brand` derived from `arbBrand` with
 * every path in `fields` cleared per Property 9 semantics.
 *
 * Pass an empty array to get a brand with no fields cleared (equivalent to
 * `arbBrand`). Property 9's test will typically pass a `fc.subarray` over
 * `BRAND_FIELD_PATHS` to explore every subset.
 */
export const arbBrandWithCleared = (
  fields: readonly BrandFieldPath[],
): fc.Arbitrary<Brand> =>
  arbBrand.map((b) => fields.reduce<Brand>(clearField, b));
