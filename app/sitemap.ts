import type { MetadataRoute } from "next";
import { getDb, type Product } from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE = process.env.SITE_URL || "https://petel-ofer.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/shop",
    "/visit",
    "/events",
    "/contact",
    "/accessibility",
    "/terms",
    "/privacy",
    "/shipping-returns",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));

  const products = getDb()
    .prepare("SELECT slug FROM products WHERE active = 1")
    .all() as Pick<Product, "slug">[];

  return [
    ...staticPages,
    ...products.map((p) => ({ url: `${BASE}/shop/${p.slug}`, lastModified: new Date() })),
  ];
}
