import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import { buildPageMetadata, formatINR } from "@/lib/seo";
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
  const category = await sanityFetch<CategoryWithProducts | null>({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
    tags: ["category", `category:${slug}`],
  });

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
    <main className="mx-auto max-w-7xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10 border-b pb-6">
        <p className="text-sm text-neutral-500">
          <Link href="/" className="hover:underline">Home</Link> / {category.title}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{category.title}</h1>
        {category.description && (
          <p className="mt-3 max-w-3xl text-neutral-600">{category.description}</p>
        )}
      </header>

      {category.products.length === 0 ? (
        <p className="text-neutral-500">No active products in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="group rounded-xl border p-4 transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100">
                {product.mainImage?.asset ? (
                  <Image
                    src={urlFor(product.mainImage).width(600).height(450).auto("format").url()}
                    alt={product.mainImage.alt || product.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                    No image
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{product.title}</h2>
              {product.shortDescription && (
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {product.shortDescription}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-medium">
                  {product.MRP != null ? `MRP ${formatINR(product.MRP)}` : "View variants"}
                </span>
                {product.variantCount > 0 && (
                  <span className="text-neutral-500">
                    {product.variantCount} variant{product.variantCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}