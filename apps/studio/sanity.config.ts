import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
  throw new Error("SANITY_STUDIO_PROJECT_ID is required to run Sanity Studio.");
}

export default defineConfig({
  name: "boho-spa-urbano",
  title: "Boho Spa Urbano",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), esESLocale()],
  schema: {
    types: schemaTypes,
  },
});
