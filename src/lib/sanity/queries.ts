import { groq } from "next-sanity";

// 1. All categories ordered by sortOrder (for Navbar, Homepage, Filters)
export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    coverImage,
    description,
    sortOrder,
    seoData
  }
`;

// 2. Single category + its active products (for /categories/[slug])
export const CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    coverImage,
    description,
    seoData,
    "products": *[_type == "product" && isActive == true && category._ref == ^._id]
      | order(sortOrder asc, title asc) {
        _id,
        title,
        "slug": slug.current,
        MRP,
        shortDescription,
        "mainImage": images[0],
        "variantCount": count(variants),
        "category": {
          "title": ^.title,
          "slug": ^.slug.current
        }
      }
  }
`;

// 3. All active products (for /products full catalogue page)
export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product" && isActive == true] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    MRP,
    shortDescription,
    "mainImage": images[0],
    "variantCount": count(variants),
    "category": category->{
      title,
      "slug": slug.current
    }
  }
`;

// 4. Single product full details + variants (for /products/[slug])
export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    "slug": slug.current,
    MRP,
    shortDescription,
    description,
    keyFeatures,
    images,
    variants,
    cataloguePages,
    "category": category->{
      _id,
      title,
      "slug": slug.current
    },
    seoData
  }
`;

// 5. Lightweight slug lists (for generateStaticParams & sitemap.ts)
export const CATEGORY_SLUGS_QUERY = groq`
  *[_type == "category" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

export const PRODUCT_SLUGS_QUERY = groq`
  *[_type == "product" && isActive == true && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;