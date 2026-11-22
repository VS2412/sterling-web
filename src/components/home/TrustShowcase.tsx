"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Compass, ShieldCheck } from "lucide-react";

interface TrustShowcaseProps {
  images: (string | null)[];
}

const TRUST_CARDS = [
  {
    eyebrow: "European Standards · SGS Certified",
    title: "Engineered for a Lifetime of Daily Motion",
    description:
      "Backed by 50 years of collective manufacturing experience, every Sterling system is stress-tested for silent soft-closing, rust resistance, and heavy load stability—supported by our Lifetime Performance Warranty.",
    cta: "Explore Hardware Specs",
    href: "/products",
    icon: ShieldCheck,
    stat: "50+ Yrs Expertise",
  },
  {
    eyebrow: "Zero-Cost Planning · Customer First",
    title: "Free Modular Kitchen & Wardrobe Design Service",
    description:
      "Planning a new kitchen or wardrobe? Sterling’s in-house designers deliver a tailored layout and complete Bill of Quantity (BOQ) suited to your space and budget—at zero cost.",
    cta: "Talk to Our Designers",
    href: "#footer-contact",
    icon: Compass,
    stat: "₹0 Design & BOQ",
  },
];

export function TrustShowcase({ images }: TrustShowcaseProps) {
  return (
    <section
      id="trust-highlights"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-7">
        {TRUST_CARDS.map((card, idx) => {
          const Icon = card.icon;
          const imgUrl = images[idx] || null;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-6 text-white shadow-sm sm:min-h-[400px] sm:p-8"
            >
              {/* Background Image */}
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-55 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-65"
                />
              ) : (
                <div
                  className={`absolute inset-0 ${
                    idx === 0
                      ? "bg-gradient-to-br from-neutral-800 via-neutral-900 to-amber-950/60"
                      : "bg-gradient-to-br from-stone-800 via-neutral-900 to-neutral-950"
                  }`}
                />
              )}

              {/* Gradient Scrim */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/20" />

              {/* Top Corner Badge */}
              <div className="relative z-10 mb-auto flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                  <Icon className="h-5 w-5 text-amber-400" />
                </span>
                <span className="rounded-full border border-white/15 bg-neutral-950/60 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                  {card.stat}
                </span>
              </div>

              {/* Card Copy */}
              <div className="relative z-10 mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400">
                  {card.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
                  {card.title}
                </h2>
                <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-neutral-300">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition group-hover:text-amber-400"
                >
                  {card.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}