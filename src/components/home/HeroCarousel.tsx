"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Handshake,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

interface HeroCarouselProps {
  slideImages: (string | null)[];
}

const SLIDES = [
  {
    id: "company",
    badge: "Technology from Veduggio, Italy",
    title: "Architectural Hardware Built for Modern Living",
    subtitle:
      "Innovation, Elegance, Quality. Precision-engineered modular kitchen, wardrobe, and drawer systems crafted with 50 years of collective industry mastery.",
    ctaLabel: "Explore Catalogue",
    ctaHref: "/products",
    secondaryLabel: "Browse Categories",
    secondaryHref: "#trending-categories",
    metrics: [
      { label: "Industry Experience", value: "50+ Years" },
      { label: "Luxury Finishes", value: "PVD & Aluminium" },
      { label: "Load Engineering", value: "Up to 100 kg" },
    ],
    icon: Sparkles,
  },
  {
    id: "trust",
    badge: "Trusted by Architects & Kitchen Makers",
    title: "SGS Certified Quality. Lifetime Performance Warranty.",
    subtitle:
      "Every hinge, tandem box, and tall pantry passes rigorous European and international stress tests—delivering silent soft-close durability trusted in homes across India.",
    ctaLabel: "View Bestsellers",
    ctaHref: "#bestsellers",
    secondaryLabel: "Why Sterling",
    secondaryHref: "#trust-highlights",
    metrics: [
      { label: "Quality Benchmark", value: "SGS Certified" },
      { label: "Peace of Mind", value: "Lifetime Warranty" },
      { label: "Tested Endurance", value: "50,000+ Cycles" },
    ],
    icon: ShieldCheck,
    reviewQuote:
      "“Consistent finish quality across PVD baskets and slim tandems—our go-to hardware partner for turnkey modular kitchens.”",
    reviewAuthor: "Verified Modular Kitchen Partner · Delhi NCR",
  },
  {
    id: "dealership",
    badge: "All-India Distribution Network",
    title: "Partner With Sterling. Grow Your Hardware Business.",
    subtitle:
      "Join India’s fastest-growing architectural hardware network with our widest palette of luxury finishes, competitive factory pricing, and dedicated design support.",
    ctaLabel: "Become a Dealer",
    ctaHref: "#footer-contact",
    secondaryLabel: "Inspect Product Range",
    secondaryHref: "/products",
    metrics: [
      { label: "Network Reach", value: "Pan-India Supply" },
      { label: "Support", value: "Free Design & BOQ" },
      { label: "Product Depth", value: "13 Full Categories" },
    ],
    icon: Handshake,
  },
];

const AUTOPLAY_MS = 6500;

export function HeroCarousel({ slideImages }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (index: number) => {
    const nextIndex = (index + SLIDES.length) % SLIDES.length;
    setDirection(nextIndex > active ? 1 : -1);
    setActive(nextIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [active]);

  const current = SLIDES[active];
  const Icon = current.icon;
  const bgImage = slideImages[active] || null;

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Subtle Architectural Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Background Image with Smooth Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current.id}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.28, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0"
        >
          {bgImage ? (
            <Image
              src={bgImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_75%_25%,rgba(217,119,6,0.35),transparent_55%)]" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dark Readability Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60 lg:bg-gradient-to-r lg:from-neutral-950 lg:via-neutral-950/85 lg:to-neutral-950/40" />

      {/* Main Slide Container */}
      <div className="relative mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-between px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:min-h-[82vh] lg:px-8 lg:pt-20">
        <div className="my-auto py-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) goTo(active + 1);
                if (info.offset.x > 50) goTo(active - 1);
              }}
              className="max-w-3xl cursor-grab active:cursor-grabbing"
            >
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-amber-400">
                <Icon className="h-3.5 w-3.5" />
                <span>{current.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {current.title}
              </h1>

              {/* Subtitle */}
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:mt-5 sm:text-base lg:text-lg">
                {current.subtitle}
              </p>

              {/* Optional Review Callout on Slide 2 */}
              {current.reviewQuote && (
                <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:max-w-xl">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                    <span className="ml-2 text-xs font-medium text-neutral-300">
                      Trusted Across India
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-200 sm:text-sm">
                    {current.reviewQuote}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium text-neutral-400">
                    — {current.reviewAuthor}
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={current.ctaHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
                >
                  {current.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={current.secondaryHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  {current.secondaryLabel}
                </Link>
              </div>

              {/* Slide Metrics Strip */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-10 sm:gap-6">
                {current.metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-sm font-bold text-white sm:text-lg">
                      {metric.value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-neutral-400 sm:text-xs">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Progress Bars & Arrows */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="grid flex-1 grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
            {SLIDES.map((slide, idx) => {
              const isCurrent = idx === active;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${slide.badge}`}
                  className="group text-left"
                >
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                    {isCurrent && (
                      <motion.div
                        key={`bar-${active}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: AUTOPLAY_MS / 1000,
                          ease: "linear",
                        }}
                        className="h-full bg-amber-400"
                      />
                    )}
                    {idx < active && <div className="h-full w-full bg-white/60" />}
                  </div>
                  <span
                    className={`mt-2 hidden text-[11px] font-medium transition sm:block ${
                      isCurrent
                        ? "text-white"
                        : "text-neutral-500 group-hover:text-neutral-300"
                    }`}
                  >
                    0{idx + 1} · {slide.id === "company" ? "Sterling" : slide.id === "trust" ? "Trust & Reviews" : "Dealership"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Trust Micro-Badge */}
      <div className="hidden border-t border-white/10 bg-neutral-900/60 py-2.5 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 text-xs text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-amber-400" /> SGS Certified Products
          </span>
          <span>•</span>
          <span>Lifetime Performance Warranty</span>
          <span>•</span>
          <span>Free Modular Design & BOQ</span>
          <span>•</span>
          <span>All-India Distribution</span>
        </div>
      </div>
    </section>
  );
}