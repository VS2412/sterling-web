import type { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import {
  CATEGORY_SLUGS_QUERY,
  PRODUCT_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/site";

interface SlugEntry {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    sanityFetch<SlugEntry[]>({
      query: CATEGORY_SLUGS_QUERY,
      revalidate: 3600,
    }),
    sanityFetch<SlugEntry[]>({
      query: PRODUCT_SLUGS_QUERY,
      revalidate: 3600,
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: new Date(cat._updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${SITE_URL}/products/${prod.slug}`,
    lastModified: new Date(prod._updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}