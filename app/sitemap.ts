import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://logicorehsv.com";

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/cybersecurity",
    "/engineering",
    "/logistics",
    "/leadership",
    "/programs",
    "/quality",
    "/hbcu",
    "/contact",
    "/cmmc-training",
    "/news",
    "/community",
    "/jobs",
    "/why-logicore",
    "/fedsignal",
    "/privacy",
    "/terms",
    "/accessibility",
  ];

  const staticSitemap: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/cybersecurity") || route.startsWith("/engineering") || route.startsWith("/logistics") ? 0.9 : 0.8,
  }));

  return staticSitemap;
}
