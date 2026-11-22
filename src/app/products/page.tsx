import type { Metadata } from "next";
import Link from "next/link";
import { CatalogueBrowser } from "@/components/products/CatalogueBrowser";
import { sanityFetch } from "@/lib/sanity/client";
import {
  ALL_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
} from "@/lib/sanity/queries";
import type { Category, ProductCardItem } from "@/types/sanity";

export const metadata: Metadata = {
  title: "All Modular Kitchen & Wardrobe Hardware",
  description:
    "Browse the complete Sterling hardware catalogue—slim tandem boxes, PVD baskets, tall pantry units, corner carousels, soft-close hinges, and wardrobe organisers.",
  alternates: {
    canonical: "/products",
  },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    sanityFetch<ProductCardItem[]>({
      query: ALL_PRODUCTS_QUERY,
      tags: ["product"],
    }),
    sanityFetch<Category[]>({
      query: ALL_CATEGORIES_QUERY,
      tags: ["category"],
    }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 border-b border-neutral-200 pb-6">
        <nav className="text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">All Products</span>
        </nav>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Complete Hardware Range
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
          Modular Kitchen & Wardrobe Catalogue
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Explore Sterling’s complete collection of soft-close drawer systems,
          storage baskets, tall pantries, and cabinet fittings engineered to
          European quality standards.
        </p>
      </header>

      <CatalogueBrowser products={products} categories={categories} />
    </main>
  );
}