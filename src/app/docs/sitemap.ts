import { getAllSlugs } from "@/lib/docs";
import { MetadataRoute } from "next";
const BASE_URL = process.env.PRODUCT_DOMAIN;

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 1 }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();

  return slugs.map(slug => {
    return {
      url: `${BASE_URL}/docs/${slug.replace("&", "&amp;")}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    };
  });
}
