import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustShowcase } from "@/components/home/TrustShowcase";
import { BestsellerTrack } from "@/components/home/BestsellerTrack";
import { TrendingCategories } from "@/components/home/TrendingCategories";
import { sanityFetch } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  ALL_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
} from "@/lib/sanity/queries";
import type { Category, ProductCardItem } from "@/types/sanity";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    sanityFetch<Category[]>({
      query: ALL_CATEGORIES_QUERY,
      tags: ["category"],
    }),
    sanityFetch<ProductCardItem[]>({
      query: ALL_PRODUCTS_QUERY,
      tags: ["product"],
    }),
  ]);

  // Grab real Sanity images (where available) for the 3 Hero slides & 2 Trust cards
  const productImageUrls = products
    .filter((p) => p.mainImage?.asset)
    .map((p) => urlFor(p.mainImage!).width(1400).auto("format").url());

  const categoryImageUrls = categories
    .filter((c) => c.coverImage?.asset)
    .map((c) => urlFor(c.coverImage!).width(1200).auto("format").url());

  const availableVisuals = [...categoryImageUrls, ...productImageUrls];

  const heroSlideImages = [
    availableVisuals[0] || null,
    availableVisuals[1] || null,
    availableVisuals[2] || null,
  ];

  const trustCardImages = [
    availableVisuals[3] || availableVisuals[0] || null,
    availableVisuals[4] || availableVisuals[1] || null,
  ];

  // Take up to 10 active products for the kinetic Bestseller track
  const bestsellers = products.slice(0, 10);

  return (
    <main>
      <HeroCarousel slideImages={heroSlideImages} />
      <TrustShowcase images={trustCardImages} />
      <BestsellerTrack products={bestsellers} />
      <TrendingCategories categories={categories} />
    </main>
  );
}