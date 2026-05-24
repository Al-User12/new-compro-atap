// app/page.tsx
//
// Atap Kreatif Manajemen landing page composition (Task 8.1).
//
// Server Component that imports Brand_Config once and threads the relevant
// slice of `brand` into every Section_Component as props (Requirement 1.6,
// 10.4, 12.4). Section_Components never import `lib/brand.ts` directly —
// only `app/page.tsx` and `app/layout.tsx` do — so unit tests can render
// each section against partial fixtures (design.md "Where Brand_Config is
// consumed").
//
// DOM landmarks (Req 1.2, 1.3):
//   - Exactly one `<header>` wrapping the Navbar.
//   - Exactly one `<main id="main-content">` wrapping the ten body sections.
//   - Exactly one `<footer>` wrapping the Footer.
//
// Section ordering (Req 1.1, 12.4):
//   Navbar → Hero → Trust → Problem → Solution → Services → WhyChooseUs →
//   Process → Showcase → Testimonials → CTA → Footer.
//
// Each Section_Component renders its own `<section aria-labelledby>` with
// a unique heading id (Req 1.4); those ids are assigned inside the
// component files themselves and are pairwise distinct across the page
// (`hero-heading`, `trust-heading`, `problem-heading`, `solution-heading`,
// `services-heading`, `why-choose-us-heading`, `process-heading`,
// `showcase-heading`, `testimonials-heading`, `cta-heading`).

import { brand } from "@/lib/brand";

import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Problem from "@/components/Problem";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Showcase from "@/components/Showcase";
import Solution from "@/components/Solution";
import Testimonials from "@/components/Testimonials";
import Trust from "@/components/Trust";
import WhyChooseUs from "@/components/WhyChooseUs";

/**
 * Generic UI-section labels needed to satisfy each section's
 * `aria-labelledby` heading-id contract (Req 1.4). These are editorial
 * UI labels — not brand-specific copy — kept local to the page
 * composition file. Brand-specific content (tagline, description,
 * services, workflow, databases, contact, social) still comes
 * exclusively from `brand` per Requirement 2.
 */
const SECTION_HEADINGS = {
  trust: "Distribution & KOL Database",
  problem: "The challenge of fragmented execution",
  solution: "An integrated digital ecosystem",
  services: "Services",
  whyChooseUs: "Why choose us",
  process: "Our process",
  showcase: "Showcase",
  testimonials: "Testimonials",
  cta: "Ready to start?",
} as const;

export default function Home() {
  return (
    <>
      {/* Page header landmark — exactly one per page (Req 1.2). */}
      <header>
        <Navbar
          brandName={brand.name}
          shortName={brand.shortName}
          wordmark={brand.wordmark}
          logoSrc={brand.assets.logoSvg}
          nav={brand.nav}
          primaryCta={brand.primaryCta}
        />
      </header>

      {/* Page main landmark — exactly one per page, target of the
          skip-link rendered in `app/layout.tsx` (Req 1.3, 6.3). */}
      <main id="main-content">
        <Hero
          // `brand.tagline` is intentionally allowed to be empty until
          // Source_Doc tagline is supplied; the Hero itself renders a
          // structural placeholder + emits its own `TODO(brand):` marker
          // when the value is blank (Req 1.5, 10.5).
          headline={brand.tagline}
          paragraph={brand.description}
          primaryCta={brand.primaryCta}
          secondaryCta={brand.secondaryCta}
          visual={brand.assets.heroVisual}
          wordmark={brand.wordmark}
        />

        <Trust
          heading={SECTION_HEADINGS.trust}
          distribution={brand.distributionDatabase}
          kol={brand.kolDatabase}
        />

        <Problem
          heading={SECTION_HEADINGS.problem}
          // No `brand.problem.body` slot exists yet; passing an empty
          // string triggers the Problem component's structural
          // placeholder + its own `TODO(brand):` marker (Req 1.5, 10.5).
          body=""
        />

        <Solution
          heading={SECTION_HEADINGS.solution}
          // No `brand.solution.body` slot exists yet; passing an empty
          // string triggers the Solution component's structural
          // placeholder + its own `TODO(brand):` marker (Req 1.5, 10.5).
          body=""
          pillars={brand.whyChooseUs}
        />

        <Services
          heading={SECTION_HEADINGS.services}
          services={brand.services}
        />

        <WhyChooseUs
          heading={SECTION_HEADINGS.whyChooseUs}
          reasons={brand.whyChooseUs}
        />

        <Process
          heading={SECTION_HEADINGS.process}
          steps={brand.workflow}
        />

        <Showcase
          heading={SECTION_HEADINGS.showcase}
          entries={brand.showcase ?? []}
        />

        <Testimonials
          heading={SECTION_HEADINGS.testimonials}
          entries={brand.testimonials ?? []}
        />

        <CTA
          heading={SECTION_HEADINGS.cta}
          primaryCta={brand.primaryCta}
          secondaryCta={brand.secondaryCta}
        />
      </main>

      {/* Page footer landmark — exactly one per page (Req 1.2). The
          Footer component itself renders a plain `<div>` so we wrap it
          here to avoid nesting two footer landmarks. */}
      <footer>
        <Footer
          brandName={brand.name}
          shortName={brand.shortName}
          wordmark={brand.wordmark}
          logoSrc={brand.assets.logoSvg}
          description={brand.description}
          contact={brand.contact}
          social={brand.social}
          nav={brand.nav}
        />
      </footer>
    </>
  );
}
