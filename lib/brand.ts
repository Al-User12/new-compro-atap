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

  tagline: "Your Integrated Digital Growth Partner",

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
      summary:
        "Digital Activation & Community Support is a strategic service that combines our internal account database with an active community network to maximize campaign reach, engagement, and participation across multiple digital platforms. In addition to leveraging our managed account database, we also collaborate with select communities across various niches, ensuring campaigns feel more organic, relevant, and aligned with actual audience behavior.",
      items: [
        "Engagement & Interaction Activation",
        "Photo & Video Content Posting",
        "Photo & Video Content Creation",
        "Marketplace Voting & Ranking Support",
        "App Store & Google Maps Review Activation",
        "Community-Based Monitoring & Reporting",
      ],
    },
    {
      id: "clipping",
      title: "Content Clipping",
      summary:
        "Clipper is a content distribution service focused on repurposing curated content into short-form content for social media distribution. This service is typically used for brand campaigns, product promotions, and commercial marketing activities that require efficient content production and consistent brand exposure.",
      items: [
        "Short-form content production from podcasts, interviews, live broadcasts, and documentaries",
        "Key moment extraction and repackaging",
        "Distribution through selected internal accounts",
        "Content optimization and message consistency",
        "Sustained exposure campaigns",
      ],
    },
    {
      id: "talent",
      title: "Talent Management",
      summary:
        "We provide a comprehensive database of KOLs at various levels, from non-followers (0–999 followers) to mega-influencers, spread across regions such as Greater Jakarta (Jabodetabek), Surabaya, Bandung, and other tier-2 cities in Indonesia. With a diverse talent pool, brands can select KOLs that best suit their campaign needs and target market.",
      items: [
        "Available Across All Social Media Platforms",
        "Engagement Boosting (Comments, Likes, Shares & Saves)",
        "Photo & Video Content Posting",
        "Photo & Video Content Creation",
        "Live Streaming",
      ],
    },
    {
      id: "ads",
      title: "Digital Advertising",
      summary:
        "Data-driven advertising services focused on planning, executing, and optimizing paid media campaigns to deliver measurable growth, performance, and conversions.",
      items: [
        "Paid Advertising (Meta Ads, TikTok Ads, Google Ads)",
        "Media Planning & Budget Allocation",
        "Audience Targeting & Funnel Strategy",
        "Creative Testing & Ad Optimization",
        "Performance Monitoring & Analytics",
        "Reporting, Insights & Campaign Optimization",
      ],
    },
    {
      id: "dev",
      title: "Development",
      summary:
        "Technology-based services that provide scalable digital solutions to support business operations, brand growth, and digital transformation.",
      items: [
        "Website Development",
        "Social Media Handling",
        "Landing Page Development",
        "Digital System & Automation",
        "UI/UX Design Support",
      ],
    },
    {
      id: "creative",
      title: "Creative Production",
      summary:
        "We already have buzzers, KOLs, advertisements, and more, so we can also provide end-to-end content production services tailored to your brand needs.",
      items: [
        "Creative Concept Development",
        "Content Planning & Campaign Ideation",
        "Video Production",
        "Photography",
        "Motion Graphic Design",
        "Copywriting & Scriptwriting",
        "Short-Form Content Production",
        "Branding & Visual Identity Design",
      ],
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

  social: [
    {
      platform: "Instagram",
      href: "https://www.instagram.com/atapkreatifmanagement",
      label: "@atapkreatifmanagement",
    },
  ],

  // TODO(brand): brand.testimonials — Source_Doc testimonial entries (omit field or supply complete entries)
  testimonials: [],

  showcase: [
    {
      title: "Sarangan Official",
      category: "Destination Campaign",
      image: {
        src: "/placeholder-showcase.svg",
        alt: "Sarangan Official portfolio showcase",
        width: 800,
        height: 1000,
      },
    },
    {
      title: "Omah Turu",
      category: "Hospitality Brand",
      image: {
        src: "/placeholder-showcase.svg",
        alt: "Omah Turu portfolio showcase",
        width: 800,
        height: 1000,
      },
    },
    {
      title: "Juat Juice",
      category: "F&B Campaign",
      image: {
        src: "/placeholder-showcase.svg",
        alt: "Juat Juice portfolio showcase",
        width: 800,
        height: 1000,
      },
    },
    {
      title: "Surabaya Domino Tournament 2026",
      category: "Event Activation",
      image: {
        src: "/placeholder-showcase.svg",
        alt: "Surabaya Domino Tournament 2026 portfolio showcase",
        width: 800,
        height: 1000,
      },
    },
    {
      title: "Teh Kota Indonesia",
      category: "Consumer Brand",
      image: {
        src: "/placeholder-showcase.svg",
        alt: "Teh Kota Indonesia portfolio showcase",
        width: 800,
        height: 1000,
      },
    },
    {
      title: "Double O Bakery",
      category: "F&B Brand",
      image: {
        src: "/placeholder-showcase.svg",
        alt: "Double O Bakery portfolio showcase",
        width: 800,
        height: 1000,
      },
    },
  ],

  whyChooseUs: [
    {
      title: "Integrated digital ecosystem",
      description:
        "At Atap Kreatif Manajemen, we offer more than just digital services — we provide an integrated digital ecosystem supported by internal buzzer networks, curated clipper distribution, multi-level KOL databases, creative production, and paid advertising solutions in one management.",
    },
    {
      title: "Community-based activation",
      description:
        "Our strength lies in combining organic digital conversations, strategic content distribution, and fast execution to help brands gain wider exposure and stronger audience engagement across multiple platforms.",
    },
    {
      title: "Adaptive campaign strategies",
      description:
        "With community-based activation, adaptive campaign strategies, and measurable workflows, Atap Kreatif Manajemen is committed to delivering impactful, relevant, and scalable digital campaigns for every brand we work with.",
    },
    {
      title: "Measurable workflows",
      description:
        "We focus not only on creating content, but also on building engagement, increasing brand exposure, and delivering campaigns that connect with the right audience effectively.",
    },
  ],

  colors: {
    primary:    "#1E2E4E",
    accent:     "#6F7C8F",
    background: "#F3F3F4",
    foreground: "#1E2E4E",
    muted:      "rgb(217 217 217 / 0.6)",
  },

  fonts: {
    display:      "var(--font-display)",
    body:         "var(--font-body)",
    fallbackBody: 'Helvetica, "Helvetica Neue", Arial, system-ui, sans-serif',
  },

  assets: {
    logoSvg: "/logo.svg",
    heroVisual: {
      src: "/placeholder-showcase.svg",
      alt: "Atap Kreatif Manajemen monochrome editorial brand visual",
      width: 1200,
      height: 900,
    },
  },

  seo: {
    title: "Atap Kreatif Manajemen — Creative & Digital Marketing Agency",
    description:
      "Atap Kreatif Manajemen integrates buzzers, clippers, KOLs, advertising, development, and creative production into one accountable workflow for brands in Madiun and beyond.",
    siteUrl: "https://new-compro-atap.vercel.app",
  },
};
