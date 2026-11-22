"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Layers } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type { ProductCardItem } from "@/types/sanity";

interface BestsellerTrackProps {
  products: ProductCardItem[];
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BestsellerTrack({ products }: BestsellerTrackProps) {
  if (!products.length) return null;

  // Duplicate list once for seamless infinite CSS marquee loop
  const loopedProducts = [...products, ...products];

  return (
    <section
      id="bestsellers"
      className="overflow-hidden border-y border-neutral-200/80 bg-white py-14 sm:py-20"
    >
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-end sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Most Specified Hardware
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Bestseller Products
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 transition hover:text-amber-700"
        >
          View Full Catalogue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Kinetic Gliding Track */}
      <div className="relative mt-8 sm:mt-10">
        {/* Soft Left & Right Edge Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-20" />

        <div className="animate-sterling-marquee flex w-max gap-4 px-4 sm:gap-6">
          {loopedProducts.map((product, idx) => (
            <motion.div
              key={`${product._id}-${idx}`}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="w-[260px] shrink-0 sm:w-[310px]"
            >
              <Link
                href={`/products/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-stone-50 transition hover:border-amber-600/50 hover:bg-white hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  {product.mainImage?.asset ? (
                    <Image
                      src={urlFor(product.mainImage)
                        .width(640)
                        .height(480)
                        .auto("format")
                        .url()}
                      alt={product.mainImage.alt || product.title}
                      fill
                      sizes="(max-width: 640px) 260px, 310px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-xs font-medium text-neutral-400">
                      Sterling Hardware
                    </div>
                  )}

                  {product.category?.title && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-800 backdrop-blur-sm">
                      {product.category.title}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="line-clamp-1 text-base font-bold text-neutral-950 transition group-hover:text-amber-700">
                    {product.title}
                  </h3>
                  {product.shortDescription && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                      {product.shortDescription}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-neutral-200/70 pt-3.5 text-xs">
                    <span className="font-bold text-neutral-950">
                      {product.MRP != null
                        ? `MRP ${formatINR(product.MRP)}`
                        : "Check Specs & MRP"}
                    </span>
                    {product.variantCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-neutral-500">
                        <Layers className="h-3.5 w-3.5" />
                        {product.variantCount} sizes
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}