import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { sanityFetch } from "@/lib/sanity/client";
import {
  ALL_CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { Category, ProductCardItem } from "@/types/sanity";

type CategoryWithProducts = Category & {
  products: ProductCardItem[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await sanityFetch<{ slug: string }[]>({
    query: CATEGORY_SLUGS_QUERY,
    tags: ["category"],
  });
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityFetch<CategoryWithProducts | null>({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
    tags: ["category", `category:${slug}`],
  });

  if (!category) return { title: "Category Not Found" };

  return buildPageMetadata({
    seoData: category.seoData,
    fallbackTitle: `${category.title} for Modular Kitchens & Wardrobes`,
    fallbackDescription:
      category.description ||
      `Explore ${category.title} hardware solutions from Sterling.`,
    path: `/categories/${category.slug}`,
    image: category.coverImage,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [category, allCategories] = await Promise.all([
    sanityFetch<CategoryWithProducts | null>({
      query: CATEGORY_BY_SLUG_QUERY,
      params: { slug },
      tags: ["category", `category:${slug}`, "product"],
    }),
    sanityFetch<Category[]>({
      query: ALL_CATEGORIES_QUERY,
      tags: ["category"],
    }),
  ]);

  if (!category) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.seoData?.metaDescription || category.description,
    url: `${SITE_URL}/categories/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: category.products.map((prod, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/products/${prod.slug}`,
        name: prod.title,
      })),
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Category Header */}
      <header className="border-b border-neutral-200 pb-6">
        <nav className="text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-neutral-900">
            Catalogue
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{category.title}</span>
        </nav>

        <div className="mt-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              {category.title}
            </h1>
            {category.description && (
              <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                {category.description}
              </p>
            )}
          </div>
          <span className="shrink-0 text-xs font-semibold text-neutral-500">
            {category.products.length} product
            {category.products.length === 1 ? "" : "s"}
          </span>
        </div>
      </header>

      {/* Quick Category Switcher (Mobile Swipeable) */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {allCategories.map((cat) => {
          const isCurrent = cat.slug === category.slug;
          return (
            <Link
              key={cat._id}
              href={`/categories/${cat.slug}`}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isCurrent
                  ? "bg-neutral-950 text-white"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
              }`}
            >
              {cat.title}
            </Link>
          );
        })}
      </div>

      {/* Product Grid */}
      {category.products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
          <p className="text-base font-semibold text-neutral-900">
            Products coming soon
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            We are currently updating the catalogue items for {category.title}.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-full bg-neutral-950 px-5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showCategory={false}
            />
          ))}
        </div>
      )}
    </main>
  );
}