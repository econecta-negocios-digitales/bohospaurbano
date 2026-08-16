import type { APIRoute } from "astro";
import { BOHO_SITE_URL, INDEXABLE_PUBLIC_ROUTES } from "../lib/site";

export const GET: APIRoute = () => {
  const urls = INDEXABLE_PUBLIC_ROUTES
    .map((path) => `    <url><loc>${new URL(path, BOHO_SITE_URL).toString()}</loc></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
