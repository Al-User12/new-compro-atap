// lib/brand.ts
//
// Brand_Config — single source of truth for Atap Kreatif Manajemen brand content.
// Task 2.1 declared the types/interfaces below; Task 2.2 populates the concrete
// `brand` constant from the design.md "Concrete values" block.
//
// Fields without a Source_Doc value yet carry a single-line marker with the
// case-sensitive `TODO(brand)` prefix per Requirement 10.5. No copy is fabricated.
//
// Authoritative source: design.md "Data Models" + "Concrete values" sections.
// Requirements: 2.1, 10.5, 10.6, 12.2, 12.3, 14.1, 14.2, 16.4, 16.5, 16.6, 16.7, 18.1.

export type Locale = "id-ID" | "en";

export interface NavItem {
  label: string;
  href: string;
}

export interface CtaConfig {
  label: string;
  href: string;
}

export interface ServiceConfig {
  id: string;
  title: string;
  /** 80–280 chars (validated at content-population time, not at type level). */
  summary: string;
  /** 3–8 deliverable bullets. */
  items: string[];
}

export interface WorkflowStep {
  /** 1..4 in canonical order: Initial, Preparation, Execution, Reporting. */
  step: number;
  title: string;
  description: string;
}

export interface DistributionStat {
  platform: string;
  accounts: number;
}

export interface KolStat {
  tier: string;
  /** Numeric count, or the literal "menyusul" for tiers not yet finalized. */
  count: number | "menyusul";
}

export interface ContactInfo {
  email: string;
  /** Raw display form, e.g. "0812-5892-2216". */
  whatsapp: string;
  /** Derived E.164-style digits without leading "+", e.g. "6281258922216". */
  whatsappE164?: string;
  address: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  label: string;
}

export interface BrandColors {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
}

export interface BrandFonts {
  display: string;
  body: string;
  fallbackBody: string;
}

export interface BrandAssets {
  logoSvg?: string;
  ogImage?: string;
  heroVisual?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface SeoConfig {
  title: string;
  description: string;
  siteUrl?: string;
  twitterHandle?: string;
}

export interface TestimonialEntry {
  quote: string;
  name: string;
  role: string;
}

export interface ShowcaseEntry {
  title: string;
  category?: string;
  href?: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface Brand {
  name: string;
  shortName: string;
  wordmark: string;
  locale: Locale;
  tagline: string;
  description: string;
  nav: NavItem[];
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  services: ServiceConfig[];
  workflow: WorkflowStep[];
  distributionDatabase: DistributionStat[];
  kolDatabase: KolStat[];
  contact: ContactInfo;
  social: SocialLink[];
  testimonials?: TestimonialEntry[];
  showcase?: ShowcaseEntry[];
  whyChooseUs: { title: string; description: string }[];
  colors: BrandColors;
  fonts: BrandFonts;
  assets: BrandAssets;
  seo: SeoConfig;
}

// ---------------------------------------------------------------------------
// Concrete Brand_Config values (Task 2.2).
//
// Sourced from design.md "Concrete values" block, Brand_Guidelines, and
// Source_Doc (COMPRO FIX). Fields awaiting Source_Doc input retain empty
// placeholders accompanied by a TODO(brand) marker per Requirement 10.5.
// ---------------------------------------------------------------------------

export const brand: Brand = {
  name: "Atap Kreatif Manajemen",
  shortName: "Atap Kreatif",
  wordmark: "ATAP KREATIF",
  locale: "id-ID",

  // TODO(brand): brand.tagline — Source_Doc tagline (1–150 chars)
  tagline: "",

  description:
    "Atap Kreatif Manajemen is a creative and digital marketing agency based in Madiun, " +
    "founded in 2025 and led by Jalu Pamenang. We integrate buzzers, clippers, KOLs, " +
    "advertising, development, and creative production into one accountable workflow.",

  nav: [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Showcase", href: "#showcase" },
    { label: "Contact", href: "#cta" },
  ],

  primaryCta: { label: "Chat on WhatsApp", href: "https://wa.me/6281258922216" },
  secondaryCta: { label: "Email Us", href: "mailto:atapkreatifmanagement@gmail.com" },

  services: [
    {
      id: "buzzer",
      title: "Buzzer Distribution",
      // TODO(brand): brand.services[buzzer].summary — Source_Doc 80–280 char summary
      summary: "",
      // TODO(brand): brand.services[buzzer].items — Source_Doc 3–8 deliverable bullets
      items: [],
    },
    {
      id: "clipping",
      title: "Content Clipping",
      // TODO(brand): brand.services[clipping].summary — Source_Doc 80–280 char summary
      summary: "",
      // TODO(brand): brand.services[clipping].items — Source_Doc 3–8 deliverable bullets
      items: [],
    },
    {
      id: "talent",
      title: "Talent Management",
      // TODO(brand): brand.services[talent].summary — Source_Doc 80–280 char summary
      summary: "",
      // TODO(brand): brand.services[talent].items — Source_Doc 3–8 deliverable bullets
      items: [],
    },
    {
      id: "ads",
      title: "Digital Advertising",
      // TODO(brand): brand.services[ads].summary — Source_Doc 80–280 char summary
      summary: "",
      // TODO(brand): brand.services[ads].items — Source_Doc 3–8 deliverable bullets
      items: [],
    },
    {
      id: "dev",
      title: "Development",
      // TODO(brand): brand.services[dev].summary — Source_Doc 80–280 char summary
      summary: "",
      // TODO(brand): brand.services[dev].items — Source_Doc 3–8 deliverable bullets
      items: [],
    },
    {
      id: "creative",
      title: "Creative Production",
      // TODO(brand): brand.services[creative].summary — Source_Doc 80–280 char summary
      summary: "",
      // TODO(brand): brand.services[creative].items — Source_Doc 3–8 deliverable bullets
      items: [],
    },
  ],

  workflow: [
    { step: 1, title: "Initial",     description: "Negotiating KPIs and project requirements." },
    { step: 2, title: "Preparation", description: "Preparing client and internal needs." },
    { step: 3, title: "Execution",   description: "Delivering on the agreed requirements." },
    { step: 4, title: "Reporting",   description: "Reporting outcomes back to the client." },
  ],

  distributionDatabase: [
    { platform: "TikTok",    accounts: 650 },
    { platform: "Instagram", accounts: 650 },
    { platform: "Facebook",  accounts: 400 },
    { platform: "Twitter/X", accounts: 350 },
    { platform: "Threads",   accounts: 500 },
    { platform: "YouTube",   accounts: 250 },
  ],

  kolDatabase: [
    { tier: "NonFoll",   count: 1500 },
    { tier: "Nano KOL",  count: 550 },
    { tier: "Micro KOL", count: 100 },
    { tier: "Macro KOL", count: 70 },
    { tier: "Mega KOL",  count: "menyusul" },
  ],

  contact: {
    email: "atapkreatifmanagement@gmail.com",
    whatsapp: "0812-5892-2216",
    whatsappE164: "6281258922216",
    address:
      "Jl. Cokrokusumo No. 2a, Kelurahan Kuncen, Kecamatan Taman, Kota Madiun, Jawa Timur",
  },

  // TODO(brand): brand.social — Source_Doc social handles (0–8 entries)
  social: [],

  // TODO(brand): brand.testimonials — Source_Doc testimonial entries (omit field or supply complete entries)
  testimonials: [],

  // TODO(brand): brand.showcase — Source_Doc portfolio entries (e.g. justjuice lab, info loker madiun, omah turu joglo)
  showcase: [],

  whyChooseUs: [
    {
      title: "Integrated digital ecosystem",
      // TODO(brand): brand.whyChooseUs[ecosystem].description — Source_Doc paragraph
      description: "",
    },
    {
      title: "Community-based activation",
      // TODO(brand): brand.whyChooseUs[activation].description — Source_Doc paragraph
      description: "",
    },
    {
      title: "Adaptive campaign strategies",
      // TODO(brand): brand.whyChooseUs[adaptive].description — Source_Doc paragraph
      description: "",
    },
    {
      title: "Measurable workflows",
      // TODO(brand): brand.whyChooseUs[measurable].description — Source_Doc paragraph
      description: "",
    },
  ],

  colors: {
    primary:    "#1F2C43",
    accent:     "#7E8772",
    background: "#DCD7D4",
    foreground: "#1F2C43",
    muted:      "rgb(220 215 212 / 0.6)",
  },

  fonts: {
    display:      "var(--font-display)",
    body:         "var(--font-body)",
    fallbackBody: 'Helvetica, "Helvetica Neue", Arial, system-ui, sans-serif',
  },

  assets: {
    // TODO(brand): brand.assets.logoSvg — supply SVG logo asset path (e.g. "/brand/logo.svg")
    // TODO(brand): brand.assets.ogImage — supply OpenGraph image asset path (e.g. "/brand/og-default.jpg")
    // TODO(brand): brand.assets.heroVisual — supply hero visual { src, alt, width, height }
  },

  seo: {
    title: "Atap Kreatif Manajemen — Creative & Digital Marketing Agency",
    description:
      "Atap Kreatif Manajemen integrates buzzers, clippers, KOLs, advertising, development, and creative production into one accountable workflow for brands in Madiun and beyond.",
    // TODO(brand): brand.seo.siteUrl — production canonical site URL
  },
};
