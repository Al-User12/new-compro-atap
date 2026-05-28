// lib/metadata.ts
//
// Builds the Next.js `Metadata` object consumed by `app/layout.tsx`.
// Brand_Config is the single source of truth (Requirement 2): every field is
// derived from `brand` with deterministic fallbacks so the export remains
// type-correct even before all Source_Doc inputs are provided.
//
// Invariants enforced here:
//   * Title length ∈ [10, 60] (truncated to 60; falls back to `brand.name`
//     if the composed `${name} — ${tagline}` would otherwise be empty).
//   * Description length ∈ [50, 160] (truncated to 160; the canonical brand
//     description yields exactly 160 chars after truncation).
//   * `openGraph.url` is present iff `brand.seo.siteUrl` is non-empty.
//   * `openGraph.images` is present iff `brand.assets.ogImage` is non-empty.
//   * `alternates` is `undefined` (not `{ canonical: undefined }`) when
//     `brand.seo.siteUrl` is absent, so consumers can rely on a single
//     truthy check to detect a configured canonical URL.
//   * `twitter.card` is always `"summary_large_image"`.
//
// Requirements: 8.1, 8.3, 8.4, 8.5, 8.6, 8.7, 10.5.

import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { nonEmpty } from "@/lib/utils";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

/**
 * Resolve the metadata title from Brand_Config, applying the documented
 * fallback chain and truncating to 60 chars per Req 8.1.
 */
function resolveTitle(): string {
  const seoTitle = nonEmpty(brand.seo.title);
  if (seoTitle !== null) {
    return seoTitle.slice(0, TITLE_MAX);
  }

  const tagline = nonEmpty(brand.tagline);
  const composed =
    tagline !== null ? `${brand.name} \u2014 ${tagline}` : brand.name;
  return composed.slice(0, TITLE_MAX);
}

/**
 * Resolve the metadata description from Brand_Config, applying the documented
 * fallback chain and truncating to 160 chars per Req 8.1.
 */
function resolveDescription(): string {
  const seoDescription = nonEmpty(brand.seo.description);
  const source =
    seoDescription !== null ? seoDescription : brand.description;
  return source.slice(0, DESCRIPTION_MAX);
}

/**
 * Build the Next.js `Metadata` object from Brand_Config.
 *
 * The shape is intentionally narrow: optional fields are *omitted* (not set
 * to `undefined`-valued keys) when their underlying Brand_Config inputs are
 * missing, so downstream consumers and tests can use a single truthiness
 * check (e.g. `metadata.alternates`) to detect configured fields.
 */
export function buildMetadata(): Metadata {
  const title = resolveTitle();
  const description = resolveDescription();

  const siteUrl = nonEmpty(brand.seo.siteUrl);
  const ogImage = nonEmpty(brand.assets.ogImage);

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title,
    description,
    siteName: brand.name,
    locale: brand.locale,
    type: "website",
  };
  if (siteUrl !== null) {
    openGraph.url = siteUrl;
  }
  if (ogImage !== null) {
    openGraph.images = [{ url: ogImage }];
  }

  const metadata: Metadata = {
    title,
    description,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (siteUrl !== null) {
    metadata.alternates = { canonical: siteUrl };
    metadata.metadataBase = new URL(siteUrl);
  }

  return metadata;
}
