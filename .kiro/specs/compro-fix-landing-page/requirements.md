# Requirements Document

## Introduction

This document defines the requirements for the **Atap Kreatif Management** marketing landing page (working title in source materials: "COMPRO FIX"). Atap Kreatif Management is a creative and digital marketing agency based in Madiun, East Java, founded in 2025 and led by Jalu Pamenang. The agency offers digital marketing, product branding, and social media management through six service lines: Buzzer Distribution, Content Clipping, Talent Management, Digital Advertising, Development, and Creative Production.

The Landing_Page is a single, conversion-focused web experience that introduces the brand, communicates the offering, builds trust through database scale and process clarity, and guides visitors toward a primary call-to-action (WhatsApp / email contact). The page MUST feel custom, editorial, premium, and human-crafted (explicitly avoiding "AI-slop" template aesthetics) while remaining accessible, responsive, performant, and SEO-ready.

The implementation uses Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion for restrained motion, and shadcn/ui where useful. All brand-specific content (colors, fonts, copy, contact info, services, navigation labels, workflow steps, KOL/account database stats) is centralized in a single brand configuration module so the page can be updated without touching component logic.

Brand copy from the source document and brand identity assets from the official Atap Kreatif Manajemen Brand Guidelines (logo system, color palette, typography) are available and are the authoritative inputs for Brand_Config. The Brand Guidelines define the brand spelling as "ATAP KREATIF MANAJEMEN" (Indonesian), the wordmark as "ATAP KREATIF", a three-color palette (Pageant Blue `#1F2C43`, Matte Green `#7E8772`, Catacomb Walls `#DCD7D4`), and a two-typeface system (Poppins and Helvetica). Photography style follows an editorial, fashion-magazine direction with bold display typography overlaid on lifestyle imagery. The page MUST never fabricate testimonials, client names, awards, or statistics that are not present in source materials.

## Glossary

- **Brand**: Atap Kreatif Manajemen (Indonesian, per Brand Guidelines) / Atap Kreatif Management (English variant per Source_Doc copy). The wordmark and logotype use "ATAP KREATIF" as the displayed mark. The displayed long-form name SHALL match Brand_Config.locale.
- **Brand_Guidelines**: The official "Brand Guidelines — ATAP KREATIF MANAJEMEN" document defining logo variations, typography (Poppins, Helvetica), color palette (Pageant Blue, Matte Green, Catacomb Walls), and visual style direction.
- **Source_Doc**: The COMPRO FIX copywriting document provided by the user, treated as the authoritative source of textual brand content.
- **Landing_Page**: The single-page Next.js route at `/` that composes all section components into the Atap Kreatif Management marketing experience.
- **Navbar**: The top navigation component (`components/Navbar.tsx`) containing logo, primary menu, primary CTA, and a mobile menu trigger.
- **Hero**: The above-the-fold section component (`components/Hero.tsx`) containing headline, supporting paragraph, primary CTA, secondary CTA, and brand visual.
- **Problem_Section**: Component (`components/Problem.tsx`) describing the audience pain point in editorial layout.
- **Solution_Section**: Component (`components/Solution.tsx`) describing the core offer using a bento grid or split layout.
- **Services_Section**: Component (`components/Services.tsx`) presenting the six Atap Kreatif Management service lines.
- **Process_Section**: Component (`components/Process.tsx`) presenting the four-step Atap Kreatif Management workflow.
- **Showcase_Section**: Component (`components/Showcase.tsx`) presenting portfolio handling-akun work or client logos.
- **Testimonials_Section**: Component (`components/Testimonials.tsx`) presenting social proof.
- **Trust_Section**: A section presenting the Atap Kreatif Management distribution database (TikTok, Instagram, Facebook, Twitter/X, Threads, YouTube) and the KOL database (NonFoll, Nano, Micro, Macro, Mega) as numeric proof points.
- **Why_Choose_Us_Section**: A section presenting brand differentiation (integrated digital ecosystem, community-based activation, adaptive campaign strategies, measurable workflows) grounded in Source_Doc copy.
- **CTA_Section**: Final call-to-action component (`components/CTA.tsx`) with a strong closing message and primary CTA.
- **Footer**: Component (`components/Footer.tsx`) containing logo, description, contact, social links, and copyright.
- **Primary_CTA**: The single highest-priority action label and target URL defined once in `lib/brand.ts`. For Atap Kreatif Management, the Primary_CTA target SHALL be the WhatsApp link `https://wa.me/6281258922216` with label "Chat on WhatsApp" or equivalent action-oriented label sourced from Brand_Config.
- **Secondary_CTA**: A lower-priority supporting action defined in `lib/brand.ts`. For Atap Kreatif Management, the Secondary_CTA target SHALL be `mailto:atapkreatifmanagement@gmail.com` or an in-page anchor (e.g., `#services`) sourced from Brand_Config.
- **Brand_Config**: The TypeScript module at `lib/brand.ts` exporting colors, copy snippets, CTA labels, contact info, services list, workflow steps, database stats, and navigation items as the single source of truth for brand content.
- **TODO_Marker**: A code comment of the form `// TODO(brand):` used in source files to flag content that requires real brand assets before launch. Each marker SHALL name both the consuming component and the missing Brand_Config field.
- **Section_Component**: Any of the named components listed above that renders a top-level section of the Landing_Page.
- **Mobile_Viewport**: A viewport with width less than 768 CSS pixels (test range: 320–767 px).
- **Tablet_Viewport**: A viewport with width from 768 to 1023 CSS pixels inclusive.
- **Desktop_Viewport**: A viewport with width from 1024 to 1920 CSS pixels inclusive.
- **Reduced_Motion_Preference**: The user-agent setting indicated by the `prefers-reduced-motion: reduce` media query.
- **Accessible_Name**: A non-empty text label exposed to assistive technology via visible text, `aria-label`, or `aria-labelledby`.
- **Lighthouse_Mobile_Audit**: A Lighthouse audit run in mobile configuration (Moto G Power device profile, simulated mobile throttling) against a production build of the Landing_Page deployed home page URL, taken as the median of 3 consecutive runs.

## Requirements

### Requirement 1: Page Composition and Structure

**User Story:** As a visitor, I want the landing page to present a complete, ordered narrative from introduction to call-to-action, so that I can understand the brand and take action without leaving the page.

#### Acceptance Criteria

1. THE Landing_Page SHALL render the following Section_Components in this exact order: Navbar, Hero, Trust_Section, Problem_Section, Solution_Section, Services_Section, Why_Choose_Us_Section, Process_Section, Showcase_Section, Testimonials_Section, CTA_Section, Footer.
2. THE Landing_Page SHALL render exactly one Navbar inside the `<header>` landmark and exactly one Footer inside the `<footer>` landmark.
3. THE Landing_Page SHALL render every Section_Component other than Navbar and Footer inside exactly one `<main>` landmark, such that the page contains exactly one `<header>`, exactly one `<main>`, and exactly one `<footer>`.
4. THE Landing_Page SHALL render each Section_Component as a `<section>` element whose Accessible_Name is provided via `aria-labelledby` referencing a visible heading inside that section, and SHALL ensure each Accessible_Name is unique across the page.
5. IF a Section_Component receives no content from Brand_Config for any of its required fields, THEN THE Section_Component SHALL render a visible structural placeholder that preserves the section's position and layout slot, AND THE source SHALL emit a comment beginning with `TODO(brand):` naming the Section_Component and the missing Brand_Config field.
6. IF Brand_Config fails to load or returns an empty object at render time, THEN THE Landing_Page SHALL still render all Section_Components in the order defined in criterion 1 with placeholder content per criterion 5, and SHALL NOT render a blank page or throw an unhandled error.

### Requirement 2: Brand Configuration as Single Source of Truth

**User Story:** As a developer maintaining the site, I want all brand-specific content centralized in one module, so that I can update copy, colors, and links without modifying component logic.

#### Acceptance Criteria

1. THE Brand_Config SHALL export a typed object containing the following fields:
   - `name`: string equal to "Atap Kreatif Manajemen" when `locale` is `id-ID`, or "Atap Kreatif Management" when `locale` is `en` (1–50 characters)
   - `wordmark`: string equal to "ATAP KREATIF" (the logotype displayed text, 1–20 characters)
   - `shortName`: string equal to "Atap Kreatif" (1–20 characters)
   - `locale`: string, one of `id-ID` or `en`
   - `tagline`: string sourced from Source_Doc (1–150 characters)
   - `description`: string sourced from Source_Doc About Us (1–400 characters)
   - `nav`: array of 4–7 entries, each `{ label: string, href: string }`
   - `primaryCta`: `{ label: string, href: string }`
   - `secondaryCta`: `{ label: string, href: string }`
   - `services`: array of exactly 6 entries, each `{ id: string, title: string, summary: string, items: string[] }`
   - `workflow`: array of exactly 4 entries, each `{ step: number, title: string, description: string }`
   - `distributionDatabase`: array of 6 entries, each `{ platform: string, accounts: number }` for TikTok, Instagram, Facebook, Twitter/X, Threads, YouTube
   - `kolDatabase`: array of 4–5 entries, each `{ tier: string, count: number | "menyusul" }` for NonFoll, Nano, Micro, Macro, and optionally Mega
   - `contact`: `{ email: string, whatsapp: string, address: string }`
   - `social`: array of 0–8 entries, each `{ platform: string, href: string, label: string }`
   - `colors`: object with keys `primary`, `accent`, `background`, `foreground`, `muted` carrying the exact hex values defined in Requirement 18
   - `fonts`: object with keys `display` and `body` declaring the font families defined in Requirement 18
2. THE Section_Components SHALL read all brand-specific text, links, and labels exclusively from Brand_Config at render time.
3. THE Hero, CTA_Section, and Navbar SHALL render the Primary_CTA from Brand_Config using the identical label string and href value declared in Brand_Config, with no per-component overrides.
4. IF any Brand_Config string field is undefined, null, or an empty string after trimming whitespace, THEN the consuming Section_Component SHALL render the structural placeholder defined in Requirement 1.5 and SHALL NOT emit empty text nodes, broken anchor tags, or zero-length list entries.
5. THE Brand_Config.colors object SHALL be the sole source of brand color values, AND THE Tailwind CSS theme configuration SHALL reference these values such that updating a token in Brand_Config propagates to every component using the corresponding Tailwind class.
6. THE Section_Components SHALL NOT contain hard-coded brand text, brand-specific URLs, or brand color literals within component source files; brand values SHALL be imported from Brand_Config.

### Requirement 3: Hero Conversion Clarity

**User Story:** As a first-time visitor, I want the hero section to immediately tell me what Atap Kreatif Management offers, who it is for, and what action to take, so that I can decide to engage within seconds.

#### Acceptance Criteria

1. THE Hero SHALL render a headline (1–80 characters), a supporting paragraph (1–240 characters), a Primary_CTA with label 1–30 characters, and a Secondary_CTA with label 1–30 characters.
2. THE Hero headline SHALL communicate that Atap Kreatif Management is a creative and digital marketing agency, AND the supporting paragraph SHALL communicate the integrated ecosystem of buzzers, clippers, KOLs, advertising, development, and creative production grounded in Source_Doc copy.
3. THE Hero SHALL render a brand-inspired visual element positioned within the Hero section bounds, AND THE visual element SHALL provide alt text of 1–150 characters via `alt` attribute or `aria-label`.
4. THE Hero headline SHALL be marked up as the single `<h1>` element of the Landing_Page.
5. THE Hero Primary_CTA SHALL be the first interactive element in DOM tab order after the Navbar's interactive elements, and the Hero Secondary_CTA SHALL immediately follow the Primary_CTA in tab order.
6. WHEN the Landing_Page is rendered at any viewport width from 320 to 1920 CSS pixels inclusive, THE Hero SHALL render its headline, supporting paragraph, Primary_CTA, and Secondary_CTA fully visible without horizontal scrolling.
7. WHEN a user activates the Hero Primary_CTA or Secondary_CTA, THE Landing_Page SHALL navigate to the corresponding href without rendering an error state in the Hero section.
8. IF the Hero brand visual fails to load, THEN THE Hero SHALL still render the headline, supporting paragraph, Primary_CTA, and Secondary_CTA, and SHALL NOT introduce horizontal scroll.

### Requirement 4: Call-to-Action Reachability

**User Story:** As a visitor scrolling the page, I want a clear path to the primary action available throughout my journey, so that I can convert at the moment I decide to.

#### Acceptance Criteria

1. THE Navbar SHALL render the Primary_CTA on Tablet_Viewport and Desktop_Viewport such that the control is keyboard-focusable, not visually occluded by other elements, and exposes a hit area of at least 44 by 44 CSS pixels.
2. WHILE the Navbar mobile menu is open on a Mobile_Viewport, THE Navbar SHALL render the Primary_CTA inside the mobile menu as a keyboard-focusable control with a hit area of at least 44 by 44 CSS pixels.
3. THE Hero SHALL render the Primary_CTA as a keyboard-focusable control with a hit area of at least 44 by 44 CSS pixels.
4. THE CTA_Section SHALL render the Primary_CTA as a keyboard-focusable control with a hit area of at least 44 by 44 CSS pixels.
5. THE Primary_CTA SHALL link to the WhatsApp href defined in Brand_Config (`https://wa.me/6281258922216` derived from contact.whatsapp `0812-5892-2216`) and SHALL render the label defined in Brand_Config wherever it appears.
6. WHEN a user activates any Primary_CTA control via mouse click, touch tap, Enter key, Space key, or assistive technology activation, THE Landing_Page SHALL initiate navigation to the configured href within 1000 milliseconds, AND navigation SHALL proceed even when the activation handler does not throw an uncaught exception.
7. IF Brand_Config does not provide a valid Primary_CTA href (undefined, null, empty string, or invalid URL), THEN every Section_Component that would render the Primary_CTA SHALL render its structural placeholder per Requirement 1.5 instead of rendering a broken link.
8. WHILE the Mobile_Viewport mobile menu is closed, THE Landing_Page SHALL make the Primary_CTA reachable by the user within at most two control activations from any scroll position (e.g., open menu then activate CTA, or scroll to the Hero or CTA_Section).

### Requirement 5: Responsive Layout Across Viewports

**User Story:** As a visitor using a phone, tablet, or desktop, I want the page to look intentional and remain usable at any size, so that the experience matches the premium brand promise.

#### Acceptance Criteria

1. WHEN the Landing_Page is rendered at any viewport width from 320 to 1920 CSS pixels inclusive, THE Landing_Page SHALL produce no horizontal scrollbar on the document root.
2. WHEN the Landing_Page is rendered at a Mobile_Viewport, THE Navbar SHALL collapse the primary menu into a single visible mobile menu trigger control with a hit area of at least 44 by 44 CSS pixels.
3. WHEN the Landing_Page is rendered at a Tablet_Viewport or Desktop_Viewport, THE Navbar SHALL display the primary menu items in a single horizontal row visible without user interaction, AND THE mobile menu trigger SHALL be hidden.
4. WHEN the Landing_Page is rendered at a Mobile_Viewport, THE Section_Components SHALL render content in a single column.
5. THE Section_Components SHALL apply layout transitions across viewports using Tailwind responsive utilities.
6. WHEN the Landing_Page is rendered at a Tablet_Viewport or Desktop_Viewport, THE Section_Components that contain three or more discrete content items SHALL render those items in at least two columns.
7. WHEN a user activates the Navbar mobile menu trigger on a Mobile_Viewport, THE Navbar SHALL toggle the mobile menu open or closed within 300 milliseconds.
8. THE Landing_Page SHALL ensure every interactive control exposes a hit target of at least 44 by 44 CSS pixels at every supported viewport width.

### Requirement 6: Accessibility

**User Story:** As a visitor using assistive technology or keyboard navigation, I want the page to be perceivable, operable, and understandable, so that I can use the site without barriers.

#### Acceptance Criteria

1. THE Landing_Page SHALL declare a valid BCP 47 language tag on the `<html>` element's `lang` attribute (`id` for Indonesian or `en` if the published copy is English-only; the value SHALL match the dominant language of the rendered copy).
2. THE Landing_Page SHALL render headings in a non-skipping hierarchy starting from a single `<h1>` in the Hero, with each subsequent Section_Component using `<h2>` for its top-level heading and `<h3>` or deeper for nested headings without skipping levels.
3. THE Navbar SHALL render a "Skip to main content" link as the first focusable element of the Landing_Page that, when activated, moves keyboard focus to the `<main>` landmark, AND THE link SHALL become visible when it receives keyboard focus.
4. THE Section_Components SHALL provide an Accessible_Name for every interactive control and icon-only button, AND every informational image SHALL have non-empty alt text while every purely decorative image SHALL declare `alt=""` or `role="presentation"`.
5. WHEN a focusable element receives keyboard focus, THE Landing_Page SHALL render a visible focus indicator with a contrast ratio of at least 3:1 against its adjacent background.
6. THE Landing_Page SHALL render text content with a contrast ratio of at least 4.5:1 against its background for body text and at least 3:1 for text 18pt or larger or 14pt bold or larger.
7. WHILE the Reduced_Motion_Preference is set, THE Landing_Page SHALL render entrance animations, scroll-linked motion, and hover/focus transitions as immediate state changes (zero animation duration), with the exception of essential motion such as focus indicators and form validation feedback.
8. THE Landing_Page SHALL be fully operable using keyboard alone with no keyboard traps, AND focus order SHALL follow the visual reading order of each Section_Component.

### Requirement 7: Motion and Interaction Restraint

**User Story:** As a visitor who values polish, I want motion to feel intentional and subtle, so that the page feels premium rather than gimmicky.

#### Acceptance Criteria

1. THE Section_Components SHALL limit motion effects to fade, slide, scale, and stagger transitions implemented with Framer Motion.
2. THE Section_Components SHALL NOT render parallax backgrounds, autoplaying carousels with per-slide dwell time of 6 seconds or less, full-screen scroll-jacking, or animated floating blob backgrounds.
3. WHEN a Section_Component crosses the threshold of 25% visibility in the viewport, THE entering animation for that section SHALL complete within 600 milliseconds.
4. WHILE the Reduced_Motion_Preference is set, THE Section_Components SHALL render content in its final visual state with zero entrance animation duration.
5. WHEN a user hovers or focuses an interactive control, THE associated micro-interaction transition (color, scale, or translate) SHALL complete within 250 milliseconds.

### Requirement 8: SEO and Metadata

**User Story:** As a marketer, I want the landing page to surface correctly in search results and social shares, so that organic and shared traffic land on a well-presented page.

#### Acceptance Criteria

1. THE Landing_Page SHALL export Next.js metadata defining `title` (10–60 characters, including "Atap Kreatif Management"), `description` (50–160 characters sourced from Source_Doc About Us), `openGraph` (with `title`, `description`, `url`, `siteName`, `locale`, `type`), and `twitter` (with `card` set to `summary_large_image`, `title`, `description`) fields sourced from Brand_Config.
2. THE Landing_Page SHALL render exactly one `<h1>` element.
3. IF Brand_Config defines a site URL, THEN THE Landing_Page SHALL include a `canonical` URL in metadata referencing that site URL.
4. IF Brand_Config does not define a site URL, THEN THE Landing_Page SHALL omit the `canonical` field rather than emit an empty or relative canonical link.
5. THE Landing_Page SHALL render a `<meta name="viewport">` tag with `width=device-width, initial-scale=1`.
6. IF Brand_Config does not define an OpenGraph image, THEN THE Landing_Page SHALL omit the OpenGraph image field rather than reference a missing asset, AND emit a `TODO(brand):` comment requesting the OG image asset.
7. IF Brand_Config does not define a required metadata field (title, description), THEN THE Landing_Page SHALL render a fallback value composed from Brand_Config brand name and tagline rather than render an empty metadata field.

### Requirement 9: Performance Budgets

**User Story:** As a visitor on a typical mobile connection, I want the page to load quickly, so that I do not abandon before seeing the offer.

#### Acceptance Criteria

1. WHEN the Landing_Page is built for production and audited via the Lighthouse_Mobile_Audit, THE audit SHALL produce a Performance score of at least 85.
2. WHEN the Landing_Page is built for production and audited via the Lighthouse_Mobile_Audit, THE audit SHALL produce an Accessibility score of at least 95.
3. WHEN the Landing_Page is built for production and audited via the Lighthouse_Mobile_Audit, THE audit SHALL produce a Best Practices score of at least 90.
4. WHEN the Landing_Page is built for production and audited via the Lighthouse_Mobile_Audit, THE audit SHALL produce an SEO score of at least 95.
5. THE Landing_Page SHALL serve raster images (JPEG, PNG, WebP, AVIF) through `next/image` with explicit width and height attributes such that cumulative layout shift contributed by images is 0.
6. THE Landing_Page SHALL declare `font-display: swap` or use `next/font` for all custom web fonts such that no text is rendered invisible for more than 3 seconds during font loading.
7. WHEN the Landing_Page is audited via the Lighthouse_Mobile_Audit, THE audit SHALL report Largest Contentful Paint of 2.5 seconds or less, Cumulative Layout Shift of 0.1 or less, and Total Blocking Time of 200 milliseconds or less.
8. IF any Lighthouse_Mobile_Audit threshold defined in criteria 1–4 or 7 is not met, THEN THE production build verification step SHALL fail with an error that names the failing metric and its measured value.

### Requirement 10: Content Fallback for Missing Brand Assets

**User Story:** As a developer building the page before all brand assets arrive, I want the page to render meaningfully with placeholders rather than break or fabricate content, so that I can hand off a working page that flags exactly what content is still needed.

#### Acceptance Criteria

1. IF Brand_Config does not provide a logo asset, THEN THE Navbar and Footer SHALL render the brand name "Atap Kreatif Management" (or `shortName` on Mobile_Viewport) using typography tokens defined in Brand_Config, AND the rendered source SHALL contain a comment beginning with `TODO(brand):` naming the missing logo asset field.
2. IF Brand_Config does not provide testimonial entries, THEN THE Testimonials_Section SHALL render a structural placeholder grid containing 3 to 6 empty card slots whose dimensions and spacing match the populated layout, SHALL NOT render any real person name, company name, or quote text, AND the rendered source SHALL contain a comment beginning with `TODO(brand):` naming the missing testimonials field.
3. IF Brand_Config does not provide showcase entries, THEN THE Showcase_Section SHALL render a structural placeholder grid containing 3 to 6 empty card slots whose dimensions and spacing match the populated layout, AND the rendered source SHALL contain a comment beginning with `TODO(brand):` naming the missing showcase field. The Source_Doc lists portfolio examples ("justjuice lab", "info loker madiun", "omah turu joglo") and a Canva portfolio link as acceptable real entries when assets are provided.
4. IF Brand_Config omits a required value, label, or attribution field for any Section_Component, THEN THE Section_Component SHALL NOT render any value, label, or attribution string for the omitted field AND the rendered source SHALL contain a comment beginning with `TODO(brand):` naming the omitted field.
5. THE source code SHALL emit every TODO_Marker with the exact case-sensitive prefix `TODO(brand):` such that a single project-wide case-sensitive search for that prefix returns one match per missing brand input with no false positives and no omissions.
6. IF the Mega KOL count in `kolDatabase` is the literal string "menyusul" (Indonesian for "to follow"), THEN the Trust_Section SHALL render the tier label without a numeric value and SHALL NOT render a fabricated count.

### Requirement 11: Visual System Consistency

**User Story:** As a visitor, I want the page to feel like a coherent designed product rather than a stitched-together template, so that I trust the brand.

#### Acceptance Criteria

1. THE Landing_Page SHALL load exactly two primary typeface families: Poppins (display) and Helvetica (body), where weight and style variants of the same family count as one family.
2. THE Section_Components SHALL apply Poppins to all heading elements (`<h1>`–`<h6>`) and Helvetica to body copy, paragraphs, captions, and button labels.
3. THE Section_Components SHALL apply spacing for margin, padding, and gap exclusively using Tailwind theme spacing scale tokens.
4. THE Section_Components SHALL apply rounded corners using a maximum of three distinct radius tokens defined in the Tailwind theme.
5. THE Section_Components SHALL render iconography using Lucide icons or custom inline SVG.
6. THE Section_Components SHALL NOT render Unicode emoji as decorative or content iconography anywhere on the Landing_Page.
7. THE Section_Components SHALL apply brand color tokens defined in Brand_Config.colors via Tailwind theme classes.
8. IF any color value is required outside the brand tokens, THEN the Section_Components SHALL NOT introduce ad-hoc hex, rgb, hsl, or named color literals inside component files.

### Requirement 12: Component File Structure

**User Story:** As a developer extending the page, I want a predictable component file layout, so that I can locate and modify each section quickly.

#### Acceptance Criteria

1. THE codebase SHALL define each Section_Component in a separate file under `components/` such that each file contains exactly one Section_Component exported as the file's default export, and the filename matches the component name exactly (case-sensitive) with a `.tsx` extension, using these exact filenames: `Navbar.tsx`, `Hero.tsx`, `Problem.tsx`, `Solution.tsx`, `Services.tsx`, `Process.tsx`, `Showcase.tsx`, `Testimonials.tsx`, `CTA.tsx`, `Footer.tsx`.
2. THE codebase SHALL define Brand_Config as a named export at exactly `lib/brand.ts` (case-sensitive path), with no alternative location accepted.
3. WHERE a Section_Component accepts props, THE Section_Component SHALL declare its props via a TypeScript interface or type alias in the same `.tsx` module, with no prop typed as `any` and no implicit `any` permitted.
4. THE Next.js App Router page entry at `app/page.tsx` SHALL import and render all ten Section_Components in the following top-to-bottom order with no other Section_Components inserted between them: Navbar, Hero, Problem, Solution, Services, Process, Showcase, Testimonials, CTA, Footer.

### Requirement 13: Build and Runtime Health

**User Story:** As a developer shipping the page, I want the project to build cleanly and run without errors, so that I can deploy with confidence.

#### Acceptance Criteria

1. WHEN the project is built with `next build`, THE build SHALL complete with zero TypeScript errors and a success exit status, AND THE source SHALL NOT contain `@ts-ignore` or `@ts-nocheck` directives.
2. WHEN the project is built with `next build`, THE build SHALL complete with zero ESLint messages at error severity and a success exit status.
3. WHEN the Landing_Page is served via `next start` from the production build and loaded in current evergreen Chrome and Firefox, THE browser console SHALL report zero error-level messages and zero React hydration warnings during initial render and the following 5 seconds.
4. IF an image asset referenced by Brand_Config fails to load (HTTP 4xx, HTTP 5xx, network failure, or missing resource), THEN THE consuming Section_Component SHALL render its structural placeholder per Requirement 10 within 1 second of the load failure, SHALL NOT render the browser's default broken-image indicator, AND SHALL NOT shift the position of surrounding content.

### Requirement 14: Trust and Social Proof Presentation

**User Story:** As a visitor evaluating Atap Kreatif Management, I want to see credible proof points, so that I can trust the brand before converting.

#### Acceptance Criteria

1. THE Trust_Section SHALL render the distribution database as 6 numeric stats sourced from Brand_Config.distributionDatabase: TikTok 650, Instagram 650, Facebook 400, Twitter/X 350, Threads 500, YouTube 250 accounts.
2. THE Trust_Section SHALL render the KOL database tiers as a separate group of 4 to 5 numeric stats sourced from Brand_Config.kolDatabase: NonFoll 1500, Nano KOL 550, Micro KOL 100, Macro KOL 70, and Mega KOL ("menyusul" rendered without a number per Requirement 10.6).
3. THE Testimonials_Section SHALL render testimonial entries where each entry includes a quote (1–280 characters), an attribution name (1–60 characters), and an attribution role or company (1–80 characters), when these fields are provided by Brand_Config.
4. IF Brand_Config provides fewer testimonial entries than the layout's slot count, THEN THE Testimonials_Section SHALL render only the provided entries without padding the grid with fabricated content.
5. IF a Brand_Config testimonial entry omits the quote, attribution name, or attribution role/company field, THEN THE Testimonials_Section SHALL omit that entry from rendering rather than render a partially populated card.
6. THE Trust_Section and THE Testimonials_Section SHALL apply the brand color tokens and typeface families declared in Brand_Config, identical to the tokens applied by other Section_Components.
7. THE Trust_Section and THE Testimonials_Section SHALL NOT render fabricated client names, awards, ratings, or stats that are not present in Source_Doc or Brand_Config.

### Requirement 15: Footer Completeness

**User Story:** As a visitor reaching the bottom of the page, I want to find contact, legal, and social information in a predictable place, so that I can follow up through any preferred channel.

#### Acceptance Criteria

1. THE Footer SHALL render the brand mark or brand name, a short description (1–280 characters sourced from Source_Doc About Us), contact information, social links, and a copyright line.
2. THE Footer SHALL source contact information and social links exclusively from Brand_Config and SHALL render: email `atapkreatifmanagement@gmail.com`, WhatsApp `0812-5892-2216`, and office address "Jl. Cokrokusumo No. 2a, Kelurahan Kuncen, Kecamatan Taman, Kota Madiun, Jawa Timur".
3. IF Brand_Config defines an email contact, THEN THE Footer SHALL render the email as a `mailto:` link with an Accessible_Name.
4. WHERE Brand_Config defines a WhatsApp number, THE Footer SHALL render the WhatsApp number as a `https://wa.me/` link with an Accessible_Name.
5. IF Brand_Config defines a current year override of exactly four numeric digits, THEN THE Footer SHALL render that year in the copyright line.
6. WHEN Brand_Config does not define a current year override, THE Footer SHALL render the current calendar year derived at render time in the copyright line.
7. IF Brand_Config provides zero social links, THEN THE Footer SHALL omit the social link group rather than render empty icon buttons.
8. WHEN Brand_Config provides one or more social links, THE Footer SHALL render the social link group with each link exposing an Accessible_Name identifying the platform, AND the group SHALL remain rendered even if a social platform icon fails to load.

### Requirement 16: Source Document Content Mapping

**User Story:** As a content reviewer comparing the published page to the Source_Doc, I want each section's copy to be traceable to a specific section of the source document, so that I can verify nothing is fabricated and nothing is missed.

#### Acceptance Criteria

1. THE Hero SHALL source its headline and supporting paragraph from the Source_Doc "About Us" section and SHALL paraphrase or quote that copy without introducing claims, statistics, awards, or company names not present in Source_Doc.
2. THE Problem_Section SHALL source its pain-point framing from the Source_Doc framing of fragmented digital execution (need for organic conversation, distribution, KOL access, and creative production in one place) and SHALL NOT introduce fabricated competitor comparisons or client anecdotes.
3. THE Solution_Section SHALL describe the Atap Kreatif Management integrated digital ecosystem combining Buzzer, Clipper, Talent Management, Digital Advertising, Development, and Creative Production, sourced from Source_Doc "About Us" and "Why Clients Should Choose Us".
4. THE Services_Section SHALL render exactly six service entries with the following titles and order: "Buzzer Distribution", "Content Clipping", "Talent Management", "Digital Advertising", "Development", "Creative Production".
5. EACH Services_Section entry SHALL render a summary description of 80–280 characters and a sub-list of 3–8 deliverable bullets, all sourced from the corresponding Source_Doc service block.
6. THE Why_Choose_Us_Section SHALL render 3–5 differentiator points sourced from the Source_Doc "Why Clients Should Choose Us" sections, including "integrated digital ecosystem", "community-based activation", "adaptive campaign strategies", and "measurable workflows".
7. THE Process_Section SHALL render exactly four steps in this order with titles drawn from Source_Doc "Our Workflow": (1) Initial — negotiating KPIs and requirements, (2) Preparation — preparing client and internal needs, (3) Execution — delivering on client requirements, (4) Reporting — reporting results to the client.
8. THE CTA_Section SHALL render the primary closing message grounded in Source_Doc "Reach us out" copy and SHALL surface both the WhatsApp Primary_CTA and the email Secondary_CTA.
9. THE Section_Components SHALL NOT render content that does not have a traceable source in Source_Doc or Brand_Config; any decorative copy that is not directly from Source_Doc SHALL be limited to neutral connective text (transitions, section labels) and SHALL NOT include claims, numbers, names, or testimonials.

### Requirement 17: Internationalization and Language Consistency

**User Story:** As a visitor reading the page, I want the language to be consistent so that the message feels intentional rather than translated or mixed by accident.

#### Acceptance Criteria

1. THE Landing_Page SHALL render all primary copy in a single dominant language consistent with Brand_Config.locale (Indonesian or English).
2. WHERE the Source_Doc provides copy in English, THE Landing_Page SHALL retain that English copy unless Brand_Config.locale is explicitly set to `id-ID`, in which case Brand_Config SHALL provide translated equivalents.
3. THE Landing_Page SHALL render Indonesian-specific terms preserved from Source_Doc (e.g., "menyusul", office address fields) without forced translation, and SHALL render proper nouns ("Atap Kreatif Management", "Jalu Pamenang", "Madiun") unchanged regardless of locale.
4. THE `<html lang>` attribute defined in Requirement 6.1 SHALL match Brand_Config.locale's primary language subtag.


### Requirement 18: Brand Identity Fidelity to Official Brand Guidelines

**User Story:** As a brand owner, I want the landing page to render exactly the colors, fonts, logo, and visual treatment defined in the official Atap Kreatif Manajemen Brand Guidelines, so that the website is consistent with all other brand touchpoints.

#### Acceptance Criteria

1. THE Brand_Config.colors SHALL declare the following exact hex values sourced from the Brand_Guidelines color palette:
   - `primary` = `#1F2C43` (Pantone 19-4111 TCX, "Pageant Blue")
   - `accent` = `#7E8772` (Pantone 17-0112 TSX, "Matte Green")
   - `background` = `#DCD7D4` (Pantone Cool Gray 1 C, "Catacomb Walls")
   - `foreground` = `#1F2C43` (primary on background, used for body text)
   - `muted` = a tint of `background` derived via Tailwind opacity utilities, with no new hex literal introduced.
2. THE Tailwind CSS theme SHALL expose the Brand_Config.colors values as theme tokens named exactly `primary`, `accent`, `background`, `foreground`, and `muted` such that classes such as `bg-background`, `text-primary`, and `bg-accent` resolve to the values above.
3. THE Landing_Page SHALL load Poppins via `next/font/google` with weights at minimum 400, 600, 700, and italic styles, AND SHALL load Helvetica with a fallback stack `Helvetica, "Helvetica Neue", Arial, system-ui, sans-serif` declared via `next/font/local` if a Helvetica font file is provided in `public/fonts/` or via the CSS fallback stack otherwise.
4. WHERE a Helvetica font file is not available in the project, THE Landing_Page SHALL render body copy using the CSS fallback stack defined in criterion 3 without emitting a `TODO(brand):` marker, since the fallback is an explicit Brand_Guidelines-aligned default.
5. THE Navbar SHALL render the Atap Kreatif logo as the wordmark+symbol lockup defined in the Brand_Guidelines "Logo Variations" section, using the navy-blue (`primary`) variation against the `background` token, AND THE logo asset SHALL be served from `public/brand/logo.svg` referenced via Brand_Config.
6. WHERE Brand_Config does not yet provide the SVG logo file, THE Navbar and Footer SHALL render the wordmark text "ATAP KREATIF" set in Poppins Bold using the `primary` color token as a typographic logo fallback, AND THE source SHALL emit a `TODO(brand):` marker requesting the SVG logo asset.
7. THE Landing_Page SHALL apply the `background` color (`#DCD7D4`) as the default page background and SHALL apply the `primary` color (`#1F2C43`) as the default body text color, ensuring a measured contrast ratio of at least 9:1 between body text and page background.
8. THE Hero, Trust_Section, Solution_Section, and CTA_Section SHALL use only the three brand colors plus their derived tints/shades (achieved via Tailwind opacity utilities such as `/10`, `/20`, `/40`, `/80`) and SHALL NOT introduce additional hue families.
9. THE Showcase_Section and Testimonials_Section SHALL preserve the editorial photography mood defined in the Brand_Guidelines "Visual Style — Photography & Graphics" page by rendering imagery with full-bleed or large-format treatment, generous negative space, and Poppins display typography overlays where text overlays imagery.
10. THE Hero brand visual SHALL adopt the editorial direction shown in the Brand_Guidelines "Visual Style" pages: large display typography (Poppins Bold) set against the `background` token, with optional photographic accent rendered with `next/image`. Decorative geometric shapes inspired by the logo's triangular "A" form are permitted; animated floating blob backgrounds remain prohibited per Requirement 7.2.
11. THE Tailwind theme SHALL define the radius scale such that the largest radius token does not exceed `1rem` (16px), preserving the angular, editorial feel established by the Brand_Guidelines logo geometry.
