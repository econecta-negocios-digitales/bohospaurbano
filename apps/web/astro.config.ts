import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { fileURLToPath } from "node:url";

const env = loadEnv(
  "development",
  fileURLToPath(new URL(".", import.meta.url)),
  "",
);

export default defineConfig({
  output: "static",
  site: "https://www.bohospaurbano.com.ar",
  trailingSlash: "always",
  adapter: vercel(),
  integrations: [
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: env.PUBLIC_SANITY_API_VERSION ?? "2025-01-01",
      useCdn: false,
      stega: {
        studioUrl: env.SANITY_STUDIO_URL ?? "http://localhost:3333",
      },
    }),
    react(),
  ],
  vite: {
    // Astro and Sanity resolve different Vite majors in the monorepo.
    plugins: [tailwindcss() as any],
    optimizeDeps: {
      include: [
        "react/compiler-runtime",
        "lodash/isObject.js",
        "lodash/groupBy.js",
        "lodash/keyBy.js",
        "lodash/partition.js",
        "lodash/sortedIndex.js",
      ],
    },
  },
});
