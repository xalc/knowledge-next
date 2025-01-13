import { getPosts } from "@/lib/blogs/blogs";
import { MetadataRoute } from "next";
const BASE_URL = process.env.PRODUCT_DOMAIN;

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return posts.map(post => {
    return {
      url: `${BASE_URL}/blogs/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    };
  });
}
