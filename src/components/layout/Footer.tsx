import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Category } from "@/types/sanity";

interface FooterProps {
  categories: Category[];
}

export function Footer({ categories }: FooterProps) {
  return (
    <footer id="footer-contact" className="border-t border-neutral-800 bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <p className="text-xl font-bold tracking-[0.18em] text-white uppercase">
              Sterling
            </p>
            <p className="mt-1 text-xs font-medium tracking-[0.14em] text-amber-500 uppercase">
              Technology from Veduggio, Italy
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              Precision-engineered modular kitchen, wardrobe, and architectural
              hardware built on 50 years of collective industry experience,
              European quality standards, and SGS-certified durability.
            </p>
          </div>

          {/* Categories Column */}
          <div className="lg:col-span-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Product Categories
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-neutral-400 transition hover:text-white"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Reach Us
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  Sterling Home Innovator Pvt. Ltd.
                  <br />
                  D-88, Sector-16, HSIIDC Bahadurgarh,
                  <br />
                  Haryana – 124507
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                <div className="flex flex-col">
                  <a href="tel:+918059843498" className="hover:text-white">
                    +91 80598 43498
                  </a>
                  <a href="tel:+918570066253" className="hover:text-white">
                    +91 85700 66253
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                <a
                  href="mailto:sterlingwp01@gmail.com"
                  className="hover:text-white"
                >
                  sterlingwp01@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Sterling Home Innovator Pvt. Ltd. All
            rights reserved.
          </p>
          <p>Innovation · Elegance · Quality</p>
        </div>
      </div>
    </footer>
  );
}