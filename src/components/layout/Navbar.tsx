"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import type { Category } from "@/types/sanity";

interface NavbarProps {
  categories: Category[];
}

export function Navbar({ categories }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex flex-col leading-none"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-xl font-bold tracking-[0.18em] text-neutral-950 uppercase">
            Sterling
          </span>
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-amber-700 uppercase">
            Kitchen · Wardrobe · Hardware
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            Home
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 py-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
            >
              Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-1/2 top-full w-[540px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setDropdownOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-neutral-700 transition hover:bg-stone-100 hover:text-neutral-950"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/products"
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            All Products
          </Link>

          <a
            href="#footer-contact"
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            Contact
          </a>
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+918059843498"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-neutral-800"
          >
            <Phone className="h-3.5 w-3.5" />
            80598 43498
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-neutral-900"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-neutral-900"
            >
              All Products
            </Link>

            <div className="border-t border-neutral-100 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Categories
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md py-1 text-sm text-neutral-600 hover:text-neutral-950"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>

            <a
              href="tel:+918059843498"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" />
              Call Customer Care
            </a>
          </div>
        </div>
      )}
    </header>
  );
}