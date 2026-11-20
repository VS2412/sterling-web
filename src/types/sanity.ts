export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  coverImage?: SanityImage;
  description?: string;
  sortOrder?: number;
  seoData?: SeoData;
}

export interface ProductVariant {
  _key: string;
  sku?: string;
  size?: string;
  dimensions?: string;
  finish?: string;
  mrp?: number;
  weightCapacity?: number;
  notes?: string;
}

export interface ProductCardItem {
  _id: string;
  title: string;
  slug: string;
  MRP?: number;
  shortDescription?: string;
  mainImage?: SanityImage;
  variantCount: number;
  category: {
    title: string;
    slug: string;
  };
}

export interface ProductDetail {
  _id: string;
  title: string;
  slug: string;
  MRP?: number;
  shortDescription?: string;
  description?: string;
  keyFeatures?: string[];
  images?: SanityImage[];
  variants?: ProductVariant[];
  cataloguePages?: string;
  category: {
    _id: string;
    title: string;
    slug: string;
  };
  seoData?: SeoData;
}