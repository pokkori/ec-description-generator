import { MetadataRoute } from "next";

const KEYWORD_SLUGS = [
  "ec-shohin-setsumei-kakikata",
  "amazon-listing-sakusei",
  "rakuten-shohin-setsumeibun",
  "yahoo-shopping-shohin-kiji",
  "cosmetics-shohin-setsumeibun",
  "food-shohin-setsumeibun",
  "fashion-shohin-copy",
  "seo-shohin-bun-keyword",
  "shopify-shohin-setsumeibun",
  "denshi-commerce-product-copy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = "https://ec-description-generator.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tool`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog/rakuten-description`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/amazon-description`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/ec-description-template`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/legal`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const keywordPages: MetadataRoute.Sitemap = KEYWORD_SLUGS.map((slug) => ({
    url: `${base}/keywords/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...keywordPages];
}
