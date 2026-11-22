import type { Metadata } from "next";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage, SeoData } from "@/types/sanity";

interface BuildMetadataParams {
  seoData?: SeoData;
  fallbackTitle: string;
  fallbackDescription: string;
  path: string;
  image?: SanityImage;
}

export function buildPageMetadata({
  seoData,
  fallbackTitle,
  fallbackDescription,
  path,
  image,
}: BuildMetadataParams): Metadata {
  const rawTitle = seoData?.metaTitle?.trim() || fallbackTitle;
  const cleanTitle = rawTitle.replace(/\s*\|\s*Sterling$/i, "");
  const description = seoData?.metaDescription?.trim() || fallbackDescription;

  const ogImageUrl = image?.asset
    ? urlFor(image).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical: path,
    },
    robots: seoData?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${cleanTitle} | Sterling`,
      description,
      url: path,
      type: "website",
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: image?.alt || cleanTitle,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | Sterling`,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}