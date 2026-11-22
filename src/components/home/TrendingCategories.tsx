"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type { Category } from "@/types/sanity";

interface TrendingCategoriesProps {
  categories: Category[];
}

export function TrendingCategories({ categories }: TrendingCategoriesProps) {
  const featured = categories.slice(0, 6);
  const remaining = categories.slice(6);
  const [expandedIdx, setExpandedIdx] = useState(0);

  if (!categories.length) return null;

  return (
    <section
      id="trending-categories"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Curated Hardware Systems
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Trending Categories
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-neutral-600 sm:text-sm">
          Explore modular kitchen drawer systems, tall pantries, PVD baskets,
          and wardrobe organisers engineered for effortless everyday motion.
        </p>
      </div>

      {/* MOBILE / TABLET: Thumb-Friendly Horizontal Snap Deck */}
      <div className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:hidden">
        {featured.map((cat, idx) => (
          <Link
            key={cat._id}
            href={`/categories/${cat.slug}`}
            className="group relative flex h-[320px] w-[78vw] max-w-[300px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-5 text-white"
          >
            {cat.coverImage?.asset ? (
              <Image
                src={urlFor(cat.coverImage).width(600).height(700).auto("format").url()}
                alt={cat.title}
                fill
                sizes="300px"
                className="object-cover opacity-65 transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-amber-950/60" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-transparent" />

            <span className="relative z-10 mb-auto text-xs font-semibold tracking-widest text-amber-400">
              0{idx + 1}
            </span>
            <div className="relative z-10">
              <h3 className="text-lg font-bold leading-snug">{cat.title}</h3>
              {cat.description && (
                <p className="mt-1.5 line-clamp-2 text-xs text-neutral-300">
                  {cat.description}
                </p>
              )}
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                Explore Range <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* DESKTOP: Interactive Expanding Architectural Panels */}
      <div className="mt-10 hidden h-[460px] gap-3 lg:flex">
        {featured.map((cat, idx) => {
          const isOpen = expandedIdx === idx;
          return (
            <motion.div
              key={cat._id}
              layout
              onMouseEnter={() => setExpandedIdx(idx)}
              onFocus={() => setExpandedIdx(idx)}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className={`group relative overflow-hidden rounded-2xl bg-neutral-900 text-white ${
                isOpen ? "flex-[3.4]" : "flex-[1]"
              }`}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="relative flex h-full w-full flex-col justify-end p-6"
              >
                {cat.coverImage?.asset ? (
                  <Image
                    src={urlFor(cat.coverImage)
                      .width(900)
                      .height(700)
                      .auto("format")
                      .url()}
                    alt={cat.title}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className={`object-cover transition duration-700 ${
                      isOpen ? "scale-105 opacity-70" : "scale-100 opacity-45"
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-amber-950/70" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />

                {/* Top Number */}
                <span className="relative z-10 mb-auto text-xs font-semibold tracking-widest text-amber-400">
                  0{idx + 1}
                </span>

                {/* Collapsed Vertical Title vs Expanded Content */}
                {isOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 max-w-md"
                  >
                    <h3 className="text-2xl font-bold leading-tight">
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-300">
                        {cat.description}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-950 transition group-hover:bg-amber-400">
                      Explore Category
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </motion.div>
                ) : (
                  <div className="relative z-10">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-200">
                      {cat.title}
                    </h3>
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Remaining Categories Index Strip (All 13 Reachable) */}
      {remaining.length > 0 && (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 sm:mt-10 sm:p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              More Hardware Categories
            </p>
            <Link
              href="/products"
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              Browse All {categories.length} Categories →
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {remaining.map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-stone-50 px-3.5 py-2 text-xs font-medium text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-950 hover:text-white sm:text-sm"
              >
                {cat.title}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}