import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { sanityFetch } from "@/lib/sanity/client";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Category } from "@/types/sanity";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Sterling",
  },
  description:
    "Modular kitchen and wardrobe hardware engineered with Italian technology—slim tandem boxes, tall pantry units, PVD baskets, soft-close hinges, and closet organisers.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await sanityFetch<Category[]>({
    query: ALL_CATEGORIES_QUERY,
    tags: ["category"],
  });

  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-stone-50 font-sans text-neutral-900 antialiased">
        <Navbar categories={categories} />
        <div className="flex-1">{children}</div>
        <Footer categories={categories} />
      </body>
    </html>
  );
}