export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
