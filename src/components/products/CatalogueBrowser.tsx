"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Category, ProductCardItem } from "@/types/sanity";

interface CatalogueBrowserProps {
  products: ProductCardItem[];
  categories: Category[];
}

export function CatalogueBrowser({
  products,
  categories,
}: CatalogueBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.slug === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        product.title.toLowerCase().includes(query) ||
        product.shortDescription?.toLowerCase().includes(query) ||
        product.category?.title.toLowerCase().includes(query)
      );
    });
  }, [products, search, selectedCategory]);

  const hasFilters = search.trim().length > 0 || selectedCategory !== "all";

  return (
    <div>
      {/* Search Bar & Count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tandem box, pantry, basket, hinge..."
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-xs font-medium text-neutral-500 sm:text-sm">
          Showing{" "}
          <span className="font-semibold text-neutral-900">
            {filteredProducts.length}
          </span>{" "}
          of {products.length} products
        </p>
      </div>

      {/* Mobile-First Category Filter Strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
            selectedCategory === "all"
              ? "bg-neutral-950 text-white"
              : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                isSelected
                  ? "bg-neutral-950 text-white"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
          <p className="text-base font-semibold text-neutral-900">
            No matching products found
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Try a different keyword or reset your category filter.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full bg-neutral-950 px-5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} showCategory />
          ))}
        </div>
      )}
    </div>
  );
}