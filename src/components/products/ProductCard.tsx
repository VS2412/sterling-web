import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import { formatINR } from "@/lib/seo";
import type { ProductCardItem } from "@/types/sanity";

interface ProductCardProps {
  product: ProductCardItem;
  showCategory?: boolean;
}

export function ProductCard({
  product,
  showCategory = true,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-amber-600/50 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {product.mainImage?.asset ? (
          <Image
            src={urlFor(product.mainImage)
              .width(720)
              .height(540)
              .auto("format")
              .url()}
            alt={product.mainImage.alt || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-xs font-medium text-neutral-400">
            Sterling Hardware
          </div>
        )}

        {showCategory && product.category?.title && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-800 backdrop-blur-sm">
            {product.category.title}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-snug text-neutral-950 transition group-hover:text-amber-700 sm:text-lg">
            {product.title}
          </h2>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-700" />
        </div>

        {product.shortDescription && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3.5 text-xs sm:text-sm">
          <span className="font-bold text-neutral-950">
            {product.MRP != null
              ? `MRP ${formatINR(product.MRP)}`
              : "View Specs & MRP"}
          </span>

          {product.variantCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
              <Layers className="h-3 w-3" />
              {product.variantCount} variant{product.variantCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}