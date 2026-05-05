import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/(auth)/",
          "/login",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://helpdeskxpert.com/sitemap.xml",
  };
}
