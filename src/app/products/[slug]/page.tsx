import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import { buildPageMetadata, formatINR } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { ProductDetail } from "@/types/sanity";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await sanityFetch<{ slug: string }[]>({
    query: PRODUCT_SLUGS_QUERY,
    tags: ["product"],
  });
  return products.map((prod) => ({ slug: prod.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await sanityFetch<ProductDetail | null>({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
    tags: ["product", `product:${slug}`],
  });

  if (!product) return { title: "Product Not Found" };

  return buildPageMetadata({
    seoData: product.seoData,
    fallbackTitle: `${product.title} — ${product.category.title}`,
    fallbackDescription:
      product.shortDescription ||
      product.description?.slice(0, 155) ||
      `Explore ${product.title} specs, sizes, finishes, and MRP from Sterling.`,
    path: `/products/${product.slug}`,
    image: product.images?.[0],
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await sanityFetch<ProductDetail | null>({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
    tags: ["product", `product:${slug}`],
  });

  if (!product) notFound();

  const variantPrices = (product.variants || [])
    .map((v) => v.mrp)
    .filter((price): price is number => typeof price === "number" && price > 0);

  const lowPrice = variantPrices.length
    ? Math.min(...variantPrices)
    : product.MRP;
  const highPrice = variantPrices.length
    ? Math.max(...variantPrices)
    : product.MRP;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.shortDescription,
    category: product.category.title,
    brand: { "@type": "Brand", name: "Sterling" },
    url: `${SITE_URL}/products/${product.slug}`,
    image: product.images
      ?.filter((img) => img.asset)
      .map((img) => urlFor(img).width(1200).auto("format").url()),
    ...(lowPrice != null && {
      offers: {
        "@type": variantPrices.length > 1 ? "AggregateOffer" : "Offer",
        priceCurrency: "INR",
        ...(variantPrices.length > 1
          ? { lowPrice, highPrice, offerCount: variantPrices.length }
          : { price: lowPrice }),
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">Home</Link>
        {" / "}
        <Link href={`/categories/${product.category.slug}`} className="hover:underline">
          {product.category.title}
        </Link>
        {" / "}
        <span className="text-neutral-900">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100">
            {product.images?.[0]?.asset ? (
              <Image
                src={urlFor(product.images[0]).width(1000).auto("format").url()}
                alt={product.images[0].alt || product.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                No product image uploaded
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={urlFor(img).width(300).height(300).auto("format").url()}
                    alt={img.alt || `${product.title} view ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            {product.category.title}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.title}</h1>

          {lowPrice != null && (
            <p className="mt-3 text-xl font-semibold">
              {highPrice && highPrice !== lowPrice
                ? `${formatINR(lowPrice)} – ${formatINR(highPrice)}`
                : `MRP ${formatINR(lowPrice)}`}
            </p>
          )}

          {product.description && (
            <p className="mt-4 leading-relaxed text-neutral-700">{product.description}</p>
          )}

          {product.keyFeatures && product.keyFeatures.length > 0 && (
            <div className="mt-6">
              <h2 className="text-base font-semibold">Key Features</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-700">
                {product.keyFeatures.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Variants Specification Table */}
      {product.variants && product.variants.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Available Sizes, Finishes & MRP</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-neutral-50 text-xs uppercase text-neutral-600">
                <tr>
                  <th className="px-4 py-3">SKU / Code</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Dimensions</th>
                  <th className="px-4 py-3">Finish</th>
                  <th className="px-4 py-3">Load Capacity</th>
                  <th className="px-4 py-3 text-right">MRP (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {product.variants.map((variant) => (
                  <tr key={variant._key} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium">{variant.sku || "—"}</td>
                    <td className="px-4 py-3">{variant.size || "—"}</td>
                    <td className="px-4 py-3">{variant.dimensions || "—"}</td>
                    <td className="px-4 py-3">{variant.finish || "—"}</td>
                    <td className="px-4 py-3">
                      {variant.weightCapacity != null ? `${variant.weightCapacity} kg` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {variant.mrp != null ? formatINR(variant.mrp) : "On Request"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}