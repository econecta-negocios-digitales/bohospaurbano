import type { APIRoute } from "astro";
import { BOHO_SITE_URL } from "../lib/site";

export const GET: APIRoute = () => new Response(
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /preview/\nSitemap: ${new URL("/sitemap.xml", BOHO_SITE_URL).toString()}\n`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);
