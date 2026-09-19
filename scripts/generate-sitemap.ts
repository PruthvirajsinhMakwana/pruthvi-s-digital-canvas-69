// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes:
//   public/sitemap.xml            — sitemap index (references the child sitemaps below)
//   public/sitemap-main.xml       — static routes
//   public/sitemap-locations.xml  — programmatic service × city pages
//   public/sitemap-blog.xml       — published blog posts (from Supabase)

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://pruthvirajsinh.in";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/certifications", changefreq: "monthly", priority: "0.8" },
  { path: "/plans", changefreq: "monthly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/links", changefreq: "weekly", priority: "0.7" },
  { path: "/locations", changefreq: "monthly", priority: "0.8" },
  { path: "/freelancer-in-ahmedabad", changefreq: "weekly", priority: "0.9" },
];

// Programmatic SEO: service × city landing pages
const seoServiceSlugs = [
  "web-development",
  "digital-marketing",
  "video-editing",
  "graphic-design",
  "seo-services",
  "social-media-marketing",
  "wordpress-development",
  "esports-hosting",
];
const seoCitySlugs = [
  "ahmedabad", "surat", "rajkot", "vadodara", "gandhinagar", "bhavnagar",
  "jamnagar", "junagadh", "anand", "mehsana", "mumbai", "delhi",
  "bangalore", "pune", "hyderabad", "chennai", "kolkata", "jaipur",
];
const locationEntries: SitemapEntry[] = seoServiceSlugs.flatMap((s) =>
  seoCitySlugs.map((c) => ({
    path: `/services/${s}/in/${c}`,
    changefreq: "monthly" as const,
    priority: "0.7",
  }))
);

async function fetchBlogEntries(): Promise<SitemapEntry[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Supabase env missing — skipping dynamic blog entries");
    return [];
  }
  try {
    const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at&status=eq.published`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      console.warn("Failed to fetch blog posts for sitemap:", res.status);
      return [];
    }
    const rows: { slug: string; updated_at: string | null }[] = await res.json();
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        lastmod: r.updated_at ? r.updated_at.slice(0, 10) : undefined,
        changefreq: "monthly" as const,
        priority: "0.7",
      }));
  } catch (e) {
    console.warn("Sitemap blog fetch error:", e);
    return [];
  }
}

function generateUrlset(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

function generateIndex(children: string[]) {
  const items = children.map((name) =>
    [`  <sitemap>`, `    <loc>${BASE_URL}/${name}</loc>`, `  </sitemap>`].join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...items,
    `</sitemapindex>`,
  ].join("\n");
}

async function main() {
  const blog = await fetchBlogEntries();

  writeFileSync(resolve("public/sitemap-main.xml"), generateUrlset(staticEntries));
  writeFileSync(resolve("public/sitemap-locations.xml"), generateUrlset(locationEntries));
  writeFileSync(resolve("public/sitemap-blog.xml"), generateUrlset(blog));

  writeFileSync(
    resolve("public/sitemap.xml"),
    generateIndex(["sitemap-main.xml", "sitemap-locations.xml", "sitemap-blog.xml"])
  );

  console.log(
    `sitemaps written — main: ${staticEntries.length}, locations: ${locationEntries.length}, blog: ${blog.length}`
  );
}

main();
